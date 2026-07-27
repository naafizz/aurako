"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) setProduct(data.product);
        else setNotFound(true);
      });
  }, [id]);

  if (notFound) {
    return <p className="mx-auto max-w-4xl px-5 py-16 text-ink-soft">প্রোডাক্ট পাওয়া যায়নি।</p>;
  }

  if (!product) {
    return <p className="mx-auto max-w-4xl px-5 py-16 text-ink-soft">লোড হচ্ছে...</p>;
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-5 py-12 sm:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-sm border border-line bg-paper-alt">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft/50">কোনো ছবি নেই</div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl text-ink">{product.name}</h1>
        <span className="font-mono text-2xl text-brass">
          ৳{Number(product.price).toLocaleString("bn-BD")}
        </span>
        {product.description && <p className="text-ink-soft">{product.description}</p>}

        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-9 w-9 border border-line text-ink"
            aria-label="কমান"
          >
            −
          </button>
          <span className="font-mono">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="h-9 w-9 border border-line text-ink"
            aria-label="বাড়ান"
          >
            +
          </button>
        </div>

        <button
          onClick={() => {
            addItem(product, qty);
            setAdded(true);
          }}
          className="mt-2 rounded-sm bg-ink px-6 py-3 font-body font-medium text-paper transition hover:bg-ink-soft"
        >
          কার্টে যোগ করুন
        </button>
        {added && (
          <button onClick={() => router.push("/cart")} className="text-left text-sm text-brass underline">
            কার্টে দেখুন →
          </button>
        )}
      </div>
    </div>
  );
}
