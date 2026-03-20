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

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        city: "",
        university: "",
        customUniversity: "",
        team: ""
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
                        team: data.team || ""
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

            <div className="max-w-4xl space-y-6">
                <Card className="bg-[#151823] border-white/[0.06]">
                    <CardHeader className="border-b border-white/[0.04]">
                        <CardTitle className="text-white text-base font-bold">Identitas Diri</CardTitle>
                        <CardDescription className="text-slate-500 text-xs">Informasi dasar akun Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-400 text-sm">Email</Label>
                            <Input
                                id="email"
                                value={profile.email}
                                disabled
                                className="bg-white/[0.03] border-white/[0.08] text-slate-500 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-slate-400 text-sm">Username</Label>
                            <Input
                                id="username"
                                value={profile.username}
                                onChange={(e) => handleChange("username", e.target.value)}
                                placeholder="Masukkan username"
                                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-purple-500/40"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#151823] border-white/[0.06]">
                    <CardHeader className="border-b border-white/[0.04]">
                        <CardTitle className="text-white text-base font-bold">Regional & Kampus (Untuk Leaderboard)</CardTitle>
                        <CardDescription className="text-slate-500 text-xs">Informasi ini akan digunakan untuk Regional dan University Leaderboard.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-slate-400 text-sm">Asal Kota</Label>
                            <Input
                                id="city"
                                value={profile.city}
                                onChange={(e) => handleChange("city", e.target.value)}
                                placeholder="Contoh: Semarang, Jakarta, Surabaya"
                                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-purple-500/40"
                            />
                        </div>

                        <div className="space-y-2 flex flex-col pt-4">
                            <Label htmlFor="university" className="text-slate-400 text-sm mb-2">Pilih Kampus / Universitas</Label>
                            <Select
                                value={profile.university}
                                onValueChange={(value) => handleChange("university", value)}
                            >
                                <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white">
                                    <SelectValue placeholder="Pilih Kampus..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-y-auto bg-[#151823] border-white/[0.08] text-white">
                                    {indonesianUniversities.map((uni) => (
                                        <SelectItem key={uni} value={uni} className="text-white hover:bg-white/[0.05]">
                                            {uni}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-slate-500 mt-1">
                                Pilih "Lainnya" jika kampusmu tidak ada di daftar.
                            </p>
                        </div>

                        {profile.university === "Lainnya" && (
                            <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="customUniversity" className="text-slate-400 text-sm">Nama Kampus (Ketik Sendiri)</Label>
                                <Input
                                    id="customUniversity"
                                    value={profile.customUniversity}
                                    placeholder="Masukkan nama kampusmu yang tepat"
                                    onChange={(e) => handleChange("customUniversity", e.target.value)}
                                    className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-purple-500/40"
                                />
                                <p className="text-xs text-red-400 mb-2">
                                    Pastikan teman kampusmu mengetik nama yang PERSIS SAMA agar poinnya bisa digabung di Leaderboard.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-[#151823] border-white/[0.06]">
                    <CardHeader className="border-b border-white/[0.04]">
                        <CardTitle className="text-white text-base font-bold">Tim / Klan (Guild)</CardTitle>
                        <CardDescription className="text-slate-500 text-xs">Sistem tim kini telah dipindahkan ke fitur Klan. Bergabung atau buat Markas Klan Anda sendiri!</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <p className="text-sm text-slate-400">
                            Poin (XP) tim akan otomatis digabungkan dari semua anggota Klan. Silakan kelola di halaman Klan.
                        </p>
                        <Button type="button" variant="outline" onClick={() => window.location.href = '/dashboard/teams'}
                            className="bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.06]">
                            Buka Halaman Klan
                        </Button>
                    </CardContent>
                </Card>

                <div className="flex justify-end pb-12">
                    <Button onClick={handleSave} disabled={isSaving}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/20 rounded-xl h-11 px-6">
                        {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
