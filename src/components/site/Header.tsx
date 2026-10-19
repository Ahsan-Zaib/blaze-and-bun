import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Flame, MapPin, Menu as MenuIcon, ShoppingBag, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BranchPicker } from "./BranchPicker";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { to: "/menu", label: "Menu" },
  { to: "/deals", label: "Deals" },
  { to: "/branches", label: "Branches" },
  { to: "/rewards", label: "Rewards" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { branch, itemCount, soundOn, toggleSound, ready } = useStore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pop, setPop] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (itemCount === 0) return;
    setPop(true);
    const t = setTimeout(() => setPop(false), 420);
    return () => clearTimeout(t);
  }, [itemCount]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Blaze and Bun home">
          <Flame className="size-6 text-primary" aria-hidden />
          <span className="font-display text-2xl tracking-wide">Blaze &amp; Bun</span>
        </Link>

        <nav aria-label="Main" className="ml-6 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              {...(l.to === "/menu" ? { "data-fx-fire": true } : {})}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname.startsWith(l.to) && "bg-secondary text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPickerOpen(true)}
            className="hidden max-w-[220px] sm:flex"
          >
            <MapPin className="size-4 text-gold" aria-hidden />
            <span className="truncate">{ready && branch ? branch.area : "Set location"}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
            title={soundOn ? "Sound on" : "Sound off"}
          >
            {soundOn ? <Volume2 className="size-5 text-gold" aria-hidden /> : <VolumeX className="size-5" aria-hidden />}
          </Button>

          <Button asChild variant="secondary" size="sm" className="relative">
            <Link to="/cart" aria-label={`Cart, ${itemCount} items`}>
              <ShoppingBag className={cn("size-4", pop && "cart-pop")} aria-hidden />
              <span className="hidden sm:inline">Cart</span>
              {ready && itemCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          </Button>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" data-fx-fire>
                <MenuIcon className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="mt-4 flex flex-col gap-1 px-4 pb-6">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    {...(l.to === "/menu" ? { "data-fx-fire": true } : {})}
                    onClick={() => setSheetOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-secondary"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link to="/faq" onClick={() => setSheetOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-secondary">FAQ</Link>
                <Link to="/admin" onClick={() => setSheetOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-secondary">Staff dashboard</Link>
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={() => {
                    setSheetOpen(false);
                    setPickerOpen(true);
                  }}
                >
                  <MapPin className="size-4" aria-hidden />
                  {branch ? branch.area : "Set your location"}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <BranchPicker open={pickerOpen} onOpenChange={setPickerOpen} />
    </header>
  );
}
