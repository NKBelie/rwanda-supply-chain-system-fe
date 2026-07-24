"use client";
import { TrendingUp, TrendingDown, Minus, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface MarketPrice {
  product: string;
  price: number;
  change: number;
  trend: "up" | "down" | "stable";
  sparkline: number[];
}

const mockPrices: MarketPrice[] = [
  { product: "Maize", price: 800, change: 6.7, trend: "up", sparkline: [720, 730, 735, 750, 760, 780, 790, 800] },
  { product: "Tomatoes", price: 1200, change: -11.1, trend: "down", sparkline: [1400, 1380, 1360, 1350, 1320, 1280, 1250, 1200] },
  { product: "Milk", price: 500, change: 0, trend: "stable", sparkline: [500, 500, 500, 500, 500, 500, 500, 500] },
  { product: "Coffee", price: 3500, change: 6.1, trend: "up", sparkline: [3200, 3250, 3280, 3300, 3350, 3400, 3450, 3500] },
  { product: "Bananas", price: 600, change: -7.7, trend: "down", sparkline: [700, 680, 670, 650, 640, 630, 615, 600] },
  { product: "Rice", price: 1500, change: 3.5, trend: "up", sparkline: [1400, 1410, 1425, 1450, 1460, 1480, 1490, 1500] },
];

export default function MarketPriceWidget() {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-border bg-gradient-to-br from-background via-surface/30 to-background p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 p-2">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Live Market Prices</h2>
            <p className="text-sm text-muted-foreground">Real-time price movements</p>
          </div>
        </div>
        <button 
          onClick={() => router.push("/farmer/market-prices")}
          className="group flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        >
          View all
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mockPrices.map((item) => {
          const maxPrice = Math.max(...item.sparkline);
          const minPrice = Math.min(...item.sparkline);
          const range = maxPrice - minPrice || 1;

          return (
            <div 
              key={item.product}
              className="group relative cursor-pointer overflow-hidden rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-md"
              onClick={() => router.push("/farmer/market-prices")}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${
                item.trend === "up" ? "bg-gradient-to-br from-emerald-500/5 to-transparent" :
                item.trend === "down" ? "bg-gradient-to-br from-red-500/5 to-transparent" :
                "bg-gradient-to-br from-slate-500/5 to-transparent"
              }`} />

              <div className="relative">
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.product}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">per kg</p>
                  </div>
                  {item.trend === "up" && (
                    <div className="rounded-full bg-emerald-500/10 p-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                  )}
                  {item.trend === "down" && (
                    <div className="rounded-full bg-red-500/10 p-1.5">
                      <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                    </div>
                  )}
                  {item.trend === "stable" && (
                    <div className="rounded-full bg-slate-500/10 p-1.5">
                      <Minus className="h-3.5 w-3.5 text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mb-3">
                  <p className="text-2xl font-bold text-foreground">
                    {item.price}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">RWF</span>
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className={`text-xs font-semibold ${
                      item.trend === "up" ? "text-emerald-600" : 
                      item.trend === "down" ? "text-red-600" : "text-slate-600"
                    }`}>
                      {item.change > 0 && "+"}{item.change}%
                    </span>
                    <span className="text-xs text-muted-foreground">today</span>
                  </div>
                </div>

                {/* Sparkline Chart */}
                <div className="relative h-12">
                  <div className="absolute inset-0 flex items-end justify-between gap-0.5">
                    {item.sparkline.map((price, idx) => {
                      const height = ((price - minPrice) / range) * 100;
                      return (
                        <div 
                          key={idx} 
                          className="flex-1 rounded-t transition-all group-hover:opacity-80"
                          style={{ 
                            height: `${Math.max(height, 10)}%`,
                            backgroundColor: item.trend === "up" ? "rgb(34 197 94 / 0.6)" : 
                                           item.trend === "down" ? "rgb(239 68 68 / 0.6)" : 
                                           "rgb(100 116 139 / 0.6)"
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 rounded-md bg-surface/50 px-2 py-1 text-center">
                  <p className="text-[10px] font-medium text-muted-foreground">7-day trend</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Summary Banner */}
      <div className="mt-4 rounded-lg border border-dashed border-border bg-surface/50 p-3">
        <div className="flex flex-wrap items-center justify-around gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Trending Up</p>
            <p className="mt-0.5 text-lg font-bold text-emerald-600">
              {mockPrices.filter(p => p.trend === "up").length}
            </p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Trending Down</p>
            <p className="mt-0.5 text-lg font-bold text-red-600">
              {mockPrices.filter(p => p.trend === "down").length}
            </p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Stable</p>
            <p className="mt-0.5 text-lg font-bold text-slate-600">
              {mockPrices.filter(p => p.trend === "stable").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
