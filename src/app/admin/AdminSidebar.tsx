'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminSignOutAction } from './actions';

const adminNavItems = [
    { href: '/admin/dashboard', icon: '📊', label: 'Overview' },
    { href: '/admin/users', icon: '👥', label: 'Users' },
    { href: '/admin/quests', icon: '⚔️', label: 'Global Quests' },
    { href: '/admin/shop', icon: '🏪', label: 'Shop Items' },
    { href: '/admin/analytics', icon: '📈', label: 'Analytics' },
];

export default function AdminSidebar({ user }: { user?: { name?: string } }) {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex w-[220px] flex-shrink-0 bg-[#0F1118]/90 backdrop-blur-xl border-r border-white/[0.04] flex-col relative z-20 h-screen sticky top-0">
            {/* Logo */}
            <div className="p-5 pb-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-600/25 group-hover:shadow-purple-600/40 transition-all group-hover:scale-105">
                        <span className="text-white text-sm">👑</span>
                    </div>
                    <div className="leading-none">
                        <span className="text-base font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent block">
                            Habitivity
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Admin</span>
                    </div>
                </Link>
            </div>

            {/* Admin User */}
            <div className="px-3 mb-3">
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03]">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 flex items-center justify-center text-sm border border-white/5">
                        👑
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold text-xs truncate">{user?.name || 'Admin'}</p>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-slate-500">Admin • Online</span>
                        </div>
                    </div>
                </div>
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
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                                ${isActive
                                    ? 'bg-purple-600/15 text-white border border-purple-500/20'
                                    : 'text-slate-500 hover:text-white hover:bg-white/[0.03]'
                                }`}
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="p-3 border-t border-white/[0.04]">
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
    );
}
