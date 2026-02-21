'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
    const [users, setUsers] = useState(initialUsers);

    // Modal state
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form state for editing
    const [editLevel, setEditLevel] = useState(1);
    const [editHp, setEditHp] = useState(100);
    const [editGold, setEditGold] = useState(0);

    const formatDate = (date: string | Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(date));
    };

    const openViewModal = (user: any) => {
        setSelectedUser(user);
        setEditLevel(user.stats?.level || 1);
        setEditHp(user.stats?.hp || 100);
        setEditGold(user.stats?.gold || 0);
        setIsEditing(false);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsEditing(false);
    };

    const handleBanToggle = async (id: string, currentStatus: string) => {
        const action = currentStatus === 'banned' ? 'unban' : 'ban';
        const msg = action === 'ban'
            ? 'Are you sure you want to BAN this user? They will not be able to log in anymore.'
            : 'Are you sure you want to UNBAN this user? They will be able to log in again.';

        if (!confirm(msg)) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action })
            });

            if (res.ok) {
                setUsers(prev => prev.map(u => {
                    if (u._id === id) return { ...u, accountStatus: action === 'ban' ? 'banned' : 'active' };
                    return u;
                }));
            } else {
                alert('Action failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedUser) return;
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedUser._id,
                    action: 'edit',
                    payload: { level: Number(editLevel), hp: Number(editHp), gold: Number(editGold) }
                })
            });

            if (res.ok) {
                setUsers(prev => prev.map(u => {
                    if (u._id === selectedUser._id) {
                        return { ...u, stats: { ...u.stats, level: Number(editLevel), hp: Number(editHp), gold: Number(editGold) } };
                    }
                    return u;
                }));
                // Update selected user view directly
                setSelectedUser({ ...selectedUser, stats: { ...selectedUser.stats, level: editLevel, hp: editHp, gold: editGold } });
                setIsEditing(false);
            } else {
                alert('Edit failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6 space-y-6 relative">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span>👥</span> User Management
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">View and manage all registered heroes in Habitivity.</p>
                </div>
                <div className="text-sm font-medium px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                    Total: {users.length} Users
                </div>
            </div>

            <Card className="bg-[#151823] border-white/[0.06] overflow-hidden">
                <CardContent className="p-0 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Hero</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Account</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap text-center">Stats (Lv / HP / Gold)</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Joined</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {users.map((user: any) => {
                                const isBanned = user.accountStatus === 'banned';

                                return (
                                    <tr key={user._id.toString()} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-4 min-w-[200px]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner bg-[#0B0E14] border border-white/5">
                                                    🧑‍💻
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className={`font-bold text-sm transition-colors ${isBanned ? 'text-red-400 line-through opacity-70' : 'text-white group-hover:text-purple-400'}`}>
                                                            {user.username}
                                                        </p>
                                                    </div>
                                                    <p className="text-slate-500 text-xs">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${isBanned ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                                                <span className={`text-xs capitalize font-medium ${isBanned ? 'text-red-400' : 'text-slate-400'}`}>
                                                    {isBanned ? 'Banned' : 'Active'}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-4 text-center">
                                            <div className={`flex items-center justify-center gap-4 ${isBanned ? 'opacity-50' : ''}`}>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Lvl</span>
                                                    <span className="text-purple-400 font-black text-sm">{user.stats?.level || 1}</span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase">HP</span>
                                                    <span className="text-rose-400 font-black text-sm">{user.stats?.hp || 100}</span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Gold</span>
                                                    <span className="text-amber-400 font-black text-sm">{user.stats?.gold || 0}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 text-sm text-slate-400 whitespace-nowrap">
                                            {formatDate(user.createdAt)}
                                        </td>

                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openViewModal(user)}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.03] text-slate-300 hover:bg-white/10 hover:text-white transition-colors border border-white/[0.05]"
                                                >
                                                    View
                                                </button>
                                                {isBanned ? (
                                                    <button
                                                        onClick={() => handleBanToggle(user._id, user.accountStatus)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                                                    >
                                                        Unban
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleBanToggle(user._id, user.accountStatus)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                                                    >
                                                        Ban
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Modal Detail / Edit User */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-[#151823] border border-purple-500/30 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col font-sans overflow-hidden">
                        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
                            <h2 className="text-lg font-bold text-white">Player Details</h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors">
                                ✕
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            {!isEditing ? (
                                <>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Identity</p>
                                        <p className="text-white text-lg font-bold">{selectedUser.username}</p>
                                        <p className="text-slate-400 text-sm">{selectedUser.email}</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-[#0B0E14] p-3 rounded-xl border border-white/[0.04] text-center">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">Level</p>
                                            <p className="text-purple-400 font-black text-lg">{selectedUser.stats?.level}</p>
                                        </div>
                                        <div className="bg-[#0B0E14] p-3 rounded-xl border border-white/[0.04] text-center">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">HP</p>
                                            <p className="text-rose-400 font-black text-lg">{selectedUser.stats?.hp}</p>
                                        </div>
                                        <div className="bg-[#0B0E14] p-3 rounded-xl border border-white/[0.04] text-center">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">Gold</p>
                                            <p className="text-amber-400 font-black text-lg">{selectedUser.stats?.gold}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Inventory Stats</p>
                                        <p className="text-slate-300 text-sm">Total items owned: <span className="font-bold text-white">{selectedUser.inventory?.length || 0}</span></p>
                                        <p className="text-slate-300 text-sm">Longest Streak: <span className="font-bold text-white">{selectedUser.stats?.longestStreak || 0} days</span></p>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white p-2.5 rounded-xl font-bold transition-all text-sm"
                                    >
                                        Edit Gamification Stats
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Level</label>
                                        <input
                                            type="number"
                                            value={editLevel}
                                            onChange={(e) => setEditLevel(Number(e.target.value))}
                                            className="w-full bg-[#0B0E14] border border-white/[0.1] rounded-lg p-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">HP Remaining</label>
                                        <input
                                            type="number"
                                            max="100"
                                            value={editHp}
                                            onChange={(e) => setEditHp(Number(e.target.value))}
                                            className="w-full bg-[#0B0E14] border border-white/[0.1] rounded-lg p-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Gold Balance</label>
                                        <input
                                            type="number"
                                            value={editGold}
                                            onChange={(e) => setEditGold(Number(e.target.value))}
                                            className="w-full bg-[#0B0E14] border border-white/[0.1] rounded-lg p-2 text-white"
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-xl font-bold transition-all text-sm border border-white/10"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveEdit}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl font-bold transition-all text-sm"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
