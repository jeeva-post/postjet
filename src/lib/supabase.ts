import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => !!supabaseUrl && !!supabaseAnonKey;

let supabase: SupabaseClient | null = null;
if (isSupabaseConfigured()) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    '[Supabase Client] Missing Supabase environment variables during build. ' +
    'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

export const getSupabaseClient = (): SupabaseClient | null => {
  return supabase;
};

export async function verifySupabaseConnection(): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('user_connections').select('id').limit(1);
    return !error;
  } catch (err) {
    console.error('[Supabase Connection] verification failed', err);
    return false;
  }
}

export async function removeMediaObject(bucket: string, path: string) {
  const client = getSupabaseClient();
  if (!client || !bucket || !path) return false;

  try {
    const { error } = await client.storage.from(bucket).remove([path]);
    if (error) {
      console.error('[Supabase] removeMediaObject failed', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] removeMediaObject exception', err);
    return false;
  }
}
