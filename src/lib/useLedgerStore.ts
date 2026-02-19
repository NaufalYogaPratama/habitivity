import { create } from 'zustand';

// ─── Types ───────────────────────────────────────────────────────
export type ExpenseCategory =
    | 'food'
    | 'transport'
    | 'entertainment'
    | 'shopping'
    | 'bills'
    | 'health'
    | 'education'
    | 'other';

export interface CategoryConfig {
    id: ExpenseCategory;
    label: string;
    icon: string;
    color: string;
    bg: string;
}

export const CATEGORIES: CategoryConfig[] = [
    { id: 'food', label: 'Makanan', icon: '🍔', color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/20' },
    { id: 'transport', label: 'Transport', icon: '🚗', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/20' },
    { id: 'entertainment', label: 'Hiburan', icon: '🎮', color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/20' },
    { id: 'shopping', label: 'Belanja', icon: '🛒', color: 'text-pink-400', bg: 'bg-pink-500/15 border-pink-500/20' },
    { id: 'bills', label: 'Tagihan', icon: '📄', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/20' },
    { id: 'health', label: 'Kesehatan', icon: '💊', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/20' },
    { id: 'education', label: 'Edukasi', icon: '📚', color: 'text-indigo-400', bg: 'bg-indigo-500/15 border-indigo-500/20' },
    { id: 'other', label: 'Lainnya', icon: '📦', color: 'text-slate-400', bg: 'bg-slate-500/15 border-slate-500/20' },
];

export interface Expense {
    _id: string;
    amount: number;
    category: ExpenseCategory;
    note: string;
    date: string; // ISO string
}

export interface SavingsGoal {
    _id: string;
    name: string;
    icon: string;
    target: number;
    current: number;
}

export type BudgetStatus = 'under' | 'normal' | 'over';
export type BudgetPeriod = 'daily' | 'monthly';

// ─── Helpers ─────────────────────────────────────────────────────
function getTodayKey(): string {
    return new Date().toISOString().split('T')[0]; // "2026-02-20"
}

// ─── Store ───────────────────────────────────────────────────────
interface LedgerStore {
    // Data
    expenses: Expense[];
    budgetAmount: number;
    budgetPeriod: BudgetPeriod;
    budgetConfigured: boolean;
    gold: number;
    savingStreak: number;
    shieldActive: boolean;
    savingsGoals: SavingsGoal[];
    loading: boolean;

    // Actions
    addExpense: (amount: number, category: ExpenseCategory, note: string) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    setBudget: (amount: number, period: BudgetPeriod) => Promise<void>;
    addSavingsGoal: (name: string, icon: string, target: number) => Promise<void>;
    deleteSavingsGoal: (id: string) => Promise<void>;
    addToSavingsGoal: (id: string, amount: number) => Promise<void>;
    hydrate: () => Promise<void>;

    // Computed
    getDailyBudget: () => number;
    getTodayExpenses: () => Expense[];
    getTodaySpending: () => number;
    getBudgetStatus: () => BudgetStatus;
    getBudgetPercentage: () => number;
    getSpendingByCategory: () => { category: CategoryConfig; total: number }[];
}

export const useLedgerStore = create<LedgerStore>((set, get) => ({
    expenses: [],
    budgetAmount: 0,
    budgetPeriod: 'daily',
    budgetConfigured: false,
    gold: 0,
    savingStreak: 0,
    shieldActive: false,
    savingsGoals: [],
    loading: true,

    // Hydrate from MongoDB on mount
    hydrate: async () => {
        try {
            set({ loading: true });

            // Fetch config + today's expenses + user stats in parallel
            const today = getTodayKey();
            const [configRes, expensesRes, statsRes] = await Promise.all([
                fetch('/api/ledger/config'),
                fetch(`/api/ledger/expenses?date=${today}`),
                fetch('/api/user/stats'),
            ]);

            const configData = configRes.ok ? await configRes.json() : { config: {} };
            const expensesData = expensesRes.ok ? await expensesRes.json() : { expenses: [] };
            const statsData = statsRes.ok ? await statsRes.json() : { stats: {} };

            const config = configData.config || {};
            const budgetAmount = config.budgetAmount || 0;

            set({
                expenses: expensesData.expenses || [],
                budgetAmount,
                budgetPeriod: config.budgetPeriod || 'daily',
                budgetConfigured: budgetAmount > 0,
                gold: statsData.stats?.gold || 0,
                savingStreak: config.savingStreak || 0,
                shieldActive: config.shieldActive || false,
                savingsGoals: (config.savingsGoals || []).map((g: SavingsGoal & { _id: string }) => ({
                    ...g,
                    _id: g._id?.toString() || g._id,
                })),
                loading: false,
            });
        } catch (err) {
            console.error('Failed to hydrate ledger:', err);
            set({ loading: false });
        }
    },

    addExpense: async (amount, category, note) => {
        try {
            const res = await fetch('/api/ledger/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, category, note }),
            });

            if (!res.ok) return;

            const { entry, goldDelta } = await res.json();

            const state = get();
            set({
                expenses: [entry, ...state.expenses],
                gold: Math.max(0, state.gold + (goldDelta || 0)),
            });
        } catch (err) {
            console.error('Failed to add expense:', err);
        }
    },

    deleteExpense: async (id) => {
        try {
            const res = await fetch('/api/ledger/expenses', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) return;

            const state = get();
            set({ expenses: state.expenses.filter((e) => e._id !== id) });
        } catch (err) {
            console.error('Failed to delete expense:', err);
        }
    },

    setBudget: async (amount, period) => {
        try {
            const res = await fetch('/api/ledger/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ budgetAmount: amount, budgetPeriod: period }),
            });

            if (!res.ok) return;

            set({ budgetAmount: amount, budgetPeriod: period, budgetConfigured: true });
        } catch (err) {
            console.error('Failed to set budget:', err);
        }
    },

    addSavingsGoal: async (name, icon, target) => {
        try {
            const res = await fetch('/api/ledger/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, icon, target }),
            });

            if (!res.ok) return;

            const { config } = await res.json();
            set({
                savingsGoals: (config.savingsGoals || []).map((g: SavingsGoal & { _id: string }) => ({
                    ...g,
                    _id: g._id?.toString() || g._id,
                })),
            });
        } catch (err) {
            console.error('Failed to add goal:', err);
        }
    },

    deleteSavingsGoal: async (goalId) => {
        try {
            const res = await fetch('/api/ledger/goals', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goalId }),
            });

            if (!res.ok) return;

            const state = get();
            set({ savingsGoals: state.savingsGoals.filter((g) => g._id !== goalId) });
        } catch (err) {
            console.error('Failed to delete goal:', err);
        }
    },

    addToSavingsGoal: async (goalId, amount) => {
        try {
            const res = await fetch('/api/ledger/goals', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goalId, amount }),
            });

            if (!res.ok) return;

            const { newCurrent } = await res.json();

            const state = get();
            set({
                savingsGoals: state.savingsGoals.map((g) =>
                    g._id === goalId ? { ...g, current: newCurrent } : g
                ),
            });
        } catch (err) {
            console.error('Failed to add to goal:', err);
        }
    },

    // ─── Computed ────────────────────────────
    getDailyBudget: () => {
        const state = get();
        if (state.budgetPeriod === 'monthly') return Math.round(state.budgetAmount / 30);
        return state.budgetAmount;
    },

    getTodayExpenses: () => {
        const state = get();
        const today = getTodayKey();
        return state.expenses.filter((e) => e.date.startsWith(today));
    },

    getTodaySpending: () => {
        return get().getTodayExpenses().reduce((sum, e) => sum + e.amount, 0);
    },

    getBudgetStatus: (): BudgetStatus => {
        const pct = get().getBudgetPercentage();
        if (pct < 50) return 'under';
        if (pct <= 100) return 'normal';
        return 'over';
    },

    getBudgetPercentage: () => {
        const dailyBudget = get().getDailyBudget();
        if (dailyBudget <= 0) return 0;
        return (get().getTodaySpending() / dailyBudget) * 100;
    },

    getSpendingByCategory: () => {
        const todayExpenses = get().getTodayExpenses();
        const map = new Map<ExpenseCategory, number>();

        todayExpenses.forEach((e) => {
            map.set(e.category, (map.get(e.category) || 0) + e.amount);
        });

        return CATEGORIES
            .filter((c) => map.has(c.id))
            .map((c) => ({ category: c, total: map.get(c.id)! }))
            .sort((a, b) => b.total - a.total);
    },
}));
