"use client";
import { useEffect, useState } from "react";
import { Plus, PackageOpen } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import {
  DataTable, Column, StatusBadge, ConfirmDialog, FormModal,
  Field, inputCls, primaryBtn, secondaryBtn, ghostBtn, EmptyState,
} from "@/components/common/ui";
import { batchService, warehouseService, productService, storageRequestService, userService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { WarehouseBatch, Warehouse, Product } from "@/lib/storage";

export default function FarmerWarehousePage() {
  const session = useSession();
  const farmerId = session?.claims.sub ?? "";

  const [batches, setBatches] = useState<WarehouseBatch[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState(false);
  const [releasing, setReleasing] = useState<WarehouseBatch | null>(null);
  const [form, setForm] = useState({ warehouseId: "", productId: "", quantity: "", duration: "30" });
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function load() {
    setBatches(batchService.getByFarmer(farmerId));
    setWarehouses(warehouseService.getAll());
    setProducts(productService.getByFarmer(farmerId));
  }

  useEffect(() => { if (farmerId) load(); }, [farmerId]);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function handleRequest() {
    if (!form.warehouseId) { setErr("Select a warehouse."); return; }
    if (!form.productId) { setErr("Select a product."); return; }
    if (!form.quantity || Number(form.quantity) <= 0) { setErr("Enter a valid quantity."); return; }
    storageRequestService.create({
      farmerId, warehouseId: form.warehouseId, productId: form.productId,
      quantity: Number(form.quantity), duration: Number(form.duration),
      requestDate: new Date().toISOString(), status: "Pending",
    });
    showToast("Storage request submitted.");
    setModal(false); load();
  }

  const columns: Column<WarehouseBatch>[] = [
    { key: "id", label: "Batch ID" },
    { key: "farmerId", label: "Farmer", render: b => userService.getUserName(b.farmerId) },
    { key: "warehouseId", label: "Warehouse", render: b => warehouses.find(w => w.id === b.warehouseId)?.name ?? b.warehouseId },
    { key: "productId", label: "Product", render: b => products.find(p => p.id === b.productId)?.name ?? b.productId },
    { key: "quantity", label: "Quantity" },
    { key: "quality", label: "Quality", render: b => <StatusBadge status={b.quality} /> },
    { key: "storageDate", label: "Stored", render: b => new Date(b.storageDate).toLocaleDateString() },
    { key: "status", label: "Status", render: b => <StatusBadge status={b.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Warehouse Batches"
        description="Products stored in warehouses on your behalf."
        crumbs={[{ label: "Farmer", href: "/farmer" }, { label: "Warehouse Batches" }]}
        actions={<button onClick={() => { setForm({ warehouseId: "", productId: "", quantity: "", duration: "30" }); setErr(null); setModal(true); }} className={primaryBtn}><Plus className="h-4 w-4" /> Request Storage</button>}
      />
      <PageBody>
        {batches.length === 0
          ? <EmptyState title="No warehouse batches" description="Request storage to store your products in a warehouse." action={<button onClick={() => setModal(true)} className={primaryBtn}><Plus className="h-4 w-4" /> Request Storage</button>} />
          : <DataTable columns={columns} rows={batches} searchKeys={["id", "status"]}
              actions={b => (
                <button disabled={b.status === "Released"} onClick={() => setReleasing(b)} className={ghostBtn}>
                  <PackageOpen className="h-3.5 w-3.5" /> Release
                </button>
              )}
            />
        }
      </PageBody>

      {modal && (
        <FormModal title="Request Warehouse Storage" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <Field label="Warehouse" required>
              <select value={form.warehouseId} onChange={e => setForm(f => ({ ...f, warehouseId: e.target.value }))} className={inputCls}>
                <option value="">— Select warehouse —</option>
                {warehouses.filter(w => w.status === "Active").map(w => (
                  <option key={w.id} value={w.id}>{w.name} · {w.availableSpace} tons available</option>
                ))}
              </select>
            </Field>
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
              <Field label="Duration (days)">
                <input type="number" min="1" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className={inputCls} />
              </Field>
            </div>
            {err && <p className="text-xs text-danger">{err}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModal(false)} className={secondaryBtn}>Cancel</button>
              <button onClick={handleRequest} className={primaryBtn}>Submit Request</button>
            </div>
          </div>
        </FormModal>
      )}

      {releasing && (
        <ConfirmDialog title="Release Batch" message={`Release batch ${releasing.id} from warehouse? This will restore warehouse space.`}
          confirmLabel="Release" danger={false}
          onConfirm={() => { batchService.release(releasing.id); setReleasing(null); showToast("Batch released."); load(); }}
          onCancel={() => setReleasing(null)} />
      )}

      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-pop">{toast}</div>}
    </>
  );
}
