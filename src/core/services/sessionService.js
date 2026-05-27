import { supabase } from "../config/supabase";

export const sessionService = {
  // Log a game session
  async logSession(profileId, level, activity, scoreObtained, timeSeconds) {
    const { data, error } = await supabase
      .from("sessions")
      .insert({
        profile_id: profileId,
        level,
        activity,
        score_obtained: scoreObtained,
        time_seconds: timeSeconds,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get recent sessions
  async getRecentSessions(profileId, limit = 10) {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },
};
