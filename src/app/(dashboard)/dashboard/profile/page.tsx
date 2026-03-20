"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Image from "next/image";
import { indonesianUniversities } from "@/data/universities";
import { UserAvatar } from "@/components/ui/UserAvatar";
import Link from "next/link";

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        city: "",
        university: "",
        customUniversity: "",
        team: "",
        avatar: null as any,
        level: 1,
        xp: 0
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/user/profile");
                if (res.ok) {
                    const data = await res.json();

                    const dbUni = data.regional?.university || "";
                    let isCustom = false;
                    if (dbUni && !indonesianUniversities.includes(dbUni)) {
                        isCustom = true;
                    }

                    setProfile({
                        username: data.username || "",
                        email: data.email || "",
                        city: data.regional?.city || "",
                        university: isCustom ? "Lainnya" : dbUni,
                        customUniversity: isCustom ? dbUni : "",
                        team: data.team || "",
                        avatar: data.avatar || null,
                        level: data.stats?.level || 1,
                        xp: data.stats?.xp || 0
                    });
                }
            } catch (error) {
                console.error("Failed to load profile", error);
                toast.error("Gagal memuat profil");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (field: string, value: string) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const finalUniversity = profile.university === "Lainnya" ? profile.customUniversity : profile.university;

            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: profile.username,
                    city: profile.city,
                    university: finalUniversity,
                    team: profile.team,
                }),
            });

            if (res.ok) {
                toast.success("Profil berhasil diperbarui!");
            } else {
                toast.error("Gagal memperbarui profil");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 flex items-center justify-center text-slate-400">Loading...</div>;
    }

    return (
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-7 min-w-0">
            {/* Header — Consistent with other dashboard pages */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                        <Image
                            src="/assets/logo/icon-profile.png"
                            alt="Profile"
                            width={32}
                            height={32}
                            className="object-contain drop-shadow-md"
                            priority
                        />
                        Profile
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">Kelola informasi pribadi, kampus, dan tim Anda di sini.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* ---------------- LEFT: PLAYER IDENTITY CARD ---------------- */}
                <div className="lg:col-span-4">
                    <Card className="bg-gradient-to-b from-[#151823] to-[#12141d] border-white/[0.06] overflow-hidden relative shadow-2xl">
                        {/* Immersive glow */}
                        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-500/20 to-transparent mix-blend-overlay"></div>

                        <CardContent className="p-8 pt-12 flex flex-col items-center justify-center relative z-10">
                            <UserAvatar avatar={profile.avatar} className="w-40 h-40 mb-5 ring-4 ring-white/10 shadow-2xl shadow-indigo-500/20" emojiSize="text-[80px]" showEvolution={true} />

                            <h2 className="text-3xl font-black text-white text-center tracking-tight mb-2">{profile.username}</h2>
                            <div className="flex items-center gap-2 mb-8">
                                <span className="px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 font-bold text-xs rounded-full uppercase tracking-wider">
                                    Lv. {profile.level}
                                </span>
                                <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold font-mono text-xs rounded-full">
                                    {profile.xp.toLocaleString()} XP
                                </span>
                            </div>

                            <Link href="/dashboard/avatar" className="w-full">
                                <Button className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all shadow-none">
                                    ⚙️ Kustomisasi Hero
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* ---------------- RIGHT: SETTINGS ---------------- */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Identitas Diri */}
                    <Card className="bg-[#151823]/80 border-white/[0.06]">
                        <CardHeader className="border-b border-white/[0.04]">
                            <CardTitle className="text-white text-base font-bold flex items-center gap-2"><span>👤</span> Informasi Akun</CardTitle>
                            <CardDescription className="text-slate-500 text-xs">Informasi dasar karakter Anda di Habitivity.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-400 text-sm">Email Aktif</Label>
                                <Input
                                    id="email"
                                    value={profile.email}
                                    disabled
                                    className="bg-black/20 border-white/[0.05] text-slate-500 cursor-not-allowed h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-slate-400 text-sm">Nick Username</Label>
                                <Input
                                    id="username"
                                    value={profile.username}
                                    onChange={(e) => handleChange("username", e.target.value)}
                                    placeholder="Masukkan nick game-mu"
                                    className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-indigo-500/50 h-12 font-bold"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Regional & Kampus */}
                    <Card className="bg-[#151823]/80 border-white/[0.06]">
                        <CardHeader className="border-b border-white/[0.04]">
                            <CardTitle className="text-white text-base font-bold flex items-center gap-2"><span>📍</span> Regional & Fraksi Kampus</CardTitle>
                            <CardDescription className="text-slate-500 text-xs">Pilih tempatmu untuk mewakili wilayah/kampus di tabel Leaderboard regional.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-slate-400 text-sm">Asal Kota / Regional</Label>
                                <Input
                                    id="city"
                                    value={profile.city}
                                    onChange={(e) => handleChange("city", e.target.value)}
                                    placeholder="Contoh: Semarang, Jakarta, Surabaya"
                                    className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-indigo-500/50 h-12"
                                />
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label htmlFor="university" className="text-slate-400 text-sm mb-1 block">Fraksi Kampus / Universitas</Label>
                                <Select
                                    value={profile.university}
                                    onValueChange={(value) => handleChange("university", value)}
                                >
                                    <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white h-12">
                                        <SelectValue placeholder="Pilih Kampus Pembelamu..." />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto bg-[#151823] border-white/[0.08] text-white">
                                        {indonesianUniversities.map((uni) => (
                                            <SelectItem key={uni} value={uni} className="text-white hover:bg-white/[0.05]">
                                                {uni}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-slate-500 mt-1.5">
                                    Pilih "Lainnya" jika kampus/sekolahmu belum masuk radar aliansi kami.
                                </p>
                            </div>

                            {profile.university === "Lainnya" && (
                                <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                                    <Label htmlFor="customUniversity" className="text-indigo-300 text-sm font-bold">Daftarkan Nama Fraksi Khusus</Label>
                                    <Input
                                        id="customUniversity"
                                        value={profile.customUniversity}
                                        placeholder="Ketik persis nama institusimu..."
                                        onChange={(e) => handleChange("customUniversity", e.target.value)}
                                        className="bg-black/20 border-white/[0.08] text-white placeholder:text-slate-600 focus:border-indigo-500/50 h-12 mt-1"
                                    />
                                    <p className="text-[11px] text-amber-400/80 leading-relaxed pt-1">
                                        ⚠️ Peringatan: Pastikan teman satu institusimu mengetik nama yang <strong>PERSIS SAMA BAHKAN KAPITALNYA</strong> agar poin XP aliansi kalian bisa terakumulasi menjadi satu Fraksi kuat di Leaderboard!
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Simpan Button */}
                    <div className="flex justify-end pt-4 pb-12">
                        <Button onClick={handleSave} disabled={isSaving}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xl shadow-indigo-600/20 rounded-xl h-14 px-8 text-base">
                            {isSaving ? "Menyimpan Data..." : "Simpan Formasi Profil"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
