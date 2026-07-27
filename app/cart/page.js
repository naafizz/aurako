"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <p className="text-ink-soft">আপনার কার্ট খালি।</p>
        <Link href="/" className="mt-4 inline-block text-brass underline">
          শপিং শুরু করুন →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="mb-6 font-display text-2xl text-ink">আপনার কার্ট</h1>
      <div className="flex flex-col divide-y divide-line border border-line">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden bg-paper-alt">
              {item.image_url && (
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-ink">{item.name}</p>
              <span className="font-mono text-sm text-brass">
                ৳{Number(item.price).toLocaleString("bn-BD")}
              </span>
            </div>
            <input
              type="number"
              min="1"
              value={item.qty}
              onChange={(e) => updateQty(item.id, Number(e.target.value))}
              className="w-16 border border-line px-2 py-1 text-center font-mono"
            />
            <button onClick={() => removeItem(item.id)} className="text-sm text-error hover:underline">
              বাদ দিন
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="font-display text-xl text-ink">মোট</span>
        <span className="font-mono text-xl text-brass">৳{total.toLocaleString("bn-BD")}</span>
      </div>
      <Link
        href="/checkout"
        className="mt-6 block rounded-sm bg-ink px-6 py-3 text-center font-medium text-paper hover:bg-ink-soft"
      >
        চেকআউট করুন
      </Link>
    </div>
  );
}
