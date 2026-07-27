"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fuzzySearch } from "@/lib/fuzzy";

export default function SearchBar({ products }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  const suggestions = fuzzySearch(query, products, "name", 6);

  useEffect(() => {
    function handleClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={boxRef} className="relative w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="প্রোডাক্টের নাম লিখুন..."
        className="w-full rounded-sm border border-line bg-white/70 px-4 py-3 font-body text-ink placeholder:text-ink-soft/50 focus:border-brass focus:outline-none"
      />
      {open && query.trim() && (
        <div className="absolute z-30 mt-1 w-full rounded-sm border border-line bg-white shadow-lg">
          {suggestions.length > 0 ? (
            suggestions.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-line/60 px-4 py-2 text-sm last:border-0 hover:bg-paper-alt"
              >
                <span className="text-ink">{p.name}</span>
                <span className="font-mono text-brass">
                  ৳{Number(p.price).toLocaleString("bn-BD")}
                </span>
              </Link>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-ink-soft/60">কিছু পাওয়া যায়নি</div>
          )}
        </div>
      )}
    </div>
  );
}
