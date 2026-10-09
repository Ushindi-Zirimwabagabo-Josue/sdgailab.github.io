// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { captureExceptionMock, captureMessageMock, initMock, withScopeMock } = vi.hoisted(() => ({
  captureExceptionMock: vi.fn(),
  captureMessageMock: vi.fn(),
  initMock: vi.fn(),
  withScopeMock: vi.fn((callback: (scope: { setTag: ReturnType<typeof vi.fn>; setContext: ReturnType<typeof vi.fn> }) => void) => {
    callback({
      setTag: vi.fn(),
      setContext: vi.fn(),
    });
  }),
}));

vi.mock('@sentry/react', () => ({
  init: initMock,
  captureException: captureExceptionMock,
  captureMessage: captureMessageMock,
  withScope: withScopeMock,
  setTag: vi.fn(),
  browserTracingIntegration: vi.fn(() => ({})),
}));

import {
  ensureObservabilityInitialized,
  isObservabilityEnabled,
  logAppError,
  logAppMessage,
  resetObservabilityForTests,
} from './observability';

describe('observability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetObservabilityForTests();
    vi.stubEnv('PUBLIC_SENTRY_DSN', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetObservabilityForTests();
  });

  it('is disabled when PUBLIC_SENTRY_DSN is not set', () => {
    expect(isObservabilityEnabled()).toBe(false);
  });

  it('does not call Sentry when logging without a DSN', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    logAppError('admin.auth.verify_editor', new Error('allowlist failed'), {
      email: 'editor@example.org',
    });

    expect(captureExceptionMock).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('initializes Sentry once and captures exceptions with scrubbed context', () => {
    vi.stubEnv('PUBLIC_SENTRY_DSN', 'https://example@o0.ingest.sentry.io/1');
    vi.stubEnv('PUBLIC_SENTRY_ENVIRONMENT', 'test');

    ensureObservabilityInitialized({ surface: 'admin' });
    ensureObservabilityInitialized({ surface: 'admin' });

    expect(initMock).toHaveBeenCalledTimes(1);
    expect(isObservabilityEnabled()).toBe(true);

    logAppError('admin.login.magic_link', new Error('network failed'), {
      email: 'editor@example.org',
      code: 'network_error',
    });

    expect(captureExceptionMock).toHaveBeenCalledTimes(1);
    expect(withScopeMock).toHaveBeenCalled();
  });

  it('captures warning messages for expected auth failures', () => {
    vi.stubEnv('PUBLIC_SENTRY_DSN', 'https://example@o0.ingest.sentry.io/1');

    logAppMessage('admin.login.magic_link', 'rate limit exceeded', 'warning', {
      code: 'over_email_send_rate_limit',
    });

    expect(captureMessageMock).toHaveBeenCalledWith('rate limit exceeded', 'warning');
  });
});
