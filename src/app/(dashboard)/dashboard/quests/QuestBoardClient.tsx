"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // <-- Tambahkan import Image
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Swords,
  Coins,
  Star,
  Clock,
  Plus,
  Play,
  CheckCircle2,
  XCircle,
  Trash2,
  Filter,
  History,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Quest {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  status: "pending" | "in_progress" | "completed" | "failed";
  rewards?: { xp: number; gold: number };
  isAdmin?: boolean;
}

type TabType = "active" | "completed" | "all";

export default function QuestBoardClient() {
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [questType, setQuestType] = useState<"personal" | "global">("personal");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [questToComplete, setQuestToComplete] = useState<Quest | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("work");
  const [isAILoading, setIsAILoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/quests");
      if (res.ok) {
        const data = await res.json();
        setQuests(data.quests || []);
      }
    } catch (error) {
      toast.error("Gagal mengambil data quest");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return toast.error("Judul misi wajib diisi!");

    setIsLoading(true);
    try {
      const res = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, difficulty, category }),
      });

      if (res.ok) {
        toast.success("Misi baru berhasil ditambahkan! 🚀");
        setIsDialogOpen(false);
        setTitle("");
        setDescription("");
        setHasAnalyzed(false);
        fetchQuests();
      } else {
        toast.error("Gagal menambahkan misi");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
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
        toast.success("Misi berhasil dianalisis oleh AI! ✨");
      } else {
        toast.error("Gagal menganalisis misi via AI");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghubungi AI");
    } finally {
      setIsAILoading(false);
    }
  };

  const updateQuestStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/quests/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(`Misi diperbarui ke ${status}`);
        fetchQuests();
      } else {
        toast.error("Gagal memperbarui misi");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    }
  };

  const deleteQuest = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus misi ini?")) return;

    try {
      const res = await fetch(`/api/quests/update/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Misi berhasil dihapus");
        fetchQuests();
      } else {
        toast.error("Gagal menghapus misi");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    }
  };

  const filteredQuests = quests.filter(q => {
    if (activeTab === "active") return q.status === "pending" || q.status === "in_progress";
    if (activeTab === "completed") return q.status === "completed";
    return true;
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy": return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20"; // Diganti cyan agar pas tema cyberpunk
      case "medium": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "hard": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "expert": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <span className="flex items-center gap-1 text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider bg-fuchsia-400/10 px-2 py-0.5 rounded-full border border-fuchsia-400/20"><CheckCircle2 className="w-3 h-3" /> Done</span>;
      case "failed": return <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-wider bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/20"><XCircle className="w-3 h-3" /> Failed</span>;
      case "in_progress": return <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20 animate-pulse"><Clock className="w-3 h-3" /> Focus</span>;
      default: return <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/[0.05]">Pending</span>;
    }
  };

  const renderQuestCard = (quest: Quest, idx: number) => (
    <motion.div
      layout
      key={quest._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.05 }}
    >
      <Card className="bg-[#151823] border-white/[0.06] rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all group flex flex-col h-full shadow-xl shadow-black/20">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-3 gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {quest.isAdmin && (
                <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border text-cyan-400 bg-cyan-400/10 border-cyan-400/20 flex items-center gap-1 shadow-[0_0_10px_rgba(34,211,238,0.15)]">
                  🌍 GLOBAL
                </div>
              )}
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDifficultyColor(quest.difficulty)}`}>
                {quest.difficulty}
              </div>
            </div>
            {getStatusBadge(quest.status)}
          </div>
          <CardTitle className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">{quest.title}</CardTitle>
          <CardDescription className="text-slate-500 mt-2 line-clamp-2 min-h-[40px] text-sm leading-relaxed">
            {quest.description || "Tidak ada rincian misi khusus bagi pahlawan."}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-fuchsia-500/5 px-3 py-2 rounded-xl border border-fuchsia-500/10">
              <Star className="w-4 h-4 text-fuchsia-400" />
              <span className="text-fuchsia-400 text-sm font-black">+{quest.rewards?.xp || 0}</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/5 px-3 py-2 rounded-xl border border-amber-500/10">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-black">+{quest.rewards?.gold || 0}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-6 hidden group-hover:flex animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-2 gap-2 w-full">
            {quest.status === 'pending' || quest.status === 'in_progress' ? (
              <>
                <Button
                  onClick={() => router.push(`/dashboard/focus?questId=${quest._id}`)}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl h-11"
                >
                  <Play className="w-4 h-4 mr-2" /> FOCUS
                </Button>
                <Button
                  onClick={() => setQuestToComplete(quest)}
                  variant="outline"
                  className="border-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/10 font-bold rounded-xl h-11"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> DONE
                </Button>
              </>
            ) : (
              <Button
                onClick={() => deleteQuest(quest._id)}
                variant="outline"
                className="col-span-2 border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold rounded-xl h-11"
              >
                <Trash2 className="w-4 h-4 mr-2" /> HAPUS JEJAK
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-7 min-w-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center justify-between">
          <div>
            {/* PERUBAHAN: Emoji diganti gambar icon-quest */}
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Image
                src="/assets/logo/icon-quest.png"
                alt="Quests"
                width={32}
                height={32}
                className="object-contain drop-shadow-md"
                priority
              />
              Quest Board
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1"> Kelola misi harianmu, raih XP dan kumpulkan Gold.</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {/* PERUBAHAN: Warna tombol diubah ke ungu */}
            <Button className="bg-purple-600 hover:bg-purple-500 text-white font-bold h-12 px-6 rounded-2xl shadow-lg shadow-purple-600/20 transition-all hover:scale-105 active:scale-95">
              <Plus className="mr-2 h-5 w-5" /> TAMBAH MISI BARU
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#0F1118]/95 backdrop-blur-2xl border-white/[0.06] text-white rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic tracking-tight">CREATE NEW QUEST</DialogTitle>
              <DialogDescription className="text-slate-400 font-medium">
                Tentukan targetmu pahlawan. Setiap misi yang selesai akan memberimu berkat.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateQuest} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-slate-500">Judul Misi</Label>
                <Input id="title" placeholder="Cth: Belajar React Fiber" value={title} onChange={(e) => { setTitle(e.target.value); setHasAnalyzed(false); }} onPointerDown={(e) => e.stopPropagation()} className="bg-white/[0.03] border-white/[0.06] rounded-xl h-12 focus:ring-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc" className="text-xs font-bold uppercase tracking-widest text-slate-500">Deskripsi (Opsional)</Label>
                <Input id="desc" placeholder="Cth: Dokumentasikan kemajuan" value={description} onChange={(e) => { setDescription(e.target.value); setHasAnalyzed(false); }} onPointerDown={(e) => e.stopPropagation()} className="bg-white/[0.03] border-white/[0.06] rounded-xl h-12 focus:ring-purple-500" />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleAskAI}
                  disabled={isAILoading || !title || hasAnalyzed}
                  className={`h-10 px-4 rounded-xl text-sm font-bold transition-all w-full sm:w-auto flex items-center justify-center ${hasAnalyzed
                    ? "bg-purple-900/20 border border-purple-500/30 text-purple-400 opacity-100 disabled:opacity-100"
                    : "bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500/20 border border-fuchsia-500/30"
                    }`}
                >
                  {isAILoading ? (
                    <span className="animate-pulse">✨ Menganalisis...</span>
                  ) : hasAnalyzed ? (
                    "✓ Dianalisis AI"
                  ) : (
                    "✨ Auto-Analyze dengan AI"
                  )}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diff" className="text-xs font-bold uppercase tracking-widest text-slate-500">Kesulitan</Label>
                  <select id="diff" value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="flex h-12 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white">
                    <option value="easy" className="bg-[#151823]">Easy (50 XP)</option>
                    <option value="medium" className="bg-[#151823]">Medium (100 XP)</option>
                    <option value="hard" className="bg-[#151823]">Hard (200 XP)</option>
                    <option value="expert" className="bg-[#151823]">Expert (400 XP)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat" className="text-xs font-bold uppercase tracking-widest text-slate-500">Kategori</Label>
                  <select id="cat" value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-12 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white">
                    <option value="work" className="bg-[#151823]">🛠️ Work</option>
                    <option value="learning" className="bg-[#151823]">🎓 Learning</option>
                    <option value="personal" className="bg-[#151823]">👤 Personal</option>
                    <option value="health" className="bg-[#151823]">💪 Health</option>
                    <option value="finance" className="bg-[#151823]">💰 Finance</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-500 w-full h-12 rounded-xl font-bold mt-4 shadow-lg shadow-purple-600/20">
                  {isLoading ? "PROSES..." : "LAUNCH MISSION 🚀"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Primary Navigation (Quest Type) */}
      <div className="flex bg-[#151823] border border-white/[0.06] rounded-2xl p-1 w-full sm:w-fit">
        {[
          { id: "personal", label: "🎯 Misi Pribadi" },
          { id: "global", label: "🌍 Misi Global" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setQuestType(tab.id as "personal" | "global")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl text-sm font-bold transition-all ${questType === tab.id
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Header for Current Tab + Secondary Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            {questType === "global" ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-2">
                🌍 Kumpulan Misi Global
              </span>
            ) : (
              <span className="flex items-center gap-2">🎯 Daftar Misi Pribadi</span>
            )}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
            {questType === "global"
              ? "Misi spesial yang diturunkan langsung oleh admin untuk diselesaikan."
              : "Misi harian yang kamu buat sendiri untuk melatih kedisiplinan."}
          </p>
        </div>

        {/* Status Tabs (Smaller Filter) */}
        <div className="flex bg-[#151823] border border-white/[0.06] rounded-xl p-1 w-full md:w-fit shrink-0">
          {[
            { id: "active", label: "Aktif", icon: <Target className="w-3.5 h-3.5" /> },
            { id: "completed", label: "Riwayat", icon: <History className="w-3.5 h-3.5" /> },
            { id: "all", label: "Semua", icon: <Filter className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold transition-all uppercase tracking-wider ${activeTab === tab.id
                ? 'bg-white/[0.08] text-white'
                : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Quest Cards */}
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Image src="/assets/logo/icon-quest.png" alt="Loading" width={48} height={48} className="mb-4 opacity-50" />
            <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Memuat Misi...</p>
          </div>
        ) : filteredQuests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-[#151823]/50 border-2 border-dashed border-white/[0.06] rounded-3xl"
          >
            <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
              <Target className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="text-white font-black text-lg">Belum Ada Misi</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">Tambahkan misi pertamamu untuk mulai petualangan mengumpulkan harta!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.filter(q => questType === "global" ? q.isAdmin : !q.isAdmin).length === 0 ? (
              <div className="col-span-full text-center py-10 bg-[#151823]/50 border border-white/[0.06] rounded-2xl text-slate-500 text-sm">
                Tidak ada {questType === "global" ? "misi global" : "misi pribadi"} di kategori ini.
              </div>
            ) : (
              filteredQuests.filter(q => questType === "global" ? q.isAdmin : !q.isAdmin).map((quest, idx) => renderQuestCard(quest, idx))
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog for Completing Quest */}
      <Dialog open={!!questToComplete} onOpenChange={(open) => !open && setQuestToComplete(null)}>
        <DialogContent className="sm:max-w-[400px] overflow-hidden bg-[#0F1118]/95 backdrop-blur-3xl border-white/[0.08] text-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-black/50">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-fuchsia-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-5 border border-fuchsia-500/20 shadow-[0_0_20px_rgba(217,70,239,0.15)]">
              <Swords className="w-10 h-10 text-fuchsia-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
              Pahlawan Pantang Bohong!
            </h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Yakin sudah menyelesaikan misi <strong className="text-white">"{questToComplete?.title}"</strong> dengan jujur dan tuntas?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => setQuestToComplete(null)}
                className="flex-1 bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.1] text-slate-300 rounded-xl h-12 font-bold transition-all"
              >
                Belum
              </Button>
              <Button
                onClick={() => {
                  if (questToComplete) updateQuestStatus(questToComplete._id, 'completed');
                  setQuestToComplete(null);
                }}
                className="flex-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white rounded-xl h-12 font-bold shadow-lg shadow-fuchsia-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Ya, Selesai! <CheckCircle2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}