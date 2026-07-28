"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import {
  DataTable, Column, StatusBadge, ConfirmDialog, FormModal,
  Field, inputCls, primaryBtn, secondaryBtn, dangerBtn, ghostBtn, EmptyState,
} from "@/components/common/ui";
import { orderService, productService, userService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { Order, Product } from "@/lib/storage";

const ORDER_STATUSES: Order["status"][] = ["Request", "Accepted", "Processing", "Transport", "Delivered", "Completed"];

export default function FarmerOrdersPage() {
  const session = useSession();
  const farmerId = session?.claims.sub ?? "";

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState<Order | null>(null);
  const [form, setForm] = useState({ productId: "", quantity: "", totalPrice: "", buyerId: "", status: "Request" as Order["status"] });
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function load() {
    setOrders(orderService.getByFarmer(farmerId));
    setProducts(productService.getByFarmer(farmerId));
  }

  useEffect(() => { if (farmerId) load(); }, [farmerId]);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function openAdd() {
    setForm({ productId: "", quantity: "", totalPrice: "", buyerId: "", status: "Request" });
    setErr(null); setModal("add");
  }

  function openEdit(o: Order) {
    setEditing(o);
    setForm({ productId: o.productId, quantity: String(o.quantity), totalPrice: String(o.totalPrice), buyerId: o.buyerId, status: o.status });
    setErr(null); setModal("edit");
  }

  function handleSave() {
    if (!form.productId) { setErr("Select a product."); return; }
    if (!form.quantity || Number(form.quantity) <= 0) { setErr("Enter a valid quantity."); return; }
    if (!form.totalPrice || Number(form.totalPrice) <= 0) { setErr("Enter a valid price."); return; }
    if (modal === "edit" && editing) {
      orderService.updateStatus(editing.id, form.status);
      showToast("Order updated.");
    } else {
      orderService.create({
        farmerId, buyerId: form.buyerId || "BUYER_TBD",
        productId: form.productId, quantity: Number(form.quantity),
        totalPrice: Number(form.totalPrice), status: form.status,
      });
      showToast("Order created.");
    }
    setModal(null); load();
  }

  const columns: Column<Order>[] = [
    { key: "createdAt", label: "Date", render: o => new Date(o.createdAt).toLocaleDateString() },
    { key: "productId", label: "Product", render: o => products.find(p => p.id === o.productId)?.name ?? o.productId },
    { key: "buyerId", label: "Buyer", render: o => userService.getUserName(o.buyerId) },
    { key: "quantity", label: "Qty" },
    { key: "totalPrice", label: "Total", render: o => `RWF ${o.totalPrice.toLocaleString()}` },
    { key: "status", label: "Status", render: o => <StatusBadge status={o.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track and manage your product orders."
        crumbs={[{ label: "Farmer", href: "/farmer" }, { label: "Orders" }]}
        actions={<button onClick={openAdd} className={primaryBtn}><Plus className="h-4 w-4" /> New Order</button>}
      />
      <PageBody>
        {orders.length === 0
          ? <EmptyState title="No orders yet" description="Orders will appear here once buyers place them." action={<button onClick={openAdd} className={primaryBtn}><Plus className="h-4 w-4" /> New Order</button>} />
          : <DataTable columns={columns} rows={orders} searchKeys={["status"]}
              actions={o => (
                <div className="flex gap-1">
                  <button onClick={() => openEdit(o)} className={ghostBtn}><Edit2 className="h-3.5 w-3.5" /> Edit</button>
                  <button onClick={() => setDeleting(o)} className={dangerBtn}><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              )}
            />
        }
      </PageBody>

      {modal && (
        <FormModal title={modal === "add" ? "New Order" : "Update Order"} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <Field label="Product" required>
              <select value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))} className={inputCls}>
                <option value="">— Select product —</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Quantity" required>
                <input type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Total Price (RWF)" required>
                <input type="number" min="0" value={form.totalPrice} onChange={e => setForm(f => ({ ...f, totalPrice: e.target.value }))} className={inputCls} />
              </Field>
            </div>
            <Field label="Status">
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Order["status"] }))} className={inputCls}>
                {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            {err && <p className="text-xs text-danger">{err}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModal(null)} className={secondaryBtn}>Cancel</button>
              <button onClick={handleSave} className={primaryBtn}>{modal === "add" ? "Create Order" : "Update"}</button>
            </div>
          </div>
        </FormModal>
      )}

      {deleting && (
        <ConfirmDialog title="Delete Order" message={`Delete order for ${products.find(p => p.id === deleting.productId)?.name ?? 'this product'}?`}
          onConfirm={() => { orderService.delete(deleting.id); setDeleting(null); showToast("Deleted."); load(); }}
          onCancel={() => setDeleting(null)} />
      )}

      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-pop">{toast}</div>}
    </>
  );
}
