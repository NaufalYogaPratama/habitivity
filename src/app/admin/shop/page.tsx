'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

export default function AdminShopPage() {
    const [items, setItems] = useState<ShopItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<Partial<ShopItem> | null>(null);

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
            const res = await fetch('/api/shop'); // public route GET
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
                // Update
                payload.id = isEditing._id;
                const res = await fetch('/api/admin/shop', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    setIsEditing(null);
                    fetchItems();
                    resetForm();
                }
            } else {
                // Create
                const res = await fetch('/api/admin/shop', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    setIsEditing(null);
                    fetchItems();
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Failed to save item:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const res = await fetch(`/api/admin/shop?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchItems();
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const startEdit = (item: ShopItem) => {
        setIsEditing(item);
        setName(item.name);
        setDescription(item.description);
        setType(item.type);
        setSubType(item.subType || 'none');
        setRarity(item.rarity);
        setPrice(item.price.toString());
        setIcon(item.icon);
    };

    const resetForm = () => {
        setIsEditing(null);
        setName('');
        setDescription('');
        setType('avatar_item');
        setSubType('helm');
        setRarity('common');
        setPrice('100');
        setIcon('📦');
    };

    return (
        <main className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Shop Management</h1>
                    <p className="text-slate-400 text-sm mt-1">Add, edit, or remove items from the global shop.</p>
                </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">
                {/* Database Items List */}
                <div className="xl:col-span-2 space-y-4">
                    <Card className="bg-[#151823] border-white/[0.06]">
                        <CardHeader>
                            <CardTitle className="text-white text-lg font-bold">Current Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="text-center py-8 text-slate-500">Loading items...</div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {items.map(item => (
                                        <div key={item._id} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                            <div className="w-12 h-12 rounded-lg bg-[#0B0E14] flex items-center justify-center text-3xl shrink-0">
                                                {item.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                                                    <span className="text-amber-400 text-xs font-bold leading-none">{item.price}g</span>
                                                </div>
                                                <p className="text-slate-500 text-[10px] mt-1">{item.type} • {item.rarity}</p>
                                                <div className="flex gap-2 mt-3">
                                                    <Button size="xs" variant="outline" className="h-6 px-2 text-[10px] bg-transparent border-white/[0.1] text-white" onClick={() => startEdit(item)}>Edit</Button>
                                                    <Button size="xs" variant="destructive" className="h-6 px-2 text-[10px] bg-red-500/20 text-red-500 border-none hover:bg-red-500/40" onClick={() => handleDelete(item._id)}>Delete</Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Editor Form */}
                <div className="xl:col-span-1">
                    <Card className="bg-[#151823] border-purple-500/20 sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-white">{isEditing ? 'Edit Item' : 'New Shop Item'}</CardTitle>
                            <CardDescription>Configure item stats and appearance.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSave} className="space-y-4">
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

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold">
                                        {isEditing ? 'Save Changes' : 'Create Item'}
                                    </Button>
                                    {isEditing && (
                                        <Button type="button" variant="outline" onClick={resetForm} className="bg-transparent border-white/[0.1] text-white hover:bg-white/5">
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
