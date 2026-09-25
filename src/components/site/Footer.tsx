import { Link } from "@tanstack/react-router";
import { Flame, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <Flame className="size-6 text-primary" aria-hidden />
            <span className="font-display text-2xl tracking-wide">Blaze &amp; Bun</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Flame-grilled since 2014. Five kitchens, one obsession: food that arrives as good as it
            leaves the pass.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://instagram.com" aria-label="Instagram" className="rounded-full border border-border p-2 transition-colors hover:border-primary hover:text-primary">
              <Instagram className="size-4" aria-hidden />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="rounded-full border border-border p-2 transition-colors hover:border-primary hover:text-primary">
              <Facebook className="size-4" aria-hidden />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="rounded-full border border-border p-2 transition-colors hover:border-primary hover:text-primary">
              <Twitter className="size-4" aria-hidden />
            </a>
          </div>
        </div>

        <nav aria-label="Order" className="text-sm">
          <h3 className="mb-4 text-lg">Order</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/menu" className="transition-colors hover:text-gold">Menu</Link></li>
            <li><Link to="/deals" className="transition-colors hover:text-gold">Deals &amp; offers</Link></li>
            <li><Link to="/branches" className="transition-colors hover:text-gold">Branches</Link></li>
            <li><Link to="/cart" className="transition-colors hover:text-gold">Your cart</Link></li>
            <li><Link to="/rewards" className="transition-colors hover:text-gold">Rewards</Link></li>
          </ul>
        </nav>

        <nav aria-label="Company" className="text-sm">
          <h3 className="mb-4 text-lg">Company</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/about" className="transition-colors hover:text-gold">About us</Link></li>
            <li><Link to="/contact" className="transition-colors hover:text-gold">Contact</Link></li>
            <li><Link to="/faq" className="transition-colors hover:text-gold">FAQ</Link></li>
            <li><Link to="/admin" className="transition-colors hover:text-gold">Staff dashboard</Link></li>
          </ul>
        </nav>

        <nav aria-label="Legal" className="text-sm">
          <h3 className="mb-4 text-lg">Legal</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/terms" className="transition-colors hover:text-gold">Terms &amp; conditions</Link></li>
            <li><Link to="/privacy" className="transition-colors hover:text-gold">Privacy policy</Link></li>
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            Demo site: menu, branches, orders and payments are sample data, not a live restaurant.
          </p>
        </nav>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Blaze &amp; Bun. All rights reserved.
      </div>
    </footer>
  );
}
