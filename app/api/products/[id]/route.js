import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request, { params }) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  return NextResponse.json({ product: data });
}
