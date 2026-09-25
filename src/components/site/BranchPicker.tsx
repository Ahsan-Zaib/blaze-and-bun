import { useMemo, useState } from "react";
import { Crosshair, Clock, MapPin, Search, Store, Truck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { branches, isOpenNow } from "@/data/branches";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BranchPicker({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { setBranch, branchId, play } = useStore();
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...branches].sort((a, b) => a.distanceKm - b.distanceKm);
    if (!q) return list;
    return list.filter((b) =>
      [b.name, b.area, b.address, ...b.zones].join(" ").toLowerCase().includes(q),
    );
  }, [query]);

  function useMyLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationNote("Your browser can't share a location — pick a branch below instead.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocating(false);
        setLocationNote("Location shared. Showing your closest kitchen first — distances are demo values.");
      },
      () => {
        setLocating(false);
        setLocationNote("No problem — search your area or choose a branch below.");
      },
      { timeout: 8000 },
    );
  }

  function choose(id: string) {
    setBranch(id);
    play("toggle");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">Where are you ordering from?</DialogTitle>
          <DialogDescription>
            Pick a kitchen and we'll show its menu, delivery times and fees.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="secondary" onClick={useMyLocation} disabled={locating} className="sm:w-auto">
            <Crosshair className="size-4" aria-hidden />
            {locating ? "Locating…" : "Use my current location"}
          </Button>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter an area, address or branch"
              aria-label="Search for your area or a branch"
              className="pl-9"
            />
          </div>
        </div>
        {locationNote ? <p className="text-xs text-muted-foreground">{locationNote}</p> : null}

        <ul className="mt-2 space-y-3">
          {results.map((b) => {
            const openNow = isOpenNow(b);
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => choose(b.id)}
                  className={cn(
                    "w-full rounded-xl border border-border bg-secondary/40 p-4 text-left transition-all hover:border-primary hover:bg-secondary",
                    branchId === b.id && "border-primary bg-secondary",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display text-xl">{b.name}</span>
                    <Badge variant={openNow ? "default" : "secondary"}>
                      {openNow ? "Open now" : "Closed"}
                    </Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" aria-hidden /> {b.address} · {b.distanceKm} km away
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" aria-hidden /> {b.opensAt}–{b.closesAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="size-3.5" aria-hidden />
                      {b.delivery ? `Delivery ~${b.deliveryMinutes} min` : "No delivery"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Store className="size-3.5" aria-hidden />
                      {b.pickup ? `Pickup ~${b.prepMinutes} min` : "No pickup"}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
          {results.length === 0 ? (
            <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No branch matches “{query}”. Try a nearby area.
            </li>
          ) : null}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
