export interface MagicLinkSignInError {
  code?: string;
  message?: string;
}

/**
 * Maps Supabase magic-link request failures to user-facing copy.
 * Avoid blaming editor access unless the email truly cannot sign in.
 */
export function getMagicLinkRequestError(error: MagicLinkSignInError): string {
  const code = error.code?.toLowerCase() ?? '';
  const message = error.message?.toLowerCase() ?? '';

  if (
    code === 'over_email_send_rate_limit' ||
    code === 'over_request_rate_limit' ||
    message.includes('rate limit')
  ) {
    return 'This project has reached Supabase’s hourly email limit (shared across all addresses). Wait up to an hour, use a magic link from an earlier email if you have one, or ask an administrator to configure custom SMTP for higher limits.';
  }

  if (
    code === 'signup_disabled' ||
    message.includes('signups not allowed') ||
    message.includes('user not found') ||
    message.includes('not authorized') ||
    code === 'otp_disabled'
  ) {
    return 'This email does not have a Supabase Auth account for CMS login. Ask the site administrator to invite you in Supabase Auth and confirm your email is on the editor allowlist.';
  }

  if (message.includes('redirect') || message.includes('redirect_to')) {
    return 'This site is not configured to accept logins from this URL. Contact the site administrator to add the admin URL to Supabase redirect settings.';
  }

  if (code === 'validation_failed' || message.includes('invalid email')) {
    return 'Enter a valid email address and try again.';
  }

  return 'We could not send a magic link right now. Please try again in a few minutes or contact the SDG AI Lab site administrator if the problem continues.';
}
