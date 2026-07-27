"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ customer_name: "", phone: "", address: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (items.length === 0) {
      setError("কার্ট খালি");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "সমস্যা হয়েছে");
      clearCart();
      router.push(`/order-success?id=${data.order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <h1 className="mb-2 font-display text-2xl text-ink">অর্ডার নিশ্চিত করুন</h1>
      <p className="mb-6 text-sm text-ink-soft">ক্যাশ অন ডেলিভারি — প্রোডাক্ট হাতে পেয়ে টাকা দিন।</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm text-ink-soft">আপনার নাম</label>
          <input
            required
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            className="w-full border border-line bg-white/70 px-4 py-3 focus:border-brass focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-soft">মোবাইল নাম্বার</label>
          <input
            required
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-line bg-white/70 px-4 py-3 focus:border-brass focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-soft">সম্পূর্ণ ঠিকানা</label>
          <textarea
            required
            name="address"
            rows={3}
            value={form.address}
            onChange={handleChange}
            className="w-full border border-line bg-white/70 px-4 py-3 focus:border-brass focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-soft">নোট (ঐচ্ছিক)</label>
          <input
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full border border-line bg-white/70 px-4 py-3 focus:border-brass focus:outline-none"
          />
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-dashed border-line pt-4">
          <span className="font-display text-lg text-ink">মোট</span>
          <span className="font-mono text-lg text-brass">৳{total.toLocaleString("bn-BD")}</span>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-sm bg-ink px-6 py-3 font-medium text-paper hover:bg-ink-soft disabled:opacity-50"
        >
          {submitting ? "পাঠানো হচ্ছে..." : "অর্ডার কনফার্ম করুন"}
        </button>
      </form>
    </div>
  );
}
