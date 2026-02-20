"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingBag,
    Coins,
    Sparkles,
    ShieldCheck,
    Zap,
    Crown,
    Check,
    Lock,
    ArrowRight,
    Filter
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
            } else {
                toast.error(data.error || "Gagal melakukan pembelian");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem");
        }
    };

    const filteredItems = items.filter(item => {
        if (filter === "all") return true;
        if (filter === "equipment") return item.type === "avatar_item";
        return item.type === filter;
    });

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case "common": return "from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-400";
            case "rare": return "from-blue-500/20 to-indigo-600/20 border-blue-500/30 text-blue-400";
            case "epic": return "from-purple-500/20 to-fuchsia-600/20 border-purple-500/30 text-purple-400";
            case "legendary": return "from-amber-400/20 to-orange-600/20 border-amber-400/30 text-amber-400";
            default: return "from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-400";
        }
    };

    const getRarityLabel = (rarity: string) => {
        return rarity.toUpperCase();
    };

    return (
        <div className="space-y-8 px-4 sm:px-6 min-h-screen pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-amber-500/10 p-2 rounded-lg">
                            <ShoppingBag className="w-6 h-6 text-amber-500" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 tracking-tight">
                            MARKETPLACE
                        </h1>
                    </div>
                    <p className="text-slate-400 font-medium max-w-md">
                        Gunakan Gold hasil kerja kerasmu untuk memperkuat avatar dan mempercepat progress.
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
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                    { id: "all", label: "Semua", icon: <Sparkles className="w-4 h-4" /> },
                    { id: "equipment", label: "Equipment", icon: <ShieldCheck className="w-4 h-4" /> },
                    { id: "boost", label: "Boosters", icon: <Zap className="w-4 h-4" /> },
                    { id: "exclusive", label: "Eksklusif", icon: <Crown className="w-4 h-4" /> },
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setFilter(t.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${filter === t.id
                                ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/20'
                                : 'bg-[#151823] border-white/[0.06] text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* Grid Shop Items */}
            <AnimatePresence mode="popLayout">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <ShoppingBag className="w-12 h-12 text-slate-700 mb-4" />
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
                                    <Card className="bg-[#151823] border-white/[0.06] rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all group flex flex-col h-full shadow-xl shadow-black/20">
                                        <CardHeader className="pb-4 relative">
                                            <div className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-[8px] font-black border tracking-widest ${getRarityColor(item.rarity)}`}>
                                                {getRarityLabel(item.rarity)}
                                            </div>
                                            <div className={`aspect-square rounded-2xl flex items-center justify-center text-5xl mb-4 bg-gradient-to-br transition-transform group-hover:scale-110 duration-500 ${getRarityColor(item.rarity)}`}>
                                                {item.icon}
                                            </div>
                                            <CardTitle className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{item.name}</CardTitle>
                                            <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                                        </CardHeader>

                                        <CardContent className="flex-grow">
                                            {item.type === 'avatar_item' && (
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Slot:</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/80">{item.subType}</span>
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
                                                    onClick={() => handlePurchase(item)}
                                                    disabled={userGold < item.price}
                                                    className={`w-full h-12 rounded-xl font-bold flex items-center justify-between px-4 ${userGold >= item.price
                                                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20'
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
        </div>
    );
}
