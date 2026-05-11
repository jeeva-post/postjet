// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => !!supabaseUrl && !!supabaseAnonKey;

if (!isSupabaseConfigured()) {
  console.warn("Supabase URL or Anon Key is missing in environment. Login and dashboard features may be disabled.");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
