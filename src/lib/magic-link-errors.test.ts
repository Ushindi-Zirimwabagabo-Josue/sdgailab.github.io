import { describe, expect, it } from 'vitest';
import { getMagicLinkRequestError } from './magic-link-errors';

describe('getMagicLinkRequestError', () => {
  it('explains email rate limits without blaming editor access', () => {
    expect(
      getMagicLinkRequestError({
        code: 'over_email_send_rate_limit',
        message: 'email rate limit exceeded',
      })
    ).toContain('hourly email limit');
  });

  it('explains missing Supabase Auth accounts separately from CMS allowlist', () => {
    expect(
      getMagicLinkRequestError({
        code: 'signup_disabled',
        message: 'Signups not allowed for otp',
      })
    ).toContain('Supabase Auth account');
  });

  it('explains redirect URL misconfiguration', () => {
    expect(
      getMagicLinkRequestError({
        message: 'Invalid redirect URL',
      })
    ).toContain('redirect settings');
  });

  it('uses a neutral fallback for unknown errors', () => {
    const message = getMagicLinkRequestError({
      code: 'unexpected_error',
      message: 'something went wrong',
    });
    expect(message).toContain('could not send a magic link');
    expect(message).not.toContain('not set up for editor access');
  });
});
