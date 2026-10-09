import { createFileRoute, notFound } from "@tanstack/react-router";
import { BranchStrip } from "@/components/site/BranchStrip";
import { MenuBrowser } from "@/components/site/MenuBrowser";
import { categories } from "@/data/menu";
import type { CategoryId } from "@/data/types";

export const Route = createFileRoute("/menu/$category")({
  loader: ({ params }) => {
    const category = categories.find((c) => c.id === params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Category unavailable — Blaze & Bun" }, { name: "robots", content: "noindex" }] };
    const { category } = loaderData;
    const title = `${category.name} — Blaze & Bun`;
    const description = `${category.tagline}. Order ${category.name.toLowerCase()} from Blaze & Bun for delivery, pickup or dine-in.`;
    return {
      meta: [
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  notFoundComponent: CategoryNotFound,
  component: CategoryPage,
});

function CategoryNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-5xl">We don't serve that category</h1>
      <p className="mt-3 text-muted-foreground">Head back to the full menu to find your craving.</p>
    </div>
  );
}

function CategoryPage() {
  const { category } = Route.useLoaderData();
  return (
    <>
      <BranchStrip />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="flex items-center gap-3 text-6xl">
          <span aria-hidden>{category.emoji}</span> {category.name}
        </h1>
        <p className="mt-3 text-muted-foreground">{category.tagline}</p>
        <div className="mt-8">
          <MenuBrowser category={category.id as CategoryId} />
        </div>
      </div>
    </>
  );
}
