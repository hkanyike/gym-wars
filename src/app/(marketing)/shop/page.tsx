import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  colors?: { id: string; name: string; swatchClass: string }[];
  sizes?: string[];
};

const BASE_COLORS = [
  { id: "black", name: "Black", swatchClass: "bg-black" },
  { id: "white", name: "White", swatchClass: "bg-white border border-border" },
  { id: "red",   name: "Red",   swatchClass: "bg-red-600" },
];

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL"];

const products: Product[] = [
  { id: "tee-white", name: "White Tee", price: 22, image: "/shop/tee-white.png", colors: BASE_COLORS, sizes: APPAREL_SIZES },
  { id: "tee-black", name: "Black Tee", price: 22, image: "/shop/tee-black.png", colors: BASE_COLORS, sizes: APPAREL_SIZES },
  { id: "hoodie", name: "Hoodie", price: 50, image: "/shop/hoodie.png", colors: BASE_COLORS, sizes: APPAREL_SIZES },
  { id: "ladies-tank", name: "Ladies Athletic Tee", price: 20, image: "/shop/ladies-tank.png", colors: BASE_COLORS, sizes: APPAREL_SIZES },
  { id: "dad-hat", name: "Dad Hat", price: 22, image: "/shop/dad-hat.png", colors: BASE_COLORS },
  { id: "steel-bottle", name: "Steel Bottle", price: 15, image: "/shop/steel-bottle.png", colors: BASE_COLORS },
];

export const metadata = {
  title: "Shop | Gym Wars",
  description: "Official Gym Wars merchandise",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Shop Gym Wars</h1>
        <p className="text-sm text-muted">Official apparel and gear</p>
      </header>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {products.map((p) => (
          <article
            key={p.id}
            className="group rounded-lg border border-border bg-card p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md bg-white">
              {/* Badge */}
              <span className="absolute left-2 top-2 z-10 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Coming Soon
              </span>

              {/* Image */}
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-contain transition group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition group-hover:opacity-100" />
            </div>

            <h3 className="font-medium">{p.name}</h3>
            <p className="text-sm text-muted">${p.price}</p>

            {/* Variants (disabled preview) */}
            <div className="mt-3 space-y-3">
              {/* Colors */}
              {p.colors && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted w-14">Color</span>
                  <div className="flex flex-wrap gap-2">
                    {p.colors.map((c) => (
                      <button
                        key={c.id}
                        aria-label={c.name}
                        title={`${c.name} (coming soon)`}
                        disabled
                        className={`h-6 w-6 rounded-full ${c.swatchClass} cursor-not-allowed`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {p.sizes && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted w-14">Size</span>
                  <div className="flex flex-wrap gap-2">
                    {p.sizes.map((s) => (
                      <button
                        key={s}
                        disabled
                        title={`${s} (coming soon)`}
                        className="cursor-not-allowed rounded-md border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-white/80"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Disabled CTA */}
            <button
              disabled
              className="mt-3 w-full cursor-not-allowed rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/70"
              title="Coming soon"
            >
              Coming Soon
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
