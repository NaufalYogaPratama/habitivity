'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { adminSignOutAction } from './actions';
import { UserAvatar } from '@/components/ui/UserAvatar';

const adminNavItems = [
    {
        href: '/admin/dashboard',
        icon: <Image src="/assets/logo/icon-home1.png" alt="Dashboard" width={32} height={32} className="object-contain drop-shadow-md" />,
        label: 'Dashboard'
    },

    {
        href: '/admin/users',
        icon: <Image src="/assets/logo/icon-profile.png" alt="Users" width={32} height={32} className="object-contain drop-shadow-md" />,
        label: 'Users'
    },
    {
        href: '/admin/quests',
        icon: <Image src="/assets/logo/icon-quest.png" alt="Global Quests" width={32} height={32} className="object-contain drop-shadow-md" />,
        label: 'Global Quests'
    },
    {
        href: '/admin/shop',
        icon: <Image src="/assets/logo/icon-shop.png" alt="Shop Items" width={32} height={32} className="object-contain drop-shadow-md" />,
        label: 'Shop Items'
    },
    {
        href: '/admin/analytics',
        icon: <Image src="/assets/logo/icon-analytics.png" alt="Analytics" width={32} height={32} className="object-contain drop-shadow-md" />,
        label: 'Analytics'
    },


];

function MobileHeader({ onToggle }: { onToggle: () => void }) {
    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0B0E14]/95 backdrop-blur-xl border-b border-white/[0.04] px-4 py-3 flex items-center justify-between">
            {/* Logo Mobile */}
            <Link href="/admin/dashboard" className="flex flex-col group">
                <div className="flex items-center transition-transform duration-300 group-hover:scale-105">
                    <Image
                        src="/assets/logo/logo-full1.png"
                        alt="Habitivity Logo"
                        width={110}
                        height={28}
                        className="object-contain drop-shadow-lg w-auto h-auto"
                        priority
                    />
                </div>
                <div className="ml-1 mt-0.5 flex items-center gap-1 opacity-80">
                    <span className="text-[8px] font-bold text-fuchsia-400 uppercase tracking-widest">Admin Panel</span>
                    <span className="text-[10px]">👑</span>
                </div>
            </Link>
            <button
                onClick={onToggle}
                className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-white hover:bg-white/[0.08] transition-colors"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </button>
        </div>
    );
}

function AdminSidebar({ user, open, onClose }: { user: any; open: boolean; onClose: () => void }) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay */}
            {open && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:relative z-40
                w-[220px] flex-shrink-0
                bg-[#0F1118]/95 lg:bg-[#0F1118]/90 backdrop-blur-xl
                border-r border-white/[0.04]
                flex flex-col
                h-full
                transition-transform duration-300 ease-in-out
                ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Desktop */}
                <div className="px-7 pt-6 pb-4">
                    <Link href="/admin/dashboard" className="flex flex-col group" onClick={onClose}>
                        <div className="flex items-center transition-transform duration-300 group-hover:scale-105">
                            <Image
                                src="/assets/logo/logo-full1.png"
                                alt="Habitivity Logo"
                                width={120}
                                height={20}
                                className="object-contain drop-shadow-lg w-auto h-auto"
                                priority
                            />
                        </div>
                        {/* Label Admin di bawah logo */}
                        <div className="mt-3 ml-1.5 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-[0.2em]">Admin Panel</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
                    <p className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Menu</p>
                    {adminNavItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                                    ${isActive
                                        ? 'bg-purple-600/15 text-white border border-purple-500/20'
                                        : 'text-slate-500 hover:text-white hover:bg-white/[0.03]'
                                    }`}
                            >
                                <div className="flex items-center justify-center w-6 h-6 text-lg group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="p-3 border-t border-white/[0.04] space-y-2">


                    <form action={adminSignOutAction}>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-start gap-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl h-11 px-3 cursor-pointer transition-colors"
                        >
                            <span className="text-lg">🚪</span>
                            <span className="text-sm font-medium">Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}

export default function AdminLayoutClient({ children, user }: { children: React.ReactNode; user: any }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-[#0B0E14] text-white flex overflow-hidden selection:bg-purple-500/30 font-sans">
            {/* Background Ambient */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-[20%] w-[600px] h-[600px] bg-purple-700/8 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-fuchsia-700/6 blur-[150px] rounded-full" />
            </div>

            {/* Mobile Header */}
            <MobileHeader onToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Sidebar */}
            <AdminSidebar user={user} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto relative z-10 pt-14 lg:pt-0">
                {children}
            </main>
        </div>
    );
}