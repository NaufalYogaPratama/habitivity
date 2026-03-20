'use client';



import { useState } from 'react';

import Link from 'next/link';

import Image from 'next/image';

import { Button } from '@/components/ui/button';

import { usePathname } from 'next/navigation';





const navItems = [

    {

        href: '/dashboard',

        icon: <Image src="/assets/logo/icon-home1.png" alt="Home" width={32} height={32} className="object-contain" />,

        label: 'Home'

    },
    {

        href: '/dashboard/quests',

        icon: <Image src="/assets/logo/icon-quest.png" alt="Quests" width={32} height={32} className="object-contain" />,

        label: 'Quests'

    },
    {

        href: '/dashboard/focus',

        icon: <Image src="/assets/logo/icon-fokus.png" alt="Focus Arena" width={32} height={32} className="object-contain" />,

        label: 'Focus Arena'

    },
    {

        href: '/dashboard/ledger',

        icon: <Image src="/assets/logo/icon-gold.png" alt="Gold Ledger" width={32} height={32} className="object-contain" />,

        label: 'Gold Ledger'

    },
    {

        href: '/dashboard/leaderboard',

        icon: <Image src="/assets/logo/icon-leaderboard.png" alt="Leaderboard" width={32} height={32} className="object-contain" />,

        label: 'Leaderboard'

    },
    {

        href: '/dashboard/shop',

        icon: <Image src="/assets/logo/icon-shop.png" alt="Shop" width={32} height={32} className="object-contain" />,

        label: 'Shop'

    },
    {

        href: '/dashboard/avatar',

        icon: <Image src="/assets/logo/icon-nft.png" alt="NFT Avatar" width={32} height={32} className="object-contain" />,

        label: 'NFT Avatar'

    },


    {

        href: '/dashboard/teams',

        icon: <Image src="/assets/logo/icon-clans.png" alt="Teams" width={32} height={32} className="object-contain" />,

        label: 'Teams'

    },
    {

        href: '/dashboard/profile',

        icon: <Image src="/assets/logo/icon-profile.png" alt="Profile" width={32} height={32} className="object-contain" />,

        label: 'Profile'

    },


];

function MobileHeader({ onToggle }: { onToggle: () => void }) {
    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0B0E14]/95 backdrop-blur-xl border-b border-white/[0.04] px-4 py-3 flex items-center justify-between">
            {/* Logo Mobile */}
            <Link href="/dashboard" className="flex items-center group">
                <div className="flex items-center transition-transform duration-300 group-hover:scale-105">
                    <Image
                        src="/assets/logo/logo-full1.png"
                        alt="Habitivity Logo"
                        width={110}
                        height={28}
                        className="object-contain drop-shadow-lg h-auto"
                        priority
                    />
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

function Sidebar({ user, open, onClose }: { user: { name?: string; email?: string }; open: boolean; onClose: () => void }) {
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
                    <Link href="/dashboard" className="flex items-center group" onClick={onClose}>
                        <div className="flex items-center transition-transform duration-300 group-hover:scale-105">
                            <Image
                                src="/assets/logo/logo-full1.png"
                                alt="Habitivity Logo"
                                width={120}
                                height={20}
                                className="object-contain drop-shadow-lg h-auto"
                                priority
                            />
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = item.href === '/dashboard'
                            ? pathname === '/dashboard'
                            : pathname.startsWith(item.href);

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
                                <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Card Bottom */}
                <div className="p-3 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] mb-1">

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
