"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import {
  DataTable, Column, StatusBadge, ConfirmDialog, FormModal,
  Field, inputCls, primaryBtn, secondaryBtn, dangerBtn, ghostBtn, EmptyState,
} from "@/components/common/ui";
import { reservationService, warehouseService, userService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { Reservation, Warehouse } from "@/lib/storage";

const RES_STATUSES: Reservation["status"][] = ["Pending", "Confirmed", "Active", "Completed", "Cancelled"];

export default function WarehouseReservationsPage() {
  const session = useSession();
  const ownerId = session?.claims.sub ?? "";

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [deleting, setDeleting] = useState<Reservation | null>(null);
  const [form, setForm] = useState({ warehouseId: "", customerId: "", product: "", quantity: "", duration: "", startDate: "", endDate: "", status: "Pending" as Reservation["status"], totalPrice: "" });
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function load() {
    const whs = warehouseService.getByOwner(ownerId);
    setWarehouses(whs);
    const whIds = whs.map(w => w.id);
    setReservations(reservationService.getAll().filter(r => whIds.includes(r.warehouseId)));
  }

  useEffect(() => { if (ownerId) load(); }, [ownerId]);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function openAdd() {
    setForm({ warehouseId: warehouses[0]?.id ?? "", customerId: "", product: "", quantity: "", duration: "", startDate: "", endDate: "", status: "Pending", totalPrice: "" });
    setErr(null); setModal("add");
  }

  function openEdit(r: Reservation) {
    setEditing(r);
    setForm({ warehouseId: r.warehouseId, customerId: r.customerId, product: r.product, quantity: String(r.quantity), duration: String(r.duration), startDate: r.startDate, endDate: r.endDate, status: r.status, totalPrice: String(r.totalPrice ?? "") });
    setErr(null); setModal("edit");
  }

  function handleSave() {
    if (!form.warehouseId) { setErr("Select a warehouse."); return; }
    if (!form.product.trim()) { setErr("Product is required."); return; }
    if (!form.quantity || Number(form.quantity) <= 0) { setErr("Enter a valid quantity."); return; }
    if (!form.startDate || !form.endDate) { setErr("Start and end dates are required."); return; }
    const data = {
      warehouseId: form.warehouseId, customerId: form.customerId || "CUST_TBD",
      product: form.product, quantity: Number(form.quantity),
      duration: Number(form.duration) || 1, startDate: form.startDate,
      endDate: form.endDate, status: form.status,
      totalPrice: form.totalPrice ? Number(form.totalPrice) : undefined,
    };
    if (modal === "edit" && editing) {
      reservationService.update(editing.id, data);
      showToast("Reservation updated.");
    } else {
      reservationService.create(data);
      showToast("Reservation created.");
    }
    setModal(null); load();
  }

  const columns: Column<Reservation>[] = [
    { key: "id", label: "Reservation ID" },
    { key: "warehouseId", label: "Warehouse", render: r => warehouses.find(w => w.id === r.warehouseId)?.name ?? r.warehouseId },
    { key: "customerId", label: "Customer", render: r => userService.getUserName(r.customerId) },
    { key: "product", label: "Product" },
    { key: "quantity", label: "Qty" },
    { key: "startDate", label: "Start", render: r => new Date(r.startDate).toLocaleDateString() },
    { key: "endDate", label: "End", render: r => new Date(r.endDate).toLocaleDateString() },
    { key: "status", label: "Status", render: r => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Reservations"
        description="Manage warehouse space reservations."
        crumbs={[{ label: "Warehouse", href: "/warehouse" }, { label: "Reservations" }]}
        actions={<button onClick={openAdd} className={primaryBtn}><Plus className="h-4 w-4" /> New Reservation</button>}
      />
      <PageBody>
        {reservations.length === 0
          ? <EmptyState title="No reservations" description="Create a reservation to allocate warehouse space." action={<button onClick={openAdd} className={primaryBtn}><Plus className="h-4 w-4" /> New Reservation</button>} />
          : <DataTable columns={columns} rows={reservations} searchKeys={["id", "customerId", "product", "status"]}
              actions={r => (
                <div className="flex gap-1">
                  <button onClick={() => openEdit(r)} className={ghostBtn}><Edit2 className="h-3.5 w-3.5" /> Edit</button>
                  <button onClick={() => setDeleting(r)} className={dangerBtn}><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              )}
            />
        }
      </PageBody>

      {modal && (
        <FormModal title={modal === "add" ? "New Reservation" : "Edit Reservation"} onClose={() => setModal(null)} wide>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Warehouse" required>
              <select value={form.warehouseId} onChange={e => setForm(f => ({ ...f, warehouseId: e.target.value }))} className={inputCls}>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </Field>
            <Field label="Customer ID">
              <input value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))} className={inputCls} placeholder="Customer ID" />
            </Field>
            <Field label="Product" required>
              <input value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))} className={inputCls} placeholder="e.g. Maize" />
            </Field>
            <Field label="Quantity" required>
              <input type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Start Date" required>
              <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="End Date" required>
              <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Total Price (RWF)">
              <input type="number" min="0" value={form.totalPrice} onChange={e => setForm(f => ({ ...f, totalPrice: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Reservation["status"] }))} className={inputCls}>
                {RES_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          {err && <p className="mt-2 text-xs text-danger">{err}</p>}
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setModal(null)} className={secondaryBtn}>Cancel</button>
            <button onClick={handleSave} className={primaryBtn}>{modal === "add" ? "Create Reservation" : "Update"}</button>
          </div>
        </FormModal>
      )}

      {deleting && (
        <ConfirmDialog title="Delete Reservation" message={`Delete reservation ${deleting.id}?`}
          onConfirm={() => { reservationService.delete(deleting.id); setDeleting(null); showToast("Deleted."); load(); }}
          onCancel={() => setDeleting(null)} />
      )}

      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-pop">{toast}</div>}
    </>
  );
}
