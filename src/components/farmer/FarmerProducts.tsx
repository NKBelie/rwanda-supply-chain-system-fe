"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Truck, Warehouse } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import {
  DataTable, Column, StatusBadge, ConfirmDialog, FormModal,
  Field, inputCls, textareaCls, primaryBtn, secondaryBtn, dangerBtn, ghostBtn, EmptyState,
} from "@/components/common/ui";
import { productService, batchService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { Product, WarehouseBatch } from "@/lib/storage";

const CATEGORIES = ["Crops", "Livestock", "Dairy", "Fruits", "Vegetables", "Seeds"] as const;
const UNITS = ["Kg", "Ton", "Bag", "Liter", "Box", "Piece"] as const;
const STATUSES = ["Available", "Growing", "Harvested", "Reserved", "Out of Stock"] as const;
const QUALITIES = ["Premium", "Grade A", "Grade B", "Standard"] as const;

type FormData = {
  name: string; category: string; unit: string; price: string; quantity: string;
  status: string; quality: string; batchId: string; description: string;
  harvestDate: string; expiryDate: string;
};

const EMPTY_FORM: FormData = {
  name: "", category: "Crops", unit: "Kg", price: "", quantity: "",
  status: "Available", quality: "Grade A", batchId: "", description: "",
  harvestDate: "", expiryDate: "",
};

export default function FarmerProductsPage() {
  const session = useSession();
  const router = useRouter();
  const farmerId = session?.claims.sub ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<WarehouseBatch[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function load() {
    setProducts(productService.getByFarmer(farmerId));
    setBatches(batchService.getAll());
  }

  useEffect(() => { if (farmerId) load(); }, [farmerId]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function openAdd() { setForm(EMPTY_FORM); setErr(null); setModal("add"); }
  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name, category: p.category, unit: p.unit,
      price: String(p.price), quantity: String(p.quantity),
      status: p.status, quality: p.quality, batchId: p.batchId ?? "",
      description: p.description ?? "", harvestDate: "", expiryDate: "",
    });
    setErr(null);
    setModal("edit");
  }

  function validate(): boolean {
    if (!form.name.trim()) { setErr("Product name is required."); return false; }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) { setErr("Enter a valid price."); return false; }
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) < 0) { setErr("Enter a valid quantity."); return false; }
    return true;
  }

  function handleSave() {
    if (!validate()) return;
    const data = {
      farmerId,
      name: form.name.trim(),
      category: form.category as Product["category"],
      unit: form.unit as Product["unit"],
      price: Number(form.price),
      quantity: Number(form.quantity),
      status: form.status as Product["status"],
      quality: form.quality as Product["quality"],
      batchId: form.batchId || undefined,
      description: form.description || undefined,
      images: [],
    };
    if (modal === "edit" && editing) {
      productService.update(editing.id, data);
      showToast("Product updated.");
    } else {
      productService.create(data);
      showToast("Product created.");
    }
    setModal(null);
    load();
  }

  function handleDelete() {
    if (!deleting) return;
    productService.delete(deleting.id);
    setDeleting(null);
    showToast("Product deleted.");
    load();
  }

  const columns: Column<Product>[] = [
    { key: "name", label: "Product Name" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Qty", render: p => `${p.quantity} ${p.unit}` },
    { key: "price", label: "Price", render: p => `RWF ${p.price.toLocaleString()}` },
    { key: "quality", label: "Quality", render: p => <StatusBadge status={p.quality} /> },
    { key: "status", label: "Status", render: p => <StatusBadge status={p.status} /> },
    { key: "createdAt", label: "Created", render: p => new Date(p.createdAt).toLocaleDateString() },
  ];

  return (
    <>
      <PageHeader
        title="My Products"
        description="Manage your farm products and inventory."
        crumbs={[{ label: "Farmer", href: "/farmer" }, { label: "Products" }]}
        actions={
          <button onClick={openAdd} className={primaryBtn}>
            <Plus className="h-4 w-4" /> Add Product
          </button>
        }
      />
      <PageBody>
        {products.length === 0
          ? <EmptyState title="No products yet" description="Add your first product to start selling." action={
              <button onClick={openAdd} className={primaryBtn}><Plus className="h-4 w-4" /> Add Product</button>
            } />
          : <DataTable
              columns={columns}
              rows={products}
              searchKeys={["name", "category", "status"]}
              actions={p => (
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(p)} className={ghostBtn}><Edit2 className="h-3.5 w-3.5" /> Edit</button>
                  <button onClick={() => router.push("/farmer/transport")} className={ghostBtn}><Truck className="h-3.5 w-3.5" /> Transport</button>
                  <button onClick={() => router.push("/farmer/warehouse")} className={ghostBtn}><Warehouse className="h-3.5 w-3.5" /> Warehouse</button>
                  <button onClick={() => setDeleting(p)} className={dangerBtn}><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              )}
            />
        }
      </PageBody>

      {/* Add/Edit Modal */}
      {modal && (
        <FormModal title={modal === "add" ? "Add Product" : "Edit Product"} onClose={() => setModal(null)} wide>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Product Name" required>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. Maize" />
            </Field>
            <Field label="Category" required>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Unit">
              <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className={inputCls}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="Price Per Unit (RWF)" required>
              <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className={inputCls} placeholder="0" />
            </Field>
            <Field label="Available Quantity" required>
              <input type="number" min="0" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} className={inputCls} placeholder="0" />
            </Field>
            <Field label="Status" required>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Quality Grade" required>
              <select value={form.quality} onChange={e => setForm(f => ({ ...f, quality: e.target.value }))} className={inputCls}>
                {QUALITIES.map(q => <option key={q}>{q}</option>)}
              </select>
            </Field>
            <Field label="Warehouse Batch">
              <select value={form.batchId} onChange={e => setForm(f => ({ ...f, batchId: e.target.value }))} className={inputCls}>
                <option value="">— None —</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.id} · {b.quantity} units</option>)}
              </select>
            </Field>
            <Field label="Harvest Date">
              <input type="date" value={form.harvestDate} onChange={e => setForm(f => ({ ...f, harvestDate: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Expiry Date">
              <input type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} className={inputCls} />
            </Field>
          </div>
          <Field label="Description">
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={textareaCls} placeholder="Optional product description…" />
          </Field>
          {err && <p className="mt-2 text-xs text-danger">{err}</p>}
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setModal(null)} className={secondaryBtn}>Cancel</button>
            <button onClick={handleSave} className={primaryBtn}>{modal === "add" ? "Save Product" : "Update Product"}</button>
          </div>
        </FormModal>
      )}

      {/* Delete Confirm */}
      {deleting && (
        <ConfirmDialog
          title="Delete Product"
          message={`Delete "${deleting.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-pop">
          {toast}
        </div>
      )}
    </>
  );
}
