// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { expectAccessibleSmoke } from '../test/axe';

function setValue(
  container: HTMLElement,
  selector: string,
  value: string
) {
  const input = container.querySelector(selector) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement;
  const proto =
    input instanceof HTMLSelectElement
      ? HTMLSelectElement.prototype
      : input instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('ContactForm', () => {
  let container: HTMLDivElement;
  let root: Root;
  let fetchMock: ReturnType<typeof vi.fn>;

  async function flush() {
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('renders labeled fields and request type options', async () => {
    vi.stubEnv('PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', '');
    const { default: ContactForm } = await import('./ContactForm');

    await act(async () => {
      root.render(<ContactForm />);
    });

    expect(container.querySelector('label[for="name"]')?.textContent).toContain('Name');
    expect(container.querySelector('label[for="email"]')?.textContent).toContain('Email');
    expect(container.querySelector('#request-type')).not.toBeNull();
    expect(container.textContent).toContain('Request technical support');
    expect(container.textContent).toContain('Submit Request');
  });

  it('keeps the honeypot website field hidden and caps message length', async () => {
    vi.stubEnv('PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', '');
    const { default: ContactForm } = await import('./ContactForm');

    await act(async () => {
      root.render(<ContactForm />);
    });

    const honeypotWrap = container.querySelector('#website')?.closest('[aria-hidden="true"]');
    expect(honeypotWrap).not.toBeNull();
    expect(honeypotWrap?.classList.contains('hidden')).toBe(true);
    expect((container.querySelector('#website') as HTMLInputElement).tabIndex).toBe(-1);
    expect((container.querySelector('#message') as HTMLTextAreaElement).maxLength).toBe(5000);
  });

  it('shows a configuration error when Supabase env vars are missing', async () => {
    vi.stubEnv('PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', '');
    const { default: ContactForm } = await import('./ContactForm');

    await act(async () => {
      root.render(<ContactForm />);
    });

    const form = container.querySelector('form') as HTMLFormElement;
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flush();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(container.textContent).toContain('The contact form is not configured yet');
  });

  it('posts the request payload and shows success feedback when configured', async () => {
    vi.resetModules();
    vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'anon-test-key');
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ notification_sent: true }),
    });

    const { default: ContactForm } = await import('./ContactForm');

    await act(async () => {
      root.render(<ContactForm />);
    });

    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setValue(container, '#name', 'Ada Lovelace');
      setValue(container, '#email', 'ada@example.org');
      setValue(container, '#organization', 'UNDP');
      setValue(container, '#request-type', 'Propose a partnership');
      setValue(container, '#message', 'Looking to co-develop a GIS tool.');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flush();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.supabase.co/functions/v1/contact-submit',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          apikey: 'anon-test-key',
          Authorization: 'Bearer anon-test-key',
        }),
      })
    );
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.org',
      organization: 'UNDP',
      request_type: 'Propose a partnership',
      message: 'Looking to co-develop a GIS tool.',
      website: '',
    });
    expect(container.textContent).toContain('Your request has been submitted successfully.');
  });

  it('includes honeypot values in the payload for server-side bot rejection', async () => {
    vi.resetModules();
    vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'anon-test-key');
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ notification_sent: true }),
    });

    const { default: ContactForm } = await import('./ContactForm');

    await act(async () => {
      root.render(<ContactForm />);
    });

    const form = container.querySelector('form') as HTMLFormElement;
    await act(async () => {
      setValue(container, '#name', 'Bot');
      setValue(container, '#email', 'bot@example.org');
      setValue(container, '#organization', 'Spam');
      setValue(container, '#message', 'Buy now');
      setValue(container, '#website', 'https://spam.example');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flush();

    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.website).toBe('https://spam.example');
  });

  it('renders API errors as plain status text without HTML injection', async () => {
    vi.resetModules();
    vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'anon-test-key');
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: '<img src=x onerror=alert(1)> Rejected' }),
    });

    const { default: ContactForm } = await import('./ContactForm');

    await act(async () => {
      root.render(<ContactForm />);
    });

    const form = container.querySelector('form') as HTMLFormElement;
    await act(async () => {
      setValue(container, '#name', 'Ada');
      setValue(container, '#email', 'ada@example.org');
      setValue(container, '#organization', 'UNDP');
      setValue(container, '#message', 'Hello');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flush();

    const status = container.querySelector('[role="status"]') as HTMLElement;
    expect(status).not.toBeNull();
    expect(status.textContent).toContain('<img src=x onerror=alert(1)> Rejected');
    expect(status.querySelector('img')).toBeNull();
  });

  it('has no detectable accessibility violations', async () => {
    vi.stubEnv('PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', '');
    const { default: ContactForm } = await import('./ContactForm');

    await act(async () => {
      root.render(<ContactForm />);
    });

    await expectAccessibleSmoke(container);
  });
});
