"use client";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="border-b border-line bg-paper-alt/40 px-5 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald">
            ক্যাশ অন ডেলিভারি উপলব্ধ
          </span>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
            যা খুঁজছেন, <span className="text-brass">লিখেই</span> খুঁজে নিন
          </h1>
          <p className="max-w-lg text-ink-soft">
            নামের কাছাকাছি বানান লিখলেও প্রোডাক্ট খুঁজে পাবেন — দ্রুত, সহজ, এক ক্লিকেই।
          </p>
          <SearchBar products={products} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="mb-6 font-display text-2xl text-ink">সব প্রোডাক্ট</h2>
        {loading ? (
          <p className="text-ink-soft">লোড হচ্ছে...</p>
        ) : products.length === 0 ? (
          <p className="text-ink-soft">
            এখনো কোনো প্রোডাক্ট যোগ করা হয়নি।{" "}
            <a href="/admin/add-product" className="text-brass underline">
              এখানে যোগ করুন
            </a>
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-line px-5 py-8 text-center text-xs text-ink-soft/60">
        <a href="/admin/add-product" className="hover:text-ink">
          Admin
        </a>
      </footer>
    </div>
  );
}
