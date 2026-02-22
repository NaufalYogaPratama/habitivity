"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
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
        return <div className="p-8 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">My Profile</h1>
                <p className="text-muted-foreground">Kelola informasi pribadi, kampus, dan tim Anda di sini.</p>
            </div>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle>Identitas Diri</CardTitle>
                    <CardDescription>Informasi dasar akun Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={profile.email}
                            disabled
                            className="bg-muted cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={profile.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                            placeholder="Masukkan username"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle>Regional & Kampus (Untuk Leaderboard)</CardTitle>
                    <CardDescription>Informasi ini akan digunakan untuk Regional dan University Leaderboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="city">Asal Kota</Label>
                        <Input
                            id="city"
                            value={profile.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            placeholder="Contoh: Semarang, Jakarta, Surabaya"
                        />
                    </div>

                    <div className="space-y-2 flex flex-col pt-4">
                        <Label htmlFor="university" className="mb-2">Pilih Kampus / Universitas</Label>
                        <Select
                            value={profile.university}
                            onValueChange={(value) => handleChange("university", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Kampus..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                                {indonesianUniversities.map((uni) => (
                                    <SelectItem key={uni} value={uni}>
                                        {uni}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground mt-1">
                            Pilih "Lainnya" jika kampusmu tidak ada di daftar.
                        </p>
                    </div>

                    {profile.university === "Lainnya" && (
                        <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2">
                            <Label htmlFor="customUniversity">Nama Kampus (Ketik Sendiri)</Label>
                            <Input
                                id="customUniversity"
                                value={profile.customUniversity}
                                placeholder="Masukkan nama kampusmu yang tepat"
                                onChange={(e) => handleChange("customUniversity", e.target.value)}
                            />
                            <p className="text-xs text-danger mb-2 text-red-500">
                                Pastikan teman kampusmu mengetik nama yang PERSIS SAMA agar poinnya bisa digabung di Leaderboard.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle>Tim / Klan (Guild)</CardTitle>
                    <CardDescription>Sistem tim kini telah dipindahkan ke fitur Klan. Bergabung atau buat Markas Klan Anda sendiri!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                        Poin (XP) tim akan otomatis digabungkan dari semua anggota Klan. Silakan kelola di halaman Klan.
                    </p>
                    <Button type="button" variant="outline" onClick={() => window.location.href = '/dashboard/teams'}>
                        Buka Halaman Klan
                    </Button>
                </CardContent>
            </Card>

            <div className="flex justify-end pb-12">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
            </div>
        </div>
    );
}
