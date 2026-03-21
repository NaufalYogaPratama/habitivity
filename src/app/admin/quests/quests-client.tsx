'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createAdminQuestAction } from './actions';

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
    isAdmin: boolean;
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

export default function AdminQuestsClient({ initialQuests, stats, users }: { initialQuests: QuestData[]; stats: QuestStats; users: { _id: string, username: string, email: string }[] }) {
    const router = useRouter();
    const [quests, setQuests] = useState(initialQuests);

    useEffect(() => {
        setQuests(initialQuests);
    }, [initialQuests]);

    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Form modal state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("medium");
    const [category, setCategory] = useState("work");
    const [targetUserId, setTargetUserId] = useState("all");
    const [isAILoading, setIsAILoading] = useState(false);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    const handleDeleteAction = async (quest: any) => {
        if (!confirm(quest.isGroup ? `Delete global quest for ${quest.groupItems.length} users?` : 'Are you sure you want to delete this quest?')) return;

        try {
            if (quest.isGroup) {
                for (const item of quest.groupItems) {
                    await fetch(`/api/quests/update/${item._id}`, { method: 'DELETE' });
                }
                setQuests(prev => prev.filter(q => !quest.groupItems.some((gi: any) => gi._id === q._id)));
            } else {
                const res = await fetch(`/api/quests/update/${quest._id}`, { method: 'DELETE' });
                if (res.ok) {
                    setQuests(prev => prev.filter(q => q._id !== quest._id));
                }
            }
            toast.success('Quest deleted successfully.');
        } catch (error) {
            console.error(error);
            toast.error('System error occurred.');
        }
    };

    const handleCreateQuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return toast.error("Judul misi wajib diisi!");

        setIsCreating(true);
        try {
            const res = await createAdminQuestAction({
                title,
                description,
                difficulty,
                category,
                targetUserId
            });

            if (res.success) {
                toast.success(targetUserId === 'all' ? "Global Quest broadcasted! 🚀" : "User Quest created! 🚀");
                setIsDialogOpen(false);
                setTitle("");
                setDescription("");
                setTargetUserId("all");
                setHasAnalyzed(false);
                router.refresh();
            } else {
                toast.error(res.error || "Gagal menambahkan misi");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setIsCreating(false);
        }
    };

    const handleAskAI = async () => {
        if (!title) {
            toast.error("Masukkan judul misi terlebih dahulu!");
            return;
        }

        setIsAILoading(true);
        try {
            const res = await fetch("/api/quests/classify-ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.difficulty) setDifficulty(data.difficulty);
                if (data.category) setCategory(data.category);
                setHasAnalyzed(true);
                toast.success("Misi dianalisis AI! ✨");
            } else {
                toast.error("Gagal menganalisis misi via AI");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem AI");
        } finally {
            setIsAILoading(false);
        }
    };

    const processed = useMemo(() => {
        const ObjectGroups: Record<string, QuestData[]> = {};
        const result: any[] = [];

        quests.forEach(q => {
            if (q.isAdmin && q.title) {
                const dateKey = q.createdAt.substring(0, 16);
                const key = `GLOBAL_${q.title}_${dateKey}`;
                if (!ObjectGroups[key]) ObjectGroups[key] = [];
                ObjectGroups[key].push(q);
            } else {
                result.push({ ...q, isGroup: false });
            }
        });

        Object.values(ObjectGroups).forEach(group => {
            if (group.length > 1) {
                const completeCount = group.filter(i => i.status === 'completed').length;
                result.push({
                    ...group[0],
                    isGroup: true,
                    groupItems: group,
                    status: completeCount === group.length ? 'completed' : 'in_progress', // aggregated status
                    user: { username: `All Heroes (${group.length})`, email: `Completed: ${completeCount}/${group.length}` }
                });
            } else {
                result.push({ ...group[0], isGroup: false });
            }
        });

        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return result;
    }, [quests]);

    const filtered = processed.filter(q => {
        const matchesStatus = filterStatus === 'all' || q.status === filterStatus || (q.isGroup && q.groupItems.some((i: any) => i.status === filterStatus));
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
                        <Image
                            src="/assets/logo/icon-quest.png"
                            alt="Quests"
                            width={32}
                            height={32}
                            className="object-contain drop-shadow-md"
                            priority
                        />
                        Global Quest
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">View and manage all quests across the platform.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-sm font-medium px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                        Total: {quests.length} Quests
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-purple-600 hover:bg-purple-500 text-white font-bold h-10 px-4 rounded-xl shadow-lg shadow-purple-600/20 transition-all">
                                <Plus className="mr-2 h-4 w-4" /> ADD QUEST
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-[#0F1118]/95 backdrop-blur-2xl border-white/[0.06] text-white rounded-3xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black italic tracking-tight">CREATE QUEST</DialogTitle>
                                <DialogDescription className="text-slate-400 font-medium">
                                    Broadcast quests to all heroes or assign specific tasks.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateQuest} className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-slate-500">Judul Misi</Label>
                                    <Input id="title" placeholder="Cth: Habisi naga hutan" value={title} onChange={(e) => { setTitle(e.target.value); setHasAnalyzed(false); }} className="bg-white/[0.03] border-white/[0.06] rounded-xl h-10" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="desc" className="text-xs font-bold uppercase tracking-widest text-slate-500">Deskripsi</Label>
                                    <Input id="desc" placeholder="Cth: Dokumentasikan hasil pembunuhan" value={description} onChange={(e) => { setDescription(e.target.value); setHasAnalyzed(false); }} className="bg-white/[0.03] border-white/[0.06] rounded-xl h-10" />
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={handleAskAI}
                                        disabled={isAILoading || !title || hasAnalyzed}
                                        className={`h-9 px-4 rounded-lg text-xs font-bold transition-all w-full flex items-center justify-center ${hasAnalyzed
                                            ? "bg-purple-900/20 border border-purple-500/30 text-purple-400 opacity-100 disabled:opacity-100"
                                            : "bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500/20 border border-fuchsia-500/30"
                                            }`}
                                    >
                                        {isAILoading ? "✨ Menganalisis..." : hasAnalyzed ? "✓ Dianalisis AI" : "✨ Auto-Analyze dengan AI"}
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Kesulitan</Label>
                                        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="flex h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-xs text-white">
                                            <option value="easy" className="bg-[#151823]">Easy (50 XP)</option>
                                            <option value="medium" className="bg-[#151823]">Medium (100 XP)</option>
                                            <option value="hard" className="bg-[#151823]">Hard (200 XP)</option>
                                            <option value="expert" className="bg-[#151823]">Expert (400 XP)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Kategori</Label>
                                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-xs text-white">
                                            <option value="work" className="bg-[#151823]">🛠️ Work</option>
                                            <option value="learning" className="bg-[#151823]">🎓 Learning</option>
                                            <option value="personal" className="bg-[#151823]">👤 Personal</option>
                                            <option value="health" className="bg-[#151823]">💪 Health</option>
                                            <option value="finance" className="bg-[#151823]">💰 Finance</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Target User</Label>
                                    <select value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} className="flex h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-xs text-white">
                                        <option value="all" className="bg-[#151823]">🌎 Semua Pahlawan (Global Broadcast)</option>
                                        {users.map(u => (
                                            <option key={u._id} value={u._id} className="bg-[#151823]">👤 {u.username} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isCreating} className="bg-purple-600 hover:bg-purple-500 w-full h-10 rounded-xl font-bold mt-2 shadow-lg shadow-purple-600/20">
                                        {isCreating ? "PROSES..." : "LAUNCH QUEST 🚀"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
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
                                                {quest.isGroup ? (
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border border-purple-500/20 text-purple-400 bg-purple-500/10`}>
                                                        Global
                                                    </span>
                                                ) : (
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${sCfg.bg} ${sCfg.color}`}>
                                                        {sCfg.label}
                                                    </span>
                                                )}
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
                                                    onClick={() => handleDeleteAction(quest)}
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
