import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Leaf, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductGrid } from "./ProductGrid";
import { categories, products, productsInCategory } from "@/data/menu";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/data/types";

type Sort = "popular" | "price-asc" | "price-desc" | "rating" | "calories";

export function MenuBrowser({ category }: { category?: CategoryId }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("popular");
  const [vegOnly, setVegOnly] = useState(false);
  const [dealsOnly, setDealsOnly] = useState(false);

  const list = useMemo(() => {
    let items = category ? productsInCategory(category) : products;
    const q = query.trim().toLowerCase();
    if (q)
      items = items.filter((p) =>
        [p.name, p.description, ...p.ingredients].join(" ").toLowerCase().includes(q),
      );
    if (vegOnly) items = items.filter((p) => p.vegetarian);
    if (dealsOnly) items = items.filter((p) => p.compareAtPrice);
    const sorted = [...items];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "calories":
        sorted.sort((a, b) => a.calories - b.calories);
        break;
      default:
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return sorted;
  }, [category, query, sort, vegOnly, dealsOnly]);

  return (
    <div>
      <div className="-mx-4 mb-6 overflow-x-auto px-4 pb-2">
        <div className="flex w-max gap-2">
          <Link
            to="/menu"
            className={cn(
              "rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-gold",
              !category && "border-primary bg-primary text-primary-foreground",
            )}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/menu/$category"
              params={{ category: c.id }}
              className={cn(
                "flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-gold",
                category === c.id && "border-primary bg-primary text-primary-foreground",
              )}
            >
              <span aria-hidden>{c.emoji}</span> {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card/50 p-4">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the menu"
            aria-label="Search the menu"
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden />
          <Label htmlFor="sort" className="sr-only">Sort</Label>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger id="sort" className="w-44">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="rating">Highest rated</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="calories">Lowest calories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Switch id="veg" checked={vegOnly} onCheckedChange={setVegOnly} />
          <Label htmlFor="veg" className="flex items-center gap-1 text-sm">
            <Leaf className="size-4 text-fresh" aria-hidden /> Vegetarian
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch id="deals" checked={dealsOnly} onCheckedChange={setDealsOnly} />
          <Label htmlFor="deals" className="text-sm">On offer</Label>
        </div>

        <p className="ml-auto text-sm text-muted-foreground" aria-live="polite">
          {list.length} {list.length === 1 ? "item" : "items"}
        </p>
      </div>

      {list.length > 0 ? (
        <ProductGrid products={list} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-2xl">Nothing matches those filters</p>
          <p className="mt-2 text-sm text-muted-foreground">Try clearing the search or switching category.</p>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => {
              setQuery("");
              setVegOnly(false);
              setDealsOnly(false);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
