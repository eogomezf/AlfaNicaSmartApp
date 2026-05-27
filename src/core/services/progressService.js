import { supabase } from "../config/supabase";

export const progressService = {
  // Save or update progress
  async saveProgress(profileId, level, activity, score, completed = false) {
    // First check if progress exists
    const { data: existing } = await supabase
      .from("progress")
      .select("*")
      .eq("profile_id", profileId)
      .eq("level", level)
      .eq("activity", activity)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from("progress")
        .update({
          score,
          completed,
          attempts: existing.attempts + 1,
          last_attempt: new Date(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from("progress")
        .insert({
          profile_id: profileId,
          level,
          activity,
          score,
          completed,
          attempts: 1,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Get progress for a profile
  async getProgress(profileId) {
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("profile_id", profileId)
      .order("level", { ascending: true })
      .order("activity", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get progress for specific level
  async getLevelProgress(profileId, level) {
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("profile_id", profileId)
      .eq("level", level);

    if (error) throw error;
    return data;
  },

  // Get total score for a profile
  async getTotalScore(profileId) {
    const { data, error } = await supabase
      .from("progress")
      .select("score")
      .eq("profile_id", profileId);

    if (error) throw error;
    return data.reduce((sum, item) => sum + (item.score || 0), 0);
  },

  // Check if level is unlocked (previous level at least 50% completed)
  async isLevelUnlocked(profileId, level) {
    if (level === 1) return true;

    const { data, error } = await supabase
      .from("progress")
      .select("completed")
      .eq("profile_id", profileId)
      .eq("level", level - 1);

    if (error) throw error;

    const completedCount = data.filter(
      (item) => item.completed === true,
    ).length;
    const totalActivities = 8; // Each level has 8 activities

    return completedCount >= totalActivities / 2;
  },
};
