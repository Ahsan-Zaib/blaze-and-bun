import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Copy, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { deals } from "@/data/deals";
import { money } from "@/lib/format";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Deals & Offers — Blaze & Bun" },
      {
        name: "description",
        content:
          "Combo meals, buy-one-get-one wings, family feast boxes, student discounts and weekend pizza nights at Blaze & Bun.",
      },
      { property: "og:title", content: "Deals & Offers — Blaze & Bun" },
      { property: "og:description", content: "Combos, BOGO wings, family boxes and student discounts." },
    ],
  }),
  component: DealsPage,
});

const kindLabel: Record<string, string> = {
  combo: "Combo",
  bogo: "Buy one get one",
  family: "Family",
  student: "Student",
  weekend: "Weekend",
  limited: "Welcome offer",
};

function DealsPage() {
  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Code ${code} copied — paste it in your cart.`);
    } catch {
      toast.info(`Your code is ${code}. Enter it in your cart.`);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-6xl">Deals &amp; offers</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Promo codes apply to your cart subtotal. Offers can't be combined and are shown as
        configured by each kitchen.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((d, i) => (
          <Reveal key={d.id} delay={i * 70}>
            <article className="surface-card group flex h-full flex-col overflow-hidden rounded-2xl">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={d.image} alt={d.title} loading="lazy" width={800} height={500} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <Badge variant="secondary" className="w-fit">{kindLabel[d.kind]}</Badge>
                <h2 className="mt-3 text-2xl">{d.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.description}</p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {d.price ? (
                    <p className="font-display text-3xl text-gold">
                      {money(d.price)}
                      {d.compareAtPrice ? (
                        <span className="ml-2 text-sm text-muted-foreground line-through">{money(d.compareAtPrice)}</span>
                      ) : null}
                    </p>
                  ) : null}
                  {d.code ? (
                    <Button variant="secondary" size="sm" onClick={() => copy(d.code!)}>
                      <Copy className="size-4" aria-hidden /> {d.code}
                    </Button>
                  ) : null}
                  <Button asChild size="sm" className="ml-auto">
                    <Link to="/menu">Start order</Link>
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <section className="mt-16">
        <SectionHeading eyebrow="How it works" title="Using a promo code" />
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            "Add your food to the bag as normal.",
            "Open your cart and paste the code into the promo field.",
            "The discount applies to your subtotal before delivery and tip.",
          ].map((step, i) => (
            <li key={step} className="surface-card flex gap-4 rounded-2xl p-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-display text-lg text-primary-foreground">
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground">{step}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Tag className="size-4 text-gold" aria-hidden />
          Demo note: codes are validated locally in this prototype, not against a payments or
          promotions backend.
        </p>
      </section>
    </div>
  );
}
