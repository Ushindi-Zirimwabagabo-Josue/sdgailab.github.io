import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseAuthConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseAuthConfigured) {
  console.warn(
    'Supabase credentials not configured. Copy .env.example to .env and set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.'
  );
}

let client: SupabaseClient | null = null;

/** Browser-only authenticated Supabase client (avoids Node SSR WebSocket errors). */
export function getSupabaseAuth(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('Supabase auth client is only available in the browser');
  }

  if (!client) {
    client = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return client;
}
