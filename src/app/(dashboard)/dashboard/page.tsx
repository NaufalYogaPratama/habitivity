import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const statCards = [
    { icon: '❤️', label: 'HP', value: 100, max: 100, color: 'from-emerald-500/20 to-emerald-600/20', border: 'border-emerald-500/20', text: 'text-emerald-400', bar: 'bg-emerald-500' },
    { icon: '⚡', label: 'XP', value: 0, max: 1000, color: 'from-indigo-500/20 to-violet-600/20', border: 'border-indigo-500/20', text: 'text-indigo-400', bar: 'bg-indigo-500' },
    { icon: '💰', label: 'Gold', value: 0, max: null, color: 'from-amber-500/20 to-orange-600/20', border: 'border-amber-500/20', text: 'text-amber-400', bar: null },
    { icon: '⭐', label: 'Level', value: 1, max: null, color: 'from-violet-500/20 to-purple-600/20', border: 'border-violet-500/20', text: 'text-violet-400', bar: null },
];

const quickActions = [
    { icon: '⚔️', label: 'New Quest', desc: 'Add a new task', href: '/dashboard/quests', color: 'bg-indigo-500/20 border-indigo-500/30 hover:bg-indigo-500/30' },
    { icon: '🎯', label: 'Focus Now', desc: 'Start a session', href: '/dashboard/focus', color: 'bg-violet-500/20 border-violet-500/30 hover:bg-violet-500/30' },
    { icon: '💸', label: 'Log Expense', desc: 'Track spending', href: '/dashboard/ledger', color: 'bg-amber-500/20 border-amber-500/30 hover:bg-amber-500/30' },
    { icon: '🏆', label: 'Leaderboard', desc: 'See rankings', href: '/dashboard/leaderboard', color: 'bg-emerald-500/20 border-emerald-500/30 hover:bg-emerald-500/30' },
];

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const user = session.user as { name?: string; email?: string; role?: string };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{user?.name || 'Hero'}</span>! 👋
                    </h1>
                    <p className="text-slate-400 mt-1">Ready to level up today? Your streak is waiting.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-amber-400 text-lg">🔥</span>
                    <div>
                        <p className="text-amber-400 font-bold text-sm">0 days</p>
                        <p className="text-slate-500 text-xs">Current streak</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-2xl p-5 backdrop-blur-sm`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className={`text-2xl font-bold ${stat.text}`}>{stat.value}</span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                        {stat.bar && stat.max && (
                            <div className="mt-2 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${stat.bar} rounded-full`}
                                    style={{ width: `${(stat.value / stat.max) * 100}%` }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span>⚡</span> Quick Actions
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                        <a
                            key={action.label}
                            href={action.href}
                            className={`${action.color} border rounded-xl p-4 transition-all group`}
                        >
                            <span className="text-2xl mb-2 block">{action.icon}</span>
                            <p className="text-white font-semibold text-sm">{action.label}</p>
                            <p className="text-slate-400 text-xs mt-0.5">{action.desc}</p>
                        </a>
                    ))}
                </div>
            </div>

            {/* Active Quests Preview */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <span>⚔️</span> Active Quests
                        </h2>
                        <a href="/dashboard/quests" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</a>
                    </div>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <span className="text-4xl mb-3">🗺️</span>
                        <p className="text-slate-400 text-sm">No active quests</p>
                        <p className="text-slate-500 text-xs mt-1">Create your first quest to get started</p>
                        <a
                            href="/dashboard/quests"
                            className="mt-4 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-medium hover:bg-indigo-500/30 transition-all"
                        >
                            + Create Quest
                        </a>
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <span>📊</span> AI Status
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {[
                            { label: 'Productivity', status: 'Steady 🔥', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                            { label: 'Finance', status: 'Balanced ⚖️', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                            { label: 'Motivation', status: 'Neutral 😐', color: 'text-slate-400', bg: 'bg-slate-700/30 border-white/5' },
                        ].map((item) => (
                            <div key={item.label} className={`flex items-center justify-between p-3 rounded-xl border ${item.bg}`}>
                                <span className="text-slate-400 text-sm">{item.label}</span>
                                <span className={`text-sm font-medium ${item.color}`}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
