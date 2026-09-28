import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Leaf, Timer, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBurger from "@/assets/hero-burger.jpg";
import chicken from "@/assets/food-chicken.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Blaze & Bun" },
      { name: "description", content: "How Blaze & Bun grew from one charcoal grill into five kitchens obsessed with flame-grilled burgers, chicken and pizza." },
      { property: "og:title", content: "Our Story — Blaze & Bun" },
      { property: "og:description", content: "One charcoal grill, five kitchens, one obsession: flame." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Flame, title: "Real flame", text: "Every patty hits open charcoal. No conveyor, no shortcuts." },
  { icon: Leaf, title: "Cut fresh daily", text: "Produce is prepped each morning and never held overnight." },
  { icon: Timer, title: "Made to order", text: "Nothing sits under a heat lamp waiting for you." },
  { icon: Users, title: "Crew first", text: "Fair pay, shared tips, and a kitchen people want to work in." },
];

function AboutPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <img src={heroBurger} alt="" aria-hidden loading="lazy" className="absolute inset-0 size-full object-cover opacity-25" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
          <p className="font-display text-xl text-gold">Since 2014</p>
          <h1 className="mt-2 text-7xl">Built around an open flame</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Blaze &amp; Bun started as a single charcoal grill in a downtown alley. The queue outside
            told us we were onto something.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
        <img src={chicken} alt="Flame-grilled chicken on the pass" loading="lazy" className="rounded-3xl object-cover" />
        <div>
          <h2 className="text-5xl">From one grill to five kitchens</h2>
          <p className="mt-4 text-muted-foreground">
            We never wanted to be the biggest. We wanted every single order to taste like the first
            one we ever sold. So we kept the recipes, kept the charcoal, and grew slowly — one
            neighbourhood at a time.
          </p>
          <p className="mt-4 text-muted-foreground">
            Today five kitchens run the same playbook: buns baked locally, patties ground each
            morning, sauces made in-house, and everything cooked only once you order it.
          </p>
          <Button asChild className="mt-7"><Link to="/branches">Find your kitchen</Link></Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-5xl">What we refuse to compromise</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <li key={v.title} className="surface-card rounded-2xl p-6 reveal-up">
              <v.icon className="size-6 text-gold" aria-hidden />
              <h3 className="mt-3 text-2xl">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
