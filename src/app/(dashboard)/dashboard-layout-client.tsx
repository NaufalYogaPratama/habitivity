'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const navItems = [
    { href: '/dashboard', icon: '🏠', label: 'Home', active: true },
    { href: '/dashboard/quests', icon: '⚔️', label: 'Quests' },
    { href: '/dashboard/focus', icon: '🎯', label: 'Focus Arena' },
    { href: '/dashboard/ledger', icon: '💰', label: 'Gold Ledger' },
    { href: '/dashboard/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { href: '/dashboard/shop', icon: '🏪', label: 'Shop' },
    { href: '/dashboard/profile', icon: '👤', label: 'Profile' },
];

function MobileHeader({ onToggle }: { onToggle: () => void }) {
    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0B0E14]/95 backdrop-blur-xl border-b border-white/[0.04] px-4 py-3 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-600/25">
                    <span className="text-white text-xs font-black">⚡</span>
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Habitivity
                </span>
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

function Sidebar({ user, open, onClose }: { user: { name?: string; email?: string }; open: boolean; onClose: () => void }) {
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
                {/* Logo */}
                <div className="p-5 pb-6">
                    <Link href="/dashboard" className="flex items-center gap-2.5 group" onClick={onClose}>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-600/25 group-hover:shadow-purple-600/40 transition-all group-hover:scale-105">
                            <span className="text-white text-sm font-black">⚡</span>
                        </div>
                        <span className="text-base font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                            Habitivity
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                                ${item.active
                                    ? 'bg-purple-600/15 text-white border border-purple-500/20'
                                    : 'text-slate-500 hover:text-white hover:bg-white/[0.03]'
                                }`}
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User Card Bottom */}
                <div className="p-3 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] mb-1">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 flex items-center justify-center text-sm border border-white/5">
                            🧑‍💻
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-white font-semibold text-xs truncate">{user?.name || 'Hero'}</p>
                            <p className="text-slate-500 text-[10px] truncate">{user?.email}</p>
                        </div>
                    </div>
                    <SignOutForm />
                </div>
            </aside>
        </>
    );
}

function SignOutForm() {
    const handleSignOut = async () => {
        const { signOut } = await import('next-auth/react');
        await signOut({ callbackUrl: '/' });
    };

    return (
        <Button
            variant="ghost"
            type="button"
            onClick={handleSignOut}
            className="w-full justify-start gap-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl h-11 px-3 cursor-pointer"
        >
            <span className="text-lg">🚪</span>
            <span className="text-sm font-medium">Sign Out</span>
        </Button>
    );
}

export default function DashboardLayoutClient({ children, user }: { children: React.ReactNode; user: { name?: string; email?: string } }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-[#0B0E14] text-white flex overflow-hidden selection:bg-purple-500/30 font-sans">
            {/* Background Ambient */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-[20%] w-[600px] h-[600px] bg-purple-700/8 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-fuchsia-700/6 blur-[150px] rounded-full" />
                <div className="absolute top-[40%] left-0 w-[400px] h-[400px] bg-indigo-700/5 blur-[120px] rounded-full" />
            </div>

            {/* Mobile Header */}
            <MobileHeader onToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Sidebar */}
            <Sidebar user={user} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto relative z-10 pt-14 lg:pt-0">
                {children}
            </main>
        </div>
    );
}
