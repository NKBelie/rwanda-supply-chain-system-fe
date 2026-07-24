"use client";
import { useMemo, useState } from "react";
import { Filter, Heart, Package, Search, ShoppingCart, Star, X } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CATEGORIES, type Category, type MarketProduct, marketProducts, rfqSample } from "./data";

export function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [wishlist, setWishlist] = useState<string[]>(["MP-001", "MP-006"]);
  const [cart, setCart] = useState<string[]>([]);
  const [viewProduct, setViewProduct] = useState<MarketProduct | null>(null);
  const [rfqProduct, setRfqProduct] = useState<MarketProduct | null>(null);
  const [orderProduct, setOrderProduct] = useState<MarketProduct | null>(null);
  const [rfqQty, setRfqQty] = useState("");
  const [rfqMsg, setRfqMsg] = useState("");
  const [rfqSent, setRfqSent] = useState(false);
  const [orderQty, setOrderQty] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"browse" | "rfq">("browse");

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return marketProducts.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchSearch = !term || [p.name, p.category, p.supplier, p.location, ...p.tags].some((v) => v.toLowerCase().includes(term));
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const toggleWishlist = (id: string) =>
    setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);

  const addToCart = (id: string) =>
    setCart((c) => c.includes(id) ? c : [...c, id]);

  const sendRfq = () => {
    if (!rfqQty.trim()) return;
    setRfqSent(true);
    setTimeout(() => { setRfqProduct(null); setRfqSent(false); setRfqQty(""); setRfqMsg(""); }, 1500);
  };

  const placeOrder = () => {
    if (!orderQty.trim()) return;
    setOrderSuccess(true);
    if (orderProduct) addToCart(orderProduct.id);
    setTimeout(() => { setOrderProduct(null); setOrderSuccess(false); setOrderQty(""); }, 1500);
  };

  return (
    <>
      <PageHeader
        title="Marketplace"
        description="Browse verified agricultural products, request quotes and place orders."
        crumbs={[{ label: "Buyer", href: "/buyer/dashboard" }, { label: "Marketplace" }]}
        actions={
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium">
                <ShoppingCart className="h-4 w-4 text-primary" />
                {cart.length} in cart
              </div>
            )}
            <Button size="sm" onClick={() => setActiveTab("rfq")}>
              <Package className="mr-1.5 h-4 w-4" /> My RFQs
            </Button>
          </div>
        }
      />
      <PageBody>
        {/* Tab switch */}
        <div className="mb-5 flex gap-2">
          <button onClick={() => setActiveTab("browse")} className={cn("rounded-xl px-4 py-2 text-sm font-medium transition", activeTab === "browse" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface border border-border")}>
            Browse Products
          </button>
          <button onClick={() => setActiveTab("rfq")} className={cn("rounded-xl px-4 py-2 text-sm font-medium transition", activeTab === "rfq" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface border border-border")}>
            My RFQs ({rfqSample.length})
          </button>
        </div>

        {activeTab === "browse" ? (
          <>
            {/* Search + filter bar */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, suppliers, locations…"
                  className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition",
                      category === cat ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-surface"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Listed Products", value: marketProducts.length },
                { label: "Verified Suppliers", value: marketProducts.filter((p) => p.verified).length },
                { label: "Wishlisted", value: wishlist.length },
                { label: "In Cart", value: cart.length },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-background p-3 text-center shadow-sm">
                  <div className="text-2xl font-semibold text-foreground">{s.value}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Results count */}
            <p className="mb-4 text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> of {marketProducts.length} products
              {category !== "All" && <> in <span className="font-medium text-foreground">{category}</span></>}
            </p>

            {/* Product grid */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-background p-10 text-center text-sm text-muted-foreground">
                No products match your search. Try adjusting filters.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <Card key={product.id} className="border-border/80 bg-background shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-elevated">
                    <div className="relative h-32 overflow-hidden rounded-t-xl border-b border-border bg-surface">
                      {product.image.startsWith("http") ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-sky-50 text-5xl dark:from-emerald-950/40 dark:to-sky-950/40">
                          {product.image}
                        </div>
                      )}
                      {product.verified && (
                        <span className="absolute right-2 top-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 backdrop-blur-sm">✓ Verified</span>
                      )}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute left-2 top-2 rounded-full border border-border bg-background p-1.5 shadow-sm hover:bg-surface"
                      >
                        <Heart className={cn("h-3.5 w-3.5", wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                      </button>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <p className="font-semibold text-foreground leading-tight">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{product.category} · {product.location}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-primary">{product.price}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {product.supplier}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {product.rating} ({product.reviews})
                        </span>
                        <span className={cn(product.stockQty > 100 ? "text-emerald-600" : "text-amber-600")}>
                          {product.stock}
                        </span>
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => setViewProduct(product)}
                          className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs font-medium hover:bg-surface"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setRfqProduct(product)}
                          className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs font-medium hover:bg-surface"
                        >
                          RFQ
                        </button>
                        <button
                          onClick={() => setOrderProduct(product)}
                          className="flex-1 rounded-lg bg-primary px-2 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary-hover"
                        >
                          Order
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          /* RFQ Tab */
          <Card className="border-border/80 bg-background shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">My Quote Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {rfqSample.length === 0 ? (
                <p className="text-sm text-muted-foreground">No RFQs sent yet. Browse products and click "RFQ" to request a quote.</p>
              ) : (
                <div className="space-y-3">
                  {rfqSample.map((rfq) => (
                    <div key={rfq.id} className="rounded-xl border border-border bg-surface p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{rfq.productName}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{rfq.supplier} · Qty: {rfq.quantity}</p>
                          {rfq.message && <p className="text-xs text-muted-foreground mt-1 italic">"{rfq.message}"</p>}
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-semibold",
                            rfq.status === "Responded" ? "bg-emerald-500/10 text-emerald-700" :
                            rfq.status === "Pending" ? "bg-amber-500/10 text-amber-700" :
                            "bg-sky-500/10 text-sky-700"
                          )}>
                            {rfq.status}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">{rfq.createdAt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </PageBody>

      {/* Product detail modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setViewProduct(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {viewProduct.image.startsWith("http") ? (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border">
                    <img
                      src={viewProduct.image}
                      alt={viewProduct.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <span className="text-4xl shrink-0">{viewProduct.image}</span>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{viewProduct.name}</h2>
                  <p className="text-sm text-muted-foreground">{viewProduct.category} · {viewProduct.location}</p>
                </div>
              </div>
              <button onClick={() => setViewProduct(null)} className="rounded-lg border border-border p-1.5 hover:bg-surface">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{viewProduct.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="font-semibold text-foreground mt-0.5">{viewProduct.price}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-xs text-muted-foreground">Available Stock</p>
                <p className="font-semibold text-foreground mt-0.5">{viewProduct.stock}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-xs text-muted-foreground">Supplier</p>
                <p className="font-semibold text-foreground mt-0.5">{viewProduct.supplier}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-xs text-muted-foreground">Minimum Order</p>
                <p className="font-semibold text-foreground mt-0.5">{viewProduct.minOrder}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {viewProduct.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-muted-foreground">{tag}</span>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <Button className="flex-1" variant="outline" onClick={() => { setViewProduct(null); setRfqProduct(viewProduct); }}>
                Request Quote
              </Button>
              <Button className="flex-1" onClick={() => { setViewProduct(null); setOrderProduct(viewProduct); }}>
                Place Order
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RFQ modal */}
      {rfqProduct && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setRfqProduct(null)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-foreground">Request a Quote</h2>
            <p className="mt-1 text-sm text-muted-foreground">{rfqProduct.name} · {rfqProduct.supplier}</p>
            {rfqSent ? (
              <div className="mt-6 rounded-xl bg-emerald-500/10 p-4 text-center text-sm font-medium text-emerald-700">
                ✓ Quote request sent successfully!
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Quantity needed *</span>
                  <input
                    value={rfqQty}
                    onChange={(e) => setRfqQty(e.target.value)}
                    placeholder={`e.g. 100 ${rfqProduct.unit}`}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Message to supplier (optional)</span>
                  <textarea
                    value={rfqMsg}
                    onChange={(e) => setRfqMsg(e.target.value)}
                    rows={3}
                    placeholder="Describe your requirements, delivery location, preferred payment terms…"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </label>
                <div className="flex justify-end gap-2 pt-1">
                  <Button variant="secondary" onClick={() => setRfqProduct(null)}>Cancel</Button>
                  <Button onClick={sendRfq} disabled={!rfqQty.trim()}>Send Request</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Place order modal */}
      {orderProduct && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setOrderProduct(null)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-foreground">Place Order</h2>
            <p className="mt-1 text-sm text-muted-foreground">{orderProduct.name} · {orderProduct.supplier}</p>
            {orderSuccess ? (
              <div className="mt-6 rounded-xl bg-emerald-500/10 p-4 text-center text-sm font-medium text-emerald-700">
                ✓ Order placed successfully! Check My Orders for status.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-border bg-surface p-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Unit price</span><span className="font-medium">{orderProduct.price}</span></div>
                  <div className="flex justify-between mt-1.5"><span className="text-muted-foreground">Min. order</span><span className="font-medium">{orderProduct.minOrder}</span></div>
                  <div className="flex justify-between mt-1.5"><span className="text-muted-foreground">In stock</span><span className="font-medium">{orderProduct.stock}</span></div>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Quantity ({orderProduct.unit}) *</span>
                  <input
                    value={orderQty}
                    onChange={(e) => setOrderQty(e.target.value)}
                    placeholder={orderProduct.minOrder}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                {orderQty && !isNaN(Number(orderQty)) && (
                  <div className="rounded-xl border border-border bg-surface p-3 text-sm">
                    <div className="flex justify-between font-medium">
                      <span>Estimated total</span>
                      <span className="text-primary">RWF {(Number(orderQty) * orderProduct.pricePerUnit).toLocaleString()}</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-1">
                  <Button variant="secondary" onClick={() => setOrderProduct(null)}>Cancel</Button>
                  <Button onClick={placeOrder} disabled={!orderQty.trim()}>Confirm Order</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
