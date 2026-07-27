"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import {
  DataTable, Column, StatusBadge, ConfirmDialog, FormModal,
  Field, inputCls, primaryBtn, secondaryBtn, dangerBtn, ghostBtn, EmptyState,
} from "@/components/common/ui";
import { transportService, productService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { TransportRequest, Product } from "@/lib/storage";

const VEHICLE_TYPES = ["Motorcycle", "Pickup", "Van", "Box Truck", "Refrigerated Truck", "Trailer"];

export default function FarmerTransportPage() {
  const session = useSession();
  const farmerId = session?.claims.sub ?? "";

  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<TransportRequest | null>(null);
  const [deleting, setDeleting] = useState<TransportRequest | null>(null);
  const [form, setForm] = useState({ pickupLocation: "", destination: "", productId: "", quantity: "", vehicleType: "Pickup", preferredDate: "" });
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function load() {
    setRequests(transportService.getByFarmer(farmerId));
    setProducts(productService.getByFarmer(farmerId));
  }

  useEffect(() => { if (farmerId) load(); }, [farmerId]);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function openAdd() {
    setForm({ pickupLocation: "", destination: "", productId: "", quantity: "", vehicleType: "Pickup", preferredDate: "" });
    setErr(null); setModal("add");
  }

  function handleSave() {
    if (!form.pickupLocation.trim() || !form.destination.trim()) { setErr("Pickup and destination are required."); return; }
    if (!form.productId) { setErr("Select a product."); return; }
    if (!form.quantity || Number(form.quantity) <= 0) { setErr("Enter a valid quantity."); return; }
    if (!form.preferredDate) { setErr("Select a preferred date."); return; }
    if (modal === "edit" && editing) {
      transportService.update(editing.id, { ...form, quantity: Number(form.quantity) });
      showToast("Request updated.");
    } else {
      transportService.create({ farmerId, ...form, quantity: Number(form.quantity), status: "Pending" });
      showToast("Transport request created.");
    }
    setModal(null); load();
  }

  const columns: Column<TransportRequest>[] = [
    { key: "preferredDate", label: "Date", render: r => new Date(r.preferredDate).toLocaleDateString() },
    { key: "pickupLocation", label: "Pickup" },
    { key: "destination", label: "Destination" },
    { key: "productId", label: "Product", render: r => products.find(p => p.id === r.productId)?.name ?? r.productId },
    { key: "quantity", label: "Qty" },
    { key: "vehicleType", label: "Vehicle" },
    { key: "status", label: "Status", render: r => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Transport Requests"
        description="Request transport for your products."
        crumbs={[{ label: "Farmer", href: "/farmer" }, { label: "Transport" }]}
        actions={<button onClick={openAdd} className={primaryBtn}><Plus className="h-4 w-4" /> New Request</button>}
      />
      <PageBody>
        {requests.length === 0
          ? <EmptyState title="No transport requests" description="Create a request to move your products." action={<button onClick={openAdd} className={primaryBtn}><Plus className="h-4 w-4" /> New Request</button>} />
          : <DataTable columns={columns} rows={requests} searchKeys={["pickupLocation", "destination", "status"]}
              actions={r => (
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(r); setForm({ pickupLocation: r.pickupLocation, destination: r.destination, productId: r.productId, quantity: String(r.quantity), vehicleType: r.vehicleType, preferredDate: r.preferredDate }); setModal("edit"); }} className={ghostBtn}><Edit2 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setDeleting(r)} className={dangerBtn}><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              )}
            />
        }
      </PageBody>

      {modal && (
        <FormModal title={modal === "add" ? "New Transport Request" : "Edit Request"} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Pickup Location" required>
                <input value={form.pickupLocation} onChange={e => setForm(f => ({ ...f, pickupLocation: e.target.value }))} className={inputCls} placeholder="e.g. Kigali" />
              </Field>
              <Field label="Destination" required>
                <input value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} className={inputCls} placeholder="e.g. Musanze" />
              </Field>
            </div>
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
              <Field label="Vehicle Type">
                <select value={form.vehicleType} onChange={e => setForm(f => ({ ...f, vehicleType: e.target.value }))} className={inputCls}>
                  {VEHICLE_TYPES.map(v => <option key={v}>{v}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Preferred Date" required>
              <input type="date" value={form.preferredDate} onChange={e => setForm(f => ({ ...f, preferredDate: e.target.value }))} className={inputCls} />
            </Field>
            {err && <p className="text-xs text-danger">{err}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModal(null)} className={secondaryBtn}>Cancel</button>
              <button onClick={handleSave} className={primaryBtn}>{modal === "add" ? "Submit Request" : "Update"}</button>
            </div>
          </div>
        </FormModal>
      )}

      {deleting && (
        <ConfirmDialog title="Delete Request" message={`Delete transport request from ${deleting.pickupLocation} to ${deleting.destination}?`}
          onConfirm={() => { transportService.delete(deleting.id); setDeleting(null); showToast("Deleted."); load(); }}
          onCancel={() => setDeleting(null)} />
      )}

      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-pop">{toast}</div>}
    </>
  );
}
