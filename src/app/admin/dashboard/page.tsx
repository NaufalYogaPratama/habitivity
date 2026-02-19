import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { signOut } from '@/auth';
import Link from 'next/link';

async function AdminSignOut() {
    return (
        <form
            action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
            }}
        >
            <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/60 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-sm font-medium cursor-pointer"
            >
                <span>🚪</span> Sign Out
            </button>
        </form>
    );
}

const analyticsCards = [
    { icon: '👥', label: 'Total Users', value: '—', sub: 'Registered heroes', color: 'from-indigo-500/20 to-violet-600/20', border: 'border-indigo-500/20', text: 'text-indigo-400' },
    { icon: '⏱️', label: 'Focus Hours', value: '—', sub: 'Total across all users', color: 'from-emerald-500/20 to-teal-600/20', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    { icon: '⚔️', label: 'Quests Completed', value: '—', sub: 'All time', color: 'from-amber-500/20 to-orange-600/20', border: 'border-amber-500/20', text: 'text-amber-400' },
    { icon: '💰', label: 'Gold Earned', value: '—', sub: 'Community total', color: 'from-violet-500/20 to-purple-600/20', border: 'border-violet-500/20', text: 'text-violet-400' },
];

const adminNavItems = [
    { href: '/admin/dashboard', icon: '📊', label: 'Overview' },
    { href: '/admin/users', icon: '👥', label: 'Users' },
    { href: '/admin/quests', icon: '⚔️', label: 'Global Quests' },
    { href: '/admin/shop', icon: '🏪', label: 'Shop Items' },
    { href: '/admin/analytics', icon: '📈', label: 'Analytics' },
];

export default async function AdminDashboardPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const user = session.user as { name?: string; role?: string };
    if (user?.role !== 'admin') redirect('/dashboard');

    return (
        <div className="min-h-screen bg-[#0F172A] flex">
            {/* Admin Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-[#1E293B]/80 border-r border-white/5 flex flex-col">
                <div className="p-5 border-b border-white/5">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <span className="text-white text-sm">👑</span>
                        </div>
                        <div>
                            <span className="text-base font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent block leading-none">
                                Habitivity
                            </span>
                            <span className="text-xs text-slate-500">Admin Panel</span>
                        </div>
                    </Link>
                </div>

                <div className="p-4 border-b border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-600/30 flex items-center justify-center text-lg">
                            👑
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm">{user?.name}</p>
                            <span className="text-xs px-1.5 py-0.5 rounded-md bg-violet-500/30 text-violet-300 font-medium">ADMIN</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-3 space-y-0.5">
                    {adminNavItems.map((item) => (
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

                <div className="p-3 border-t border-white/5">
                    <AdminSignOut />
                </div>
            </aside>

            {/* Admin Main */}
            <main className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span>📊</span> Admin Dashboard
                        </h1>
                        <p className="text-slate-400 mt-1">Habitivity platform overview & analytics</p>
                    </div>
                    <AdminSignOut />
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {analyticsCards.map((card) => (
                        <div
                            key={card.label}
                            className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-5 backdrop-blur-sm`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl">{card.icon}</span>
                                <span className={`text-2xl font-bold ${card.text}`}>{card.value}</span>
                            </div>
                            <p className="text-white font-semibold text-sm">{card.label}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{card.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Platform Impact */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>🚀</span> Platform Impact
                        </h2>
                        <div className="space-y-4">
                            {[
                                { label: 'Quest Completion Rate', value: '—', color: 'bg-indigo-500' },
                                { label: 'Daily Active Users', value: '—', color: 'bg-emerald-500' },
                                { label: 'Avg Focus Session', value: '— min', color: 'bg-amber-500' },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400">{item.label}</span>
                                        <span className="text-white font-medium">{item.value}</span>
                                    </div>
                                    <div className="h-2 bg-slate-700/50 rounded-full">
                                        <div className={`h-full w-0 ${item.color} rounded-full`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>⚡</span> Admin Actions
                        </h2>
                        <div className="space-y-2">
                            {[
                                { icon: '⚔️', label: 'Create Global Quest', desc: 'Push quest to all users', href: '/admin/quests/new' },
                                { icon: '🏪', label: 'Add Shop Item', desc: 'Add new NFT item', href: '/admin/shop/new' },
                                { icon: '👥', label: 'Manage Users', desc: 'View & manage all users', href: '/admin/users' },
                                { icon: '📢', label: 'Announcements', desc: 'Send platform updates', href: '/admin/announcements' },
                            ].map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 border border-white/5 hover:bg-slate-700/60 transition-all group"
                                >
                                    <span className="text-xl">{action.icon}</span>
                                    <div>
                                        <p className="text-white text-sm font-medium group-hover:text-indigo-300 transition-colors">{action.label}</p>
                                        <p className="text-slate-500 text-xs">{action.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>🔧</span> System Status
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { label: 'Database', status: 'Connected', icon: '🟢' },
                            { label: 'AI Service', status: 'Ready', icon: '🟡' },
                            { label: 'Auth', status: 'Active', icon: '🟢' },
                            { label: 'API', status: 'Healthy', icon: '🟢' },
                        ].map((sys) => (
                            <div key={sys.label} className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/40 border border-white/5">
                                <span className="text-sm">{sys.icon}</span>
                                <div>
                                    <p className="text-white text-xs font-medium">{sys.label}</p>
                                    <p className="text-slate-500 text-xs">{sys.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
