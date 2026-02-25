import { createClient } from "@supabase/supabase-js";

console.log("🔥 SUPABASE FILE LOADED 🔥");

export const supabase = createClient(
  "https://vchtdktlgxzmkiuuxsun.supabase.co",
  "PASTE_YOUR_PUBLISHABLE_KEY_HERE"
);
