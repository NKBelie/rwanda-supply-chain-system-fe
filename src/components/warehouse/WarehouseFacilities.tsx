"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import {
  DataTable, Column, StatusBadge, ConfirmDialog, FormModal,
  Field, inputCls, primaryBtn, secondaryBtn, dangerBtn, ghostBtn, EmptyState,
} from "@/components/common/ui";
import { warehouseService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import { RWANDA_PROVINCES, getDistricts } from "@/lib/auth/onboarding";
import type { Warehouse } from "@/lib/storage";

const WH_TYPES: Warehouse["type"][] = ["Cold Storage", "Dry Storage", "Agricultural Warehouse", "Manufacturing Storage", "Distribution Center"];
const WH_STATUSES: Warehouse["status"][] = ["Active", "Inactive", "Maintenance"];

type FormData = {
  name: string; type: string; province: string; district: string; sector: string;
  cell: string; village: string; capacity: string; availableSpace: string; status: string;
};

const EMPTY: FormData = {
  name: "", type: "Dry Storage", province: "", district: "", sector: "",
  cell: "", village: "", capacity: "", availableSpace: "", status: "Active",
};

export default function WarehouseFacilitiesPage() {
  const session = useSession();
  const ownerId = session?.claims.sub ?? "";

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Warehouse | null>(null);
  const [deleting, setDeleting] = useState<Warehouse | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function load() { setWarehouses(warehouseService.getByOwner(ownerId)); }
  useEffect(() => { if (ownerId) load(); }, [ownerId]);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function openAdd() { setForm(EMPTY); setErr(null); setModal("add"); }
  function openEdit(w: Warehouse) {
    setEditing(w);
    setForm({ name: w.name, type: w.type, province: w.province, district: w.district, sector: w.sector, cell: w.cell, village: w.village, capacity: String(w.capacity), availableSpace: String(w.availableSpace), status: w.status });
    setErr(null); setModal("edit");
  }

  function validate(): boolean {
    if (!form.name.trim()) { setErr("Warehouse name is required."); return false; }
    if (!form.province) { setErr("Province is required."); return false; }
    if (!form.district) { setErr("District is required."); return false; }
    if (!form.capacity || Number(form.capacity) <= 0) { setErr("Enter a valid capacity."); return false; }
    if (!form.availableSpace || Number(form.availableSpace) < 0) { setErr("Enter valid available space."); return false; }
    if (Number(form.availableSpace) > Number(form.capacity)) { setErr("Available space cannot exceed capacity."); return false; }
    return true;
  }

  function handleSave() {
    if (!validate()) return;
    const data = {
      ownerId, name: form.name.trim(), type: form.type as Warehouse["type"],
      province: form.province, district: form.district, sector: form.sector,
      cell: form.cell, village: form.village,
      capacity: Number(form.capacity), availableSpace: Number(form.availableSpace),
      status: form.status as Warehouse["status"],
      conditions: [], productsAllowed: [], images: [],
    };
    if (modal === "edit" && editing) {
      warehouseService.update(editing.id, data);
      showToast("Warehouse updated.");
    } else {
      warehouseService.create(data);
      showToast("Warehouse created.");
    }
    setModal(null); load();
  }

  const districts = getDistricts(form.province);

  const columns: Column<Warehouse>[] = [
    { key: "name", label: "Warehouse Name" },
    { key: "type", label: "Type" },
    { key: "district", label: "Location", render: w => `${w.district}, ${w.province}` },
    { key: "capacity", label: "Capacity", render: w => `${w.capacity.toLocaleString()} tons` },
    { key: "availableSpace", label: "Available", render: w => `${w.availableSpace.toLocaleString()} tons` },
    { key: "status", label: "Status", render: w => <StatusBadge status={w.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="My Warehouses"
        description="Manage your warehouse facilities."
        crumbs={[{ label: "Warehouse", href: "/warehouse" }, { label: "Facilities" }]}
        actions={<button onClick={openAdd} className={primaryBtn}><Plus className="h-4 w-4" /> Add Warehouse</button>}
      />
      <PageBody>
        {warehouses.length === 0
          ? <EmptyState title="No warehouses yet" description="Add your first warehouse facility." action={<button onClick={openAdd} className={primaryBtn}><Plus className="h-4 w-4" /> Add Warehouse</button>} />
          : <DataTable columns={columns} rows={warehouses} searchKeys={["name", "type", "district", "status"]}
              actions={w => (
                <div className="flex gap-1">
                  <button onClick={() => openEdit(w)} className={ghostBtn}><Edit2 className="h-3.5 w-3.5" /> Edit</button>
                  <button onClick={() => setDeleting(w)} className={dangerBtn}><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              )}
            />
        }
      </PageBody>

      {modal && (
        <FormModal title={modal === "add" ? "Add Warehouse" : "Edit Warehouse"} onClose={() => setModal(null)} wide>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Warehouse Name" required>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. Kigali Cold Storage" />
            </Field>
            <Field label="Warehouse Type" required>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={inputCls}>
                {WH_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Province" required>
              <select value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value, district: "" }))} className={inputCls}>
                <option value="">— Select province —</option>
                {RWANDA_PROVINCES.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="District" required>
              <select value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} className={inputCls} disabled={!form.province}>
                <option value="">— Select district —</option>
                {districts.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Sector">
              <input value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))} className={inputCls} placeholder="Sector" />
            </Field>
            <Field label="Cell">
              <input value={form.cell} onChange={e => setForm(f => ({ ...f, cell: e.target.value }))} className={inputCls} placeholder="Cell" />
            </Field>
            <Field label="Total Capacity (tons)" required>
              <input type="number" min="1" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Available Space (tons)" required>
              <input type="number" min="0" value={form.availableSpace} onChange={e => setForm(f => ({ ...f, availableSpace: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls}>
                {WH_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          {err && <p className="mt-2 text-xs text-danger">{err}</p>}
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setModal(null)} className={secondaryBtn}>Cancel</button>
            <button onClick={handleSave} className={primaryBtn}>{modal === "add" ? "Create Warehouse" : "Update Warehouse"}</button>
          </div>
        </FormModal>
      )}

      {deleting && (
        <ConfirmDialog title="Delete Warehouse" message={`Delete "${deleting.name}"? All associated batches will be affected.`}
          onConfirm={() => { warehouseService.delete(deleting.id); setDeleting(null); showToast("Warehouse deleted."); load(); }}
          onCancel={() => setDeleting(null)} />
      )}

      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-pop">{toast}</div>}
    </>
  );
}
