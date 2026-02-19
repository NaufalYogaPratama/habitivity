import { create } from 'zustand';

export type FocusMode = 'deep-work' | 'quick-sprint' | 'marathon';

export interface FocusModeConfig {
    id: FocusMode;
    label: string;
    duration: number; // in seconds
    icon: string;
    description: string;
    xpReward: number;
    gradient: string;
    border: string;
}

export const FOCUS_MODES: FocusModeConfig[] = [
    {
        id: 'quick-sprint',
        label: 'Quick Sprint',
        duration: 25 * 60,
        icon: '⚡',
        description: 'Fast & focused burst',
        xpReward: 50,
        gradient: 'from-amber-500/30 via-orange-500/20 to-red-500/20',
        border: 'border-amber-500/20 hover:border-amber-500/40',
    },
    {
        id: 'deep-work',
        label: 'Deep Work',
        duration: 50 * 60,
        icon: '🧠',
        description: 'Deep concentration flow',
        xpReward: 120,
        gradient: 'from-purple-500/30 via-fuchsia-500/20 to-pink-500/20',
        border: 'border-purple-500/20 hover:border-purple-500/40',
    },
    {
        id: 'marathon',
        label: 'Marathon',
        duration: 90 * 60,
        icon: '🔥',
        description: 'Extended endurance session',
        xpReward: 250,
        gradient: 'from-emerald-500/30 via-teal-500/20 to-cyan-500/20',
        border: 'border-emerald-500/20 hover:border-emerald-500/40',
    },
];

export type SessionState = 'idle' | 'running' | 'paused' | 'completed' | 'gave-up';

interface FocusStore {
    // Timer
    selectedMode: FocusMode;
    timeRemaining: number;
    totalTime: number;
    sessionState: SessionState;

    // HP
    hp: number;
    hpPenaltyCount: number;

    // Stats
    sessionsCompleted: number;
    totalFocusTime: number;
    currentStreak: number;

    // Actions
    selectMode: (mode: FocusMode) => void;
    startSession: () => void;
    pauseSession: () => void;
    resumeSession: () => void;
    giveUp: () => void;
    completeSession: () => void;
    tick: () => void;
    penalizeHP: () => void;
    resetToIdle: () => void;
}

export const useFocusStore = create<FocusStore>((set, get) => ({
    selectedMode: 'quick-sprint',
    timeRemaining: 25 * 60,
    totalTime: 25 * 60,
    sessionState: 'idle',

    hp: 100,
    hpPenaltyCount: 0,

    sessionsCompleted: 0,
    totalFocusTime: 0,
    currentStreak: 0,

    selectMode: (mode) => {
        const config = FOCUS_MODES.find((m) => m.id === mode)!;
        set({
            selectedMode: mode,
            timeRemaining: config.duration,
            totalTime: config.duration,
            sessionState: 'idle',
        });
    },

    startSession: () => {
        set({
            sessionState: 'running',
            hp: 100,
            hpPenaltyCount: 0,
        });
    },

    pauseSession: () => set({ sessionState: 'paused' }),
    resumeSession: () => set({ sessionState: 'running' }),

    giveUp: () => {
        const state = get();
        const elapsed = state.totalTime - state.timeRemaining;
        set({
            sessionState: 'gave-up',
            totalFocusTime: state.totalFocusTime + elapsed,
            currentStreak: 0,
        });
    },

    completeSession: () => {
        const state = get();
        set({
            sessionState: 'completed',
            sessionsCompleted: state.sessionsCompleted + 1,
            totalFocusTime: state.totalFocusTime + state.totalTime,
            currentStreak: state.currentStreak + 1,
        });
    },

    tick: () => {
        const state = get();
        if (state.sessionState !== 'running') return;
        if (state.timeRemaining <= 0) {
            get().completeSession();
            return;
        }
        set({ timeRemaining: state.timeRemaining - 1 });
    },

    penalizeHP: () => {
        const state = get();
        if (state.sessionState !== 'running') return;
        const newHP = Math.max(0, state.hp - 5);
        set({ hp: newHP, hpPenaltyCount: state.hpPenaltyCount + 1 });
        // If HP reaches 0, auto give up
        if (newHP <= 0) {
            get().giveUp();
        }
    },

    resetToIdle: () => {
        const state = get();
        const config = FOCUS_MODES.find((m) => m.id === state.selectedMode)!;
        set({
            timeRemaining: config.duration,
            totalTime: config.duration,
            sessionState: 'idle',
            hp: 100,
            hpPenaltyCount: 0,
        });
    },
}));
