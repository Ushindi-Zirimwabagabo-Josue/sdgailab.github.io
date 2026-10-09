import logoUrl from '../../../../assets/img/whitelogo.png?url';
import icpsdLogoUrl from '../../../../assets/img/ICPSD-logo-navbar.png?url';
import undpLogoUrl from '../../../../assets/img/UNDP_logo.svg?url';
import { useState } from 'react';
import { consumeRateLimit, normalizeAdminEmail } from '../../../lib/admin-security';
import { getMagicLinkRequestError } from '../../../lib/magic-link-errors';
import { logAppError, logAppMessage } from '../../../lib/observability';
import { getSupabaseAuth } from '../../../lib/supabase-auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalizedEmail = normalizeAdminEmail(email);
    const rateLimit = consumeRateLimit({
      key: `admin-login:${normalizedEmail || 'anonymous'}`,
      limit: 3,
      windowMs: 15 * 60 * 1000,
      cooldownMs: 60 * 1000,
      message: 'Too many sign-in requests for this email address.',
    });

    if (!rateLimit.allowed) {
      setError(rateLimit.error);
      return;
    }

    setLoading(true);
    setSubmitted(false);
    setError(null);
    try {
      const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '';
      const redirectUrl = `${window.location.origin}${basePath}/admin`;
      const { error: signInError } = await getSupabaseAuth().auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: redirectUrl,
          shouldCreateUser: false,
        },
      });
      if (signInError) {
        logAppMessage('admin.login.magic_link', signInError.message, 'warning', {
          code: signInError.code ?? 'unknown',
        });
        setError(getMagicLinkRequestError(signInError));
        return;
      }
      setSubmitted(true);
    } catch (error) {
      logAppError('admin.login.magic_link', error);
      setError('Unable to send the magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-lab-base px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-lab-border bg-lab-surface shadow-2xl">
        <div className="border-b border-lab-border bg-lab-section p-8 text-center">
          <img src={logoUrl} alt="SDG AI Lab" className="mx-auto h-16 w-16 rounded-sm object-contain" />
          <h1 className="mt-5 text-2xl font-extrabold text-lab-text">SDG AI Lab</h1>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-lab-muted">Content Management System</p>
          <div className="mt-5 flex justify-center gap-4">
            <img src={icpsdLogoUrl} alt="ICPSD" className="h-8 w-auto object-contain" />
            <img src={undpLogoUrl} alt="UNDP" className="h-9 w-auto object-contain" />
          </div>
        </div>
        <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-lab-text">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-lab-border px-3 py-2 text-lab-text placeholder-lab-subtle focus:border-lab-accent focus:outline-none focus:ring-1 focus:ring-lab-accent"
              placeholder="you@example.com"
              disabled={loading}
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-lab-accent px-4 py-2 font-medium text-lab-text transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </span>
            ) : (
              'Send Magic Link'
            )}
          </button>
        </form>
        {submitted && (
          <p className="mt-4 text-center text-sm text-lab-muted">
            Check your email for the magic link.
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}
        </div>
      </div>
    </div>
  );
}
