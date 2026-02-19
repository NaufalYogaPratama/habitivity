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
                className="w-full justify-start gap-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl h-11 px-3 cursor-pointer"
            >
                <span className="text-lg">🚪</span>
                <span className="text-sm font-medium">Sign Out</span>
            </Button>
        </form>
    );
}

const analyticsCards = [
    { icon: '👥', label: 'Total Users', value: '—', sub: '+0 this week', color: 'text-purple-400', gradient: 'from-purple-500/20 via-purple-600/10 to-transparent', border: 'border-purple-500/15' },
    { icon: '⏱️', label: 'Focus Hours', value: '—', sub: 'All users combined', color: 'text-emerald-400', gradient: 'from-emerald-500/20 via-emerald-600/10 to-transparent', border: 'border-emerald-500/15' },
    { icon: '⚔️', label: 'Quests Done', value: '—', sub: 'All time total', color: 'text-amber-400', gradient: 'from-amber-500/20 via-amber-600/10 to-transparent', border: 'border-amber-500/15' },
    { icon: '💰', label: 'Gold Earned', value: '—', sub: 'Community total', color: 'text-fuchsia-400', gradient: 'from-fuchsia-500/20 via-fuchsia-600/10 to-transparent', border: 'border-fuchsia-500/15' },
];

const adminNavItems = [
    { href: '/admin/dashboard', icon: '📊', label: 'Overview', active: true },
    { href: '/admin/users', icon: '👥', label: 'Users' },
    { href: '/admin/quests', icon: '⚔️', label: 'Global Quests' },
    { href: '/admin/shop', icon: '🏪', label: 'Shop Items' },
    { href: '/admin/analytics', icon: '📈', label: 'Analytics' },
];

const recentUsers = [
    { name: 'ShadowBlade', email: 'shadow@mail.com', level: 28, status: 'online' },
    { name: 'ZenMaster', email: 'zen@mail.com', level: 25, status: 'online' },
    { name: 'CodeNinja', email: 'ninja@mail.com', level: 22, status: 'offline' },
    { name: 'PixelArt', email: 'pixel@mail.com', level: 18, status: 'online' },
];

const systemLogs = [
    { action: 'User registered', detail: 'ShadowBlade joined', time: '2m ago', icon: '🆕' },
    { action: 'Quest completed', detail: '5K Runner by ZenMaster', time: '5m ago', icon: '✅' },
    { action: 'Shop purchase', detail: 'Dark Sword by CodeNinja', time: '12m ago', icon: '🛒' },
    { action: 'Level up', detail: 'PixelArt reached Lv.18', time: '18m ago', icon: '⬆️' },
    { action: 'Focus session', detail: '45min by ShadowBlade', time: '25m ago', icon: '🎯' },
];

export default async function AdminDashboardPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const user = session.user as { name?: string; role?: string; email?: string };
    if (user?.role !== 'admin') redirect('/dashboard');

    return (
        <div className="min-h-screen bg-[#0B0E14] text-white flex overflow-hidden selection:bg-purple-500/30 font-sans">
            {/* Background Ambient */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-[20%] w-[600px] h-[600px] bg-purple-700/8 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-fuchsia-700/6 blur-[150px] rounded-full" />
            </div>

            {/* Admin Sidebar */}
            <aside className="w-[220px] flex-shrink-0 bg-[#0F1118]/90 backdrop-blur-xl border-r border-white/[0.04] flex flex-col relative z-10">
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
                            <p className="text-white font-semibold text-xs truncate">{user?.name}</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-slate-500">Admin • Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                    <p className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Menu</p>
                    {adminNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
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

                {/* Bottom */}
                <div className="p-3 border-t border-white/[0.04]">
                    <AdminSignOut />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10">
                <div className="flex">
                    {/* Center Feed */}
                    <div className="flex-1 p-6 space-y-7 max-w-[calc(100%-320px)]">
                        {/* Top Bar */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2.5">
                                    <span>📊</span> Admin Dashboard
                                </h1>
                                <p className="text-slate-500 text-sm mt-1">
                                    Welcome back, <span className="text-white font-medium">{user?.name}</span>
                                </p>
                            </div>
                            <div className="flex gap-2.5">
                                <Button variant="outline" size="sm" className="bg-[#151823] border-white/[0.06] text-white hover:bg-white/5 rounded-xl">
                                    <span>📅</span> Last 7 Days
                                </Button>
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 border-none rounded-xl">
                                    <span>📥</span> Export
                                </Button>
                            </div>
                        </div>

                        {/* Analytics Cards */}
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                            {analyticsCards.map((card) => (
                                <Card key={card.label} className={`bg-gradient-to-br ${card.gradient} bg-[#151823] border ${card.border} hover:border-purple-500/20 transition-all group hover:-translate-y-0.5 duration-200`}>
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-2xl">{card.icon}</span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{card.sub}</span>
                                        </div>
                                        <div className={`text-3xl font-bold ${card.color} mb-1`}>{card.value}</div>
                                        <p className="text-slate-400 text-xs font-medium">{card.label}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Platform Activity + Quick Actions */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Platform Activity */}
                            <Card className="lg:col-span-2 bg-[#151823] border-white/[0.06]">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.04] pb-4">
                                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                                        <span>🚀</span> Platform Activity
                                    </CardTitle>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live</span>
                                </CardHeader>
                                <CardContent className="p-6 space-y-5">
                                    {[
                                        { label: 'Quest Completion Rate', value: '—', color: 'bg-purple-500', width: '0%' },
                                        { label: 'Daily Active Users', value: '—', color: 'bg-emerald-500', width: '0%' },
                                        { label: 'Avg Focus Session', value: '— min', color: 'bg-amber-500', width: '0%' },
                                    ].map((item) => (
                                        <div key={item.label}>
                                            <div className="flex justify-between text-xs mb-2">
                                                <span className="text-slate-400 font-medium">{item.label}</span>
                                                <span className="text-white font-bold">{item.value}</span>
                                            </div>
                                            <div className="h-2 bg-[#0B0E14] rounded-full overflow-hidden border border-white/[0.03]">
                                                <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: item.width }} />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-3 flex items-center justify-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                        <p className="text-[10px] text-slate-500 font-medium">Real-time data visualization coming soon</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="bg-[#151823] border-white/[0.06]">
                                <CardHeader className="border-b border-white/[0.04] pb-4">
                                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                                        <span>⚡</span> Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-2">
                                    {[
                                        { icon: '⚔️', label: 'Create Quest', desc: 'Push global quest', href: '/admin/quests/new', hover: 'hover:border-purple-500/20' },
                                        { icon: '🏪', label: 'Add Item', desc: 'New shop item', href: '/admin/shop/new', hover: 'hover:border-emerald-500/20' },
                                        { icon: '👥', label: 'Manage Users', desc: 'View user DB', href: '/admin/users', hover: 'hover:border-blue-500/20' },
                                        { icon: '📢', label: 'Broadcast', desc: 'Send alerts', href: '/admin/announcements', hover: 'hover:border-amber-500/20' },
                                    ].map((action) => (
                                        <Link
                                            key={action.label}
                                            href={action.href}
                                            className={`flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] ${action.hover} transition-all group hover:-translate-x-0.5 duration-200`}
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-[#0B0E14] flex items-center justify-center text-lg border border-white/[0.04]">
                                                {action.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-xs font-bold">{action.label}</p>
                                                <p className="text-slate-500 text-[10px]">{action.desc}</p>
                                            </div>
                                            <span className="text-slate-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                        </Link>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* System Status */}
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                            {[
                                { label: 'Database', status: 'Connected', icon: '🟢', color: 'text-emerald-400' },
                                { label: 'AI Service', status: 'Ready', icon: '🟡', color: 'text-amber-400' },
                                { label: 'Auth', status: 'Active', icon: '🟢', color: 'text-emerald-400' },
                                { label: 'API', status: 'Healthy', icon: '🟢', color: 'text-emerald-400' },
                            ].map((sys) => (
                                <div key={sys.label} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#151823] border border-white/[0.06]">
                                    <span className="text-sm animate-pulse">{sys.icon}</span>
                                    <div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{sys.label}</p>
                                        <p className={`text-xs font-bold ${sys.color}`}>{sys.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-[320px] flex-shrink-0 border-l border-white/[0.04] bg-[#0F1118]/60 backdrop-blur-xl p-5 space-y-6 overflow-y-auto hidden xl:block">
                        {/* Admin Stats */}
                        <div>
                            <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                                <span>📊</span> Overview
                            </h3>
                            <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/30 border border-purple-500/15 rounded-2xl p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Online', value: '—', color: 'text-emerald-400' },
                                        { label: 'New Today', value: '—', color: 'text-purple-400' },
                                        { label: 'Revenue', value: '—', color: 'text-amber-400' },
                                        { label: 'Quests', value: '—', color: 'text-fuchsia-400' },
                                    ].map((s) => (
                                        <div key={s.label} className="bg-black/20 rounded-xl p-3 text-center border border-white/[0.03]">
                                            <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
                                            <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* Mini chart */}
                                <div className="flex items-end gap-1 h-14 pt-2">
                                    {[20, 35, 25, 45, 30, 55, 40, 60, 50, 45, 65, 55].map((h, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-purple-500/30 hover:bg-purple-500/50 rounded-t transition-colors cursor-pointer"
                                            style={{ height: `${h}%` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/[0.04]" />

                        {/* Recent Users */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-sm text-white">Recent Users</h3>
                                <Link href="/admin/users" className="text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider">See All</Link>
                            </div>
                            <div className="space-y-2">
                                {recentUsers.map((u) => (
                                    <div key={u.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center text-xs border border-white/5">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-xs font-semibold truncate">{u.name}</p>
                                            <p className="text-slate-600 text-[10px] truncate">{u.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-purple-400 text-[10px] font-bold">Lv.{u.level}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'online' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                                                <span className="text-slate-500 text-[9px]">{u.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-white/[0.04]" />

                        {/* System Logs */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-sm text-white">System Logs</h3>
                                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Live</span>
                            </div>
                            <div className="space-y-2">
                                {systemLogs.map((log, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
                                        <span className="text-sm mt-0.5">{log.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs">
                                                <span className="text-white font-semibold">{log.action}</span>
                                            </p>
                                            <p className="text-slate-500 text-[10px]">{log.detail}</p>
                                            <p className="text-slate-600 text-[9px] mt-0.5">{log.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
