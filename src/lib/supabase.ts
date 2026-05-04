import { createClient } from '@supabase/supabase-js';

// Environment variables ni initialize chesthunnam
// "!" mark use cheyadam valla TypeScript 'null' error chupinchadhu
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Environment variables missing unte developer ki clarity kosam oka check
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials missing! Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file."
  );
}

// Professional client initialization
export const supabase = createClient(supabaseUrl, supabaseAnonKey);