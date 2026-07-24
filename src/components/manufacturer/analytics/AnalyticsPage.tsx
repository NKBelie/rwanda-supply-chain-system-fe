"use client";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const monthlyOutput = [
  { month: "Feb", output: 18400, target: 20000 }, { month: "Mar", output: 21200, target: 20000 },
  { month: "Apr", output: 19800, target: 22000 }, { month: "May", output: 23500, target: 22000 },
  { month: "Jun", output: 22100, target: 22000 }, { month: "Jul", output: 19600, target: 22000 },
];

const yieldByLine = [
  { line: "Line A", yield: 97.2 }, { line: "Line B", yield: 94.8 }, { line: "Line C", yield: 96.5 },
];

const productMix = [
  { name: "Roasted Coffee", value: 38 }, { name: "Maize Flour", value: 29 },
  { name: "Tomato Paste", value: 18 }, { name: "Rice Bran Oil", value: 15 },
];

const PIE_COLORS = ["var(--color-primary)", "var(--color-secondary)", "var(--color-accent)", "#64748b"];

const supplierOnTime = [
  { supplier: "Musanze Coop", rate: 94 }, { supplier: "Kigali Grain", rate: 91 },
  { supplier: "AgriChem", rate: 88 }, { supplier: "Rwanda Chem", rate: 96 }, { supplier: "Nyagatare", rate: 82 },
];

const costTrend = [
  { month: "Feb", rawMat: 4200000, labor: 1800000, overhead: 900000 },
  { month: "Mar", rawMat: 4800000, labor: 1900000, overhead: 950000 },
  { month: "Apr", rawMat: 4500000, labor: 1850000, overhead: 920000 },
  { month: "May", rawMat: 5200000, labor: 2000000, overhead: 1000000 },
  { month: "Jun", rawMat: 4900000, labor: 1950000, overhead: 980000 },
  { month: "Jul", rawMat: 4600000, labor: 1880000, overhead: 940000 },
];

const fmt = (v: number) => v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v);
const tooltipStyle = { background: "var(--color-background)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 };

export function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Production performance, cost analysis and supplier metrics."
        crumbs={[{ label: "Manufacturer", href: "/manufacturer/dashboard" }, { label: "Analytics" }]}
        actions={<button className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-surface">Export Report</button>}
      />
      <PageBody>
        {/* Top KPIs */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Avg Yield Efficiency", value: "94.1%", trend: "+0.6% this month", up: true },
            { label: "Production vs Target", value: "89.1%", trend: "Below Jul target", up: false },
            { label: "Supplier On-Time Rate", value: "92%", trend: "+2% vs last month", up: true },
            { label: "Cost per kg (Jul)", value: "RWF 3,890", trend: "–3.2% vs Jun", up: true },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-background p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="mt-1.5 text-2xl font-semibold text-foreground">{k.value}</p>
              <p className={`mt-1 text-xs font-medium ${k.up ? "text-emerald-600" : "text-rose-600"}`}>{k.trend}</p>
            </div>
          ))}
        </div>

        {/* Production output vs target */}
        <Card className="mb-4 border-border/80 bg-background shadow-sm">
          <CardHeader><CardTitle className="text-base">Monthly Production Output vs Target (kg)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyOutput}>
                <defs>
                  <linearGradient id="gOutput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${Number(v).toLocaleString()} kg`]} />
                <Area type="monotone" dataKey="target" stroke="var(--color-border)" strokeDasharray="4 4" strokeWidth={2} fill="none" name="Target" />
                <Area type="monotone" dataKey="output" stroke="var(--color-primary)" strokeWidth={2} fill="url(#gOutput)" name="Actual Output" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          {/* Product mix */}
          <Card className="border-border/80 bg-background shadow-sm">
            <CardHeader><CardTitle className="text-base">Product Mix (% of output)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={productMix} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {productMix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Yield by line */}
          <Card className="border-border/80 bg-background shadow-sm">
            <CardHeader><CardTitle className="text-base">Yield Rate by Production Line (%)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={yieldByLine} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="line" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Yield"]} />
                  <Bar dataKey="yield" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          {/* Cost breakdown */}
          <Card className="border-border/80 bg-background shadow-sm">
            <CardHeader><CardTitle className="text-base">Cost Breakdown by Month (RWF)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={costTrend} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`RWF ${Number(v).toLocaleString()}`]} />
                  <Bar dataKey="rawMat" fill="var(--color-primary)" radius={[4,4,0,0]} name="Raw Material" stackId="a" />
                  <Bar dataKey="labor" fill="var(--color-secondary)" radius={[0,0,0,0]} name="Labor" stackId="a" />
                  <Bar dataKey="overhead" fill="var(--color-accent)" radius={[4,4,0,0]} name="Overhead" stackId="a" />
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Supplier on-time */}
          <Card className="border-border/80 bg-background shadow-sm">
            <CardHeader><CardTitle className="text-base">Supplier On-Time Delivery Rate (%)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={supplierOnTime} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" domain={[60, 100]} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="supplier" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "On-Time"]} />
                  <Bar dataKey="rate" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
