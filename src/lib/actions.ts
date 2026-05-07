// src/lib/actions.ts
import { supabase } from './supabase';

// Post ni save cheyadaniki function
export const savePost = async (content: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("User not logged in");

  const { data, error } = await supabase
    .from('posts')
    .insert([
      { 
        user_id: user.id, 
        content: content,
        platform: ['Twitter', 'LinkedIn'] 
      }
    ]);

  if (error) throw error;
  return data;
};

// Posts ni thechukovadaniki function
export const getRecentPosts = async (limit = 5) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};