import { getSupabaseClient } from "./supabase";

export async function schedulePost(payload: any) {
  if (!payload.scheduledAt) {
    return { success: false, error: "scheduledAt is required" };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Supabase not configured" };
  }

  const { data, error } = await supabase.from("scheduled_posts").insert([{ ...payload, status: "scheduled", created_at: new Date().toISOString() }]);
  return { success: !error, error: error?.message, data };
}

export async function completeScheduledPost(id: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Supabase not configured" };
  }

  const { data, error } = await supabase.from("scheduled_posts").update({ status: "posted" }).eq("id", id);
  return { success: !error, error: error?.message, data };
}
