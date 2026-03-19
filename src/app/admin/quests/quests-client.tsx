'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface QuestData {
    _id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    status: string;
    rewards: { xp: number; gold: number };
    user: { username: string; email: string };
    createdAt: string;
    completedAt: string | null;
}

interface QuestStats {
    totalQuests: number;
    completedQuests: number;
    pendingQuests: number;
    inProgressQuests: number;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    in_progress: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    failed: { label: 'Failed', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
};

const difficultyConfig: Record<string, { label: string; color: string }> = {
    easy: { label: 'Easy', color: 'text-emerald-400' },
    medium: { label: 'Medium', color: 'text-amber-400' },
    hard: { label: 'Hard', color: 'text-orange-400' },
    expert: { label: 'Expert', color: 'text-red-400' },
};

const categoryIcons: Record<string, string> = {
    work: '💼',
    learning: '📚',
    personal: '🧩',
    health: '❤️',
    finance: '💰',
};

export default function AdminQuestsClient({ initialQuests, stats }: { initialQuests: QuestData[]; stats: QuestStats }) {
    const [quests, setQuests] = useState(initialQuests);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this quest?')) return;

        try {
            const res = await fetch(`/api/quests/update/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setQuests(prev => prev.filter(q => q._id !== id));
            } else {
                alert('Failed to delete quest');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filtered = quests.filter(q => {
        const matchesStatus = filterStatus === 'all' || q.status === filterStatus;
        const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.user.username.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                        <span className="text-2xl sm:text-3xl">⚔️</span> Global Quests
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">View and manage all quests across the platform.</p>
                </div>
                <div className="text-sm font-medium px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                    Total: {quests.length} Quests
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { icon: '📋', label: 'Total', value: stats.totalQuests, color: 'text-purple-400', border: 'border-purple-500/15', bg: 'from-purple-500/10' },
                    { icon: '⏳', label: 'Pending', value: stats.pendingQuests, color: 'text-amber-400', border: 'border-amber-500/15', bg: 'from-amber-500/10' },
                    { icon: '🔄', label: 'In Progress', value: stats.inProgressQuests, color: 'text-blue-400', border: 'border-blue-500/15', bg: 'from-blue-500/10' },
                    { icon: '✅', label: 'Completed', value: stats.completedQuests, color: 'text-emerald-400', border: 'border-emerald-500/15', bg: 'from-emerald-500/10' },
                ].map(s => (
                    <div key={s.label} className={`bg-gradient-to-br ${s.bg} to-transparent bg-[#151823] border ${s.border} rounded-xl p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{s.icon}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
                        </div>
                        <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search quests or users..."
                    className="flex-1 bg-[#151823] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/40 transition-colors"
                />
                <div className="flex gap-2 flex-wrap">
                    {['all', 'pending', 'in_progress', 'completed', 'failed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all capitalize
                                ${filterStatus === status
                                    ? 'bg-purple-600/20 border-purple-500/30 text-purple-300'
                                    : 'bg-white/[0.02] border-white/[0.06] text-slate-500 hover:text-white hover:bg-white/[0.05]'
                                }`}
                        >
                            {status === 'all' ? 'All' : status === 'in_progress' ? 'In Progress' : status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quest Table */}
            <Card className="bg-[#151823] border-white/[0.06] overflow-hidden">
                <CardContent className="p-0 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Quest</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Hero</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap text-center">Difficulty</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap text-center">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap text-center">Rewards</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Created</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <p className="text-3xl mb-2">📭</p>
                                        <p className="text-slate-500 text-sm">No quests found</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(quest => {
                                    const sCfg = statusConfig[quest.status] || statusConfig.pending;
                                    const dCfg = difficultyConfig[quest.difficulty] || difficultyConfig.medium;
                                    const catIcon = categoryIcons[quest.category] || '📋';

                                    return (
                                        <tr key={quest._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-4 min-w-[220px]">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#0B0E14] border border-white/5 flex items-center justify-center text-lg">
                                                        {catIcon}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-white text-sm font-bold truncate max-w-[200px]">{quest.title}</p>
                                                        <p className="text-slate-600 text-[10px] capitalize">{quest.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="text-white text-xs font-semibold">{quest.user.username}</p>
                                                    <p className="text-slate-600 text-[10px]">{quest.user.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`text-xs font-bold ${dCfg.color}`}>{dCfg.label}</span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${sCfg.bg} ${sCfg.color}`}>
                                                    {sCfg.label}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <span className="text-purple-400 text-xs font-bold">{quest.rewards.xp} XP</span>
                                                    <span className="text-amber-400 text-xs font-bold">{quest.rewards.gold}g</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-slate-400 whitespace-nowrap">
                                                {formatDate(quest.createdAt)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(quest._id)}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
