import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Clock, Flame, Quote, Star, Truck, Utensils } from "lucide-react";
import heroBurger from "@/assets/hero-burger.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BranchStrip } from "@/components/site/BranchStrip";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { bestSellers, categories, featured, products } from "@/data/menu";
import { deals } from "@/data/deals";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blaze & Bun — Flame-grilled burgers delivered hot" },
      {
        name: "description",
        content:
          "Smash burgers, crispy chicken buckets and stone-baked pizza from your nearest Blaze & Bun kitchen. Build your order, tip the crew, track it to the door.",
      },
      { property: "og:title", content: "Blaze & Bun — Flame-grilled burgers delivered hot" },
      {
        property: "og:description",
        content: "Smash burgers, crispy chicken and stone-baked pizza. Delivery, pickup and dine-in.",
      },
    ],
  }),
  component: Home,
});

const reviews = [
  {
    name: "Amira K.",
    text: "The double smash actually arrived hot and the fries were still crispy. That never happens.",
    rating: 5,
  },
  {
    name: "Dan P.",
    text: "Customising the burger is ridiculously easy — no onions, extra house sauce, done in seconds.",
    rating: 5,
  },
  {
    name: "Sofia R.",
    text: "Ordered the family box for six people and it came earlier than the estimate. Kids demolished it.",
    rating: 4,
  },
];

function Home() {
  const { play, soundOn } = useStore();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Badge className="bg-gold text-gold-foreground">Flame-grilled since 2014</Badge>
            <h1 className="mt-5 text-6xl leading-[0.92] sm:text-7xl lg:text-8xl">
              Seriously good <span className="ember-text">fast food</span>, straight off the flame.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Smashed patties, double-dredged chicken and stone-baked pizza — built to order and out
              of the kitchen in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="glow-ember">
                <Link to="/menu">
                  Order now <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/menu">View menu</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Avg. delivery</dt>
                <dd className="font-display text-3xl text-gold">27 min</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Kitchens</dt>
                <dd className="font-display text-3xl text-gold">5</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Rating</dt>
                <dd className="font-display text-3xl text-gold">4.8★</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <img
              src={heroBurger}
              alt="Double smash burger with melted cheddar, bacon and fresh lettuce"
              width={1280}
              height={1280}
              fetchPriority="high"
              onMouseEnter={() => play("sizzle")}
              className="mx-auto w-full max-w-lg rounded-[2rem] object-cover shadow-[var(--shadow-ember)] transition-transform duration-700 hover:scale-[1.02]"
            />
            <div className="absolute bottom-5 left-2 rounded-2xl border border-border bg-card/90 px-4 py-3 backdrop-blur sm:left-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Signature</p>
              <p className="font-display text-2xl">Blaze Double Smash</p>
              <p className="text-sm text-gold">{money(11.9)}</p>
            </div>
            {soundOn ? null : (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Tip: turn sound on in the header for subtle kitchen sounds.
              </p>
            )}
          </div>
        </div>
      </section>

      <BranchStrip />

      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading eyebrow="Browse" title="Pick your craving" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 40}>
              <Link
                to="/menu/$category"
                params={{ category: c.id }}
                className="surface-card flex h-full flex-col items-center gap-1 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 hover:border-gold"
              >
                <span className="text-3xl" aria-hidden>{c.emoji}</span>
                <span className="font-display text-lg">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.tagline}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHeading
          eyebrow="Most ordered"
          title="Best sellers"
          description="The dishes our kitchens can barely keep up with."
          action={
            <Button asChild variant="ghost">
              <Link to="/menu">See full menu <ArrowRight className="size-4" aria-hidden /></Link>
            </Button>
          }
        />
        <ProductGrid products={bestSellers} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHeading eyebrow="Fresh" title="Featured & new arrivals" />
        <ProductGrid products={featured} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          eyebrow="Save more"
          title="Combo deals & offers"
          action={
            <Button asChild variant="ghost">
              <Link to="/deals">All deals <ArrowRight className="size-4" aria-hidden /></Link>
            </Button>
          }
        />
        <div className="grid gap-5 md:grid-cols-3">
          {deals.slice(0, 3).map((d, i) => (
            <Reveal key={d.id} delay={i * 80}>
              <article className="surface-card group h-full overflow-hidden rounded-2xl">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={d.image} alt={d.title} loading="lazy" width={800} height={450} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="text-2xl">{d.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
                  <div className="mt-4 flex items-center gap-3">
                    {d.price ? (
                      <p className="font-display text-2xl text-gold">
                        {money(d.price)}
                        {d.compareAtPrice ? (
                          <span className="ml-2 text-sm text-muted-foreground line-through">{money(d.compareAtPrice)}</span>
                        ) : null}
                      </p>
                    ) : (
                      <Badge variant="secondary">Code {d.code}</Badge>
                    )}
                    <Button asChild size="sm" variant="secondary" className="ml-auto">
                      <Link to="/deals">View deal</Link>
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/40 py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3">
          {[
            { icon: Truck, title: "Delivery to your door", text: "Live estimate before you pay, hot bags on every ride." },
            { icon: Utensils, title: "Pickup in minutes", text: "Skip the queue — we'll have it bagged at the counter." },
            { icon: Clock, title: "Made to order", text: "Nothing sits under a heat lamp. Ever." },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="flex gap-4">
                <f.icon className="size-8 shrink-0 text-primary" aria-hidden />
                <div>
                  <h3 className="text-2xl">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading eyebrow="Guests" title="What people say" />
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 80}>
              <figure className="surface-card h-full rounded-2xl p-6">
                <Quote className="size-6 text-primary" aria-hidden />
                <blockquote className="mt-3 text-sm leading-relaxed">{r.text}</blockquote>
                <figcaption className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold">{r.name}</span>
                  <span className="flex gap-0.5 text-gold" aria-label={`${r.rating} out of 5`}>
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <Star key={s} className="size-4 fill-current" aria-hidden />
                    ))}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-2">
        <Reveal>
          <img
            src={products[4]?.image}
            alt="Crispy fried chicken pieces fresh from the fryer"
            loading="lazy"
            width={800}
            height={800}
            className="rounded-[2rem] object-cover"
          />
        </Reveal>
        <Reveal delay={100}>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Our story</p>
            <h2 className="text-5xl">One grill, one obsession</h2>
            <p className="mt-4 text-muted-foreground">
              Blaze &amp; Bun started as a single converted shipping container with one flat-top grill
              and a queue that wrapped around the block. A decade on, we still smash every patty to
              order, still brine our chicken for 24 hours, and still refuse to serve anything we
              wouldn't eat on our own break.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link to="/about">Read our story</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/branches">Find a kitchen</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <Reveal>
          <div className="surface-card relative overflow-hidden rounded-[2rem] p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-gold/20 blur-3xl" aria-hidden />
            <div className="relative flex flex-wrap items-center gap-8">
              <Award className="size-12 text-gold" aria-hidden />
              <div className="min-w-[16rem] flex-1">
                <h2 className="text-5xl">Every bite counts</h2>
                <p className="mt-3 max-w-xl text-muted-foreground">
                  Earn 10 points for every dollar. Free fries at 500, a free burger at 1,200, and a
                  full combo on the house at 2,500.
                </p>
              </div>
              <Button asChild size="lg">
                <Link to="/rewards">
                  <Flame className="size-4" aria-hidden /> View rewards
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
