"use client";
import { useState } from "react";
import { Bell, Heart, ShoppingCart, Trash2, X } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { wishlistItems, type WishlistItem } from "./data";

export function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(wishlistItems);
  const [orderTarget, setOrderTarget] = useState<WishlistItem | null>(null);
  const [orderQty, setOrderQty] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [alertTarget, setAlertTarget] = useState<WishlistItem | null>(null);
  const [alertPrice, setAlertPrice] = useState("");
  const [alertSet, setAlertSet] = useState(false);

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const placeOrder = () => {
    if (!orderQty.trim()) return;
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderTarget(null);
      setOrderSuccess(false);
      setOrderQty("");
    }, 1500);
  };

  const saveAlert = () => {
    if (!alertPrice.trim()) return;
    setAlertSet(true);
    setTimeout(() => {
      setAlertTarget(null);
      setAlertSet(false);
      setAlertPrice("");
    }, 1500);
  };

  const inStockItems = items.filter((i) => i.inStock);
  const outOfStockItems = items.filter((i) => !i.inStock);

  return (
    <>
      <PageHeader
        title="Wishlist"
        description="Save products you want to buy later and get notified when prices drop."
        crumbs={[{ label: "Buyer", href: "/buyer/dashboard" }, { label: "Wishlist" }]}
        actions={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            {items.length} saved item{items.length !== 1 ? "s" : ""}
          </div>
        }
      />
      <PageBody>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background p-16 text-center">
            <Heart className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 font-medium text-foreground">Your wishlist is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Browse the marketplace and save products you want to buy later.</p>
            <a href="/buyer/marketplace">
              <Button className="mt-4">Browse Marketplace</Button>
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Saved Products", value: items.length },
                { label: "In Stock", value: inStockItems.length },
                { label: "Price Alerts Set", value: items.filter((i) => i.priceAlert !== null).length },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-background p-3 text-center shadow-sm">
                  <div className="text-2xl font-semibold text-foreground">{s.value}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            {/* In-stock items */}
            {inStockItems.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-foreground">In Stock</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {inStockItems.map((item) => (
                    <WishlistCard
                      key={item.id}
                      item={item}
                      onRemove={() => remove(item.id)}
                      onOrder={() => setOrderTarget(item)}
                      onAlert={() => { setAlertTarget(item); setAlertPrice(item.priceAlert ? String(item.priceAlert) : ""); }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Out-of-stock items */}
            {outOfStockItems.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Out of Stock · Notify me when available</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {outOfStockItems.map((item) => (
                    <WishlistCard
                      key={item.id}
                      item={item}
                      onRemove={() => remove(item.id)}
                      onOrder={() => setOrderTarget(item)}
                      onAlert={() => { setAlertTarget(item); setAlertPrice(item.priceAlert ? String(item.priceAlert) : ""); }}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </PageBody>

      {/* Order modal */}
      {orderTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setOrderTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Place Order</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{orderTarget.name}</p>
              </div>
              <button onClick={() => setOrderTarget(null)} className="rounded-lg border border-border p-1.5 hover:bg-surface">
                <X className="h-4 w-4" />
              </button>
            </div>
            {orderSuccess ? (
              <div className="rounded-xl bg-emerald-500/10 p-4 text-center text-sm font-medium text-emerald-700">
                ✓ Order placed! Check My Orders for status.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-surface p-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span className="font-medium">{orderTarget.price}</span></div>
                  <div className="flex justify-between mt-1"><span className="text-muted-foreground">Stock</span><span className="font-medium">{orderTarget.stock}</span></div>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Quantity ({orderTarget.unit}) *</span>
                  <input
                    value={orderQty}
                    onChange={(e) => setOrderQty(e.target.value)}
                    placeholder={`e.g. 50 ${orderTarget.unit}`}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                {orderQty && !isNaN(Number(orderQty)) && (
                  <div className="rounded-xl border border-border bg-surface p-3 text-sm font-medium flex justify-between">
                    <span>Estimated total</span>
                    <span className="text-primary">RWF {(Number(orderQty) * orderTarget.pricePerUnit).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <Button variant="secondary" className="flex-1" onClick={() => setOrderTarget(null)}>Cancel</Button>
                  <Button className="flex-1" onClick={placeOrder} disabled={!orderQty.trim()}>Confirm</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price alert modal */}
      {alertTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setAlertTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Set Price Alert</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{alertTarget.name} · Current: {alertTarget.price}</p>
              </div>
              <button onClick={() => setAlertTarget(null)} className="rounded-lg border border-border p-1.5 hover:bg-surface">
                <X className="h-4 w-4" />
              </button>
            </div>
            {alertSet ? (
              <div className="rounded-xl bg-emerald-500/10 p-4 text-center text-sm font-medium text-emerald-700">
                ✓ Alert set! We'll notify you when price drops.
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Alert me when price drops below (RWF per {alertTarget.unit})</span>
                  <input
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    placeholder={`e.g. ${alertTarget.pricePerUnit - 200}`}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <div className="flex gap-2 pt-1">
                  <Button variant="secondary" className="flex-1" onClick={() => setAlertTarget(null)}>Cancel</Button>
                  <Button className="flex-1" onClick={saveAlert} disabled={!alertPrice.trim()}>Save Alert</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function WishlistCard({
  item, onRemove, onOrder, onAlert,
}: {
  item: WishlistItem;
  onRemove: () => void;
  onOrder: () => void;
  onAlert: () => void;
}) {
  return (
    <Card className={cn("border-border/80 bg-background shadow-sm transition-all duration-200 hover:-translate-y-0.5", !item.inStock && "opacity-75")}>
      <div className="relative h-32 overflow-hidden rounded-t-xl border-b border-border">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {!item.inStock && (
          <div className="absolute inset-0 flex items-center justify-center rounded-t-xl bg-background/70">
            <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-700 shadow-sm">Out of Stock</span>
          </div>
        )}
        <button
          onClick={onRemove}
          className="absolute right-2 top-2 rounded-full border border-border bg-background/90 p-1.5 shadow-sm hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <CardContent className="p-4 space-y-2">
        <div>
          <p className="font-semibold text-foreground leading-tight">{item.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{item.category} · {item.supplier}</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-primary">{item.price}</span>
          <span className="text-xs text-muted-foreground">⭐ {item.rating}</span>
        </div>
        {item.priceAlert && (
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2 py-1 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            <Bell className="h-3 w-3 shrink-0" />
            Alert set: &lt; RWF {item.priceAlert.toLocaleString()}/{item.unit}
          </div>
        )}
        <p className="text-xs text-muted-foreground">{item.inStock ? item.stock : item.stock}</p>
        <div className="flex gap-1.5 pt-1">
          <button
            onClick={onAlert}
            className="rounded-lg border border-border px-2 py-1.5 text-xs font-medium hover:bg-surface"
            title="Set price alert"
          >
            <Bell className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onOrder}
            disabled={!item.inStock}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition",
              item.inStock
                ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                : "border border-border text-muted-foreground cursor-not-allowed opacity-50"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {item.inStock ? "Order Now" : "Notify Me"}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground">Added {item.addedAt}</p>
      </CardContent>
    </Card>
  );
}
