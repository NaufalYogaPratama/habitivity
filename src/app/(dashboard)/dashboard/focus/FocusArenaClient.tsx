'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocusStore, FOCUS_MODES, type FocusMode } from '@/lib/useFocusStore';

// ─── Sound Effects (Web Audio API) ───────────────────────────────
function playTone(frequencies: number[], durations: number[], type: OscillatorType = 'sine', volume = 0.15) {
    try {
        const ctx = new AudioContext();
        let startTime = ctx.currentTime;
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(volume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + durations[i]);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + durations[i]);
            startTime += durations[i] * 0.7;
        });
    } catch { /* audio not supported */ }
}

const playCompleteSound = () => playTone([523, 659, 784, 1047], [0.15, 0.15, 0.15, 0.4], 'sine', 0.12);
const playGiveUpSound = () => playTone([400, 300, 200], [0.2, 0.2, 0.4], 'triangle', 0.1);
const playPenaltySound = () => playTone([300, 250], [0.1, 0.15], 'square', 0.05);
const playStartSound = () => playTone([440, 550, 660], [0.1, 0.1, 0.2], 'sine', 0.08);
const playTickSound = () => playTone([800], [0.03], 'sine', 0.02);

// ─── Break Suggestions ──────────────────────────────────────────
const BREAK_ACTIVITIES = [
    { icon: '🧘', title: 'Stretch & Breathe', desc: 'Do 5 deep breaths and stretch your arms', duration: '2 min' },
    { icon: '💧', title: 'Hydrate', desc: 'Drink a glass of water', duration: '1 min' },
    { icon: '🚶', title: 'Quick Walk', desc: 'Walk around your room or hallway', duration: '3 min' },
    { icon: '👀', title: 'Eye Rest', desc: 'Look at something 20ft away for 20 seconds', duration: '1 min' },
    { icon: '🎵', title: 'Listen to Music', desc: 'Play your favorite relaxing song', duration: '3 min' },
    { icon: '✏️', title: 'Doodle', desc: 'Draw something random on paper', duration: '2 min' },
    { icon: '🤸', title: 'Quick Exercise', desc: '10 jumping jacks or push ups', duration: '2 min' },
    { icon: '☕', title: 'Make a Drink', desc: 'Brew some tea or coffee', duration: '3 min' },
    { icon: '🌿', title: 'Look Outside', desc: 'Gaze out the window and relax', duration: '1 min' },
    { icon: '📱', title: 'Message a Friend', desc: 'Send a quick hello to someone', duration: '2 min' },
];

function getRandomBreaks(count: number) {
    const shuffled = [...BREAK_ACTIVITIES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// ─── Helpers ─────────────────────────────────────────────────────
function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ─── MODE SELECTION ──────────────────────────────────────────────
function ModeSelector({ selectedMode, onSelect }: { selectedMode: FocusMode; onSelect: (m: FocusMode) => void }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {FOCUS_MODES.map((mode) => {
                const isSelected = selectedMode === mode.id;
                return (
                    <motion.button
                        key={mode.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onSelect(mode.id)}
                        className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 border
                            ${isSelected
                                ? `bg-gradient-to-br ${mode.gradient} ${mode.border.split(' ')[0]} ring-2 ring-white/10 shadow-lg`
                                : `bg-[#151823]/80 border-white/[0.06] hover:bg-[#1a1f2e]`
                            }`}
                    >
                        {isSelected && (
                            <motion.div
                                layoutId="mode-glow"
                                className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                        <div className="relative z-10">
                            <span className="text-3xl sm:text-4xl block mb-3">{mode.icon}</span>
                            <h3 className="text-white font-bold text-sm sm:text-base">{mode.label}</h3>
                            <p className="text-slate-500 text-xs mt-1">{mode.description}</p>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                                <span className="text-slate-400 text-xs font-mono">{mode.duration / 60} min</span>
                                <span className="text-purple-400 text-xs font-bold">+{mode.xpReward} XP</span>
                            </div>
                        </div>
                        {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                <span className="text-white text-[10px]">✓</span>
                            </div>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}

// ─── CIRCULAR TIMER ──────────────────────────────────────────────
function CircularTimer({ timeRemaining, totalTime, isRunning }: { timeRemaining: number; totalTime: number; isRunning: boolean }) {
    const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) : 0;
    const radius = 130;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress * circumference);

    return (
        <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] mx-auto">
            {/* Ambient glow */}
            {isRunning && (
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-[-20px] rounded-full bg-purple-500/10 blur-2xl"
                />
            )}

            <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
                {/* Background circle */}
                <circle
                    cx="150" cy="150" r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="8"
                />
                {/* Progress circle */}
                <motion.circle
                    cx="150" cy="150" r={radius}
                    fill="none"
                    stroke="url(#timerGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
                {/* Glow circle */}
                <motion.circle
                    cx="150" cy="150" r={radius}
                    fill="none"
                    stroke="url(#timerGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    opacity={0.2}
                    style={{ filter: 'blur(8px)', transition: 'stroke-dashoffset 0.5s ease' }}
                />
                <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="50%" stopColor="#d946ef" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    key={timeRemaining}
                    initial={{ scale: 1.05, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight"
                >
                    {formatTime(timeRemaining)}
                </motion.span>
                {isRunning && (
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-1.5 mt-2"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span className="text-purple-400 text-xs font-medium uppercase tracking-wider">Focusing</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// ─── HP BAR ──────────────────────────────────────────────────────
function HPBar({ hp }: { hp: number }) {
    const isLow = hp <= 30;
    const isCritical = hp <= 10;

    return (
        <div className="w-full max-w-xs mx-auto">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    ❤️ HP
                </span>
                <span className={`text-xs font-mono font-bold ${isCritical ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {hp}/100
                </span>
            </div>
            <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden relative">
                {isLow && (
                    <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-red-500/20"
                    />
                )}
                <motion.div
                    className={`h-full rounded-full relative ${isCritical
                        ? 'bg-gradient-to-r from-red-600 to-red-400'
                        : isLow
                            ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                            : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                        }`}
                    initial={false}
                    animate={{ width: `${hp}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                </motion.div>
            </div>
        </div>
    );
}

// ─── SESSION COMPLETE ────────────────────────────────────────────
function SessionComplete({ xp, streak, onContinue }: { xp: number; streak: number; onContinue: () => void }) {
    const [breaks] = useState(() => getRandomBreaks(4));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="text-center space-y-6 max-w-md mx-auto"
        >
            {/* Celebration */}
            <div className="relative">
                {/* Confetti-like particles */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 0, x: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            y: [0, -60 - Math.random() * 40],
                            x: [(Math.random() - 0.5) * 120],
                        }}
                        transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' }}
                        className="absolute left-1/2 top-1/2 text-lg"
                    >
                        {['✨', '🎉', '⭐', '💫', '🏆', '🔥', '💎', '🌟'][i]}
                    </motion.div>
                ))}
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.6 }}
                    className="text-7xl sm:text-8xl mb-4"
                >
                    🏆
                </motion.div>
            </div>

            <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Session Complete!</h2>
                <p className="text-slate-400 text-sm">Great discipline, warrior!</p>
            </div>

            {/* Rewards */}
            <div className="flex justify-center gap-4">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-purple-500/15 border border-purple-500/20 rounded-2xl px-5 py-3 text-center"
                >
                    <p className="text-purple-400 text-2xl font-black">+{xp}</p>
                    <p className="text-purple-400/60 text-[10px] font-bold uppercase tracking-wider mt-0.5">XP Earned</p>
                </motion.div>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-amber-500/15 border border-amber-500/20 rounded-2xl px-5 py-3 text-center"
                >
                    <p className="text-amber-400 text-2xl font-black">{streak}🔥</p>
                    <p className="text-amber-400/60 text-[10px] font-bold uppercase tracking-wider mt-0.5">Streak</p>
                </motion.div>
            </div>

            {/* Break Suggestions */}
            <div>
                <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center justify-center gap-2">
                    <span>☕</span> Take a Break
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {breaks.map((b) => (
                        <motion.div
                            key={b.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-[#151823] border border-white/[0.06] rounded-xl p-3 text-left hover:bg-white/[0.04] transition-colors"
                        >
                            <span className="text-lg">{b.icon}</span>
                            <p className="text-white text-xs font-bold mt-1">{b.title}</p>
                            <p className="text-slate-600 text-[10px] mt-0.5">{b.desc}</p>
                            <p className="text-purple-400/60 text-[10px] font-mono mt-1">{b.duration}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onContinue}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-lg shadow-purple-600/20"
            >
                Start New Session
            </motion.button>
        </motion.div>
    );
}

// ─── GAVE UP SCREEN ──────────────────────────────────────────────
function GaveUpScreen({ onRetry }: { onRetry: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-5 max-w-sm mx-auto"
        >
            <div className="text-6xl sm:text-7xl mb-2">😤</div>
            <div>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-1">Session Ended</h2>
                <p className="text-slate-500 text-sm">Don&apos;t worry, try again! Every attempt counts.</p>
            </div>
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRetry}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-lg shadow-purple-600/20"
            >
                Try Again 💪
            </motion.button>
        </motion.div>
    );
}

// ─── TAB PENALTY WARNING ─────────────────────────────────────────
function TabPenaltyOverlay({ show, penaltyCount }: { show: boolean; penaltyCount: number }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-16 lg:top-4 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xl shadow-red-500/10">
                        <span className="text-xl">⚠️</span>
                        <div>
                            <p className="text-red-300 text-xs font-bold">Tab switch detected!</p>
                            <p className="text-red-400/60 text-[10px]">-5 HP penalty ({penaltyCount}x)</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── SESSION STATS ───────────────────────────────────────────────
function SessionStats({ sessions, totalTime, streak }: { sessions: number; totalTime: number; streak: number }) {
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return (
        <div className="grid grid-cols-3 gap-3">
            {[
                { icon: '🎯', label: 'Sessions', value: sessions, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/15' },
                { icon: '⏱️', label: 'Focus Time', value: timeStr, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/15' },
                { icon: '🔥', label: 'Streak', value: streak, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/15' },
            ].map((stat) => (
                <div key={stat.label} className={`${stat.bg} border rounded-xl p-3 text-center`}>
                    <span className="text-lg block">{stat.icon}</span>
                    <p className={`font-bold text-base ${stat.color} mt-1`}>{stat.value}</p>
                    <p className="text-slate-600 text-[10px] font-medium mt-0.5">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function FocusArenaClient() {
    const store = useFocusStore();
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hiddenAtRef = useRef<number | null>(null);
    const [showPenaltyWarning, setShowPenaltyWarning] = useState(false);
    const penaltyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const currentMode = FOCUS_MODES.find((m) => m.id === store.selectedMode)!;

    // ─── Load stats from DB ────────────────
    useEffect(() => {
        store.loadStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Timer Tick ──────────────────────────
    useEffect(() => {
        if (store.sessionState === 'running') {
            timerRef.current = setInterval(() => {
                store.tick();
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [store.sessionState]);

    // ─── Auto-complete detection ─────────────
    useEffect(() => {
        if (store.sessionState === 'running' && store.timeRemaining <= 0) {
            store.completeSession();
            playCompleteSound();
        }
    }, [store.timeRemaining, store.sessionState]);

    // ─── Page Visibility API (HP Penalty) ────
    // Instead of setInterval (throttled in hidden tabs), we record the
    // timestamp when the user leaves and calculate bulk penalties on return.
    useEffect(() => {
        const handleVisibilityChange = () => {
            const state = useFocusStore.getState();

            if (document.hidden) {
                // Tab became hidden — record timestamp
                if (state.sessionState === 'running') {
                    hiddenAtRef.current = Date.now();
                }
            } else {
                // Tab became visible — calculate penalties
                if (hiddenAtRef.current && state.sessionState === 'running') {
                    const elapsed = Date.now() - hiddenAtRef.current;
                    const penalties = Math.max(1, Math.floor(elapsed / 3000)); // at least 1 penalty

                    // Apply all penalties
                    for (let i = 0; i < penalties; i++) {
                        const current = useFocusStore.getState();
                        if (current.sessionState !== 'running') break; // stop if auto gave-up
                        current.penalizeHP();
                    }

                    playPenaltySound();
                    hiddenAtRef.current = null;

                    // Show warning overlay
                    setShowPenaltyWarning(true);
                    if (penaltyTimeoutRef.current) clearTimeout(penaltyTimeoutRef.current);
                    penaltyTimeoutRef.current = setTimeout(() => setShowPenaltyWarning(false), 4000);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (penaltyTimeoutRef.current) clearTimeout(penaltyTimeoutRef.current);
        };
    }, []); // No deps needed — reads from store directly via getState()

    // ─── Handlers ────────────────────────────
    const handleStart = () => {
        store.startSession();
        playStartSound();
    };

    const handlePause = () => {
        store.pauseSession();
    };

    const handleResume = () => {
        store.resumeSession();
        playStartSound();
    };

    const handleGiveUp = () => {
        store.giveUp();
        playGiveUpSound();
    };

    const handleReset = () => {
        store.resetToIdle();
    };

    // ─── Minute tick sound ───────────────────
    useEffect(() => {
        if (store.sessionState === 'running' && store.timeRemaining > 0 && store.timeRemaining % 60 === 0 && store.timeRemaining !== store.totalTime) {
            playTickSound();
        }
    }, [store.timeRemaining, store.sessionState, store.totalTime]);

    return (
        <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-7 min-w-0 max-w-4xl mx-auto">
            {/* Tab Penalty Warning */}
            <TabPenaltyOverlay show={showPenaltyWarning} penaltyCount={store.hpPenaltyCount} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                        <span className="text-2xl sm:text-3xl">🎯</span> Focus Arena
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">Train your discipline, earn rewards</p>
                </div>
            </div>

            {/* Session Stats */}
            <SessionStats
                sessions={store.sessionsCompleted}
                totalTime={store.totalFocusTime}
                streak={store.currentStreak}
            />

            {/* Main Content */}
            <AnimatePresence mode="wait">
                {store.sessionState === 'completed' ? (
                    <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <SessionComplete
                            xp={currentMode.xpReward}
                            streak={store.currentStreak}
                            onContinue={handleReset}
                        />
                    </motion.div>
                ) : store.sessionState === 'gave-up' ? (
                    <motion.div key="gave-up" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <GaveUpScreen onRetry={handleReset} />
                    </motion.div>
                ) : (
                    <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 sm:space-y-8">
                        {/* Mode Selector (only when idle) */}
                        {store.sessionState === 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h2 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                                    <span>⚡</span> Select Focus Mode
                                </h2>
                                <ModeSelector
                                    selectedMode={store.selectedMode}
                                    onSelect={store.selectMode}
                                />
                            </motion.div>
                        )}

                        {/* Current Mode Badge (when running/paused) */}
                        {(store.sessionState === 'running' || store.sessionState === 'paused') && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center"
                            >
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${currentMode.gradient} border ${currentMode.border.split(' ')[0]}`}>
                                    <span>{currentMode.icon}</span>
                                    <span className="text-white text-xs font-bold">{currentMode.label}</span>
                                    <span className="text-white/40">•</span>
                                    <span className="text-purple-300 text-xs font-mono">{currentMode.duration / 60} min</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Timer */}
                        <CircularTimer
                            timeRemaining={store.timeRemaining}
                            totalTime={store.totalTime}
                            isRunning={store.sessionState === 'running'}
                        />

                        {/* HP Bar (when active) */}
                        {(store.sessionState === 'running' || store.sessionState === 'paused') && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <HPBar hp={store.hp} />
                            </motion.div>
                        )}

                        {/* Controls */}
                        <div className="flex justify-center gap-3">
                            {store.sessionState === 'idle' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleStart}
                                    className="px-8 sm:px-10 py-3 sm:py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold rounded-xl text-sm sm:text-base shadow-lg shadow-purple-600/25 transition-all"
                                >
                                    Start Focus ⚡
                                </motion.button>
                            )}

                            {store.sessionState === 'running' && (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handlePause}
                                        className="px-6 py-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/25 text-amber-300 font-bold rounded-xl text-sm transition-all"
                                    >
                                        ⏸ Pause
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleGiveUp}
                                        className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold rounded-xl text-sm transition-all"
                                    >
                                        Give Up 🏳️
                                    </motion.button>
                                </>
                            )}

                            {store.sessionState === 'paused' && (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleResume}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-600/25 transition-all"
                                    >
                                        ▶ Resume
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleGiveUp}
                                        className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold rounded-xl text-sm transition-all"
                                    >
                                        Give Up 🏳️
                                    </motion.button>
                                </>
                            )}
                        </div>

                        {/* Paused indicator */}
                        {store.sessionState === 'paused' && (
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-center"
                            >
                                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">⏸ Paused</span>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
