import { useEffect, useState } from 'react';
import {
  clearAuthCallbackQueryParams,
  completeAuthCallback,
  hasAuthCallbackParams,
} from '../../../lib/auth-callback';
import { logAppError } from '../../../lib/observability';
import { useAuth } from './AuthProvider';

export default function AuthCallback() {
  const { session, loading } = useAuth();
  const [error, setError] = useState(false);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function handleCallback() {
      if (!hasAuthCallbackParams()) {
        if (!cancelled) {
          logAppError('admin.auth.callback', new Error('Missing auth callback parameters'));
          setError(true);
          setProcessing(false);
        }
        return;
      }

      const { error: exchangeError } = await completeAuthCallback();
      if (!cancelled) {
        if (exchangeError) {
          logAppError('admin.auth.callback', exchangeError);
          setError(true);
        }
        clearAuthCallbackQueryParams();
        setProcessing(false);
      }
    }

    void handleCallback();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!error && session) {
      window.location.hash = '#/';
    }
  }, [session, error]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-lab-base px-4">
        <p className="text-center text-lab-muted">
          Invalid or expired link. Please request a new magic link.
        </p>
        <a
          href="#/login"
          className="rounded-lg bg-lab-accent px-4 py-2 font-medium text-lab-text hover:bg-primary-dark"
        >
          Back to login
        </a>
      </div>
    );
  }

  if (processing || loading || !session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-lab-base px-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-lab-border border-t-lab-accent" />
        <p className="text-lab-muted">Signing you in...</p>
      </div>
    );
  }

  return null;
}
