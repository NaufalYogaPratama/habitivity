import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statCards = [
    { icon: '❤️', label: 'HP', value: 100, max: 100, color: 'from-emerald-500/10 to-emerald-600/10', border: 'border-emerald-500/20', text: 'text-emerald-400', bar: 'bg-emerald-500' },
    { icon: '⚡', label: 'XP', value: 0, max: 1000, color: 'from-indigo-500/10 to-violet-600/10', border: 'border-indigo-500/20', text: 'text-indigo-400', bar: 'bg-indigo-500' },
    { icon: '💰', label: 'Gold', value: 0, max: null, color: 'from-amber-500/10 to-orange-600/10', border: 'border-amber-500/20', text: 'text-amber-400', bar: null },
    { icon: '⭐', label: 'Level', value: 1, max: null, color: 'from-violet-500/10 to-purple-600/10', border: 'border-violet-500/20', text: 'text-violet-400', bar: null },
];

const quickActions = [
    { icon: '⚔️', label: 'New Quest', desc: 'Add a new task', href: '/dashboard/quests', color: 'bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20' },
    { icon: '🎯', label: 'Focus Now', desc: 'Start a session', href: '/dashboard/focus', color: 'bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20' },
    { icon: '💸', label: 'Log Expense', desc: 'Track spending', href: '/dashboard/ledger', color: 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20' },
    { icon: '🏆', label: 'Leaderboard', desc: 'See rankings', href: '/dashboard/leaderboard', color: 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20' },
];

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const user = session.user as { name?: string; email?: string; role?: string };

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{user?.name || 'Hero'}</span>! 👋
                    </h1>
                    <p className="text-slate-400 mt-1">Ready to level up today? Your streak is waiting.</p>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
                    <span className="text-amber-400 text-2xl">🔥</span>
                    <div>
                        <p className="text-amber-400 font-bold text-lg leading-none">0 days</p>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Streak</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <Card key={stat.label} className={`bg-gradient-to-br ${stat.color} border ${stat.border} backdrop-blur-sm shadow-sm`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-3xl">{stat.icon}</span>
                                <span className={`text-3xl font-bold ${stat.text}`}>{stat.value}</span>
                            </div>
                            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                            {stat.bar && stat.max && (
                                <div className="mt-3 h-2 bg-slate-900/50 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className={`h-full ${stat.bar} rounded-full transition-all duration-1000`}
                                        style={{ width: `${(stat.value / stat.max) * 100}%` }}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>⚡</span> Quick Actions
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                        >
                            <Card className={`${action.color} border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer h-full`}>
                                <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                                    <span className="text-3xl mb-1">{action.icon}</span>
                                    <div>
                                        <p className="text-white font-bold text-sm">{action.label}</p>
                                        <p className="text-slate-400 text-xs">{action.desc}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Active Quests & AI Status */}
            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 bg-[#1a1b33]/60 border-white/5 backdrop-blur-xl">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                            <span>⚔️</span> Active Quests
                        </CardTitle>
                        <Link href="/dashboard/quests" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">View all →</Link>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[240px]">
                        <span className="text-5xl mb-4 opacity-50">🗺️</span>
                        <p className="text-slate-300 font-medium">No active quests</p>
                        <p className="text-slate-500 text-sm mt-1 max-w-xs">You haven't started any quests yet. Create one to begin your journey!</p>
                        <Link
                            href="/dashboard/quests"
                            className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
                        >
                            + Create Quest
                        </Link>
                    </CardContent>
                </Card>

                <Card className="bg-[#1a1b33]/60 border-white/5 backdrop-blur-xl">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                            <span>📊</span> AI Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {[
                            { label: 'Productivity', status: 'Steady 🔥', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                            { label: 'Finance', status: 'Balanced ⚖️', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                            { label: 'Motivation', status: 'Neutral 😐', color: 'text-slate-400', bg: 'bg-slate-700/30 border-white/5' },
                        ].map((item) => (
                            <div key={item.label} className={`flex items-center justify-between p-4 rounded-xl border ${item.bg}`}>
                                <span className="text-slate-400 text-sm font-medium">{item.label}</span>
                                <span className={`text-sm font-bold ${item.color}`}>{item.status}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
