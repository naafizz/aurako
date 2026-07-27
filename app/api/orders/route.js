import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  const body = await request.json();
  const { customer_name, phone, address, items, total, note } = body;

  if (!customer_name || !phone || !address || !items?.length) {
    return NextResponse.json({ error: "সব তথ্য দিন" }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert([
      {
        customer_name,
        phone,
        address,
        items,
        total,
        note: note || null,
        payment_method: "cash_on_delivery",
        status: "pending",
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ order: data[0] });
}
