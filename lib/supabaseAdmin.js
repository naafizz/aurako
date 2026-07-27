import { createClient } from "@supabase/supabase-js";

// এই ক্লায়েন্টটি শুধু সার্ভার-সাইড API route এ ব্যবহার হবে (service role key)।
// এটা কখনো ব্রাউজারে বা ক্লায়েন্ট কম্পোনেন্টে import করা যাবে না।
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
