import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone, Search, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/site/Reveal";
import { branches, isOpenNow } from "@/data/branches";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: "Our Branches — Blaze & Bun" },
      {
        name: "description",
        content:
          "Find your nearest Blaze & Bun kitchen: opening hours, delivery zones, pickup availability, prep times and contact details.",
      },
      { property: "og:title", content: "Our Branches — Blaze & Bun" },
      { property: "og:description", content: "Opening hours, delivery zones and pickup at every Blaze & Bun kitchen." },
    ],
  }),
  component: BranchesPage,
});

function BranchesPage() {
  const { branchId, setBranch } = useStore();
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...branches].sort((a, b) => a.distanceKm - b.distanceKm);
    if (!q) return sorted;
    return sorted.filter((b) => [b.name, b.area, b.address, ...b.zones].join(" ").toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-6xl">Our kitchens</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Five kitchens, each with its own hours and delivery zone. Distances shown are demo values,
        not measured from your device.
      </p>

      <div className="relative mt-8 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by area, address or zone"
          aria-label="Search branches"
          className="pl-9"
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {list.map((b, i) => {
          const open = isOpenNow(b);
          const selected = branchId === b.id;
          return (
            <Reveal key={b.id} delay={i * 60}>
              <article className="surface-card h-full rounded-2xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-3xl">{b.name}</h2>
                  <Badge variant={open ? "default" : "secondary"}>{open ? "Open now" : "Closed"}</Badge>
                </div>

                <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" aria-hidden />
                    <span>{b.address} · {b.distanceKm} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4" aria-hidden />
                    <span>Open {b.opensAt}–{b.closesAt} · prep ~{b.prepMinutes} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="size-4" aria-hidden />
                    <span>
                      {b.delivery
                        ? `Delivery ~${b.deliveryMinutes} min · fee ${money(b.deliveryFee)}`
                        : "Delivery not available"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Store className="size-4" aria-hidden />
                    <span>
                      {b.pickup ? "Pickup available" : "No pickup"}
                      {b.dineIn ? " · dine-in seating" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4" aria-hidden />
                    <a href={`tel:${b.phone.replace(/[^+\d]/g, "")}`} className="hover:text-gold">{b.phone}</a>
                  </div>
                </dl>

                {b.zones.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Delivery zones</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {b.zones.map((z) => (
                        <li key={z} className="rounded-full border border-border px-3 py-1 text-xs">{z}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button onClick={() => setBranch(b.id)} variant={selected ? "secondary" : "default"}>
                    {selected ? "Selected kitchen" : "Order from here"}
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to="/menu">View menu</Link>
                  </Button>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
