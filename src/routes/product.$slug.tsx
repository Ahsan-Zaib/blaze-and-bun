import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Flame, Leaf, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CustomizeDialog } from "@/components/site/CustomizeDialog";
import { ProductGrid } from "@/components/site/ProductGrid";
import { SectionHeading } from "@/components/site/SectionHeading";
import { getProduct, products } from "@/data/menu";
import { money } from "@/lib/format";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Item unavailable — Blaze & Bun" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    return {
      meta: [
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: `${p.name} — Blaze & Bun` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.name} — Blaze & Bun` },
        { property: "og:description", content: p.description },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-5xl">That dish isn't on the menu</h1>
      <p className="mt-3 text-muted-foreground">It may have sold out or been retired.</p>
      <Button asChild className="mt-6">
        <Link to="/menu">Back to the menu</Link>
      </Button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [open, setOpen] = useState(false);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <Link to="/menu" className="hover:text-gold">Menu</Link>
        <span className="mx-2">/</span>
        <Link to="/menu/$category" params={{ category: product.category }} className="hover:text-gold">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <img
          src={product.image}
          alt={product.name}
          width={1000}
          height={800}
          className="w-full rounded-[2rem] object-cover"
        />

        <div>
          <div className="flex flex-wrap gap-2">
            {product.badges.includes("popular") ? <Badge className="bg-gold text-gold-foreground">Popular</Badge> : null}
            {product.badges.includes("new") ? <Badge className="bg-fresh text-fresh-foreground">New</Badge> : null}
            {product.compareAtPrice ? <Badge variant="destructive">Save {money(product.compareAtPrice - product.price)}</Badge> : null}
            {!product.available ? <Badge variant="secondary">Currently unavailable</Badge> : null}
          </div>

          <h1 className="mt-4 text-6xl">{product.name}</h1>
          <p className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 text-gold">
              <Star className="size-4 fill-current" aria-hidden /> {product.rating.toFixed(1)}
            </span>
            <span>({product.reviewCount} reviews)</span>
            <span>· {product.calories} kcal</span>
            <span>· ready in ~{product.prepMinutes} min</span>
          </p>

          <p className="mt-5 text-lg text-muted-foreground">{product.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
            {product.vegetarian ? (
              <span className="flex items-center gap-1.5 text-fresh"><Leaf className="size-4" aria-hidden /> Vegetarian</span>
            ) : null}
            {product.spiceLevel > 0 ? (
              <span className="flex items-center gap-1.5 text-primary">
                {Array.from({ length: product.spiceLevel }).map((_, i) => (
                  <Flame key={i} className="size-4" aria-hidden />
                ))}
                Spice {product.spiceLevel}/3
              </span>
            ) : null}
          </div>

          <Separator className="my-6" />

          <h2 className="text-2xl">What's in it</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {product.ingredients.map((i) => (
              <li key={i} className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-sm">
                {i}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <p className="font-display text-4xl">
              {money(product.price)}
              {product.compareAtPrice ? (
                <span className="ml-3 align-middle text-lg text-muted-foreground line-through">
                  {money(product.compareAtPrice)}
                </span>
              ) : null}
            </p>
            <Button size="lg" onClick={() => setOpen(true)} disabled={!product.available} className="glow-ember">
              {product.available ? "Customize & add" : "Sold out"}
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <SectionHeading eyebrow="Goes well with" title="You might also like" />
          <ProductGrid products={related} />
        </section>
      ) : null}

      <CustomizeDialog product={product} open={open} onOpenChange={setOpen} />
    </div>
  );
}
