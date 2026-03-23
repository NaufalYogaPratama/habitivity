"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // <-- Tambahkan import Image
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    Coins,
    Sparkles,
    ShieldCheck,
    Zap,
    Crown,
    Check,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ShopItem {
    _id: string;
    name: string;
    description: string;
    type: 'avatar_item' | 'boost' | 'theme' | 'exclusive';
    subType?: 'helm' | 'armor' | 'weapon' | 'accessory';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    price: number;
    icon: string;
}

export default function ShopClient() {
    const [items, setItems] = useState<ShopItem[]>([]);
    const [userGold, setUserGold] = useState(0);
    const [ownedItems, setOwnedItems] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [subFilter, setSubFilter] = useState<string>("all");
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [shopRes, userRes] = await Promise.all([
                fetch("/api/shop"),
                fetch("/api/user/stats")
            ]);

            if (shopRes.ok && userRes.ok) {
                const shopData = await shopRes.json();
                const userData = await userRes.json();
                setItems(shopData.items || []);
                setUserGold(userData.stats?.gold || 0);
                setOwnedItems(userData.inventory || []);
            }
        } catch (error) {
            toast.error("Gagal memuat data toko");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePurchase = async (item: ShopItem) => {
        setIsPurchasing(true);
        if (userGold < item.price) {
            toast.error("Gold tidak cukup! Kumpulkan lebih banyak dari misi.");
            return;
        }

        try {
            const res = await fetch("/api/shop/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId: item._id }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(`Berhasil membeli ${item.name}! 🚀`);
                setUserGold(data.userStats.gold);
                setOwnedItems(prev => [...prev, item.name]);
                setSelectedItem(null); // Tutup modal setelah sukses
            } else {
                toast.error(data.error || "Gagal melakukan pembelian");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setIsPurchasing(false);
        }
    };

    const filteredItems = items.filter(item => {
        let matchesMainFilter = true;
        if (filter !== "all") {
            if (filter === "equipment") {
                matchesMainFilter = item.type === "avatar_item";
            } else {
                matchesMainFilter = item.type === filter;
            }
        }

        let matchesSubFilter = true;
        // Hanya aplikasikan filter tipe pada Equipment
        if (filter === "equipment" && subFilter !== "all" && item.type === "avatar_item") {
            matchesSubFilter = item.subType === subFilter;
        }

        return matchesMainFilter && matchesSubFilter;
    });

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case "common": return "from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-400";
            case "rare": return "from-blue-500/20 to-indigo-600/20 border-blue-500/30 text-blue-400";
            case "epic": return "from-purple-500/20 to-fuchsia-600/20 border-purple-500/30 text-purple-400";
            case "legendary": return "from-fuchsia-400/20 to-pink-600/20 border-fuchsia-400/30 text-fuchsia-400"; // Ubah jadi pink/fuchsia agar tak oren
            default: return "from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-400";
        }
    };

    return (
        <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-7 min-w-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                        {/* PERUBAHAN: Emoji diganti gambar icon-shop */}
                        <Image
                            src="/assets/logo/icon-shop.png"
                            alt="Shop"
                            width={32}
                            height={32}
                            className="object-contain drop-shadow-md"
                            priority
                        />
                        Marketplace
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Gunakan Gold untuk memperkuat avatar dan progress.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-[#151823] border border-white/[0.06] rounded-2xl px-6 py-3 shadow-xl shadow-black/20">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Saldo Gold</span>
                        <div className="flex items-center gap-2">
                            <Coins className="w-5 h-5 text-amber-400" />
                            <span className="text-xl font-black text-white">{userGold.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {[
                        { id: "all", label: "Semua", icon: <Sparkles className="w-4 h-4" /> },
                        { id: "equipment", label: "Equipment", icon: <ShieldCheck className="w-4 h-4" /> },
                        { id: "boost", label: "Boosters", icon: <Zap className="w-4 h-4" /> },
                        { id: "exclusive", label: "Eksklusif", icon: <Crown className="w-4 h-4" /> },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => {
                                setFilter(t.id);
                                if (t.id !== "equipment") setSubFilter("all");
                            }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${filter === t.id
                                ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20' // <-- Warna aktif filter diganti ungu
                                : 'bg-[#151823] border-white/[0.06] text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {/* Sub-filters KHUSUS untuk Equipment */}
                {filter === "equipment" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex gap-2 mb-2 overflow-x-auto no-scrollbar"
                    >
                        {[
                            { id: "all", label: "Semua Slot" },
                            { id: "helm", label: "🪖 Helm" },
                            { id: "armor", label: "👕 Armor" },
                            { id: "weapon", label: "⚔️ Weapon" },
                            { id: "accessory", label: "💍 Accessory" },
                        ].map((sub) => (
                            <button
                                key={sub.id}
                                onClick={() => setSubFilter(sub.id)}
                                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all border whitespace-nowrap ${subFilter === sub.id
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-transparent border-white/[0.04] text-slate-500 hover:text-slate-400 hover:bg-white/[0.02]'
                                    }`}
                            >
                                {sub.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Grid Shop Items */}
            <AnimatePresence mode="popLayout">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Image src="/assets/logo/icon-shop.png" alt="Loading Shop" width={48} height={48} className="mb-4 opacity-50" />
                        <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Membuka Etalase...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-20 bg-[#151823]/50 border-2 border-dashed border-white/[0.06] rounded-3xl">
                        <p className="text-slate-500">Stok sedang kosong pahlawan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredItems.map((item, idx) => {
                            const isOwned = ownedItems.includes(item.name);
                            return (
                                <motion.div
                                    layout
                                    key={item._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    {/* Hover border diganti ungu */}
                                    <Card className="bg-[#151823] border-white/[0.06] rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all group flex flex-col h-full shadow-xl shadow-black/20">
                                        <CardHeader className="pb-4 relative">
                                            <div className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-[8px] font-black border tracking-widest ${getRarityColor(item.rarity)}`}>
                                                {item.rarity.toUpperCase()}
                                            </div>
                                            <div className={`aspect-square rounded-2xl flex items-center justify-center text-5xl mb-4 bg-gradient-to-br transition-transform group-hover:scale-110 duration-500 ${getRarityColor(item.rarity)}`}>
                                                {item.icon}
                                            </div>
                                            <CardTitle className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{item.name}</CardTitle>
                                            <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                                        </CardHeader>

                                        <CardContent className="flex-grow">
                                            {item.type === 'avatar_item' && (
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Slot:</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">{item.subType}</span>
                                                </div>
                                            )}
                                        </CardContent>

                                        <CardFooter className="pt-0 pb-6">
                                            {isOwned ? (
                                                <div className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-bold text-xs">
                                                    <Check className="w-4 h-4" /> DIMILIKI
                                                </div>
                                            ) : (
                                                <Button
                                                    onClick={() => setSelectedItem(item)}
                                                    disabled={userGold < item.price}
                                                    className={`w-full h-12 rounded-xl font-bold flex items-center justify-between px-4 ${userGold >= item.price
                                                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20' // <-- Tombol beli diganti ungu
                                                        : 'bg-white/[0.03] border border-white/[0.06] text-slate-600'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Coins className="w-4 h-4" />
                                                        <span>{item.price.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                        <span className="text-[10px] uppercase">Beli</span>
                                                        <ArrowRight className="w-3 h-3" />
                                                    </div>
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </AnimatePresence>

            {/* Purchase Confirmation Dialog */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="sm:max-w-md bg-[#151823]/95 backdrop-blur-xl border border-white/[0.06] shadow-2xl shadow-black">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                            Konfirmasi Pembelian
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Apakah kamu yakin ingin menukarkan Gold milikmu dengan item ini?
                        </DialogDescription>
                    </DialogHeader>

                    {selectedItem && (
                        <div className="flex flex-col items-center py-6">
                            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-6xl shadow-lg mb-4 bg-gradient-to-br ${getRarityColor(selectedItem.rarity)}`}>
                                {selectedItem.icon}
                            </div>
                            <h3 className="text-lg font-black text-white">{selectedItem.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{selectedItem.type.replace('_', ' ').toUpperCase()}</p>

                            <div className="flex items-center gap-2 px-6 py-3 bg-[#0B0E14] border border-white/[0.04] rounded-xl">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Harga:</span>
                                <div className="flex items-center gap-1.5 ml-2">
                                    <Coins className="w-5 h-5 text-amber-400" />
                                    <span className="text-xl font-black text-white leading-none">{selectedItem.price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex gap-3 sm:justify-center border-t border-white/[0.04] pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedItem(null)}
                            disabled={isPurchasing}
                            className="flex-1 bg-transparent border-white/[0.1] text-white hover:bg-white/[0.05]"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={() => selectedItem && handlePurchase(selectedItem)}
                            disabled={isPurchasing || (selectedItem ? userGold < selectedItem.price : true)}
                            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/20"
                        >
                            {isPurchasing ? "Memproses..." : "Beli Sekarang"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}