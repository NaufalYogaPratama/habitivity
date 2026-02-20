'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Trophy,
    Zap,
    Timer,
    Flame,
    TrendingUp,
    MapPin,
    Users,
    ChevronRight,
    Search,
    Filter
} from 'lucide-react';
import { toast } from 'sonner';

type Category = 'xp' | 'savings' | 'focus' | 'streak' | 'level' | 'regional' | 'team';
type Timeframe = 'daily' | 'weekly' | 'monthly' | 'all';

interface LeaderboardItem {
    rank: number;
    username: string;
    avatar?: {
        base: string;
    };
    level: number;
    displayValue: string;
    value: number;
    region?: string;
}

const CATEGORIES = [
    { id: 'xp', label: 'Weekly Champions', icon: <Trophy className="w-4 h-4" />, desc: 'XP Terbanyak mingguan' },
    { id: 'savings', label: 'Savings Masters', icon: <TrendingUp className="w-4 h-4" />, desc: 'Penghematan terbesar' },
    { id: 'focus', label: 'Focus Legends', icon: <Timer className="w-4 h-4" />, desc: 'Total jam fokus' },
    { id: 'streak', label: 'Streak Kings', icon: <Flame className="w-4 h-4" />, desc: 'Streak terpanjang' },
    { id: 'level', label: 'Highest Level', icon: <Zap className="w-4 h-4" />, desc: 'Level tertinggi' },
    { id: 'regional', label: 'Regional', icon: <MapPin className="w-4 h-4" />, desc: 'Per kota/universitas' },
    { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" />, desc: 'Cooperative leaderboard' },
];

const TIMEFRAMES = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'all', label: 'All Time' },
];

export default function LeaderboardPage() {
    const [category, setCategory] = useState<Category>('xp');
    const [timeframe, setTimeframe] = useState<Timeframe>('weekly');
    const [data, setData] = useState<LeaderboardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/leaderboard?category=${category}&timeframe=${timeframe}`);
                const result = await res.json();
                if (result.leaderboard) {
                    setData(result.leaderboard);
                }
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
                toast.error('Gagal mengambil data leaderboard');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category, timeframe]);

    const filteredData = data.filter(item => {
        const name = item?.username || '';
        return name.toLowerCase().includes((searchTerm || '').toLowerCase());
    });

    const topThree = filteredData.slice(0, 3);
    const rest = filteredData.slice(3);

    return (
        <div className="p-4 sm:p-8 space-y-8 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 tracking-tight">
                        HALAMAN PAHLAWAN
                    </h1>
                    <p className="text-slate-400 font-medium">
                        Ciptakan kompetisi sehat dan raih peringkat tertinggi di Habitivity.
                    </p>
                </div>

                <div className="flex bg-[#151823] border border-white/[0.06] rounded-2xl p-1">
                    {TIMEFRAMES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTimeframe(t.id as Timeframe)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${timeframe === t.id
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id as Category)}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 ${category === cat.id
                            ? 'bg-purple-600/10 border-purple-500 text-purple-300'
                            : 'bg-[#151823] border-white/[0.06] text-slate-400 hover:border-white/10'
                            }`}
                    >
                        {cat.icon}
                        <span className="text-xs font-bold whitespace-nowrap">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Podium Section */}
            <div className="flex flex-col md:grid md:grid-cols-3 items-center md:items-end gap-10 md:gap-6 pt-16 pb-12 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${category}-${timeframe}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="contents"
                    >
                        {/* Rank 2 - Appears second on mobile, first on desktop */}
                        <PodiumCard
                            item={topThree[1]}
                            rank={2}
                            color="from-slate-400 to-slate-200"
                            delay={0.1}
                            className="order-2 md:order-1 h-[220px] md:h-[280px] w-full max-w-[200px]"
                        />

                        {/* Rank 1 - Appears first on mobile, middle on desktop */}
                        <PodiumCard
                            item={topThree[0]}
                            rank={1}
                            color="from-amber-400 to-yellow-200"
                            delay={0}
                            className="order-1 md:order-2 h-[260px] md:h-[340px] md:scale-110 w-full max-w-[240px]"
                        />

                        {/* Rank 3 - Appears third on mobile, last on desktop */}
                        <PodiumCard
                            item={topThree[2]}
                            rank={3}
                            color="from-orange-400 to-orange-200"
                            delay={0.2}
                            className="order-3 h-[180px] md:h-[240px] w-full max-w-[180px]"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* List Section */}
            <Card className="bg-[#151823] border-white/[0.06] rounded-3xl overflow-hidden backdrop-blur-xl">
                <div className="p-4 sm:p-6 border-b border-white/[0.04] flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cari pahlawan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/30 transition-all"
                        />
                    </div>
                    <Button variant="outline" className="sm:w-auto h-auto py-3 px-6 rounded-2xl border-white/[0.06] font-bold text-xs gap-2">
                        <Filter className="w-4 h-4" /> Filter Advanced
                    </Button>
                </div>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02] text-slate-500 text-[10px] uppercase tracking-widest font-black">
                                <tr>
                                    <th className="px-6 py-4">Rank</th>
                                    <th className="px-6 py-4">Hero</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={4} className="px-6 py-8 h-20 bg-white/[0.01]" />
                                        </tr>
                                    ))
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                            Belum ada pahlawan di kategori ini.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item, idx) => (
                                        <motion.tr
                                            key={item.username}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-black ${item.rank <= 3 ? 'text-purple-400' : 'text-slate-600'
                                                        }`}>
                                                        #{item.rank}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center text-lg border border-white/10 group-hover:scale-110 transition-transform">
                                                        {item.username === 'Teammate' ? '👥' : '🧑‍🚀'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                                                            {item.username}
                                                        </p>
                                                        {item.region && (
                                                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                                                <MapPin className="w-2 h-2" /> {item.region}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-bold text-purple-400">
                                                    Level {item.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-mono font-bold text-white tracking-tight">
                                                    {item.displayValue}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function PodiumCard({ item, rank, color, delay, className = "" }: { item?: LeaderboardItem, rank: number, color: string, delay: number, className?: string }) {
    if (!item) return <div className={`hidden md:block ${className}`} />;

    const medals = {
        1: '🥇',
        2: '🥈',
        3: '🥉'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`relative flex flex-col items-center justify-end ${className}`}
        >
            <div className="absolute -top-6 text-4xl mb-2 animate-bounce">
                {medals[rank as keyof typeof medals]}
            </div>

            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border-2 border-white/20 flex items-center justify-center text-3xl mb-4 relative z-10 shadow-2xl`}>
                🧑‍🚀
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-black border-2 border-[#0F1118]">
                    {rank}
                </div>
            </div>

            <div className="text-center mb-4">
                <h3 className="text-white font-black text-lg truncate w-32">{item.username}</h3>
                <p className="text-purple-400 text-sm font-bold">{item.displayValue}</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Lv. {item.level}</p>
            </div>

            <div className={`w-full bg-gradient-to-b ${color} opacity-10 rounded-t-3xl border-x border-t border-white/20 flex items-start justify-center pt-4 self-stretch`}>
                <span className="text-4xl font-black text-white mix-blend-overlay">#{rank}</span>
            </div>
        </motion.div>
    );
}
