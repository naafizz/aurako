"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const id = params.get("id");

  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center">
      <h1 className="font-display text-3xl text-emerald">অর্ডার সম্পন্ন হয়েছে ✓</h1>
      <p className="mt-3 text-ink-soft">
        ধন্যবাদ! আপনার অর্ডার নাম্বার:{" "}
        <span className="font-mono text-ink">{id}</span>
      </p>
      <p className="mt-1 text-sm text-ink-soft">প্রোডাক্ট হাতে পেয়ে ক্যাশ পরিশোধ করবেন।</p>
      <Link href="/" className="mt-6 inline-block text-brass underline">
        আরও শপিং করুন →
      </Link>
    </div>
  );
}
