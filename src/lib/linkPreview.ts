import { getSupabaseAuth } from './supabase-auth';

export interface LinkPreview {
  title: string;
  image: string | null;
  summary: string | null;
  publish_date: string | null;
}

export async function fetchLinkPreview(pageUrl: string): Promise<{ data: LinkPreview | null; error: string | null }> {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    return { data: null, error: 'Supabase is not configured.' };
  }

  const { data: sessionData } = await getSupabaseAuth().auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) {
    return { data: null, error: 'Sign in again to read a source page.' };
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/link-preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ url: pageUrl }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.error) {
    return { data: null, error: result.error || 'The page could not be read.' };
  }
  if (typeof result.title !== 'string' || !result.title.trim()) {
    return { data: null, error: 'That page does not publish a title.' };
  }
  return {
    data: {
      title: result.title.trim(),
      image: typeof result.image === 'string' ? result.image : null,
      summary: typeof result.summary === 'string' ? result.summary : null,
      publish_date: typeof result.publish_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(result.publish_date) ? result.publish_date : null,
    },
    error: null,
  };
}
