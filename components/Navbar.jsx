"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-xl tracking-tight text-ink">
          Aurako<span className="text-brass">.</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm text-ink-soft hover:text-ink">
            সব প্রোডাক্ট
          </Link>
          <Link href="/cart" className="relative text-sm text-ink-soft hover:text-ink">
            কার্ট
            {count > 0 && (
              <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brass font-mono text-[11px] text-paper">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
