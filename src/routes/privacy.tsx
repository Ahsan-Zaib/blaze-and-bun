import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Privacy Policy — Blaze & Bun" },
      { name: "description", content: "What information Blaze & Bun collects when you order, how it is used, and the choices you have over it." },
      { property: "og:title", content: "Privacy Policy — Blaze & Bun" },
      { property: "og:description", content: "What we collect when you order, and what we do with it." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  { h: "Where your data lives today", p: "This site is a demonstration. Your branch choice, bag, orders and points are stored only in your own browser's local storage. Nothing is transmitted to a server and clearing site data erases it all." },
  { h: "What we would collect in production", p: "Name, phone number, email address, delivery address and delivery instructions — the minimum needed to cook and deliver an order — plus your order history and rewards balance." },
  { h: "How it would be used", p: "To prepare and deliver your food, keep you updated on order status, run the rewards programme, handle refunds, and improve the menu based on aggregate ordering patterns." },
  { h: "Location", p: "If you press \"use my location\" we ask your browser for coordinates purely to suggest the nearest branch. You can always pick a branch manually instead, and we do not track your location in the background." },
  { h: "Sharing", p: "Delivery riders receive your address and phone number for the duration of a delivery. Payment providers, once connected, would process card details directly — we would never store full card numbers." },
  { h: "Cookies and storage", p: "We use local storage to remember your bag and branch between visits. No advertising or cross-site tracking cookies are used." },
  { h: "Retention", p: "Order records would be kept as long as required for accounting and refunds. Account data is deleted on request." },
  { h: "Your choices", p: "You can request a copy of your data, ask for corrections, or ask us to delete your account at any time through the contact page." },
  { h: "Children", p: "The service is intended for adults. We do not knowingly collect information from children." },
  { h: "Contact", p: "Privacy questions can be sent through the contact page and reach the team responsible for data protection." },
];

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-7xl">Privacy policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Sample policy provided for demonstration — review with a legal advisor before going live.</p>
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
