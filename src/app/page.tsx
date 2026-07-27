import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { AnimatedCounter } from "@/components/marketing/AnimatedCounter";
import {
  ArrowRight, CheckCircle2, PlayCircle, Sprout, Factory, Warehouse, Truck,
  ShoppingCart, Landmark, Users, Package, BarChart3, Boxes, CreditCard, Star,
} from "lucide-react";

export const metadata = {
  title: "RSCN - Rwanda Supply Chain Network",
  description: "Connecting every product, every business, every movement across Rwanda. One national supply chain platform.",
};

export default function Home() {
  return (
    <MarketingShell>
      {/* HERO */}
      <section className="border-b border-border bg-background">
        <div className="container-rscn grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> National digital infrastructure
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Rwanda&apos;s national supply chain, connected.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              RSCN unifies farmers, cooperatives, manufacturers, warehouses, transporters,
              retailers, banks and government into one intelligent platform ” from harvest to shelf.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/register" className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/book-demo" className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-5 text-sm font-semibold hover:bg-surface">
                <PlayCircle className="h-4 w-4" /> Watch Demo
              </Link>
              <Link href="/auth/login" className="inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-primary hover:bg-primary/5">
                Explore Platform <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["ISO 27001 aligned", "WCAG A accessible", "Kinyarwanda · English · French"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> {t}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 shadow-elevated">
            <div className="rounded-xl border border-border bg-background p-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <div className="text-xs text-muted-foreground">National Dashboard · Q3 2026</div>
                  <div className="text-sm font-semibold">Live supply activity</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-success">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> Live
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Active orders", value: "12,483", sub: "+8.2%" },
                  { label: "In transit", value: "1,204", sub: "+3.1%" },
                  { label: "Warehouse fill", value: "68%", sub: "+1.4%" },
                ].map((k) => (
                  <div key={k.label} className="rounded-lg border border-border bg-surface p-3">
                    <div className="text-[11px] text-muted-foreground">{k.label}</div>
                    <div className="mt-1 text-xl font-bold">{k.value}</div>
                    <div className="text-[11px] text-success">{k.sub}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {[
                  ["Maize · 12 tons", "Musanze > Kigali", "In transit", "info"],
                  ["Coffee · 8 tons", "Huye > Rusizi", "Delivered", "success"],
                  ["Fertilizer · 40 pallets", "Kigali > Nyagatare", "Loading", "warning"],
                ].map(([a,b,c,tone]) => (
                  <div key={a} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                    <div>
                      <div className="font-medium">{a}</div>
                      <div className="text-xs text-muted-foreground">{b}</div>
                    </div>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                      tone === "success" ? "bg-success/10 text-success" : tone === "warning" ? "bg-warning/10 text-warning" : "bg-secondary/10 text-secondary"
                    }`}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border bg-surface">
        <div className="container-rscn grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {([
            { v: 12480, suffix: "+", l: "Businesses onboarded" },
            { v: 30, suffix: "", l: "Districts covered" },
            { v: 1.2, suffix: "M", l: "Tons moved / year", decimals: 1 },
            { v: 99.9, suffix: "%", l: "Platform uptime", decimals: 1 },
          ]).map((s) => (
            <div key={s.l}>
              <div className="text-2xl font-bold text-foreground md:text-3xl">
                <AnimatedCounter value={s.v} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <Section heading="Rwanda's supply chain is fragmented." eyebrow="The problem">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Invisible inventory","Producers, warehouses and retailers can't see each other's stock in real time."],
            ["Manual logistics","Transport is booked over phone; deliveries lose 20-30% of value to delays."],
            ["Broken financing","Banks and buyers can't verify inventory, contracts or transactions on paper."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-border bg-background p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-danger/10 text-danger">!</div>
              <h3 className="mt-4 font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section eyebrow="How RSCN works" heading="From harvest to shelf, on one network.">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [Sprout, "Produce", "Farmers & cooperatives list produce with quality and quantity."],
            [Warehouse, "Store", "Warehouses reserve space and track stock, temperature, expiry."],
            [Truck, "Move", "Transporters accept jobs, optimize routes, prove delivery."],
            [ShoppingCart, "Sell", "Buyers, retailers and exporters procure, pay and reconcile."],
          ].map(([Icon, t, d], i: number) => (
            <div key={t as string} className="relative rounded-xl border border-border bg-background p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="absolute right-4 top-4 text-xs font-semibold text-muted-foreground">0{i + 1}</div>
              <h3 className="mt-4 font-semibold">{t as string}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d as string}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* MODULES */}
      <Section eyebrow="Platform modules" heading="Everything a national supply chain needs.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            [Users, "Identity & Organizations", "Verified identities, roles, departments, audit logs."],
            [Package, "Products & Inventory", "Batches, barcodes, QR, quality certificates, expiry tracking."],
            [ShoppingCart, "Smart Marketplace", "RFQs, negotiation, contracts, purchase & sales orders."],
            [Warehouse, "Warehousing", "Zones, racks, reservations, temperature monitoring."],
            [Truck, "Transportation", "Fleet, GPS, route optimization, proof of delivery."],
            [Boxes, "Procurement", "Supplier directory, comparisons, POs, performance."],
            [CreditCard, "Payments & Wallet", "Invoices, subscriptions, refunds, receipts."],
            [BarChart3, "Analytics & Forecast", "Sales, demand, regional and executive dashboards."],
            [Landmark, "Government View", "National production, food supply, transport heatmap."],
          ].map(([Icon, t, d]) => (
            <div key={t as string} className="rounded-xl border border-border bg-background p-6 hover:border-primary/40 hover:shadow-card">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary/10 text-secondary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{t as string}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d as string}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* BENEFITS */}
      <Section eyebrow="Why RSCN" heading="Built for every stakeholder in the chain.">
        <div className="grid gap-4 md:grid-cols-3">
          {([
            { Icon: Sprout, t: "For producers", items: ["Reach buyers nationally", "Get paid on delivery", "Track quality & batches"] },
            { Icon: Factory, t: "For businesses", items: ["Real-time inventory", "Automated procurement", "One-click transport"] },
            { Icon: Landmark, t: "For government", items: ["National production visibility", "Food security dashboard", "Policy-grade analytics"] },
          ]).map(({ Icon, t, items }) => (
            <div key={t} className="rounded-xl border border-border bg-background p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{t}</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {items.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section eyebrow="Testimonials" heading="Trusted by cooperatives, exporters and institutions.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["\u201CWe moved from paper receipts to real-time inventory in a week.\u201D", "Aline U.", "Manager, Musanze Cooperative"],
            ["\u201COur transport costs dropped 22% after route optimization.\u201D", "Eric N.", "Ops Director, Kigali Logistics"],
            ["\u201CFor the first time we have national food supply data by district.\u201D", "Dr. P. Habimana", "MINAGRI"],
          ].map(([q, n, r]) => (
            <div key={n} className="rounded-xl border border-border bg-background p-6">
              <div className="flex gap-0.5 text-warning">{Array.from({length: 5}).map((_,i)=><Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-3 text-sm text-foreground">{q}</p>
              <div className="mt-4 text-sm font-semibold">{n}</div>
              <div className="text-xs text-muted-foreground">{r}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* PARTNERS */}
      <section className="border-y border-border bg-surface">
        <div className="container-rscn py-10">
          <div className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Partners & integrations</div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-6">
            {["MINAGRI","RRA","BNR","MINICOM","RSSB","RIB","RAB"].map((p) => (
              <div key={p} className="grid h-14 place-items-center rounded-lg border border-border bg-background text-sm font-semibold text-muted-foreground">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <Section eyebrow="Pricing" heading="Simple plans for every stakeholder.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: "Starter", price: "Free", desc: "For farmers & small retailers", features: ["Up to 100 products","Marketplace access","Basic reporting"] },
            { name: "Business", price: "RWF 45,000/mo", desc: "For SMEs & cooperatives", features: ["Unlimited products","Warehouse & transport","Advanced analytics","Priority support"], featured: true },
            { name: "Enterprise", price: "Custom", desc: "For institutions & government", features: ["National dashboards","SLA & dedicated support","Custom integrations","On-premise options"] },
          ].map((p) => (
            <div key={p.name} className={`rounded-xl border p-6 ${p.featured ? "border-primary bg-background shadow-elevated" : "border-border bg-background"}`}>
              {p.featured && <span className="inline-block rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">Most popular</span>}
              <h3 className="mt-2 text-lg font-semibold">{p.name}</h3>
              <div className="mt-2 text-3xl font-bold">{p.price}</div>
              <div className="text-sm text-muted-foreground">{p.desc}</div>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />{f}</li>
                ))}
              </ul>
              <Link href="/auth/register" className={`mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold ${p.featured ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "border border-border hover:bg-surface"}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow="FAQ" heading="Common questions.">
        <div className="mx-auto max-w-3xl divide-y divide-border rounded-xl border border-border bg-background">
          {[
            ["Who can use RSCN?", "Any registered business in Rwanda ” farmers, cooperatives, manufacturers, warehouses, transporters, retailers, wholesalers, banks and government institutions."],
            ["Is my data secure?", "Yes. RSCN is aligned with ISO 27001 and Rwanda's data protection law. All data is encrypted in transit and at rest."],
            ["How do I get onboarded?", "Register, select your role, verify your email OTP, and complete profile setup if your role requires it."],
            ["Do you integrate with banks & tax?", "Yes ” direct integrations with BNR, RRA and major commercial banks for payments, invoicing and reconciliation."],
          ].map(([q, a]) => (
            <details key={q} className="group p-5">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold">
                {q}
                <span className="text-muted-foreground group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="container-rscn flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="max-w-2xl text-3xl font-bold md:text-4xl">Join Rwanda&apos;s national supply chain network.</h2>
          <p className="max-w-xl text-primary-foreground/85">Register your business in minutes. No credit card required to start.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/auth/register" className="inline-flex h-11 items-center rounded-lg bg-primary-foreground px-5 text-sm font-semibold text-primary hover:bg-primary-foreground/90">Register</Link>
            <Link href="/book-demo" className="inline-flex h-11 items-center rounded-lg border border-primary-foreground/40 px-5 text-sm font-semibold hover:bg-primary-hover">Book Demo</Link>
            <Link href="/contact" className="inline-flex h-11 items-center rounded-lg px-5 text-sm font-semibold hover:bg-primary-hover">Contact Sales</Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

function Section({ eyebrow, heading, children }: { eyebrow?: string; heading: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border bg-background">
      <div className="container-rscn py-16 md:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          {eyebrow && <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</div>}
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{heading}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}
