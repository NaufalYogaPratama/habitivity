'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Pencil, Trash2 } from 'lucide-react';

interface ShopItem {
    _id: string;
    name: string;
    description: string;
    type: 'avatar_item' | 'boost' | 'theme' | 'exclusive';
    subType?: 'helm' | 'armor' | 'weapon' | 'accessory';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    price: number;
    icon: string;
    isActive: boolean;
    stats?: {
        xpMultiplier?: number;
        hpBonus?: number;
        shieldDuration?: number;
    };
}

const rarityColors: Record<string, string> = {
    common: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    rare: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    epic: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    legendary: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
};

export default function AdminShopClient() {
    const [items, setItems] = useState<ShopItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<Partial<ShopItem> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<ShopItem['type']>('avatar_item');
    const [subType, setSubType] = useState<ShopItem['subType'] | 'none'>('helm');
    const [rarity, setRarity] = useState<ShopItem['rarity']>('common');
    const [price, setPrice] = useState('100');
    const [icon, setIcon] = useState('📦');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/shop');
            const data = await res.json();
            if (data.items) {
                setItems(data.items);
            }
        } catch (error) {
            console.error('Failed to fetch items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {
            name,
            description,
            type,
            rarity,
            price: parseInt(price),
            icon,
            isActive: true,
        };

        if (type === 'avatar_item' && subType !== 'none') {
            payload.subType = subType;
        }

        try {
            if (isEditing && isEditing._id) {
                payload.id = isEditing._id;
                const res = await fetch('/api/admin/shop', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) { closeModal(); fetchItems(); }
            } else {
                const res = await fetch('/api/admin/shop', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) { closeModal(); fetchItems(); }
            }
        } catch (error) {
            console.error('Failed to save item:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            const res = await fetch(`/api/admin/shop?id=${id}`, { method: 'DELETE' });
            if (res.ok) { fetchItems(); }
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const openCreateModal = () => {
        resetFormFields();
        setIsEditing(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: ShopItem) => {
        setIsEditing(item);
        setName(item.name);
        setDescription(item.description);
        setType(item.type);
        setSubType(item.subType || 'none');
        setRarity(item.rarity);
        setPrice(item.price.toString());
        setIcon(item.icon);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(null);
        resetFormFields();
    };

    const resetFormFields = () => {
        setName('');
        setDescription('');
        setType('avatar_item');
        setSubType('helm');
        setRarity('common');
        setPrice('100');
        setIcon('📦');
    };

    return (
        <main className="w-full p-4 sm:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                        <Image
                            src="/assets/logo/icon-shop.png"
                            alt="Shop"
                            width={32}
                            height={32}
                            className="object-contain drop-shadow-md"
                            priority
                        />
                        Shop Management
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Add, edit, or remove items from the global shop.</p>
                </div>
                <Button
                    onClick={openCreateModal}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-2 shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Item</span>
                    <span className="sm:hidden">Add</span>
                </Button>
            </div>

            {/* Items Grid */}
            <Card className="bg-[#151823] border-white/[0.06]">
                <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg font-bold">
                        Current Items
                        <span className="ml-2 text-sm font-normal text-slate-500">({items.length})</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-12 text-slate-500">Loading items...</div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <p>No items yet.</p>
                            <Button onClick={openCreateModal} variant="outline" className="mt-3 bg-transparent border-white/10 text-white hover:bg-white/5">
                                Create your first item
                            </Button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {items.map(item => (
                                <div key={item._id} className="flex gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/20 transition-colors">
                                    <div className="w-11 h-11 rounded-lg bg-[#0B0E14] flex items-center justify-center text-2xl shrink-0">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${rarityColors[item.rarity]}`}>
                                                {item.rarity}
                                            </span>
                                            <span className="text-amber-400 text-xs font-bold">{item.price}g</span>
                                        </div>
                                        <p className="text-slate-600 text-[10px] mt-1">{item.type}</p>
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                                            >
                                                <Pencil className="w-3 h-3" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="flex items-center gap-1 text-[10px] text-red-500/70 hover:text-red-400 transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
                >
                    <div className="w-full max-w-md bg-[#151823] border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                            <div>
                                <h2 className="text-white font-bold text-lg">{isEditing ? 'Edit Item' : 'New Shop Item'}</h2>
                                <p className="text-slate-500 text-xs mt-0.5">Configure item stats and appearance.</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 max-h-[70vh] overflow-y-auto">
                            <form onSubmit={handleSave} className="space-y-4" id="shop-item-form">
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-400">Name</Label>
                                    <Input value={name} onChange={e => setName(e.target.value)} required className="bg-[#0B0E14] border-white/[0.1] text-white" placeholder="e.g. Master Sword" />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-400">Description</Label>
                                    <Textarea value={description} onChange={(e: any) => setDescription(e.target.value)} required className="bg-[#0B0E14] border-white/[0.1] text-white text-sm" placeholder="Item description..." />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-400">Rarity</Label>
                                        <Select value={rarity} onValueChange={(v: any) => setRarity(v)}>
                                            <SelectTrigger className="bg-[#0B0E14] border-white/[0.1] text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#151823] border-white/[0.1] text-white">
                                                <SelectItem value="common">Common</SelectItem>
                                                <SelectItem value="rare">Rare</SelectItem>
                                                <SelectItem value="epic">Epic</SelectItem>
                                                <SelectItem value="legendary">Legendary</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-400">Price (Gold)</Label>
                                        <Input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} required className="bg-[#0B0E14] border-white/[0.1] text-white" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-400">Type</Label>
                                        <Select value={type} onValueChange={(v: any) => setType(v)}>
                                            <SelectTrigger className="bg-[#0B0E14] border-white/[0.1] text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#151823] border-white/[0.1] text-white">
                                                <SelectItem value="avatar_item">Equipment</SelectItem>
                                                <SelectItem value="boost">Boost</SelectItem>
                                                <SelectItem value="theme">Theme</SelectItem>
                                                <SelectItem value="exclusive">Exclusive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-400">Emoji Icon</Label>
                                        <Input value={icon} onChange={e => setIcon(e.target.value)} required className="bg-[#0B0E14] border-white/[0.1] text-white text-center text-xl" />
                                    </div>
                                </div>

                                {type === 'avatar_item' && (
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-400">Equipment Slot</Label>
                                        <Select value={subType} onValueChange={(v: any) => setSubType(v)}>
                                            <SelectTrigger className="bg-[#0B0E14] border-white/[0.1] text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#151823] border-white/[0.1] text-white">
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="helm">Helm</SelectItem>
                                                <SelectItem value="armor">Armor</SelectItem>
                                                <SelectItem value="weapon">Weapon</SelectItem>
                                                <SelectItem value="accessory">Accessory</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-5 border-t border-white/[0.06]">
                            <Button type="button" variant="outline" onClick={closeModal} className="bg-transparent border-white/[0.1] text-white hover:bg-white/5">
                                Cancel
                            </Button>
                            <Button type="submit" form="shop-item-form" className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold">
                                {isEditing ? 'Save Changes' : 'Create Item'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
