import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const trendingQuests = [
    { icon: '🏃‍♂️', title: '5K Runner', category: 'Fitness', reward: '150 XP', time: '2h 40m', rarity: 'Epic', gradient: 'from-orange-500/30 via-rose-500/20 to-purple-600/20', users: 24 },
    { icon: '📚', title: 'Read 30 Pages', category: 'Knowledge', reward: '100 XP', time: '1h 20m', rarity: 'Rare', gradient: 'from-blue-500/30 via-indigo-500/20 to-violet-600/20', users: 18 },
    { icon: '🧘‍♂️', title: 'Zen Master', category: 'Mindfulness', reward: '200 XP', time: '3h 10m', rarity: 'Legendary', gradient: 'from-emerald-500/30 via-teal-500/20 to-cyan-600/20', users: 31 },
    { icon: '💧', title: 'Hydration Hero', category: 'Health', reward: '80 XP', time: '5h 00m', rarity: 'Common', gradient: 'from-cyan-500/30 via-blue-500/20 to-indigo-600/20', users: 45 },
];

const topHeroes = [
    { name: 'ShadowBlade', xp: '12,450 XP', level: 28, streak: 45 },
    { name: 'ZenMaster', xp: '11,200 XP', level: 25, streak: 38 },
    { name: 'CodeNinja', xp: '9,800 XP', level: 22, streak: 30 },
];

const recentActivity = [
    { user: 'ShadowBlade', action: 'completed', quest: '10K Run', time: '2m ago', icon: '🏆' },
    { user: 'ZenMaster', action: 'earned', quest: '500 XP', time: '5m ago', icon: '⚡' },
    { user: 'CodeNinja', action: 'started', quest: 'Deep Focus', time: '12m ago', icon: '🎯' },
    { user: 'PixelArt', action: 'minted', quest: 'Art NFT #42', time: '18m ago', icon: '🎨' },
];

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const user = session.user as { name?: string; email?: string; role?: string };

    return (
        <div className="flex flex-col xl:flex-row">
            {/* Main Feed */}
            <div className="flex-1 p-4 sm:p-6 space-y-6 sm:space-y-7 min-w-0">
                {/* Top Bar */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex-1 flex items-center bg-[#151823] border border-white/[0.06] rounded-2xl px-4 py-2.5 focus-within:border-purple-500/30 transition-colors">
                        <span className="text-slate-500 mr-3">🔍</span>
                        <input
                            type="text"
                            placeholder="Search quests, heroes..."
                            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-600"
                        />
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-[#151823] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all flex-shrink-0">
                        🔔
                    </button>
                </div>

                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-900/80 via-fuchsia-900/60 to-indigo-900/80 border border-white/[0.06]">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-[-50%] right-[-10%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-fuchsia-500/20 blur-[80px] rounded-full" />
                        <div className="absolute bottom-[-30%] left-[10%] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-purple-500/20 blur-[60px] rounded-full" />
                    </div>

                    <div className="relative z-10 p-5 sm:p-8 flex items-center justify-between">
                        <div className="max-w-md space-y-3 sm:space-y-4">
                            <h1 className="text-xl sm:text-3xl font-bold leading-tight">
                                Discover, Collect<br />
                                and <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-300">Build Your Legacy</span>
                            </h1>
                            <p className="text-slate-300/80 text-xs sm:text-sm leading-relaxed">
                                Complete quests, earn XP, and mint your achievements as collectible NFTs.
                            </p>
                            <div className="flex gap-2 sm:gap-3 pt-1">
                                <Link
                                    href="/dashboard/quests"
                                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/20 transition-all hover:scale-105"
                                >
                                    Explore Quests
                                </Link>
                                <Link
                                    href="/dashboard/shop"
                                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs sm:text-sm font-bold transition-all"
                                >
                                    Visit Shop
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:flex items-center">
                            <div className="text-7xl animate-bounce duration-[3000ms]">🧙‍♂️</div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[
                        { icon: '❤️', label: 'HP', value: '100/100', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/15' },
                        { icon: '⚡', label: 'XP', value: '0/1,000', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/15' },
                        { icon: '💰', label: 'Gold', value: '0', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/15' },
                        { icon: '⭐', label: 'Level', value: '1', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10 border-fuchsia-500/15' },
                    ].map((stat) => (
                        <div key={stat.label} className={`${stat.bg} border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3`}>
                            <span className="text-xl sm:text-2xl">{stat.icon}</span>
                            <div>
                                <p className={`font-bold text-base sm:text-lg ${stat.color} leading-none`}>{stat.value}</p>
                                <p className="text-slate-500 text-[10px] sm:text-xs font-medium mt-0.5">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trending Quests */}
                <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                            <span>🔥</span> Trending Quests
                        </h2>
                        <Link href="/dashboard/quests" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors">
                            See All →
                        </Link>
                    </div>
                    {/* Horizontal scroll on mobile, grid on larger */}
                    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-x-visible lg:pb-0">
                        {trendingQuests.map((quest) => (
                            <Card key={quest.title} className="bg-[#151823] border-white/[0.06] hover:border-purple-500/20 transition-all group hover:-translate-y-1 duration-300 min-w-[200px] sm:min-w-[220px] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink">
                                <CardContent className="p-0">
                                    <div className={`aspect-[4/3] rounded-t-xl bg-gradient-to-br ${quest.gradient} relative overflow-hidden flex items-center justify-center`}>
                                        <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">{quest.icon}</span>
                                        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 bg-black/40 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold border border-white/10 text-white uppercase tracking-wider">
                                            {quest.rarity}
                                        </div>
                                    </div>
                                    <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                                        <div>
                                            <h3 className="font-bold text-xs sm:text-sm text-white">{quest.title}</h3>
                                            <p className="text-slate-500 text-[10px] sm:text-xs mt-0.5">{quest.category}</p>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] sm:text-xs">
                                            <div>
                                                <p className="text-slate-600 mb-0.5">Time Left</p>
                                                <p className="text-white font-mono font-bold">{quest.time}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-slate-600 mb-0.5">Reward</p>
                                                <p className="text-purple-400 font-mono font-bold">{quest.reward}</p>
                                            </div>
                                        </div>
                                        <Button className="w-full bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/20 text-purple-300 font-bold text-[10px] sm:text-xs rounded-xl h-8 sm:h-9 transition-all">
                                            Accept Quest
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                        <span>⚡</span> Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {[
                            { icon: '⚔️', label: 'New Quest', desc: 'Create a task', href: '/dashboard/quests', gradient: 'from-purple-600/20 to-fuchsia-600/20', border: 'border-purple-500/15 hover:border-purple-500/30' },
                            { icon: '🎯', label: 'Focus Now', desc: 'Start session', href: '/dashboard/focus', gradient: 'from-blue-600/20 to-indigo-600/20', border: 'border-blue-500/15 hover:border-blue-500/30' },
                            { icon: '💸', label: 'Log Expense', desc: 'Track gold', href: '/dashboard/ledger', gradient: 'from-amber-600/20 to-orange-600/20', border: 'border-amber-500/15 hover:border-amber-500/30' },
                            { icon: '🏆', label: 'Rankings', desc: 'Leaderboard', href: '/dashboard/leaderboard', gradient: 'from-emerald-600/20 to-teal-600/20', border: 'border-emerald-500/15 hover:border-emerald-500/30' },
                        ].map((action) => (
                            <Link key={action.label} href={action.href}>
                                <div className={`bg-gradient-to-br ${action.gradient} border ${action.border} rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all hover:-translate-y-0.5 duration-200 group cursor-pointer`}>
                                    <span className="text-2xl sm:text-3xl block mb-2 sm:mb-3 group-hover:scale-110 transition-transform">{action.icon}</span>
                                    <p className="text-white font-bold text-xs sm:text-sm">{action.label}</p>
                                    <p className="text-slate-500 text-[10px] sm:text-xs mt-0.5">{action.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Mobile-only: Right sidebar content inline */}
                <div className="xl:hidden space-y-6">
                    {/* User Profile Card */}
                    <Card className="bg-[#151823] border-white/[0.06]">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 border border-white/10 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/10">
                                    🧑‍💻
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white">{user?.name || 'Hero'}</h3>
                                    <p className="text-slate-500 text-xs">@{user?.name?.toLowerCase().replace(/\s+/g, '') || 'hero'}</p>
                                </div>
                                <div className="flex gap-4 text-center">
                                    <div>
                                        <p className="text-white font-bold text-sm">Lv.1</p>
                                        <p className="text-slate-600 text-[9px] uppercase">Level</p>
                                    </div>
                                    <div>
                                        <p className="text-amber-400 font-bold text-sm">0🔥</p>
                                        <p className="text-slate-600 text-[9px] uppercase">Streak</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Balance + Top Heroes side by side on tablet */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        {/* Balance */}
                        <Card className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/30 border-purple-500/15">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">💰</span>
                                        <span className="text-xl font-bold text-white">0 Gold</span>
                                    </div>
                                    <Button size="xs" className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg px-3">
                                        Add +
                                    </Button>
                                </div>
                                <div className="flex items-end gap-1 h-12 pt-2">
                                    {[20, 35, 25, 45, 30, 55, 40, 60, 50, 45, 65, 55].map((h, i) => (
                                        <div key={i} className="flex-1 bg-purple-500/30 rounded-t" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Heroes */}
                        <Card className="bg-[#151823] border-white/[0.06]">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-bold text-white">Top Heroes</CardTitle>
                                    <Link href="/dashboard/leaderboard" className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">See All</Link>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-2">
                                {topHeroes.map((hero, idx) => (
                                    <div key={hero.name} className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02]">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${idx === 0 ? 'bg-amber-500/20 text-amber-400' : idx === 1 ? 'bg-slate-400/20 text-slate-300' : 'bg-orange-500/20 text-orange-400'}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-xs font-semibold truncate">{hero.name}</p>
                                            <p className="text-slate-500 text-[10px]">Lv.{hero.level}</p>
                                        </div>
                                        <span className="text-purple-400 text-[10px] font-bold">{hero.xp}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card className="bg-[#151823] border-white/[0.06]">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-white">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                            {recentActivity.map((act, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-2 rounded-xl">
                                    <span className="text-sm mt-0.5">{act.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs">
                                            <span className="text-white font-semibold">{act.user}</span>{' '}
                                            <span className="text-slate-500">{act.action}</span>{' '}
                                            <span className="text-purple-300 font-medium">{act.quest}</span>
                                        </p>
                                        <p className="text-slate-600 text-[10px] mt-0.5">{act.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right Sidebar - Desktop only */}
            <div className="w-[320px] flex-shrink-0 border-l border-white/[0.04] bg-[#0F1118]/60 backdrop-blur-xl p-5 space-y-6 overflow-y-auto hidden xl:block">
                {/* User Profile Card */}
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 border border-white/10 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-purple-500/10">
                        🧑‍💻
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{user?.name || 'Hero'}</h3>
                        <p className="text-slate-500 text-xs">@{user?.name?.toLowerCase().replace(/\s+/g, '') || 'hero'}</p>
                    </div>
                    <div className="flex justify-center gap-4 text-center">
                        <div>
                            <p className="text-white font-bold text-sm">Lv. 1</p>
                            <p className="text-slate-600 text-[10px] uppercase tracking-wider">Level</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div>
                            <p className="text-amber-400 font-bold text-sm">0 🔥</p>
                            <p className="text-slate-600 text-[10px] uppercase tracking-wider">Streak</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div>
                            <p className="text-purple-400 font-bold text-sm">0</p>
                            <p className="text-slate-600 text-[10px] uppercase tracking-wider">Quests</p>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-white/[0.04]" />

                {/* Your Balance */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-sm text-white">Your Balance</h3>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/30 border border-purple-500/15 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">💰</span>
                                <span className="text-xl font-bold text-white">0 Gold</span>
                            </div>
                            <Button size="xs" className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg px-3">
                                Add +
                            </Button>
                        </div>
                        <div className="flex items-end gap-1 h-12 pt-2">
                            {[20, 35, 25, 45, 30, 55, 40, 60, 50, 45, 65, 55].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-purple-500/30 hover:bg-purple-500/50 rounded-t transition-colors"
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-white/[0.04]" />

                {/* Top Heroes */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-sm text-white">Top Heroes</h3>
                        <Link href="/dashboard/leaderboard" className="text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider">See All</Link>
                    </div>
                    <div className="space-y-2">
                        {topHeroes.map((hero, idx) => (
                            <div key={hero.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-amber-500/20 text-amber-400' : idx === 1 ? 'bg-slate-400/20 text-slate-300' : 'bg-orange-500/20 text-orange-400'}`}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-xs font-semibold truncate">{hero.name}</p>
                                    <p className="text-slate-500 text-[10px]">Lv.{hero.level} • {hero.streak}🔥</p>
                                </div>
                                <span className="text-purple-400 text-[10px] font-bold">{hero.xp}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-white/[0.04]" />

                {/* Recent Activity */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-sm text-white">Recent Activity</h3>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">See All</span>
                    </div>
                    <div className="space-y-2">
                        {recentActivity.map((act, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
                                <span className="text-base mt-0.5">{act.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs">
                                        <span className="text-white font-semibold">{act.user}</span>{' '}
                                        <span className="text-slate-500">{act.action}</span>{' '}
                                        <span className="text-purple-300 font-medium">{act.quest}</span>
                                    </p>
                                    <p className="text-slate-600 text-[10px] mt-0.5">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
