"use client";
import type { ComponentType, ReactElement, SVGProps } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
} from "recharts";
import { StatCard, ActivityCard, SummaryCard } from "@/components/cards";
import { Card, CardContent } from "@/components/ui";

// ─── DashboardStats ───────────────────────────────────────────────────────────
type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type KpiItem = { label: string; value: string; delta?: string; up?: boolean; icon: IconComponent };

export function DashboardStats({ kpis, accent }: { kpis: KpiItem[]; accent?: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => <StatCard key={k.label} {...k} accent={accent} />)}
    </div>
  );
}

// ─── DashboardChart ───────────────────────────────────────────────────────────
export type ChartSpec = {
  kind: "area" | "bar" | "line" | "pie";
  title: string;
  data: Record<string, unknown>[];
  xKey?: string; yKey?: string;
};

export function DashboardChart({ spec, color }: { spec: ChartSpec; color: string }) {
  return (
    <Card className="lg:col-span-2">
      <CardContent>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold">{spec.title}</div>
          <span className="text-xs text-muted-foreground">Last 30 days</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer>{renderChart(spec, color)}</ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function renderChart(c: ChartSpec, color: string): ReactElement {
  const xKey = c.xKey ?? "x";
  const yKey = c.yKey ?? "y";
  const gridProps = { strokeDasharray: "3 3", stroke: "hsl(var(--border))" };
  const axisProps = { stroke: "hsl(var(--muted-foreground))", fontSize: 11 };

  switch (c.kind) {
    case "area": return (
      <AreaChart data={c.data}>
        <defs>
          <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip />
        <Area type="monotone" dataKey={yKey} stroke={color} fill="url(#dash-area)" strokeWidth={2} />
      </AreaChart>
    );
    case "bar": return (
      <BarChart data={c.data}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip />
        <Bar dataKey={yKey} fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    );
    case "line": return (
      <LineChart data={c.data}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip />
        <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    );
    case "pie": return (
      <PieChart>
        <Pie data={c.data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
          {c.data.map((_, i) => (
            <Cell key={i} fill={[color, "#2563EB", "#F59E0B", "#EF4444", "#8B5CF6"][i % 5]} />
          ))}
        </Pie>
        <Legend /><Tooltip />
      </PieChart>
    );
  }
}

// ─── DashboardWidgets ─────────────────────────────────────────────────────────
export function DashboardWidgets({ chart, side, color }: {
  chart: ChartSpec;
  side: { title: string; items: { label: string; value: string; tone?: "success" | "warning" | "danger" }[] };
  color: string;
}) {
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-3">
      <DashboardChart spec={chart} color={color} />
      <SummaryCard title={side.title} items={side.items} />
    </div>
  );
}

// ─── RecentActivity ───────────────────────────────────────────────────────────
export function RecentActivity({ items }: { items: { title: string; when: string; who?: string }[] }) {
  return (
    <div className="mt-4">
      <ActivityCard items={items} />
    </div>
  );
}
