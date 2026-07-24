import { Heart, ShoppingCart, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "./data";

export function ProductCard({ product, onWishlist, wishlist }: { product: Product; onWishlist: (id: number) => void; wishlist: number[] }) {
  return (
    <Card className="border-border/80 bg-background shadow-sm transition-all duration-200 hover:-translate-y-1">
      <div className="h-32 overflow-hidden rounded-t-xl border-b border-border bg-surface">
        {product.image.startsWith("http") ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-sky-50 text-5xl dark:from-emerald-950/40 dark:to-sky-950/40">
            {product.image}
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          {product.verified ? <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Verified</span> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{product.category}</span>
          <span className="inline-flex items-center gap-1 text-amber-500"><Star className="h-3.5 w-3.5" /> {product.rating}</span>
        </div>
        <div className="text-muted-foreground">Supplier: {product.supplier}</div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground">{product.price}</span>
          <span className="text-muted-foreground">{product.stock}</span>
        </div>
        <div className="flex gap-2 pt-2">
          <button className="flex-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface">View</button>
          <button onClick={() => onWishlist(product.id)} className="rounded-lg border border-border px-3 py-2 hover:bg-surface">
            <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </button>
          <button className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
