import { getSupabaseAuth } from './supabase-auth';

/** True when the current URL carries Supabase magic-link / OAuth callback parameters. */
export function hasAuthCallbackParams(): boolean {
  if (typeof window === 'undefined') return false;

  const hash = window.location.hash;
  if (
    hash.includes('access_token') ||
    hash.includes('refresh_token') ||
    hash.includes('type=magiclink') ||
    hash.includes('type=recovery')
  ) {
    return true;
  }

  return new URLSearchParams(window.location.search).has('code');
}

/** Exchange hash or PKCE query callback params for a Supabase session. */
export async function completeAuthCallback(): Promise<{ error: Error | null }> {
  const auth = getSupabaseAuth().auth;

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');

  if (accessToken && refreshToken) {
    const { error } = await auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    return { error: error ?? null };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code');
  if (code) {
    const { error } = await auth.exchangeCodeForSession(code);
    return { error: error ?? null };
  }

  return { error: new Error('No auth callback parameters found') };
}

/** Remove callback query params so refresh does not re-process the code. */
export function clearAuthCallbackQueryParams(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('error');
  url.searchParams.delete('error_description');
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, '', next);
}
