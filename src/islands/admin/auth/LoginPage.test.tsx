// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

expect.extend(toHaveNoViolations);

const {
  consumeRateLimitMock,
  normalizeAdminEmailMock,
  signInWithOtpMock,
} = vi.hoisted(() => ({
  consumeRateLimitMock: vi.fn(),
  normalizeAdminEmailMock: vi.fn((email: string) => email.trim().toLowerCase()),
  signInWithOtpMock: vi.fn(),
}));

vi.mock('../../../lib/admin-security', () => ({
  consumeRateLimit: consumeRateLimitMock,
  normalizeAdminEmail: normalizeAdminEmailMock,
}));

vi.mock('../../../lib/supabase-auth', () => ({
  getSupabaseAuth: () => ({
    auth: {
      signInWithOtp: signInWithOtpMock,
    },
  }),
}));

import LoginPage from './LoginPage';

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('LoginPage', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    consumeRateLimitMock.mockReturnValue({ allowed: true });
    signInWithOtpMock.mockResolvedValue({ error: null });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('submits a normalized email and shows success feedback', async () => {
    await act(async () => {
      root.render(<LoginPage />);
    });

    const input = container.querySelector('input[type="email"]') as HTMLInputElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(input, ' Editor@Example.org ');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(normalizeAdminEmailMock).toHaveBeenCalledWith('Editor@Example.org');
    expect(consumeRateLimitMock).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'admin-login:editor@example.org' })
    );
    expect(signInWithOtpMock).toHaveBeenCalledWith({
      email: 'editor@example.org',
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        shouldCreateUser: false,
      },
    });
    expect(container.textContent).toContain('Check your email for the magic link.');
  });

  it('shows throttle errors without calling Supabase auth', async () => {
    consumeRateLimitMock.mockReturnValue({
      allowed: false,
      error: 'Too many sign-in requests for this email address. Try again in 1 minute.',
      retryAfterMs: 60_000,
    });

    await act(async () => {
      root.render(<LoginPage />);
    });

    const input = container.querySelector('input[type="email"]') as HTMLInputElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(input, 'editor@example.org');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(signInWithOtpMock).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Too many sign-in requests for this email address.');
  });

  it('shows rate-limit guidance when Supabase throttles email sending', async () => {
    signInWithOtpMock.mockResolvedValue({
      error: { code: 'over_email_send_rate_limit', message: 'email rate limit exceeded' },
    });

    await act(async () => {
      root.render(<LoginPage />);
    });

    const input = container.querySelector('input[type="email"]') as HTMLInputElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(input, 'editor@example.org');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(container.textContent).toContain('hourly email limit');
  });

  it('explains when Supabase Auth has no account for the email', async () => {
    signInWithOtpMock.mockResolvedValue({
      error: { code: 'signup_disabled', message: 'Signups not allowed for otp' },
    });

    await act(async () => {
      root.render(<LoginPage />);
    });

    const input = container.querySelector('input[type="email"]') as HTMLInputElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(input, 'editor@example.org');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(container.textContent).toContain('Supabase Auth account');
    expect(container.textContent).not.toContain('not set up for editor access');
  });

  it('has no detectable accessibility violations', async () => {
    const { axe } = await import('jest-axe');

    await act(async () => {
      root.render(<LoginPage />);
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
