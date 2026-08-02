import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types/user";

export const getUserServer = async (): Promise<UserProfile | null> => {
  try {
    await connection();
    const supabase = await createClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) return null;

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "회원",
      avatarUrl: supabaseUser.user_metadata?.avatar_url,
      phone: supabaseUser.user_metadata?.phone,
      createdAt: supabaseUser.created_at,
    };
  } catch {
    return null;
  }
};
