"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Swords, Coins, Star, Clock, Plus, Play } from "lucide-react";

// Tipe data Quest sesuai model yang kita buat sebelumnya
interface Quest {
  _id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  status: "pending" | "in_progress" | "completed" | "failed";
  rewards: { xp: number; gold: number };
}

export default function QuestBoardClient() {
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("work");

  // Fetch data quests saat komponen dimuat
  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const res = await fetch("/api/quests");
      if (res.ok) {
        const data = await res.json();
        setQuests(data.quests);
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
        fetchQuests(); // Refresh daftar quest
      } else {
        toast.error("Gagal menambahkan misi");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper untuk warna badge berdasarkan kesulitan
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy": return "text-green-500 bg-green-500/10";
      case "medium": return "text-blue-500 bg-blue-500/10";
      case "hard": return "text-orange-500 bg-orange-500/10";
      case "expert": return "text-red-500 bg-red-500/10 border-red-500";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tombol Tambah */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Tambah Misi Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-50">
            <DialogHeader>
              <DialogTitle>Buat Misi Baru</DialogTitle>
              <DialogDescription className="text-slate-400">
                Tentukan targetmu. AI akan menghitung reward secara otomatis nanti.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateQuest} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Misi</Label>
                <Input id="title" placeholder="Cth: Selesaikan Bab 3 Skripsi" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-slate-800 border-slate-700" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Deskripsi Singkat</Label>
                <Input id="desc" placeholder="Cth: Minimal 5 halaman" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-slate-800 border-slate-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diff">Tingkat Kesulitan</Label>
                  <select id="diff" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat">Kategori</Label>
                  <select id="cat" value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="work">Work (Kerja)</option>
                    <option value="learning">Learning (Belajar)</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 w-full mt-4">
                  {isLoading ? "Menyimpan..." : "Simpan Misi"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid Quest Cards */}
      {isLoading ? (
        <div className="text-center text-slate-500 py-10">Memuat misi...</div>
      ) : quests.length === 0 ? (
        <div className="text-center text-slate-500 py-10 border-2 border-dashed border-slate-800 rounded-lg">
          Belum ada misi. Tambahkan misi pertamamu untuk mulai mendapatkan Gold!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map((quest) => (
            <Card key={quest._id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold text-slate-50">{quest.title}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider ${getDifficultyColor(quest.difficulty)}`}>
                    {quest.difficulty}
                  </span>
                </div>
                <CardDescription className="text-slate-400 mt-2 line-clamp-2">
                  {quest.description || "Tidak ada deskripsi."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex gap-4 text-sm font-medium">
                  <div className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                    <Star className="w-4 h-4 mr-1" /> +{quest.rewards.xp} XP
                  </div>
                  <div className="flex items-center text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
                    <Coins className="w-4 h-4 mr-1" /> +{quest.rewards.gold} Gold
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => router.push(`/dashboard/focus?questId=${quest._id}`)}
                  className="w-full bg-slate-800 hover:bg-indigo-600 text-slate-50 transition-colors"
                >
                  <Play className="w-4 h-4 mr-2" /> Kerjakan Sekarang
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}