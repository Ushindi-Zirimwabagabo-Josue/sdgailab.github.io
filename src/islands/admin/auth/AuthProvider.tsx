import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  clearAuthorizedAdminCache,
  getAuthorizedAdmin,
  normalizeAdminEmail,
} from '../../../lib/admin-security';
import { logAppError } from '../../../lib/observability';
import { getSupabaseAuth } from '../../../lib/supabase-auth';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  adminUser: { email: string; role: 'admin' | 'editor' } | null;
  isEditor: boolean;
  loading: boolean;
  authorizationError: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<{ email: string; role: 'admin' | 'editor' } | null>(
    null
  );
  const [authorizationError, setAuthorizationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const adminUserRef = useRef(adminUser);
  adminUserRef.current = adminUser;

  const signOut = useCallback(async () => {
    await getSupabaseAuth().auth.signOut();
    clearAuthorizedAdminCache();
    setSession(null);
    setUser(null);
    setAdminUser(null);
    setAuthorizationError(null);
  }, []);

  const applySession = useCallback(async (s: Session | null) => {
    setSession(s);
    setUser(s?.user ?? null);

    if (!s) {
      clearAuthorizedAdminCache();
      setAdminUser(null);
      setAuthorizationError(null);
      setLoading(false);
      return;
    }

    const normalizedEmail = normalizeAdminEmail(s.user.email ?? '');
    if (!normalizedEmail) {
      clearAuthorizedAdminCache();
      setAdminUser(null);
      setAuthorizationError('This account does not have a valid email address.');
      setLoading(false);
      return;
    }

    // Keep the current editor gate mounted while re-verifying the same identity.
    // Clearing adminUser here remounts CMS pages and reloads lists on tab focus.
    try {
      const actor = await getAuthorizedAdmin(true);
      if (actor.email !== normalizedEmail) {
        clearAuthorizedAdminCache();
        setAdminUser(null);
        setAuthorizationError('This account is not approved for editor access.');
        setLoading(false);
        return;
      }
      setAdminUser(actor);
      setAuthorizationError(null);
    } catch (error) {
      logAppError('admin.auth.verify_editor', error);
      setAdminUser(null);
      setAuthorizationError(error instanceof Error ? error.message : 'Unable to verify editor access.');
      setLoading(false);
      return;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getSupabaseAuth().auth.getSession().then(({ data: { session: s } }) => {
      void applySession(s);
    });

    const { data: { subscription } } = getSupabaseAuth().auth.onAuthStateChange((event, s) => {
      if (event === 'INITIAL_SESSION') {
        void applySession(s);
        return;
      }
      if (event === 'SIGNED_IN' && s) {
        const email = normalizeAdminEmail(s.user.email ?? '');
        const alreadyAuthorized = Boolean(email && adminUserRef.current?.email === email);
        if (!alreadyAuthorized) {
          setLoading(true);
        }
        void applySession(s);
      } else if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !s)) {
        void applySession(null);
      } else if (event === 'TOKEN_REFRESHED' && s) {
        // Token refresh does not change identity — update session quietly.
        setSession(s);
        setUser(s.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, [applySession]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        adminUser,
        isEditor: Boolean(adminUser),
        loading,
        authorizationError,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
