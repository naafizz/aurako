import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  const body = await request.json();
  const { passcode, name, price, description, image_url, category, stock } = body;

  if (!process.env.ADMIN_PASSCODE || passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "ভুল পাসকোড" }, { status: 401 });
  }
  if (!name || !price) {
    return NextResponse.json({ error: "নাম ও দাম আবশ্যক" }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("products")
    .insert([{ name, price, description, image_url, category, stock: stock ?? 0 }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ product: data[0] });
}
