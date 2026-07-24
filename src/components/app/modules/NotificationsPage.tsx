"use client";
import { useState } from "react";
import { 
  Bell, 
  BellOff, 
  CheckCheck, 
  Filter, 
  Package, 
  Warehouse, 
  CreditCard, 
  Truck, 
  ShoppingCart, 
  Settings,
  type LucideIcon,
} from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  commsStore, notifForRole, useComms,
  type Notification, type NotificationCategory, type State, type Tone,
} from "@/lib/comms-store";
import type { Role } from "@/lib/auth/roles";

const TONE_STYLES: Record<Tone, string> = {
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  danger: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  info: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  muted: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

const TONE_DOT: Record<Tone, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-sky-500",
  muted: "bg-slate-400",
};

const CATEGORY_ICON: Record<NotificationCategory, LucideIcon> = {
  Order: Package,
  Warehouse: Warehouse,
  Payment: CreditCard,
  Transport: Truck,
  Marketplace: ShoppingCart,
  System: Settings,
};

const CATEGORIES = ["All", "Order", "Payment", "Transport", "Marketplace", "Warehouse", "System"] as const;
type FilterCat = (typeof CATEGORIES)[number];

export function RoleNotificationsPage({ role }: { role: Role }) {
  const notifications = useComms((s: State) => s.notifications.filter((n) => notifForRole(n, role)));
  const [catFilter, setCatFilter] = useState<FilterCat>("All");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filtered = notifications.filter((n) => {
    const matchCat = catFilter === "All" || n.category === catFilter;
    const matchRead = !showUnreadOnly || !n.read;
    return matchCat && matchRead;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Stay updated on orders, payments, deliveries and platform activity."
        crumbs={[{ label: role, href: `/${role}/dashboard` }, { label: "Notifications" }]}
        actions={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {unreadCount} unread
              </span>
            )}
            <Button size="sm" variant="outline" onClick={() => commsStore.markAllRead(role)} disabled={unreadCount === 0}>
              <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read
            </Button>
          </div>
        }
      />
      <PageBody>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            <Filter className="h-4 w-4 text-muted-foreground self-center" />
            {CATEGORIES.map((cat) => {
              const Icon = cat !== "All" ? CATEGORY_ICON[cat as NotificationCategory] : null;
              return (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition flex items-center gap-1.5",
                    catFilter === cat
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-surface"
                  )}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {cat}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setShowUnreadOnly((v) => !v)}
            className={cn(
              "ml-auto flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
              showUnreadOnly
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-surface"
            )}
          >
            {showUnreadOnly ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
            {showUnreadOnly ? "Unread only" : "All"}
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background p-12 text-center">
            <Bell className="mx-auto h-10 w-10 text-muted-foreground/30" />
            <p className="mt-3 font-medium text-foreground">No notifications</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {showUnreadOnly ? "All caught up! No unread notifications." : "Nothing here yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((n) => (
              <NotifRow key={n.id} n={n} onRead={() => commsStore.markRead(n.id)} />
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}

function NotifRow({ n, onRead }: { n: Notification; onRead: () => void }) {
  const Icon = CATEGORY_ICON[n.category];
  
  return (
    <div
      onClick={() => { if (!n.read) onRead(); }}
      className={cn(
        "flex items-start gap-4 rounded-xl border px-4 py-3 transition cursor-pointer",
        n.read
          ? "border-border bg-background hover:bg-surface/60"
          : "border-primary/20 bg-primary/5 hover:bg-primary/10"
      )}
    >
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", TONE_STYLES[n.tone])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm leading-snug", n.read ? "text-muted-foreground" : "font-medium text-foreground")}>
            {n.message}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            {!n.read && <span className={cn("h-2 w-2 rounded-full shrink-0", TONE_DOT[n.tone])} />}
            <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
          </div>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", TONE_STYLES[n.tone])}>
            {n.category}
          </span>
          {n.read && <span className="text-[10px] text-muted-foreground">Read</span>}
        </div>
      </div>
    </div>
  );
}
