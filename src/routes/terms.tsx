import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Terms & Conditions — Blaze & Bun" },
      { name: "description", content: "The terms that apply when you order food, use rewards points or browse the Blaze & Bun website." },
      { property: "og:title", content: "Terms & Conditions — Blaze & Bun" },
      { property: "og:description", content: "The terms that apply when you order from Blaze & Bun." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TermsPage,
});

const SECTIONS = [
  { h: "1. About these terms", p: "By placing an order or using this website you agree to the terms below. They exist to keep expectations clear on both sides." },
  { h: "2. Demo status", p: "This website is currently a demonstration. Menu items, branches, prices, orders and loyalty balances are sample data held in your browser. No food is prepared and no money changes hands." },
  { h: "3. Orders", p: "An order is accepted once the kitchen confirms it. We may decline an order if an item is out of stock, the address falls outside a delivery zone, or the branch is closed." },
  { h: "4. Prices and payment", p: "Prices shown include tax and may change. Delivery fees vary by branch. Cash on delivery is the only method reflecting a real flow at present; card, online and wallet options are placeholders." },
  { h: "5. Tips", p: "Tips are entirely optional, shared among the kitchen and delivery crew working your order, and never attributed to one named individual." },
  { h: "6. Rewards", p: "Points are earned at 10 per $1 spent and hold no cash value. We may adjust the rewards catalogue, and points may be removed where an order is refunded or fraudulent." },
  { h: "7. Allergens", p: "Ingredient lists are provided for every item, but our kitchens handle common allergens in shared spaces. We cannot guarantee an allergen-free product." },
  { h: "8. Cancellations and refunds", p: "Contact the branch as soon as possible. Once preparation has started we may be unable to cancel. Where something goes wrong, we will remake the item or refund it." },
  { h: "9. Acceptable use", p: "Don't misuse the site: no scraping, no attempts to disrupt service, no fraudulent orders or promo code abuse." },
  { h: "10. Liability", p: "We are responsible for losses we cause you that are a foreseeable result of breaking these terms. We are not liable for delays caused by events outside our control." },
  { h: "11. Changes", p: "We may update these terms. The version published here applies to any order you place after it appears." },
  { h: "12. Contact", p: "Questions about these terms can be sent through the contact page." },
];

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-7xl">Terms &amp; conditions</h1>
      <p className="mt-4 text-sm text-muted-foreground">Sample terms provided for demonstration — review with a legal advisor before going live.</p>
      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="text-2xl">{s.h}</h2>
            <p className="mt-2 text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
