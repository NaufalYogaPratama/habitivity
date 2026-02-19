import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

async function SignOutButton() {
    return (
        <form
            action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
            }}
        >
            <Button
                variant="ghost"
                type="submit"
                className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/10"
            >
                <span>🚪</span> Sign Out
            </Button>
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
        <div className="min-h-screen bg-[#0f1021] text-white flex overflow-hidden selection:bg-fuchsia-500/30 font-sans">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full" />
            </div>

            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-[#1a1b33]/60 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-10">
                {/* Logo */}
                <div className="p-6 border-b border-white/5">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                            <span className="text-white text-lg font-bold">⚡</span>
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            Habitivity
                        </span>
                    </Link>
                </div>

                {/* User info */}
                <div className="p-4">
                    <Card className="bg-white/5 border-white/10 shadow-none">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 border border-white/5 flex items-center justify-center text-lg">
                                    🧑‍💻
                                </div>
                                <div className="min-w-0 overflow-hidden">
                                    <p className="text-white font-semibold text-sm truncate">{user?.name || 'Hero'}</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs text-slate-400">Lv. 1</span>
                                        <span className="text-xs px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/10">
                                            {user?.role?.toUpperCase() || 'USER'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats mini */}
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: 'HP', value: '100', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                                    { label: 'XP', value: '0', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                                    { label: 'Gold', value: '0', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                                ].map((stat) => (
                                    <div key={stat.label} className={`rounded-lg p-1.5 text-center border border-white/5 ${stat.bg}`}>
                                        <p className={`text-xs font-bold ${stat.color}`}>{stat.value}</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium group"
                        >
                            <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Sign out */}
                <div className="p-4 border-t border-white/5">
                    <SignOutButton />
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {children}
            </main>
        </div>
    );
}
