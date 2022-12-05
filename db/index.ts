import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE)
  throw new Error("No supabase env present.");

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE
);
