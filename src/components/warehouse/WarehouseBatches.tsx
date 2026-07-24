"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, PackageOpen } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import {
  DataTable, Column, StatusBadge, ConfirmDialog, FormModal,
  Field, inputCls, primaryBtn, secondaryBtn, dangerBtn, ghostBtn, EmptyState,
} from "@/components/common/ui";
import { batchService, warehouseService, productService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { WarehouseBatch, Warehouse, Product } from "@/lib/storage";

const QUALITIES = ["Premium", "Grade A", "Grade B", "Standard"] as const;
const STATUSES: WarehouseBatch["status"][] = ["Stored", "Reserved", "Released"];

export default function WarehouseBatchesPage() {
  const session = useSession();
  const ownerId = session?.claims.sub ?? "";

  const [batches, setBatches] = useState<WarehouseBatch[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<WarehouseBatch | null>(null);
  const [deleting, setDeleting] = useState<WarehouseBatch | null>(null);
  const [releasing, setReleasing] = useState<WarehouseBatch | null>(null);
  const [form, setForm] = useState({ warehouseId: "", productId: "", farmerId: "", quantity: "", quality: "Grade A", zone: "", rackNumber: "", status: "Stored" as WarehouseBatch["status"] });
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function load() {
    const whs = warehouseService.getByOwner(ownerId);
    setWarehouses(whs);
    const whIds = whs.map(w => w.id);
    setBatches(batchService.getAll().filter(b => whIds.includes(b.warehouseId)));
    setProducts(productService.getAll());
  }

  useEffect(() => { if (ownerId) load(); }, [ownerId]);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function openAdd() {
    setForm({ warehouseId: warehouses[0]?.id ?? "", productId: "", farmerId: "", quantity: "", quality: "Grade A", zone: "", rackNumber: "", status: "Stored" });
    setErr(null); setModal("add");
  }

  function openEdit(b: WarehouseBatch) {
    setEditing(b);
    setForm({ warehouseId: b.warehouseId, productId: b.productId, farmerId: b.farmerId, quantity: String(b.quantity), quality: b.quality, zone: b.zone ?? "", rackNumber: b.rackNumber ?? "", status: b.status });
    setErr(null); setModal("edit");
  }

  function handleSave() {
    if (!form.warehouseId) { setErr("Select a warehouse."); return; }
    if (!form.productId) { setErr("Select a product."); return; }
    if (!form.quantity || Number(form.quantity) <= 0) { setErr("Enter a valid quantity."); return; }
    const data = {
      warehouseId: form.warehouseId, productId: form.productId,
      farmerId: form.farmerId || ownerId, quantity: Number(form.quantity),
      quality: form.quality as WarehouseBatch["quality"],
      zone: form.zone || undefined, rackNumber: form.rackNumber || undefined,
      status: form.status, storageDate: new Date().toISOString(),
    };
    if (modal === "edit" && editing) {
      batchService.update(editing.id, data);
      showToast("Batch updated.");
    } else {
      batchService.create(data);
      showToast("Batch created.");
    }
    setModal(null); load();
  }

  const columns: Column<WarehouseBatch>[] = [
    { key: "id", label: "Batch ID" },
    { key: "warehouseId", label: "Warehouse", render: b => warehouses.find(w => w.id === b.warehouseId)?.name ?? b.warehouseId },
    { key: "productId", label: "Product", render: b => products.find(p => p.id === b.productId)?.name ?? b.productId },
    { key: "quantity", label: "Quantity" },
    { key: "quality", label: "Quality", render: b => <StatusBadge status={b.quality} /> },
    { key: "zone", label: "Zone", render: b => b.zone ?? "—" },
    { key: "rackNumber", label: "Rack", render: b => b.rackNumber ?? "—" },
    { key: "storageDate", label: "Stored", render: b => new Date(b.storageDate).toLocaleDateString() },
    { key: "status", label: "Status", render: b => <StatusBadge status={b.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Warehouse Batches"
        description="Manage stored product batches."
        crumbs={[{ label: "Warehouse", href: "/warehouse" }, { label: "Batches" }]}
        actions={<button onClick={openAdd} className={primaryBtn}><Plus className="h-4 w-4" /> New Batch</button>}
      />
      <PageBody>
        {batches.length === 0
          ? <EmptyState title="No batches" description="Create a batch to start tracking stored products." action={<button onClick={openAdd} className={primaryBtn}><Plus className="h-4 w-4" /> New Batch</button>} />
          : <DataTable columns={columns} rows={batches} searchKeys={["id", "status"]}
              actions={b => (
                <div className="flex gap-1">
                  <button onClick={() => openEdit(b)} className={ghostBtn}><Edit2 className="h-3.5 w-3.5" /></button>
                  <button disabled={b.status === "Released"} onClick={() => setReleasing(b)} className={ghostBtn}><PackageOpen className="h-3.5 w-3.5" /> Release</button>
                  <button onClick={() => setDeleting(b)} className={dangerBtn}><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              )}
            />
        }
      </PageBody>

      {modal && (
        <FormModal title={modal === "add" ? "New Batch" : "Edit Batch"} onClose={() => setModal(null)} wide>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Warehouse" required>
              <select value={form.warehouseId} onChange={e => setForm(f => ({ ...f, warehouseId: e.target.value }))} className={inputCls}>
                <option value="">— Select —</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </Field>
            <Field label="Product" required>
              <select value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))} className={inputCls}>
                <option value="">— Select —</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
            <Field label="Quantity" required>
              <input type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Quality">
              <select value={form.quality} onChange={e => setForm(f => ({ ...f, quality: e.target.value }))} className={inputCls}>
                {QUALITIES.map(q => <option key={q}>{q}</option>)}
              </select>
            </Field>
            <Field label="Storage Zone">
              <input value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} className={inputCls} placeholder="e.g. Zone A" />
            </Field>
            <Field label="Rack Number">
              <input value={form.rackNumber} onChange={e => setForm(f => ({ ...f, rackNumber: e.target.value }))} className={inputCls} placeholder="e.g. R-01" />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as WarehouseBatch["status"] }))} className={inputCls}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          {err && <p className="mt-2 text-xs text-danger">{err}</p>}
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setModal(null)} className={secondaryBtn}>Cancel</button>
            <button onClick={handleSave} className={primaryBtn}>{modal === "add" ? "Create Batch" : "Update Batch"}</button>
          </div>
        </FormModal>
      )}

      {releasing && (
        <ConfirmDialog title="Release Batch" message={`Release batch ${releasing.id}? This restores warehouse space.`}
          confirmLabel="Release" danger={false}
          onConfirm={() => { batchService.release(releasing.id); setReleasing(null); showToast("Batch released."); load(); }}
          onCancel={() => setReleasing(null)} />
      )}

      {deleting && (
        <ConfirmDialog title="Delete Batch" message={`Delete batch ${deleting.id}?`}
          onConfirm={() => { batchService.delete(deleting.id); setDeleting(null); showToast("Deleted."); load(); }}
          onCancel={() => setDeleting(null)} />
      )}

      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-pop">{toast}</div>}
    </>
  );
}
