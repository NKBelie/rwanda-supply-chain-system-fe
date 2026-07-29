import { ReactNode, type ComponentType, type SVGProps } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/utils";
import { Card, CardContent } from "@/components/ui";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, delta, up, icon: Icon, accent = "#166534" }: {
  label: string; value: string; delta?: string; up?: boolean;
  icon: IconComponent; accent?: string;
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="grid h-8 w-8 place-items-center rounded-lg"
            style={{ backgroundColor: `${accent}22`, color: accent }}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 text-2xl font-semibold">{value}</div>
        {delta && (
          <div className={cn("mt-1 flex items-center gap-1 text-xs", up ? "text-success" : "text-danger")}>
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {delta}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────
export function MetricCard({ title, value, sub, tone = "success" }: {
  title: string; value: string; sub?: string; tone?: "success" | "warning" | "danger" | "info";
}) {
  const toneMap = { success: "text-success", warning: "text-warning", danger: "text-danger", info: "text-secondary" };
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="text-[11px] text-muted-foreground">{title}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
      {sub && <div className={cn("text-[11px]", toneMap[tone])}>{sub}</div>}
    </div>
  );
}

// ─── InfoCard ─────────────────────────────────────────────────────────────────
export function InfoCard({ title, desc, bg = "bg-background" }: {
  title: string; desc: string; bg?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border p-6", bg)}>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

// ─── FeatureCard ─────────────────────────────────────────────────────────────
export function FeatureCard({ icon: Icon, title, desc, iconBg = "bg-primary/10 text-primary" }: {
  icon: ComponentType<{ className?: string }>; title: string; desc: string; iconBg?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-6 hover:border-primary/40 hover:shadow-card">
      <div className={cn("grid h-10 w-10 place-items-center rounded-lg", iconBg)}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

// ─── ActivityCard ─────────────────────────────────────────────────────────────
export function ActivityCard({ items }: {
  items: { title: string; when: string; who?: string }[];
}) {
  return (
    <Card>
      <CardContent>
        <div className="mb-3 text-sm font-semibold">Recent activity</div>
        <ul className="divide-y divide-border">
          {items.map((a, i) => (
            <li key={i} className="flex items-center justify-between py-3 text-sm">
              <div>
                <div className="font-medium">{a.title}</div>
                {a.who && <div className="text-xs text-muted-foreground">{a.who}</div>}
              </div>
              <span className="text-xs text-muted-foreground">{a.when}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── QuickActionCard ──────────────────────────────────────────────────────────
export function QuickActionCard({ label, icon: Icon, onClick }: {
  label: string; icon: IconComponent; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 text-left text-xs hover:bg-surface">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span className="truncate">{label}</span>
    </button>
  );
}

// ─── SummaryCard ──────────────────────────────────────────────────────────────
export function SummaryCard({ title, items }: {
  title: string;
  items: { label: string; value: string; tone?: "success" | "warning" | "danger" }[];
}) {
  return (
    <Card>
      <CardContent>
        <div className="mb-3 text-sm font-semibold">{title}</div>
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.label} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
              <span className="text-foreground">{it.label}</span>
              <span className={cn("text-xs font-semibold",
                it.tone === "warning" ? "text-warning" : it.tone === "danger" ? "text-danger" : "text-success"
              )}>{it.value}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
