import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-line bg-white/40 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <span className="absolute left-3 top-3 z-10 h-3 w-3 rounded-full border border-ink/30 bg-paper" />
      <div className="aspect-square w-full overflow-hidden bg-paper-alt">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-soft/50">
            কোনো ছবি নেই
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t border-dashed border-line px-4 py-3">
        <h3 className="font-display text-base leading-snug text-ink">{product.name}</h3>
        {product.category && (
          <span className="text-xs uppercase tracking-wide text-ink-soft/60">{product.category}</span>
        )}
        <span className="mt-1 font-mono text-lg text-brass">
          ৳{Number(product.price).toLocaleString("bn-BD")}
        </span>
      </div>
    </Link>
  );
}
