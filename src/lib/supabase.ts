import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase credentials not configured. Copy .env.example to .env and set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.'
  );
}

let client: SupabaseClient | null = null;

/** Browser-only Supabase client (avoids Node SSR WebSocket errors). */
export function getSupabase(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('Supabase client is only available in the browser');
  }

  if (!client) {
    client = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
  }

  return client;
}
