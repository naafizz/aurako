"use client";
import { useState } from "react";

const emptyForm = {
  passcode: "",
  name: "",
  price: "",
  description: "",
  image_url: "",
  category: "",
  stock: "",
};

export default function AddProductPage() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock || 0),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "সমস্যা হয়েছে");
      setStatus("success");
      setForm({ ...emptyForm, passcode: form.passcode });
    } catch (err) {
      setStatus(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <h1 className="mb-1 font-display text-2xl text-ink">নতুন প্রোডাক্ট যোগ করুন</h1>
      <p className="mb-6 text-sm text-ink-soft">ফর্মটি পূরণ করে সাবমিট করলেই প্রোডাক্ট সাথে সাথে ওয়েবসাইটে দেখা যাবে।</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm text-ink-soft">অ্যাডমিন পাসকোড</label>
          <input
            required
            type="password"
            name="passcode"
            value={form.passcode}
            onChange={handleChange}
            className="w-full border border-line bg-white/70 px-4 py-3 focus:border-brass focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-soft">প্রোডাক্টের নাম</label>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-line bg-white/70 px-4 py-3 focus:border-brass focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-soft">দাম (৳)</label>
          <input
            required
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border border-line bg-white/70 px-4 py-3 focus:border-brass focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-soft">ছবির লিংক (URL)</label>
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border border-line bg-white/70 px-4 py-3 focus:border-brass focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-soft">ক্যাটাগরি</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-line bg-white/70 px-4 py-3 focus:border-brass focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-soft">স্টক পরিমাণ</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border border-line bg-white/70 px-4 py-3 focus:border-brass focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-soft">বিবরণ</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="w-full border border-line bg-white/70 px-4 py-3 focus:border-brass focus:outline-none"
          />
        </div>

        {status === "success" && <p className="text-sm text-emerald">প্রোডাক্ট যোগ হয়েছে ✓</p>}
        {status && status !== "success" && <p className="text-sm text-error">{status}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-sm bg-ink px-6 py-3 font-medium text-paper hover:bg-ink-soft disabled:opacity-50"
        >
          {submitting ? "যোগ হচ্ছে..." : "প্রোডাক্ট যোগ করুন"}
        </button>
      </form>
    </div>
  );
}
