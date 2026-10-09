import * as Sentry from '@sentry/react';

export type ObservabilitySurface = 'admin' | 'public';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const SENSITIVE_KEY_PATTERN = /email|token|password|authorization|cookie|secret|key|refresh/i;
const LOG_LEVEL_RANK: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

let initialized = false;

function getConfiguredLogLevel(): LogLevel {
  const raw = import.meta.env.PUBLIC_LOG_LEVEL?.trim().toLowerCase();
  if (raw === 'error' || raw === 'warn' || raw === 'info' || raw === 'debug') {
    return raw;
  }
  return import.meta.env.DEV ? 'warn' : 'error';
}

function shouldLogToConsole(level: LogLevel): boolean {
  return LOG_LEVEL_RANK[level] <= LOG_LEVEL_RANK[getConfiguredLogLevel()];
}

function getDsn(): string | undefined {
  const dsn = import.meta.env.PUBLIC_SENTRY_DSN;
  return typeof dsn === 'string' && dsn.trim() ? dsn.trim() : undefined;
}

function scrubString(value: string): string {
  if (value.includes('@')) {
    return '[redacted-email]';
  }
  if (/bearer\s+/i.test(value) || /^eyJ/.test(value)) {
    return '[redacted-token]';
  }
  return value;
}

function scrubContext(context?: Record<string, string>): Record<string, string> | undefined {
  if (!context) {
    return undefined;
  }

  const scrubbed: Record<string, string> = {};
  for (const [key, value] of Object.entries(context)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      scrubbed[key] = '[redacted]';
      continue;
    }
    scrubbed[key] = scrubString(value);
  }
  return scrubbed;
}

function scrubEvent(event: Sentry.ErrorEvent): Sentry.ErrorEvent {
  if (event.user?.email) {
    delete event.user.email;
  }
  if (event.user?.ip_address) {
    delete event.user.ip_address;
  }
  if (event.request?.headers) {
    delete event.request.headers.Authorization;
    delete event.request.headers.Cookie;
  }
  return event;
}

export function isObservabilityEnabled(): boolean {
  return Boolean(getDsn());
}

export function ensureObservabilityInitialized(options: {
  surface: ObservabilitySurface;
}): void {
  const dsn = getDsn();
  if (!dsn || initialized || typeof window === 'undefined') {
    return;
  }

  Sentry.init({
    dsn,
    environment:
      import.meta.env.PUBLIC_SENTRY_ENVIRONMENT?.trim() ||
      import.meta.env.MODE ||
      'development',
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
    beforeSend: scrubEvent,
  });

  Sentry.setTag('surface', options.surface);
  initialized = true;
}

export function logAppError(
  action: string,
  error: unknown,
  context?: Record<string, string>
): void {
  const normalizedError =
    error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Unknown error');
  const scrubbedContext = scrubContext(context);

  if (import.meta.env.DEV && shouldLogToConsole('error')) {
    console.error(`[${action}]`, normalizedError.message, scrubbedContext ?? {});
  }

  if (!isObservabilityEnabled()) {
    return;
  }

  Sentry.withScope((scope) => {
    scope.setTag('action', action);
    if (scrubbedContext) {
      scope.setContext('app', scrubbedContext);
    }
    Sentry.captureException(normalizedError);
  });
}

function toConsoleLogLevel(level: Sentry.SeverityLevel): LogLevel {
  if (level === 'fatal' || level === 'error') return 'error';
  if (level === 'warning') return 'warn';
  if (level === 'debug') return 'debug';
  return 'info';
}

export function logAppMessage(
  action: string,
  message: string,
  level: Sentry.SeverityLevel = 'warning',
  context?: Record<string, string>
): void {
  const scrubbedContext = scrubContext(context);

  if (import.meta.env.DEV && shouldLogToConsole(toConsoleLogLevel(level))) {
    console.warn(`[${action}]`, message, scrubbedContext ?? {});
  }

  if (!isObservabilityEnabled()) {
    return;
  }

  Sentry.withScope((scope) => {
    scope.setTag('action', action);
    if (scrubbedContext) {
      scope.setContext('app', scrubbedContext);
    }
    Sentry.captureMessage(message, level);
  });
}

export function resetObservabilityForTests(): void {
  initialized = false;
}
