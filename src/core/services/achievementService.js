import { supabase } from "../config/supabase";

export const achievementService = {
  // Unlock an achievement
  async unlockAchievement(profileId, achievementName) {
    const { data, error } = await supabase
      .from("achievements")
      .insert({ profile_id: profileId, achievement_name: achievementName })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all achievements for a profile
  async getAchievements(profileId) {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("profile_id", profileId)
      .order("unlocked_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Check if an achievement is already unlocked
  async hasAchievement(profileId, achievementName) {
    const { data, error } = await supabase
      .from("achievements")
      .select("id")
      .eq("profile_id", profileId)
      .eq("achievement_name", achievementName)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },
};
