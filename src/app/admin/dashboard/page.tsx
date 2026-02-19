import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { signOut } from '@/auth';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

async function AdminSignOut() {
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
                className="text-slate-400 hover:text-white hover:bg-white/10"
            >
                <span>🚪</span> Sign Out
            </Button>
        </form>
    );
}

const analyticsCards = [
    { icon: '👥', label: 'Total Users', value: '—', sub: 'Registered heroes', color: 'from-indigo-500/10 to-violet-600/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
    { icon: '⏱️', label: 'Focus Hours', value: '—', sub: 'Total across all users', color: 'from-emerald-500/10 to-teal-600/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    { icon: '⚔️', label: 'Quests Completed', value: '—', sub: 'All time', color: 'from-amber-500/10 to-orange-600/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    { icon: '💰', label: 'Gold Earned', value: '—', sub: 'Community total', color: 'from-violet-500/10 to-purple-600/10', border: 'border-violet-500/20', text: 'text-violet-400' },
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
        <div className="min-h-screen bg-[#0f1021] text-white flex overflow-hidden selection:bg-fuchsia-500/30 font-sans">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[120px] rounded-full" />
            </div>

            {/* Admin Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-[#1a1b33]/60 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-10">
                <div className="p-6 border-b border-white/5">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all">
                            <span className="text-white text-lg">👑</span>
                        </div>
                        <div>
                            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 block leading-none">
                                Habitivity
                            </span>
                            <span className="text-xs text-slate-500 font-medium">Admin Panel</span>
                        </div>
                    </Link>
                </div>

                <div className="p-4">
                    <Card className="bg-white/5 border-white/10 shadow-none">
                        <CardContent className="p-3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center text-lg border border-white/5">
                                👑
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs text-slate-400">Online</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
                    {adminNavItems.map((item) => (
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

                <div className="p-4 border-t border-white/5">
                    <AdminSignOut />
                </div>
            </aside>

            {/* Admin Main */}
            <main className="flex-1 p-8 space-y-8 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <span>📊</span> Dashboard
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Welcome back, <span className="text-white font-medium">{user?.name}</span>. Here's what's happening today.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                            <span>📅</span> Last 7 Days
                        </Button>
                        <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20 border-none">
                            <span>📥</span> Export Report
                        </Button>
                    </div>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {analyticsCards.map((card) => (
                        <Card key={card.label} className={`bg-gradient-to-br ${card.color} border ${card.border} backdrop-blur-sm shadow-sm`}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${card.text}`}>
                                        <span className="text-2xl">{card.icon}</span>
                                    </div>
                                    {/* <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">+12%</span> */}
                                </div>
                                <div>
                                    <div className={`text-2xl font-bold text-white mb-1`}>{card.value}</div>
                                    <p className="text-slate-400 text-sm font-medium">{card.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Platform Impact & Admin Actions */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Platform Impact */}
                    <Card className="lg:col-span-2 bg-[#1a1b33]/60 border-white/5 backdrop-blur-xl">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                <span>🚀</span> Platform Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-6">
                            <div className="space-y-6">
                                {[
                                    { label: 'Quest Completion Rate', value: '—', color: 'bg-indigo-500', width: '0%' },
                                    { label: 'Daily Active Users', value: '—', color: 'bg-emerald-500', width: '0%' },
                                    { label: 'Avg Focus Session', value: '— min', color: 'bg-amber-500', width: '0%' },
                                ].map((item) => (
                                    <div key={item.label}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400 font-medium">{item.label}</span>
                                            <span className="text-white font-bold">{item.value}</span>
                                        </div>
                                        <div className="h-2.5 bg-slate-800/50 rounded-full overflow-hidden">
                                            <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: item.width }} />
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 flex items-center justify-center">
                                    <p className="text-xs text-slate-500">Real-time data visualization coming soon</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="bg-[#1a1b33]/60 border-white/5 backdrop-blur-xl">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                <span>⚡</span> Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-3">
                            {[
                                { icon: '⚔️', label: 'Create Quest', desc: 'Push global quest', href: '/admin/quests/new', color: 'hover:bg-violet-500/10 hover:border-violet-500/20' },
                                { icon: '🏪', label: 'Add Item', desc: 'New shop item', href: '/admin/shop/new', color: 'hover:bg-emerald-500/10 hover:border-emerald-500/20' },
                                { icon: '👥', label: 'Manage Users', desc: 'View user DB', href: '/admin/users', color: 'hover:bg-blue-500/10 hover:border-blue-500/20' },
                                { icon: '📢', label: 'Broadcast', desc: 'Send alerts', href: '/admin/announcements', color: 'hover:bg-amber-500/10 hover:border-amber-500/20' },
                            ].map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className={`flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 ${action.color} transition-all group`}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#0f1021] flex items-center justify-center text-xl shadow-inner">
                                        {action.icon}
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold group-hover:text-white transition-colors">{action.label}</p>
                                        <p className="text-slate-500 text-xs">{action.desc}</p>
                                    </div>
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                                        →
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* System Status - Mini Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Database', status: 'Connected', icon: '🟢', color: 'text-emerald-400' },
                        { label: 'AI Service', status: 'Ready', icon: '🟡', color: 'text-amber-400' },
                        { label: 'Auth', status: 'Active', icon: '🟢', color: 'text-emerald-400' },
                        { label: 'API', status: 'Healthy', icon: '🟢', color: 'text-emerald-400' },
                    ].map((sys) => (
                        <Card key={sys.label} className="bg-[#1a1b33]/40 border-white/5">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="text-lg animate-pulse">{sys.icon}</div>
                                <div>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{sys.label}</p>
                                    <p className={`text-sm font-bold ${sys.color}`}>{sys.status}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
