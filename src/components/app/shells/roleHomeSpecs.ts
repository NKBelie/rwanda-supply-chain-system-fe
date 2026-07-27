import type { HomeSpec } from "./RoleHome";
import type { Role } from "@/lib/auth/roles";

const range = (n: number, base = 100, jitter = 40) =>
  Array.from({ length: n }, (_, i) => ({ x: `D${i + 1}`, y: base + Math.round(Math.sin(i / 2) * jitter + i * 6) }));

export const ROLE_HOME_SPEC: Record<Role, HomeSpec> = {
  super_admin: {
    greeting: "Platform health",
    subtitle: "Everything happening across RSCN, at a glance.",
    kpis: [
      { label: "Active users",      value: "12,486", delta: "+4.2% wk",   up: true,  icon: "Users" },
      { label: "Verified accounts", value: "9,132",  delta: "+128 today", up: true,  icon: "ShieldCheck" },
      { label: "System uptime",     value: "99.98%", delta: "SLA met",    up: true,  icon: "Activity" },
      { label: "Open tickets",      value: "37",     delta: "-6 wk",      up: true,  icon: "Server" },
    ],
    chart: { kind: "area", title: "Signups & logins", data: range(30, 220, 60) },
    side: {
      title: "Pending approvals",
      items: [
        { label: "Government accounts",  value: "8", tone: "warning" },
        { label: "Suspicious logins",    value: "2", tone: "danger" },
        { label: "Support escalations",  value: "5", tone: "warning" },
        { label: "Role change requests", value: "3" },
      ],
    },
    activity: [
      { title: "Approved MINAGRI officer account", who: "alice.uwase",  when: "2m ago" },
      { title: "Rotated platform signing key",     who: "system",       when: "1h ago" },
      { title: "Audit log export downloaded",      who: "compliance",   when: "3h ago" },
    ],
  },
  government: {
    greeting: "National oversight",
    subtitle: "Rwanda supply chain — production, movement and demand.",
    kpis: [
      { label: "National output",      value: "1.84M t", delta: "+3.1%", up: true,  icon: "Landmark" },
      { label: "Warehouse occupancy",  value: "72%",     delta: "+4pp",  up: true,  icon: "Warehouse" },
      { label: "Active shipments",     value: "3,214",   delta: "-1.2%", up: false, icon: "Truck" },
      { label: "Market price index",   value: "108.6",   delta: "+0.4",  up: true,  icon: "Store" },
    ],
    chart: { kind: "bar", title: "Regional production (tons)", data: [
      { x: "Kigali", y: 84 }, { x: "North", y: 210 }, { x: "South", y: 190 },
      { x: "East",   y: 260 }, { x: "West",  y: 175 },
    ]},
    side: {
      title: "Policy watchlist",
      items: [
        { label: "Cassava shortage risk (South)", value: "Medium", tone: "warning" },
        { label: "Maize export queue",            value: "12 lots" },
        { label: "Fertilizer subsidy usage",      value: "68%" },
      ],
    },
    activity: [
      { title: "Published Q3 national supply report", when: "yesterday" },
      { title: "Reviewed 42 warehouse inspections",   when: "2 days ago" },
    ],
  },
  farmer: {
    greeting: "Karibu, Jean",
    subtitle: "Your farm's activity for this week.",
    kpis: [
      { label: "Products listed",   value: "14",       delta: "+2",       up: true,  icon: "Package" },
      { label: "Ready to harvest",  value: "3 plots",  delta: "This week", up: true, icon: "Sprout" },
      { label: "Open orders",       value: "7",        delta: "+3",       up: true,  icon: "ShoppingCart" },
      { label: "Payments pending",  value: "RWF 480k", delta: "2 buyers", up: false, icon: "CreditCard" },
    ],
    chart: { kind: "line", title: "Harvest yield (kg / week)", data: range(12, 320, 90) },
    side: {
      title: "Upcoming actions",
      items: [
        { label: "Deliver maize to Kigali Coop",  value: "Fri", tone: "warning" },
        { label: "Warehouse booking · Musanze",   value: "Mon" },
        { label: "Buyer inquiry: 1t beans",       value: "New" },
      ],
    },
    activity: [
      { title: "Sold 200kg beans to East Retail", when: "1h ago" },
      { title: "Uploaded quality certificate",    when: "yesterday" },
    ],
  },
  cooperative: {
    greeting: "Cooperative overview",
    subtitle: "Aggregated activity from all members.",
    kpis: [
      { label: "Members",           value: "1,284",    delta: "+18",  up: true, icon: "Users" },
      { label: "Aggregated stock",  value: "412 t",    delta: "+22 t", up: true, icon: "Boxes" },
      { label: "Open orders",       value: "62",       delta: "+9",   up: true, icon: "ShoppingCart" },
      { label: "Payouts this month",value: "RWF 18.4M",delta: "+6%",  up: true, icon: "CreditCard" },
    ],
    chart: { kind: "bar", title: "Deliveries by member group", data: [
      { x: "Grp A", y: 82 }, { x: "Grp B", y: 130 }, { x: "Grp C", y: 96 }, { x: "Grp D", y: 154 },
    ]},
    side: {
      title: "Member alerts",
      items: [
        { label: "5 members below quota",    value: "Follow up", tone: "warning" },
        { label: "New membership requests",  value: "12" },
      ],
    },
    activity: [
      { title: "Aggregated 3.2t maize · Group B",    when: "30m ago" },
      { title: "Contract signed with Rwanda Foods",  when: "2 days ago" },
    ],
  },
  manufacturer: {
    greeting: "Production floor",
    subtitle: "Batches, procurement and outgoing in one place.",
    kpis: [
      { label: "Active batches",   value: "18",    delta: "+2",     up: true,  icon: "Factory" },
      { label: "Open POs",         value: "34",    delta: "-3",     up: true,  icon: "ClipboardList" },
      { label: "Raw stock cover",  value: "12 days",delta: "-1 day",up: false, icon: "Boxes" },
      { label: "Yield efficiency", value: "94.1%", delta: "+0.6%",  up: true,  icon: "BarChart3" },
    ],
    chart: { kind: "area", title: "Daily production output", data: range(30, 480, 120) },
    side: {
      title: "Supplier status",
      items: [
        { label: "On-time delivery",  value: "92%" },
        { label: "Late shipments",    value: "3",  tone: "warning" },
        { label: "New RFQs to send",  value: "6" },
      ],
    },
    activity: [
      { title: "Batch #7821 completed QA",           when: "45m ago" },
      { title: "PO-3392 acknowledged by supplier",   when: "2h ago" },
    ],
  },
  supplier: {
    greeting: "Supplier hub",
    subtitle: "RFQs, contracts and deliveries.",
    kpis: [
      { label: "Open RFQs",            value: "11",       delta: "+2 new", up: true,  icon: "FileSignature" },
      { label: "Won POs (30d)",         value: "27",       delta: "+5",     up: true,  icon: "ClipboardList" },
      { label: "On-time rate",          value: "96%",      delta: "+1pp",   up: true,  icon: "PackageCheck" },
      { label: "Outstanding invoices",  value: "RWF 6.2M", delta: "4 items",up: false, icon: "CreditCard" },
    ],
    chart: { kind: "bar", title: "RFQ win rate by month", data: [
      { x: "Apr", y: 42 }, { x: "May", y: 51 }, { x: "Jun", y: 47 },
      { x: "Jul", y: 63 }, { x: "Aug", y: 58 },
    ]},
    side: {
      title: "Contracts expiring",
      items: [
        { label: "Rwanda Foods · maize supply", value: "18d", tone: "warning" },
        { label: "MINAGRI · fertilizer",        value: "42d" },
      ],
    },
    activity: [
      { title: "Responded to RFQ #4471",          when: "10m ago" },
      { title: "Delivered PO-2201 to East Retail", when: "3h ago" },
    ],
  },
  buyer: {
    greeting: "Discover & buy",
    subtitle: "Marketplace picks and order status.",
    kpis: [
      { label: "Active orders",    value: "6",       delta: "+1",            up: true, icon: "ShoppingCart" },
      { label: "In transit",       value: "3",       delta: "ETA today",     up: true, icon: "MapPin" },
      { label: "Wishlist items",   value: "22",      delta: "5 back in stock",up: true, icon: "Heart" },
      { label: "Spend this month", value: "RWF 3.4M",delta: "-4%",           up: true, icon: "CreditCard" },
    ],
    chart: { kind: "line", title: "Monthly spend", data: range(12, 260, 80) },
    side: {
      title: "Recommended for you",
      items: [
        { label: "Grade A coffee · Musanze",  value: "In stock" },
        { label: "Bulk maize · Kigali Coop",  value: "-8%" },
        { label: "Chili paste · Rwanda Foods",value: "New" },
      ],
    },
    activity: [
      { title: "Order #B-1183 dispatched",          when: "1h ago" },
      { title: "Review submitted for Coffee lot",   when: "yesterday" },
    ],
  },
  retailer: {
    greeting: "Store performance",
    subtitle: "Stock, sales and reorder guidance.",
    kpis: [
      { label: "Today's sales",    value: "RWF 812k", delta: "+9%",    up: true,  icon: "CircleDollarSign" },
      { label: "SKUs low",         value: "14",       delta: "Reorder", up: false, icon: "Boxes" },
      { label: "Suppliers active", value: "22",       delta: "+1",      up: true,  icon: "Handshake" },
      { label: "Refunds",          value: "2",        delta: "-1",      up: true,  icon: "Star" },
    ],
    chart: { kind: "bar", title: "Sales by category", data: [
      { x: "Grains",  y: 320 }, { x: "Produce", y: 210 }, { x: "Dairy", y: 180 },
      { x: "Meat",    y: 140 }, { x: "Dry",     y: 260 },
    ]},
    side: {
      title: "Reorder soon",
      items: [
        { label: "Maize flour 5kg", value: "3 left",  tone: "danger" },
        { label: "Cooking oil 1L",  value: "8 left",  tone: "warning" },
        { label: "Rice 25kg",       value: "12 left" },
      ],
    },
    activity: [
      { title: "Sold 42 units at counter 2",          when: "10m ago" },
      { title: "Received delivery from Supplier #12", when: "2h ago" },
    ],
  },
  warehouse: {
    greeting: "Warehouse control",
    subtitle: "Capacity, incoming and outgoing flow.",
    kpis: [
      { label: "Capacity used",      value: "76%",      delta: "+2pp", up: false, icon: "Building2" },
      { label: "incoming today",      value: "24 trucks",delta: "+4",   up: true,  icon: "PackageOpen" },
      { label: "outgoing today",     value: "18 trucks",delta: "-2",   up: false, icon: "PackageCheck" },
      { label: "Open reservations",  value: "37",       delta: "+6",   up: true,  icon: "ClipboardList" },
    ],
    chart: { kind: "area", title: "Occupancy trend", data: range(30, 65, 25) },
    side: {
      title: "Alerts",
      items: [
        { label: "Cold room 2 · temp high", value: "Check",  tone: "danger" },
        { label: "Bay 4 · booked",          value: "14:00" },
        { label: "5 SKUs near expiry",      value: "Rotate", tone: "warning" },
      ],
    },
    activity: [
      { title: "Received 12t maize from Kigali Coop", when: "20m ago" },
      { title: "Dispatched PO-3341 to Rwanda Foods",  when: "1h ago" },
    ],
  },
  transport: {
    greeting: "Fleet command",
    subtitle: "Vehicles, drivers and today's routes.",
    kpis: [
      { label: "Active vehicles",  value: "42",       delta: "+2",   up: true,  icon: "Truck" },
      { label: "Drivers on shift", value: "38",       delta: "-1",   up: false, icon: "RouteIcon" },
      { label: "Deliveries today", value: "96",       delta: "+8",   up: true,  icon: "PackageCheck" },
      { label: "Fuel efficiency",  value: "6.4 L/100",delta: "-0.2", up: true,  icon: "Fuel" },
    ],
    chart: { kind: "line", title: "Deliveries per hour", data: range(24, 8, 5) },
    side: {
      title: "Maintenance due",
      items: [
        { label: "RAB 214 J · service in 2 days", value: "Book",    tone: "warning" },
        { label: "RAA 108 F · tyre replace",      value: "Overdue", tone: "danger" },
      ],
    },
    activity: [
      { title: "Trip #T-8821 completed",                      when: "8m ago" },
      { title: "Assigned driver Emmanuel to route KGL-MSZ",   when: "1h ago" },
    ],
  },
  driver: {
    greeting: "Ready to roll, Emmanuel",
    subtitle: "Your assigned trips for today.",
    kpis: [
      { label: "Deliveries today", value: "4",       delta: "1 done", up: true, icon: "PackageCheck" },
      { label: "Next stop",        value: "Musanze", delta: "ETA 45m",up: true, icon: "MapPin" },
      { label: "Distance covered", value: "128 km",  delta: "+18",    up: true, icon: "RouteIcon" },
      { label: "Fuel",             value: "72%",     delta: "OK",     up: true,  icon: "Fuel" },
    ],
    chart: { kind: "line", title: "Speed (last hour)", data: range(12, 55, 15) },
    side: {
      title: "Today's stops",
      items: [
        { label: "1 · Pickup · Kigali Coop",  value: "08:30" },
        { label: "2 · Drop · Musanze Store",  value: "10:15" },
        { label: "3 · Drop · Rubavu Retail",  value: "13:00" },
      ],
    },
    activity: [
      { title: "POD uploaded for stop #2", when: "just now" },
      { title: "Started trip #T-8821",     when: "6:45 AM" },
    ],
  },
  bank: {
    greeting: "Finance workspace",
    subtitle: "Applications, risk and portfolio.",
    kpis: [
      { label: "New applications", value: "48",       delta: "+12",   up: true, icon: "ClipboardList" },
      { label: "Approved (30d)",   value: "132",      delta: "+8",    up: true, icon: "ShieldCheck" },
      { label: "Default rate",     value: "2.1%",     delta: "-0.3pp",up: true, icon: "BarChart3" },
      { label: "Portfolio",        value: "RWF 8.4B", delta: "+2.1%", up: true, icon: "CreditCard" },
    ],
    chart: { kind: "area", title: "Loan disbursements", data: range(30, 180, 60) },
    side: {
      title: "High-risk applicants",
      items: [
        { label: "APP-2210 · manufacturer", value: "Review", tone: "danger" },
        { label: "APP-2214 · retailer",     value: "Watch",  tone: "warning" },
      ],
    },
    activity: [
      { title: "Approved APP-2205 · RWF 12M",            when: "30m ago" },
      { title: "Verification completed for buyer group", when: "2h ago" },
    ],
  },
};

