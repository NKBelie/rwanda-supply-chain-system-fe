"use client";
import { useState } from "react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Activity, 
  Calendar, 
  DollarSign, 
  Star, 
  AlertTriangle, 
  BarChart3, 
  X,
  Coffee,
  Milk,
  Wheat,
  Carrot,
  Apple,
  Sprout
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PriceData {
  id: string;
  product: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  unit: string;
  market: string;
  lastUpdated: string;
  trend: "up" | "down" | "stable";
  historicalPrices: { date: string; price: number }[];
}

// Helper function to get product icon
function getProductIcon(productName: string) {
  const name = productName.toLowerCase();
  if (name.includes("coffee")) return Coffee;
  if (name.includes("milk")) return Milk;
  if (name.includes("maize") || name.includes("rice") || name.includes("bean")) return Wheat;
  if (name.includes("tomato") || name.includes("potato")) return Carrot;
  if (name.includes("banana")) return Apple;
  return Sprout;
}

const mockPriceData: PriceData[] = [
  {
    id: "P001",
    product: "Maize",
    category: "Cereals",
    currentPrice: 800,
    previousPrice: 750,
    change: 50,
    changePercent: 6.67,
    unit: "kg",
    market: "Kimironko Market",
    lastUpdated: "2025-01-24",
    trend: "up",
    historicalPrices: [
      { date: "2025-01-17", price: 720 },
      { date: "2025-01-18", price: 730 },
      { date: "2025-01-19", price: 735 },
      { date: "2025-01-20", price: 750 },
      { date: "2025-01-21", price: 760 },
      { date: "2025-01-22", price: 780 },
      { date: "2025-01-23", price: 790 },
      { date: "2025-01-24", price: 800 },
    ]
  },
  {
    id: "P002",
    product: "Tomatoes",
    category: "Vegetables",
    currentPrice: 1200,
    previousPrice: 1350,
    change: -150,
    changePercent: -11.11,
    unit: "kg",
    market: "Nyabugogo Market",
    lastUpdated: "2025-01-24",
    trend: "down",
    historicalPrices: [
      { date: "2025-01-17", price: 1400 },
      { date: "2025-01-18", price: 1380 },
      { date: "2025-01-19", price: 1360 },
      { date: "2025-01-20", price: 1350 },
      { date: "2025-01-21", price: 1320 },
      { date: "2025-01-22", price: 1280 },
      { date: "2025-01-23", price: 1250 },
      { date: "2025-01-24", price: 1200 },
    ]
  },
  {
    id: "P003",
    product: "Milk",
    category: "Dairy",
    currentPrice: 500,
    previousPrice: 500,
    change: 0,
    changePercent: 0,
    unit: "liter",
    market: "Multiple Markets",
    lastUpdated: "2025-01-24",
    trend: "stable",
    historicalPrices: [
      { date: "2025-01-17", price: 500 },
      { date: "2025-01-18", price: 500 },
      { date: "2025-01-19", price: 500 },
      { date: "2025-01-20", price: 500 },
      { date: "2025-01-21", price: 500 },
      { date: "2025-01-22", price: 500 },
      { date: "2025-01-23", price: 500 },
      { date: "2025-01-24", price: 500 },
    ]
  },
  {
    id: "P004",
    product: "Coffee Beans",
    category: "Cash Crops",
    currentPrice: 3500,
    previousPrice: 3300,
    change: 200,
    changePercent: 6.06,
    unit: "kg",
    market: "Export Market",
    lastUpdated: "2025-01-24",
    trend: "up",
    historicalPrices: [
      { date: "2025-01-17", price: 3200 },
      { date: "2025-01-18", price: 3250 },
      { date: "2025-01-19", price: 3280 },
      { date: "2025-01-20", price: 3300 },
      { date: "2025-01-21", price: 3350 },
      { date: "2025-01-22", price: 3400 },
      { date: "2025-01-23", price: 3450 },
      { date: "2025-01-24", price: 3500 },
    ]
  },
  {
    id: "P005",
    product: "Bananas",
    category: "Fruits",
    currentPrice: 600,
    previousPrice: 650,
    change: -50,
    changePercent: -7.69,
    unit: "kg",
    market: "Kimironko Market",
    lastUpdated: "2025-01-24",
    trend: "down",
    historicalPrices: [
      { date: "2025-01-17", price: 700 },
      { date: "2025-01-18", price: 680 },
      { date: "2025-01-19", price: 670 },
      { date: "2025-01-20", price: 650 },
      { date: "2025-01-21", price: 640 },
      { date: "2025-01-22", price: 630 },
      { date: "2025-01-23", price: 615 },
      { date: "2025-01-24", price: 600 },
    ]
  },
  {
    id: "P006",
    product: "Rice",
    category: "Cereals",
    currentPrice: 1500,
    previousPrice: 1450,
    change: 50,
    changePercent: 3.45,
    unit: "kg",
    market: "Nyabugogo Market",
    lastUpdated: "2025-01-24",
    trend: "up",
    historicalPrices: [
      { date: "2025-01-17", price: 1400 },
      { date: "2025-01-18", price: 1410 },
      { date: "2025-01-19", price: 1425 },
      { date: "2025-01-20", price: 1450 },
      { date: "2025-01-21", price: 1460 },
      { date: "2025-01-22", price: 1480 },
      { date: "2025-01-23", price: 1490 },
      { date: "2025-01-24", price: 1500 },
    ]
  },
  {
    id: "P007",
    product: "Potatoes",
    category: "Vegetables",
    currentPrice: 450,
    previousPrice: 450,
    change: 0,
    changePercent: 0,
    unit: "kg",
    market: "Kimironko Market",
    lastUpdated: "2025-01-24",
    trend: "stable",
    historicalPrices: [
      { date: "2025-01-17", price: 450 },
      { date: "2025-01-18", price: 450 },
      { date: "2025-01-19", price: 450 },
      { date: "2025-01-20", price: 450 },
      { date: "2025-01-21", price: 450 },
      { date: "2025-01-22", price: 450 },
      { date: "2025-01-23", price: 450 },
      { date: "2025-01-24", price: 450 },
    ]
  },
  {
    id: "P008",
    product: "Beans",
    category: "Legumes",
    currentPrice: 1100,
    previousPrice: 1050,
    change: 50,
    changePercent: 4.76,
    unit: "kg",
    market: "Multiple Markets",
    lastUpdated: "2025-01-24",
    trend: "up",
    historicalPrices: [
      { date: "2025-01-17", price: 1000 },
      { date: "2025-01-18", price: 1020 },
      { date: "2025-01-19", price: 1030 },
      { date: "2025-01-20", price: 1050 },
      { date: "2025-01-21", price: 1060 },
      { date: "2025-01-22", price: 1080 },
      { date: "2025-01-23", price: 1090 },
      { date: "2025-01-24", price: 1100 },
    ]
  }
];

export default function FarmerMarketPricesPage() {
  const [selectedProduct, setSelectedProduct] = useState<PriceData | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [compareMode, setCompareMode] = useState(false);
  const [compareProducts, setCompareProducts] = useState<string[]>([]);

  const categories = ["All", ...Array.from(new Set(mockPriceData.map(p => p.category)))];
  
  const filteredPrices = categoryFilter === "All" 
    ? mockPriceData 
    : mockPriceData.filter(p => p.category === categoryFilter);

  const marketSummary = {
    totalProducts: mockPriceData.length,
    pricesUp: mockPriceData.filter(p => p.trend === "up").length,
    pricesDown: mockPriceData.filter(p => p.trend === "down").length,
    pricesStable: mockPriceData.filter(p => p.trend === "stable").length,
  };

  // Generate dynamic insights
  const insights = [
    ...mockPriceData
      .filter(p => p.changePercent > 5)
      .map(p => ({
        type: "success" as const,
        icon: Star,
        title: `${p.product} showing strong upward trend (+${p.changePercent.toFixed(2)}%)`,
        description: `${p.market} reports increased demand. Good opportunity to list ${p.product.toLowerCase()} products.`,
      })),
    ...mockPriceData
      .filter(p => p.changePercent < -5)
      .map(p => ({
        type: "warning" as const,
        icon: AlertTriangle,
        title: `${p.product} prices dropping significantly (${p.changePercent.toFixed(2)}%)`,
        description: `${p.market} experiencing oversupply. Consider storage or processing options.`,
      })),
    ...mockPriceData
      .filter(p => p.changePercent === 0)
      .slice(0, 1)
      .map(p => ({
        type: "info" as const,
        icon: BarChart3,
        title: `${p.product} prices stable across all markets`,
        description: `Consistent demand maintaining steady pricing. Reliable option for planning.`,
      })),
  ];

  const toggleCompare = (productId: string) => {
    setCompareProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : prev.length < 3 
          ? [...prev, productId]
          : prev
    );
  };

  return (
    <>
      <PageHeader
        title="Market Prices"
        description="Track real-time market prices and trends for agricultural products."
        crumbs={[{ label: "Farmer", href: "/farmer/dashboard" }, { label: "Market Prices" }]}
        actions={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Last updated: {new Date().toLocaleDateString()}
          </div>
        }
      />
      <PageBody>
        {/* Market Summary Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="border-border/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Products</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{marketSummary.totalProducts}</p>
                </div>
                <Activity className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Prices Up</p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-600">{marketSummary.pricesUp}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500/60" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Prices Down</p>
                  <p className="mt-1 text-2xl font-semibold text-red-600">{marketSummary.pricesDown}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500/60" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Stable</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{marketSummary.pricesStable}</p>
                </div>
                <Minus className="h-8 w-8 text-slate-500/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition",
                categoryFilter === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-surface"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Price Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPrices.map((price) => (
            <Card
              key={price.id}
              className="cursor-pointer border-border/80 bg-background shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-elevated"
              onClick={() => setSelectedProduct(price)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                      {(() => {
                        const Icon = getProductIcon(price.product);
                        return <Icon className="h-5 w-5 text-primary" />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{price.product}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{price.category}</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {price.trend === "up" && <TrendingUp className="h-5 w-5 text-emerald-600" />}
                    {price.trend === "down" && <TrendingDown className="h-5 w-5 text-red-600" />}
                    {price.trend === "stable" && <Minus className="h-5 w-5 text-slate-600" />}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-2xl font-bold text-foreground">
                    RWF {price.currentPrice}
                    <span className="text-sm font-normal text-muted-foreground">/{price.unit}</span>
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs font-semibold",
                      price.changePercent > 0 && "text-emerald-600",
                      price.changePercent < 0 && "text-red-600",
                      price.changePercent === 0 && "text-slate-600"
                    )}
                  >
                    {price.changePercent > 0 && "+"}
                    {price.change} RWF ({price.changePercent > 0 && "+"}
                    {price.changePercent.toFixed(2)}%)
                  </span>
                </div>

                <div className="mt-3 rounded-lg border border-border bg-surface p-2">
                  <p className="text-xs text-muted-foreground">{price.market}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Market Insights */}
        <Card className="mt-6 border-border/80">
          <CardHeader>
            <CardTitle className="text-lg">Market Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-surface p-6 text-center text-sm text-muted-foreground">
                <BarChart3 className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No significant market movements detected</p>
              </div>
            ) : (
              insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "rounded-lg border p-3",
                    insight.type === "success" && "border-emerald-500/20 bg-emerald-500/5",
                    insight.type === "warning" && "border-amber-500/20 bg-amber-500/5",
                    insight.type === "info" && "border-sky-500/20 bg-sky-500/5"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <insight.icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        insight.type === "success" && "text-emerald-600",
                        insight.type === "warning" && "text-amber-600",
                        insight.type === "info" && "text-sky-600"
                      )}
                    />
                    <div>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          insight.type === "success" && "text-emerald-700",
                          insight.type === "warning" && "text-amber-700",
                          insight.type === "info" && "text-sky-700"
                        )}
                      >
                        {insight.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </PageBody>

      {/* Price Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  {(() => {
                    const Icon = getProductIcon(selectedProduct.product);
                    return <Icon className="h-6 w-6 text-primary" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{selectedProduct.product}</h2>
                  <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xs text-muted-foreground">Current Price</p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  RWF {selectedProduct.currentPrice}
                </p>
                <p className="text-xs text-muted-foreground">per {selectedProduct.unit}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xs text-muted-foreground">Previous Price</p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  RWF {selectedProduct.previousPrice}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xs text-muted-foreground">Change</p>
                <p
                  className={cn(
                    "mt-1 text-xl font-bold",
                    selectedProduct.changePercent > 0 && "text-emerald-600",
                    selectedProduct.changePercent < 0 && "text-red-600",
                    selectedProduct.changePercent === 0 && "text-slate-600"
                  )}
                >
                  {selectedProduct.changePercent > 0 && "+"}
                  {selectedProduct.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">7-Day Price Trend</h3>
              <div className="mt-3 rounded-xl border border-border bg-surface p-4">
                <div className="flex items-end justify-between gap-2" style={{ height: "120px" }}>
                  {selectedProduct.historicalPrices.map((item, idx) => {
                    const maxPrice = Math.max(...selectedProduct.historicalPrices.map(p => p.price));
                    const minPrice = Math.min(...selectedProduct.historicalPrices.map(p => p.price));
                    const range = maxPrice - minPrice || 1;
                    const height = ((item.price - minPrice) / range) * 100 + 10;
                    
                    return (
                      <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                        <div className="relative w-full">
                          <div
                            className={cn(
                              "w-full rounded-t transition-all",
                              selectedProduct.trend === "up" && "bg-emerald-500",
                              selectedProduct.trend === "down" && "bg-red-500",
                              selectedProduct.trend === "stable" && "bg-slate-500"
                            )}
                            style={{ height: `${height}px` }}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-surface p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market</span>
                <span className="font-medium text-foreground">{selectedProduct.market}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium text-foreground">
                  {new Date(selectedProduct.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
