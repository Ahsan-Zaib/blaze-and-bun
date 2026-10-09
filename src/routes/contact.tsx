import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { branches } from "@/data/branches";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Contact Us — Blaze & Bun" },
      { name: "description", content: "Questions about an order, catering or a job at Blaze & Bun? Call a kitchen directly or send us a message." },
      { property: "og:title", content: "Contact Us — Blaze & Bun" },
      { property: "og:description", content: "Call a kitchen directly or send us a message." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-7xl">Talk to us</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Something wrong with an order? Call the kitchen that cooked it — that's always fastest.
        Everything else can come through the form.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <section className="surface-card rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-3xl">
            <MessageSquare className="size-6 text-primary" aria-hidden /> Send a message
          </h2>
          <form
            className="mt-6 grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast.success("Thanks — we've noted your message.", {
                description: "Email delivery isn't connected in this demo, so nothing was actually sent.",
              });
            }}
          >
            <div>
              <Label htmlFor="c-name">Name</Label>
              <Input id="c-name" required autoComplete="name" />
            </div>
            <div>
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" type="email" required autoComplete="email" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="c-subject">Subject</Label>
              <Input id="c-subject" required placeholder="Order issue, catering, careers…" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="c-message">Message</Label>
              <Textarea id="c-message" rows={5} required />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg">Send message</Button>
              {sent ? (
                <p className="mt-3 text-sm text-fresh" aria-live="polite">
                  Message captured. Once email is connected this will reach the team inbox.
                </p>
              ) : null}
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-2xl">Head office</h2>
            <p className="mt-3 flex items-center gap-2 text-sm">
              <Mail className="size-4 text-gold" aria-hidden />
              <a href="mailto:hello@blazeandbun.example" className="underline">hello@blazeandbun.example</a>
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm">
              <Phone className="size-4 text-gold" aria-hidden />
              <a href="tel:+15550100100" className="underline">+1 555 0100 100</a>
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 text-gold" aria-hidden /> Every day, 10:00 – 23:00
            </p>
          </div>

          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-2xl">Call a kitchen</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {branches.map((b) => (
                <li key={b.id} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{b.name}</span>
                  <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="underline">{b.phone}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
