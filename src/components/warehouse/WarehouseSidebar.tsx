'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useDashboard';
import {
    Home,
    Building2,
    Plus,
    Package,
    Layers,
    LogIn,
    LogOut,
    BookOpen,
    CheckCircle,
    Truck,
    BarChart3,
    MessageSquare,
    Bell,
    User,
    Settings,
    } from 'lucide-react';

    const sidebarItems = [
    {
        label: 'Dashboard',
        href: '/warehouse/dashboard',
        icon: Home,
    },
    {
        label: 'My Warehouses',
        href: '/warehouse/facilities',
        icon: Building2,
    },
    {
        label: 'Add Warehouse',
        href: '/warehouse/facilities/add',
        icon: Plus,
    },
    {
        label: 'Stored Products',
        href: '/warehouse/products',
        icon: Package,
    },
    {
        label: 'Warehouse Batches',
        href: '/warehouse/batches',
        icon: Layers,
    },
    {
        label: 'Incoming Goods',
        href: '/warehouse/incoming',
        icon: LogIn,
    },
    {
        label: 'Outgoing Goods',
        href: '/warehouse/outgoing',
        icon: LogOut,
    },
    {
        label: 'Loading Schedule',
        href: '/warehouse/schedules',
        icon: BookOpen,
    },
    {
        label: 'Storage Requests',
        href: '/warehouse/requests',
        icon: BookOpen,
    },
    {
        label: 'Reservations',
        href: '/warehouse/reservations',
        icon: CheckCircle,
    },
    {
        label: 'Transport',
        href: '/warehouse/transport',
        icon: Truck,
    },
    {
        label: 'Analytics',
        href: '/warehouse/analytics',
        icon: BarChart3,
    },
    {
        label: 'Messages',
        href: '/warehouse/messages',
        icon: MessageSquare,
    },
    {
        label: 'Notifications',
        href: '/warehouse/notifications',
        icon: Bell,
    },
    {
        label: 'Profile',
        href: '/warehouse/profile',
        icon: User,
    },
    {
        label: 'Settings',
        href: '/warehouse/settings',
        icon: Settings,
    },
    ];

    export function WarehouseSidebar() {
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <div className="h-full flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
            </div>
            <div>
                <h1 className="font-bold text-lg text-slate-900 dark:text-white">RSCN</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Warehouse Portal</p>
            </div>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
                <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
                </Link>
            );
            })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'W'}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Warehouse
                </p>
            </div>
            </div>
        </div>
        </div>
    );
}
