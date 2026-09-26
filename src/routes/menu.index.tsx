import { createFileRoute } from "@tanstack/react-router";
import { BranchStrip } from "@/components/site/BranchStrip";
import { MenuBrowser } from "@/components/site/MenuBrowser";

export const Route = createFileRoute("/menu/")({
  head: () => ({
    meta: [
      { title: "Full Menu — Blaze & Bun" },
      {
        name: "description",
        content:
          "Browse every burger, chicken bucket, pizza, wrap, side, shake and dessert on the Blaze & Bun menu. Filter by vegetarian, spice and offers.",
      },
      { property: "og:title", content: "Full Menu — Blaze & Bun" },
      {
        property: "og:description",
        content: "Burgers, chicken, pizza, sides, shakes and desserts — built to order.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  return (
    <>
      <BranchStrip />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-6xl">The menu</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Everything is made to order. Tap any dish to size it up, stack extras, drop ingredients and
          add a side.
        </p>
        <div className="mt-8">
          <MenuBrowser />
        </div>
      </div>
    </>
  );
}
