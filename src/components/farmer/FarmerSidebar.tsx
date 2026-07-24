'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useDashboard';
import {
    Home,
    Package,
    Plus,
    Layers,
    BarChart3,
    Zap,
    ShoppingCart,
    FileText,
    Truck,
    Droplet,
    TrendingUp,
    MessageSquare,
    Bell,
    User,
    Settings,
    Sprout,
    } from 'lucide-react';

    const sidebarItems = [
    {
        label: 'Dashboard',
        href: '/farmer/dashboard',
        icon: Home,
    },
    {
        label: 'My Products',
        href: '/farmer/products',
        icon: Package,
    },
    {
        label: 'Add Product',
        href: '/farmer/products/add',
        icon: Plus,
    },
    {
        label: 'Warehouse Batches',
        href: '/farmer/batches',
        icon: Layers,
    },
    {
        label: 'Inventory',
        href: '/farmer/inventory',
        icon: BarChart3,
    },
    {
        label: 'Orders',
        href: '/farmer/orders',
        icon: ShoppingCart,
    },
    {
        label: 'Transport Requests',
        href: '/farmer/transport',
        icon: Truck,
    },
    {
        label: 'Market Prices',
        href: '/farmer/prices',
        icon: Droplet,
    },
    {
        label: 'Analytics',
        href: '/farmer/analytics',
        icon: TrendingUp,
    },
    {
        label: 'Messages',
        href: '/farmer/messages',
        icon: MessageSquare,
    },
    {
        label: 'Notifications',
        href: '/farmer/notifications',
        icon: Bell,
    },
    {
        label: 'Profile',
        href: '/farmer/profile',
        icon: User,
    },
    {
        label: 'Settings',
        href: '/farmer/settings',
        icon: Settings,
    },
    ];

    export function FarmerSidebar() {
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <div className="h-full flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Sprout className="h-5 w-5 text-white" />
            </div>
            <div>
                <h1 className="font-bold text-lg text-slate-900 dark:text-white">RSCN</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Farmer Portal</p>
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
                {user?.name?.charAt(0) || 'F'}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Farmer
                </p>
            </div>
            </div>
        </div>
        </div>
    );
}
