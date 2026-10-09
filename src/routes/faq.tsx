import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "FAQ — Blaze & Bun" },
      { name: "description", content: "Delivery times, allergens, order changes, rewards points and payment — the answers to the questions we get most." },
      { property: "og:title", content: "FAQ — Blaze & Bun" },
      { property: "og:description", content: "Answers to the questions we get most." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  { q: "How long does delivery take?", a: "Most orders arrive in 25–35 minutes depending on your branch and how busy the grill is. The branch bar at the top of the menu shows the current estimate before you order." },
  { q: "Can I change or cancel an order?", a: "Call the kitchen that's cooking it straight away. Once a burger hits the grill we can't pull it back, but the crew will always try to help." },
  { q: "Do you cater for allergies?", a: "Every item lists its ingredients on the product page. Our kitchens handle gluten, dairy, egg, sesame and nuts in a shared space, so we can't guarantee zero cross-contact." },
  { q: "Are there vegetarian options?", a: "Yes — use the vegetarian filter on the menu. Our halloumi stack and spiced bean burger are crew favourites." },
  { q: "How do rewards points work?", a: "You earn 10 points for every $1 spent, added the moment the order is placed. Points can be swapped for fries, drinks, shakes, wings, burgers or free delivery." },
  { q: "Which payment methods do you accept?", a: "Cash on delivery today. Card, online and wallet options appear at checkout but no payment provider is connected yet, so nothing is charged." },
  { q: "Is the tip optional?", a: "Always. It's shared across the kitchen and delivery crew working your order and is never assigned to one individual. Skipping it changes nothing about your food." },
  { q: "Do you do large or corporate orders?", a: "We do. Message us through the contact page with your date, headcount and branch and we'll come back with a plan." },
];

function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-7xl">Good questions</h1>
      <p className="mt-4 text-muted-foreground">Everything people ask us most, answered plainly.</p>

      <Accordion type="single" collapsible className="mt-10">
        {FAQS.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-left font-display text-xl">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="surface-card mt-12 rounded-2xl p-8 text-center">
        <h2 className="text-3xl">Still stuck?</h2>
        <p className="mt-2 text-muted-foreground">The crew would rather hear from you than have you guess.</p>
        <Button asChild className="mt-5"><Link to="/contact">Contact us</Link></Button>
      </div>
    </div>
  );
}
