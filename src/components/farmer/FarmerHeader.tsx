'use client';

import { useState } from 'react';
import { useAuth, useNotifications, useMessages } from '@/hooks/useDashboard';
import { Bell, Mail, LogOut, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function FarmerHeader() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { getUnreadCount: getUnreadNotifications } = useNotifications();
    const { getUnreadCount: getUnreadMessages } = useMessages();
    const [showMenu, setShowMenu] = useState(false);

    const unreadNotifications = user?.id ? getUnreadNotifications(user.id) : 0;
    const unreadMessages = user?.id ? getUnreadMessages(user.id) : 0;

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    return (
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between h-16 px-8">
            {/* Greeting */}
            <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Good morning, {user?.name?.split(' ')[0]}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your farm production and connect with buyers.
            </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
            {/* Notifications */}
            <button
                onClick={() => router.push('/farmer/notifications')}
                className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
                )}
            </button>

            {/* Messages */}
            <button
                onClick={() => router.push('/farmer/messages')}
                className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
                <Mail className="w-5 h-5" />
                {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
                )}
            </button>

            {/* User Menu */}
            <div className="relative">
                <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                {showMenu ? (
                    <X className="w-5 h-5" />
                ) : (
                    <Menu className="w-5 h-5" />
                )}
                </button>

                {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <p className="font-medium text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                    <button
                    onClick={() => router.push('/farmer/profile')}
                    className="w-full text-left px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                    Profile Settings
                    </button>
                    <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                    <LogOut className="w-4 h-4" />
                    Logout
                    </button>
                </div>
                )}
            </div>
            </div>
        </div>
        </header>
    );
}
