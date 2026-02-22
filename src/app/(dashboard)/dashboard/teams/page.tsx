"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Shield, Users, Search, Target, Award, UserPlus, LogOut } from "lucide-react";

export default function TeamsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'mine' | 'explore' | 'create'>('mine');

    const [myTeam, setMyTeam] = useState<any>(null);
    const [exploreTeams, setExploreTeams] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [joinCode, setJoinCode] = useState("");

    // Create form
    const [newTeam, setNewTeam] = useState({ name: "", description: "", icon: "🛡️" });

    useEffect(() => {
        fetchMyTeam();
    }, []);

    const fetchMyTeam = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/teams/mine");
            const data = await res.json();
            if (data.team) {
                setMyTeam(data.team);
                setViewMode('mine');
            } else {
                setMyTeam(null);
                setViewMode('explore');
                fetchExploreTeams();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchExploreTeams = async (q = "") => {
        try {
            const res = await fetch(`/api/teams?q=${q}`);
            const data = await res.json();
            setExploreTeams(data.teams || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async () => {
        if (!newTeam.name) return toast.error("Nama klan harus diisi");
        try {
            const res = await fetch("/api/teams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTeam)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal membuat klan");

            toast.success("Klan berhasil dibuat!");
            fetchMyTeam();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleJoin = async (code: string) => {
        if (!code) return toast.error("Kode tidak boleh kosong");
        try {
            const res = await fetch("/api/teams/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ joinCode: code })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal masuk clan");

            toast.success("Berhasil bergabung ke clan!");
            fetchMyTeam();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleLeave = async () => {
        if (!confirm("Yakin ingin keluar dari klan? Jika Anda sendirian, klan akan dihapus permanen.")) return;
        try {
            const res = await fetch("/api/teams/leave", { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal keluar clan");

            toast.success("Anda keluar dari klan.");
            setMyTeam(null);
            setViewMode('explore');
            fetchExploreTeams();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-400">Loading klan data...</div>;

    return (
        <div className="p-4 sm:p-8 space-y-8 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 tracking-tight">
                        KLAN & GUILD
                    </h1>
                    <p className="text-slate-400 font-medium">Bentuk tim pahlawan dan raih skor tertinggi bersama-sama.</p>
                </div>
            </div>

            {myTeam && viewMode === 'mine' ? (
                /* ----------------- MY TEAM VIEW ----------------- */
                <div className="space-y-6">
                    {/* Header info */}
                    <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-white/[0.06] overflow-hidden relative">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

                        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-white/10 rounded-3xl border border-white/20 flex items-center justify-center text-5xl shadow-2xl backdrop-blur-md">
                                    {myTeam.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-black text-white tracking-tight">{myTeam.name}</h2>
                                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white uppercase border border-white/20">
                                            Lv. {myTeam.stats?.level}
                                        </span>
                                    </div>
                                    <p className="text-indigo-200 mt-2 max-w-md">{myTeam.description}</p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-lg border border-white/10">
                                            <span className="text-slate-400 text-xs">Total XP:</span>
                                            <span className="text-yellow-400 font-bold font-mono">{myTeam.stats?.totalXp?.toLocaleString() || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-lg border border-white/10">
                                            <span className="text-slate-400 text-xs text-nowrap">Invite Code (Khusus Teman):</span>
                                            <span className="text-green-400 font-bold font-mono select-all bg-white/5 px-2 rounded">{myTeam.joinCode}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="destructive"
                                onClick={handleLeave}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 md:self-start"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Keluar Klan
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Members List */}
                    <Card className="bg-[#151823] border-white/[0.06]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Users className="text-purple-400" />
                                Anggota Klan ({myTeam.membersList?.length}/50)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {myTeam.membersList?.map((member: any) => (
                                    <div key={member._id} className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-2xl flex items-center justify-between hover:bg-white/[0.05] transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 rounded-xl flex items-center justify-center text-xl">
                                                🧑‍🚀
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">{member.username}</p>
                                                <p className="text-xs text-slate-500">Level {member.level} • {member.xp} XP</p>
                                            </div>
                                        </div>
                                        {myTeam.leaderId === member._id && (
                                            <div className="px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-md text-[10px] uppercase font-black tracking-wider">
                                                Leader
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            ) : (
                /* ----------------- EXPLORE / CREATE VIEW ----------------- */
                <div className="space-y-8">
                    {/* Actions Nav */}
                    <div className="flex gap-4 border-b border-white/10 pb-4">
                        <Button
                            variant={viewMode === 'explore' ? 'default' : 'ghost'}
                            onClick={() => { setViewMode('explore'); fetchExploreTeams(); }}
                            className={viewMode === 'explore' ? 'bg-indigo-600' : ''}
                        >
                            Cari Klan
                        </Button>
                        <Button
                            variant={viewMode === 'create' ? 'default' : 'ghost'}
                            onClick={() => setViewMode('create')}
                            className={viewMode === 'create' ? 'bg-purple-600' : ''}
                        >
                            Buat Klan Baru
                        </Button>
                    </div>

                    {/* EXPLORE MODE */}
                    {viewMode === 'explore' && (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <Card className="bg-[#151823] border-white/[0.06] flex-1">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <Search className="text-slate-500 w-5 h-5 ml-2" />
                                        <Input
                                            placeholder="Cari nama klan..."
                                            value={searchQuery}
                                            onChange={(e) => { setSearchQuery(e.target.value); fetchExploreTeams(e.target.value); }}
                                            className="border-none bg-transparent focus-visible:ring-0 text-white shadow-none px-0"
                                        />
                                    </CardContent>
                                </Card>
                                <Card className="bg-[#151823] border-white/[0.06] w-full md:w-80">
                                    <CardContent className="p-2 pl-4 flex items-center gap-2">
                                        <Input
                                            placeholder="Join dgn Kode..."
                                            value={joinCode}
                                            onChange={(e) => setJoinCode(e.target.value)}
                                            className="border-none bg-transparent focus-visible:ring-0 text-white shadow-none px-0 uppercase h-10"
                                            maxLength={6}
                                        />
                                        <Button onClick={() => handleJoin(joinCode)} variant="secondary" className="h-10">Gabung</Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {exploreTeams.map(team => (
                                    <Card key={team._id} className="bg-[#151823] border-white/[0.06] hover:border-indigo-500/50 transition-colors group p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-lg shadow-black/50">
                                                        {team.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black text-white">{team.name}</h3>
                                                        <p className="text-xs text-slate-400 capitalize">Level {team.level}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-400 mb-6 line-clamp-2 min-h-10">{team.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 mt-auto">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                    <Users className="w-3 h-3 text-indigo-400" />
                                                    {team.memberCount}/50
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-mono font-bold">
                                                    <Award className="w-3 h-3 text-yellow-500" />
                                                    {team.totalXp.toLocaleString()} XP
                                                </div>
                                            </div>
                                            {/* Untuk bisa join klan tanpa kode jika open. Sementara asumsikan wajib kode atau tidak. Kita buat tombol Minta Kode atau Join Langsung */}
                                            {/* Sebenarnya kalau sistem Clash of Clans, search klan bisa lgsg Click -> Join jika tipe klannya "Open". Di db kita belum pakai limit open. Kita asumsikan saat search bisa tap "Join?" tapi butuh code, jadi sementara buat pamer aja klan yg ada :D */}
                                            <Button disabled className="h-8 text-[10px] uppercase font-bold tracking-wider px-3" variant="outline">
                                                Ask Code
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                                {exploreTeams.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-slate-500">
                                        Tidak ada klan yang ditemukan. Buat klan Anda sendiri!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {viewMode === 'create' && (
                        <div className="max-w-xl">
                            <Card className="bg-[#151823] border-white/[0.06]">
                                <CardHeader>
                                    <CardTitle>Membangun Markas Baru</CardTitle>
                                    <CardDescription>Buat nama dan deskripsi klan agar teman-teman Anda bisa bergabung.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400 font-medium">Ikon / Emoji Klan</label>
                                        <Input
                                            value={newTeam.icon}
                                            onChange={(e) => setNewTeam({ ...newTeam, icon: e.target.value })}
                                            className="text-4xl w-24 h-24 text-center p-0 rounded-2xl bg-white/5 border-white/10 mx-auto block cursor-pointer transition-colors focus:bg-white/10"
                                            maxLength={2}
                                            title="Masukkan 1-2 emoji untuk identitas"
                                        />
                                        <p className="text-center text-xs text-slate-500 mt-2">Ketik emoji favorit Anda 🛡️ ⚔️ 🔥 🎯 🐺 dll</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400 font-medium">Nama Klan <span className="text-red-500">*</span></label>
                                        <Input
                                            placeholder="Ex: Soegijapranata Squad"
                                            value={newTeam.name}
                                            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-600"
                                            maxLength={30}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400 font-medium">Deskripsi / Motto</label>
                                        <textarea
                                            placeholder="Ex: Pantang menyerah walau error melanda."
                                            value={newTeam.description}
                                            onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                                            className="w-full h-24 rounded-lg bg-white/5 border border-white/10 text-white p-3 text-sm resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
                                            maxLength={200}
                                        />
                                    </div>

                                    <Button onClick={handleCreate} className="w-full h-12 text-base font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-none">
                                        Mulai Petualangan
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
