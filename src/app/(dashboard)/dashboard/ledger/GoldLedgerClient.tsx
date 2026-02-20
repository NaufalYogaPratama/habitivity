'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    useLedgerStore,
    CATEGORIES,
    type ExpenseCategory,
    type CategoryConfig,
} from '@/lib/useLedgerStore';

// ─── Helpers ─────────────────────────────────────────────────────
function formatRupiah(amount: number): string {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function formatTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

// ─── BUDGET STATUS CARD ──────────────────────────────────────────
function BudgetStatusCard({
    percentage,
    spent,
    budget,
    status,
    shieldActive,
}: {
    percentage: number;
    spent: number;
    budget: number;
    status: 'under' | 'normal' | 'over';
    shieldActive: boolean;
}) {
    const clampedPct = Math.min(percentage, 100);
    const statusConfig = {
        under: { color: 'text-emerald-400', barColor: 'from-emerald-500 to-teal-400', label: 'Hemat! 🛡️', bg: 'bg-emerald-500/10' },
        normal: { color: 'text-amber-400', barColor: 'from-amber-500 to-orange-400', label: 'Normal', bg: 'bg-amber-500/10' },
        over: { color: 'text-red-400', barColor: 'from-red-500 to-rose-400', label: 'Over Budget! ⚠️', bg: 'bg-red-500/10' },
    };
    const cfg = statusConfig[status];

    return (
        <div className="bg-[#151823]/80 border border-white/[0.06] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <span>📊</span> Budget Hari Ini
                </h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="h-4 bg-white/[0.06] rounded-full overflow-hidden relative">
                    <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${cfg.barColor} relative`}
                        initial={false}
                        animate={{ width: `${clampedPct}%` }}
                        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                    </motion.div>
                </div>
                <div className="flex justify-between text-xs">
                    <span className={`font-bold ${cfg.color}`}>{formatRupiah(spent)}</span>
                    <span className="text-slate-500">dari {formatRupiah(budget)}</span>
                </div>
            </div>

            {/* Percentage */}
            <div className="flex items-center justify-between">
                <span className={`text-2xl font-black ${cfg.color}`}>{Math.round(percentage)}%</span>
                {shieldActive && (
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl"
                    >
                        🛡️
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// ─── CATEGORY SELECTOR ───────────────────────────────────────────
function CategorySelector({
    selected,
    onSelect,
}: {
    selected: ExpenseCategory;
    onSelect: (c: ExpenseCategory) => void;
}) {
    return (
        <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
                const isActive = selected === cat.id;
                return (
                    <motion.button
                        key={cat.id}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => onSelect(cat.id)}
                        className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-all text-center
                            ${isActive
                                ? `${cat.bg} ring-1 ring-white/10`
                                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                            }`}
                    >
                        <span className="text-lg">{cat.icon}</span>
                        <span className={`text-[10px] font-medium ${isActive ? cat.color : 'text-slate-500'}`}>
                            {cat.label}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}

// ─── ADD EXPENSE FORM ────────────────────────────────────────────
function AddExpenseForm({ onAdd }: { onAdd: (amount: number, category: ExpenseCategory, note: string) => void }) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<ExpenseCategory>('food');
    const [note, setNote] = useState('');

    const handleSubmit = () => {
        const num = parseInt(amount.replace(/\D/g, ''), 10);
        if (!num || num <= 0) return;
        onAdd(num, category, note);
        setAmount('');
        setNote('');
    };

    return (
        <div className="bg-[#151823]/80 border border-white/[0.06] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <span>➕</span> Tambah Pengeluaran
            </h3>

            {/* Amount */}
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">Rp</span>
                <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setAmount(raw ? parseInt(raw, 10).toLocaleString('id-ID') : '');
                    }}
                    placeholder="0"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 pl-10 py-3 text-white text-lg font-bold placeholder:text-slate-600 focus:outline-none focus:border-purple-500/40 transition-colors"
                />
            </div>

            {/* Category */}
            <CategorySelector selected={category} onSelect={setCategory} />

            {/* Note */}
            <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Catatan (opsional)"
                maxLength={50}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/40 transition-colors"
            />

            {/* Submit */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-purple-600/20 transition-all"
            >
                Tambah Pengeluaran 💸
            </motion.button>
        </div>
    );
}

// ─── EXPENSE ITEM ────────────────────────────────────────────────
function ExpenseItem({ expense, onDelete }: { expense: { _id: string; amount: number; category: ExpenseCategory; note: string; date: string }; onDelete: (id: string) => void }) {
    const cat = CATEGORIES.find((c) => c.id === expense.category)!;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10, height: 0 }}
            className="flex items-center gap-3 py-3 px-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl transition-colors group"
        >
            <div className={`w-10 h-10 rounded-xl ${cat.bg} border flex items-center justify-center text-lg flex-shrink-0`}>
                {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-bold">{cat.label}</span>
                    <span className="text-slate-600 text-[10px]">{formatTime(expense.date)}</span>
                </div>
                {expense.note && (
                    <p className="text-slate-500 text-xs truncate">{expense.note}</p>
                )}
            </div>
            <span className="text-red-400 text-sm font-bold font-mono flex-shrink-0">-{formatRupiah(expense.amount)}</span>
            <button
                onClick={() => onDelete(expense._id)}
                className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all text-xs ml-1"
            >
                ✕
            </button>
        </motion.div>
    );
}

// ─── STATS ROW ───────────────────────────────────────────────────
function StatsRow({ spending, streak, gold }: { spending: number; streak: number; gold: number }) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {[
                { icon: '💸', label: 'Hari Ini', value: formatRupiah(spending), color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/15' },
                { icon: '🔥', label: 'Streak', value: `${streak} hari`, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/15' },
                { icon: '💰', label: 'Gold', value: gold.toString(), color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/15' },
            ].map((stat) => (
                <div key={stat.label} className={`${stat.bg} border rounded-xl p-3 text-center`}>
                    <span className="text-lg block">{stat.icon}</span>
                    <p className={`font-bold text-sm ${stat.color} mt-1`}>{stat.value}</p>
                    <p className="text-slate-600 text-[10px] font-medium mt-0.5">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}

// ─── SPENDING BY CATEGORY ────────────────────────────────────────
function SpendingBreakdown({ data }: { data: { category: CategoryConfig; total: number }[] }) {
    if (data.length === 0) return null;
    const maxTotal = Math.max(...data.map((d) => d.total));

    return (
        <div className="bg-[#151823]/80 border border-white/[0.06] rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <span>📈</span> Pengeluaran per Kategori
            </h3>
            <div className="space-y-2.5">
                {data.map(({ category: cat, total }) => (
                    <div key={cat.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                <span>{cat.icon}</span> {cat.label}
                            </span>
                            <span className={`text-xs font-bold font-mono ${cat.color}`}>{formatRupiah(total)}</span>
                        </div>
                        <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full bg-gradient-to-r ${cat.bg.includes('orange') ? 'from-orange-500 to-orange-400' : cat.bg.includes('blue') ? 'from-blue-500 to-blue-400' : cat.bg.includes('purple') ? 'from-purple-500 to-purple-400' : cat.bg.includes('pink') ? 'from-pink-500 to-pink-400' : cat.bg.includes('red') ? 'from-red-500 to-red-400' : cat.bg.includes('emerald') ? 'from-emerald-500 to-emerald-400' : cat.bg.includes('indigo') ? 'from-indigo-500 to-indigo-400' : 'from-slate-500 to-slate-400'}`}
                                initial={false}
                                animate={{ width: `${(total / maxTotal) * 100}%` }}
                                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── SAVINGS GOALS ───────────────────────────────────────────────
const GOAL_ICONS = ['🎯', '🏠', '✈️', '💻', '📱', '🎓', '💍', '🚗', '🎸', '🎁'];

function SavingsGoalCard({ goal, onAdd, onDelete }: {
    goal: { _id: string; name: string; icon: string; target: number; current: number };
    onAdd: (id: string, amount: number) => void;
    onDelete: (id: string) => void;
}) {
    const pct = goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0;
    const isDone = goal.current >= goal.target;
    const [addAmount, setAddAmount] = useState('');

    const handleAdd = () => {
        const num = parseInt(addAmount.replace(/\D/g, ''), 10);
        if (!num || num <= 0) return;
        onAdd(goal._id, num);
        setAddAmount('');
    };

    return (
        <div className={`bg-[#151823]/80 border rounded-2xl p-4 space-y-3 ${isDone ? 'border-emerald-500/30' : 'border-white/[0.06]'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                        <p className="text-white text-sm font-bold">{goal.name}</p>
                        <p className="text-slate-500 text-[10px]">{formatRupiah(goal.current)} / {formatRupiah(goal.target)}</p>
                    </div>
                </div>
                {isDone ? (
                    <span className="text-emerald-400 text-xs font-bold">✓ Tercapai!</span>
                ) : (
                    <button onClick={() => onDelete(goal._id)} className="text-slate-600 hover:text-red-400 text-xs transition-colors">✕</button>
                )}
            </div>

            {/* Progress */}
            <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${isDone ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-purple-500 to-fuchsia-400'}`}
                    initial={false}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                />
            </div>

            {!isDone && (
                <div className="flex gap-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={addAmount}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            setAddAmount(raw ? parseInt(raw, 10).toLocaleString('id-ID') : '');
                        }}
                        placeholder="Tambah tabungan..."
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-500/40 transition-colors"
                    />
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAdd}
                        className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/20 text-purple-300 rounded-lg text-xs font-bold transition-colors"
                    >
                        +
                    </motion.button>
                </div>
            )}
        </div>
    );
}

function AddGoalModal({ onAdd, onClose }: { onAdd: (name: string, icon: string, target: number) => void; onClose: () => void }) {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('🎯');
    const [target, setTarget] = useState('');

    const handleSubmit = () => {
        const num = parseInt(target.replace(/\D/g, ''), 10);
        if (!name.trim() || !num || num <= 0) return;
        onAdd(name.trim(), icon, num);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#151823] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm space-y-4"
            >
                <h3 className="text-white font-bold text-base">Target Tabungan Baru</h3>

                {/* Icon picker */}
                <div className="flex gap-2 flex-wrap">
                    {GOAL_ICONS.map((ic) => (
                        <button
                            key={ic}
                            onClick={() => setIcon(ic)}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg transition-all
                                ${icon === ic ? 'bg-purple-500/20 border-purple-500/30 ring-1 ring-purple-500/20' : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'}`}
                        >
                            {ic}
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama target (misal: MacBook)"
                    maxLength={30}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/40 transition-colors"
                />

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">Rp</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={target}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            setTarget(raw ? parseInt(raw, 10).toLocaleString('id-ID') : '');
                        }}
                        placeholder="Target"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 pl-10 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/40 transition-colors"
                    />
                </div>

                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-slate-400 text-sm font-bold hover:bg-white/[0.04] transition-colors">
                        Batal
                    </button>
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSubmit}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-bold shadow-lg shadow-purple-600/20"
                    >
                        Simpan
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── BUDGET SETUP CARD ───────────────────────────────────────────
function BudgetSetupCard({
    currentAmount,
    currentPeriod,
    isConfigured,
    onSave,
}: {
    currentAmount: number;
    currentPeriod: 'daily' | 'monthly';
    isConfigured: boolean;
    onSave: (amount: number, period: 'daily' | 'monthly') => void;
}) {
    const [amount, setAmount] = useState(currentAmount > 0 ? currentAmount.toLocaleString('id-ID') : '');
    const [period, setPeriod] = useState<'daily' | 'monthly'>(currentPeriod);
    const [editing, setEditing] = useState(!isConfigured);

    // If already configured, show compact view
    if (isConfigured && !editing) {
        return (
            <div className="bg-[#151823]/80 border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-xl">💳</span>
                    <div>
                        <p className="text-white text-sm font-bold">{formatRupiah(currentAmount)}<span className="text-slate-500 font-normal">/{currentPeriod === 'daily' ? 'hari' : 'bulan'}</span></p>
                        {currentPeriod === 'monthly' && (
                            <p className="text-slate-500 text-[10px]">≈ {formatRupiah(Math.round(currentAmount / 30))}/hari</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => { setAmount(currentAmount.toLocaleString('id-ID')); setPeriod(currentPeriod); setEditing(true); }}
                    className="text-purple-400 text-xs font-bold hover:text-purple-300 transition-colors"
                >
                    ✏️ Ubah
                </button>
            </div>
        );
    }

    const handleSave = () => {
        const num = parseInt(amount.replace(/\D/g, ''), 10);
        if (!num || num <= 0) return;
        onSave(num, period);
        setEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500/10 via-[#151823] to-fuchsia-500/10 border border-purple-500/20 rounded-2xl p-6 space-y-5"
        >
            <div className="text-center space-y-1">
                <span className="text-4xl block">💰</span>
                <h2 className="text-white font-black text-lg">{isConfigured ? 'Ubah Budget' : 'Atur Budget Kamu'}</h2>
                <p className="text-slate-500 text-xs">Tentukan batas pengeluaran untuk memulai</p>
            </div>

            {/* Period Toggle */}
            <div className="flex bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
                {([['daily', 'Harian'], ['monthly', 'Bulanan']] as const).map(([id, label]) => (
                    <button
                        key={id}
                        onClick={() => setPeriod(id)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all
                            ${period === id
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                : 'text-slate-400 hover:text-slate-300'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Amount Input */}
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">Rp</span>
                <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setAmount(raw ? parseInt(raw, 10).toLocaleString('id-ID') : '');
                    }}
                    placeholder={period === 'daily' ? '50.000' : '1.500.000'}
                    autoFocus
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 pl-10 py-3.5 text-white text-xl font-bold placeholder:text-slate-600 focus:outline-none focus:border-purple-500/40 transition-colors text-center"
                />
            </div>

            {/* Hint */}
            {period === 'monthly' && amount && (
                <p className="text-center text-slate-500 text-xs">
                    ≈ {formatRupiah(Math.round(parseInt(amount.replace(/\D/g, ''), 10) / 30))}/hari
                </p>
            )}

            {/* Save */}
            <div className="flex gap-2">
                {isConfigured && (
                    <button
                        onClick={() => setEditing(false)}
                        className="flex-1 py-3 rounded-xl border border-white/[0.08] text-slate-400 text-sm font-bold hover:bg-white/[0.04] transition-colors"
                    >
                        Batal
                    </button>
                )}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-600/20 transition-all"
                >
                    {isConfigured ? 'Simpan Perubahan' : 'Mulai Tracking 🚀'}
                </motion.button>
            </div>
        </motion.div>
    );
}

// ─── BUDGET ALERT BANNER ─────────────────────────────────────────
function BudgetAlertBanner({ percentage, status }: { percentage: number; status: 'under' | 'normal' | 'over' }) {
    if (status !== 'over' && percentage < 80) return null;

    const isOver = status === 'over';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`rounded-xl p-3 flex items-center gap-3 border ${isOver
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-amber-500/10 border-amber-500/20'
                    }`}
            >
                <span className="text-xl">{isOver ? '🚨' : '⚠️'}</span>
                <div>
                    <p className={`text-xs font-bold ${isOver ? 'text-red-300' : 'text-amber-300'}`}>
                        {isOver ? 'Budget Terlampaui!' : 'Mendekati Batas Budget'}
                    </p>
                    <p className={`text-[10px] ${isOver ? 'text-red-400/60' : 'text-amber-400/60'}`}>
                        {isOver
                            ? `Pengeluaran ${Math.round(percentage)}% dari budget. -5 Gold penalty!`
                            : `Sudah ${Math.round(percentage)}% dari budget hari ini.`}
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function GoldLedgerClient() {
    const store = useLedgerStore();
    const [showAddGoal, setShowAddGoal] = useState(false);

    // Hydrate from MongoDB on mount
    useEffect(() => {
        store.hydrate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const todayExpenses = store.getTodayExpenses();
    const todaySpending = store.getTodaySpending();
    const dailyBudget = store.getDailyBudget();
    const budgetPct = store.getBudgetPercentage();
    const budgetStatus = store.getBudgetStatus();
    const categoryBreakdown = store.getSpendingByCategory();

    return (
        <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-7 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                        <span className="text-2xl sm:text-3xl">💰</span> Gold Ledger
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">Kelola keuangan, kumpulkan gold</p>
                </div>
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2">
                    <span className="text-lg">💰</span>
                    <span className="text-yellow-400 font-black text-lg">{store.gold}</span>
                    <span className="text-yellow-400/50 text-xs">Gold</span>
                </div>
            </div>

            {/* Budget Setup / Edit */}
            <BudgetSetupCard
                currentAmount={store.budgetAmount}
                currentPeriod={store.budgetPeriod}
                isConfigured={store.budgetConfigured}
                onSave={store.setBudget}
            />

            {/* Only show the rest if budget is configured */}
            {store.budgetConfigured && (
                <>
                    {/* Budget Alert */}
                    <BudgetAlertBanner percentage={budgetPct} status={budgetStatus} />

                    {/* Stats Row */}
                    <StatsRow spending={todaySpending} streak={store.savingStreak} gold={store.gold} />

                    {/* Budget Status */}
                    <BudgetStatusCard
                        percentage={budgetPct}
                        spent={todaySpending}
                        budget={dailyBudget}
                        status={budgetStatus}
                        shieldActive={store.shieldActive}
                    />

                    {/* Add Expense */}
                    <AddExpenseForm onAdd={store.addExpense} />

                    {/* Today's Expenses */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <span>📋</span> Pengeluaran Hari Ini
                            </h3>
                            <span className="text-slate-600 text-xs">{todayExpenses.length} transaksi</span>
                        </div>

                        {todayExpenses.length === 0 ? (
                            <div className="bg-[#151823]/50 border border-white/[0.04] rounded-2xl p-8 text-center">
                                <p className="text-3xl mb-2">🎉</p>
                                <p className="text-slate-500 text-sm">Belum ada pengeluaran hari ini</p>
                                <p className="text-slate-600 text-xs mt-1">Hemat terus untuk dapat Gold bonus!</p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <AnimatePresence mode="popLayout">
                                    {todayExpenses.map((expense) => (
                                        <ExpenseItem
                                            key={expense._id}
                                            expense={expense}
                                            onDelete={store.deleteExpense}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Spending Breakdown */}
                    <SpendingBreakdown data={categoryBreakdown} />

                    {/* Savings Goals */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <span>🎯</span> Target Tabungan
                            </h3>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAddGoal(true)}
                                className="text-purple-400 text-xs font-bold hover:text-purple-300 transition-colors"
                            >
                                + Tambah
                            </motion.button>
                        </div>

                        {store.savingsGoals.length === 0 ? (
                            <div className="bg-[#151823]/50 border border-white/[0.04] rounded-2xl p-6 text-center">
                                <p className="text-2xl mb-2">🏦</p>
                                <p className="text-slate-500 text-sm">Belum ada target tabungan</p>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setShowAddGoal(true)}
                                    className="mt-3 px-4 py-2 bg-purple-600/20 border border-purple-500/20 text-purple-300 rounded-xl text-xs font-bold hover:bg-purple-600/30 transition-colors"
                                >
                                    Buat Target Pertama
                                </motion.button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {store.savingsGoals.map((goal) => (
                                    <SavingsGoalCard
                                        key={goal._id}
                                        goal={goal}
                                        onAdd={store.addToSavingsGoal}
                                        onDelete={store.deleteSavingsGoal}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Gamification Rules */}
            <div className="bg-[#151823]/50 border border-white/[0.04] rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <span>📖</span> Aturan Gold Ledger
                </h3>
                <div className="space-y-2">
                    {[
                        { icon: '🛡️', rule: 'Spending < 50% budget', result: '+10 Gold + Shield', color: 'text-emerald-400' },
                        { icon: '⚖️', rule: 'Spending 50-100% budget', result: 'Normal', color: 'text-amber-400' },
                        { icon: '⚠️', rule: 'Spending > 100% budget', result: '-5 Gold + Warning', color: 'text-red-400' },
                    ].map((r) => (
                        <div key={r.rule} className="flex items-center gap-3 text-xs">
                            <span className="text-base">{r.icon}</span>
                            <span className="text-slate-400 flex-1">{r.rule}</span>
                            <span className={`font-bold ${r.color}`}>{r.result}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Spacer for mobile */}
            <div className="h-4" />

            {/* Add Goal Modal */}
            <AnimatePresence>
                {showAddGoal && (
                    <AddGoalModal
                        onAdd={store.addSavingsGoal}
                        onClose={() => setShowAddGoal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
