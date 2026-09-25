import { Link } from "@tanstack/react-router";
import { Flame, Leaf, Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/types";

export function ProductCard({
  product,
  onCustomize,
  className,
}: {
  product: Product;
  onCustomize: (p: Product) => void;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group surface-card relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/60",
        !product.available && "opacity-60",
        className,
      )}
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={600}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-[var(--gradient-fade)]" aria-hidden />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.badges.includes("popular") ? <Badge className="bg-gold text-gold-foreground">Popular</Badge> : null}
          {product.badges.includes("new") ? <Badge className="bg-fresh text-fresh-foreground">New</Badge> : null}
          {product.compareAtPrice ? <Badge variant="destructive">Save {money(product.compareAtPrice - product.price)}</Badge> : null}
          {product.badges.includes("chef") ? <Badge variant="secondary">Chef's pick</Badge> : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl leading-tight">
            <Link to="/product/$slug" params={{ slug: product.slug }} className="transition-colors hover:text-gold">
              {product.name}
            </Link>
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-sm text-gold">
            <Star className="size-3.5 fill-current" aria-hidden />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{product.calories} kcal</span>
          {product.vegetarian ? (
            <span className="flex items-center gap-1 text-fresh"><Leaf className="size-3.5" aria-hidden />Veg</span>
          ) : null}
          {product.spiceLevel > 0 ? (
            <span className="flex items-center gap-1 text-primary" aria-label={`Spice level ${product.spiceLevel} of 3`}>
              {Array.from({ length: product.spiceLevel }).map((_, i) => (
                <Flame key={i} className="size-3.5" aria-hidden />
              ))}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 pt-1">
          <p className="font-display text-2xl">
            {money(product.price)}
            {product.compareAtPrice ? (
              <span className="ml-2 align-middle text-sm text-muted-foreground line-through">
                {money(product.compareAtPrice)}
              </span>
            ) : null}
          </p>
          <Button
            size="sm"
            onClick={() => onCustomize(product)}
            disabled={!product.available}
            aria-label={product.available ? `Customize and add ${product.name}` : `${product.name} unavailable`}
          >
            <Plus className="size-4" aria-hidden />
            {product.available ? "Add" : "Sold out"}
          </Button>
        </div>
      </div>
    </article>
  );
}
