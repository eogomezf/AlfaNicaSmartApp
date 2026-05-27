import { supabase } from "../config/supabase";

export const profileService = {
  // Create a new profile
  async createProfile(userId, name, age) {
    const { data, error } = await supabase
      .from("profiles")
      .insert({ user_id: userId, name, age })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get profile by user ID
  async getProfileByUserId(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Update profile
  async updateProfile(profileId, updates) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profileId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
