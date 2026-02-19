import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '@/auth';

async function SignOutButton() {
    return (
        <form
            action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
            }}
        >
            <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all text-sm font-medium cursor-pointer"
            >
                <span>🚪</span> Sign Out
            </button>
        </form>
    );
}

const navItems = [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/dashboard/quests', icon: '⚔️', label: 'Quests' },
    { href: '/dashboard/focus', icon: '🎯', label: 'Focus Arena' },
    { href: '/dashboard/ledger', icon: '💰', label: 'Gold Ledger' },
    { href: '/dashboard/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { href: '/dashboard/shop', icon: '🏪', label: 'Shop' },
    { href: '/dashboard/profile', icon: '👤', label: 'Profile' },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    const user = session.user as { name?: string; role?: string; email?: string };

    return (
        <div className="min-h-screen bg-[#0F172A] flex">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-[#1E293B]/80 border-r border-white/5 flex flex-col">
                {/* Logo */}
                <div className="p-5 border-b border-white/5">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <span className="text-white text-sm font-bold">⚡</span>
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            Habitivity
                        </span>
                    </Link>
                </div>

                {/* User info */}
                <div className="p-4 border-b border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-600/30 border border-white/10 flex items-center justify-center text-lg">
                            🧑‍💻
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{user?.name || 'Hero'}</p>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs text-slate-400">Lv. 1</span>
                                <span className="text-xs px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 font-medium">
                                    {user?.role?.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats mini */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        {[
                            { label: 'HP', value: '100', color: 'text-emerald-400' },
                            { label: 'XP', value: '0', color: 'text-indigo-400' },
                            { label: '💰', value: '0', color: 'text-amber-400' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-slate-900/40 rounded-lg p-2 text-center">
                                <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
                                <p className="text-xs text-slate-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all text-sm font-medium"
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Sign out */}
                <div className="p-3 border-t border-white/5">
                    <SignOutButton />
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
