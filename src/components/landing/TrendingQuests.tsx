'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { fadeUp, staggerContainer } from '@/lib/animations';

const quests = [
    {
        emoji: '🏃‍♂️',
        name: '5k Runner',
        timer: '01h : 30m',
        xp: 50,
        active: 12,
        gradient: 'from-emerald-500/30 to-teal-600/20',
    },
    {
        emoji: '📚',
        name: 'Read 30 Pages',
        timer: '02h : 15m',
        xp: 100,
        active: 28,
        gradient: 'from-orange-500/30 to-amber-600/20',
    },
    {
        emoji: '💧',
        name: 'Hydration Hit',
        timer: '00h : 45m',
        xp: 150,
        active: 45,
        gradient: 'from-blue-500/30 to-cyan-600/20',
    },
    {
        emoji: '🎨',
        name: 'Create Art',
        timer: '03h : 00m',
        xp: 200,
        active: 8,
        gradient: 'from-pink-500/30 to-rose-600/20',
    },
];

export default function TrendingQuests() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section
            ref={ref}
            id="explore"
            className="py-20 sm:py-32"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-10 sm:mb-14">
                    <h2
                        className="text-2xl sm:text-3xl md:text-4xl font-[800] tracking-[-0.02em] text-[var(--hv-text-primary)] flex items-center gap-3"
                        style={{ fontFamily: 'var(--font-syne)' }}
                    >
                        <span className="text-2xl">🔥</span> Trending Quests
                    </h2>
                    <Link
                        href="#"
                        className="text-sm font-medium transition-colors hover:opacity-80"
                        style={{
                            color: 'var(--hv-primary-light)',
                            fontFamily: 'var(--font-dm-sans)',
                        }}
                    >
                        View All →
                    </Link>
                </div>

                {/* Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    {quests.map((q, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            className="group rounded-2xl p-4 cursor-pointer transition-all duration-300 glass-card-hover"
                            style={{
                                background: 'var(--hv-bg-surface)',
                                border: '1px solid var(--hv-border)',
                            }}
                        >
                            {/* Card image area */}
                            <div
                                className={`aspect-[4/3] rounded-xl mb-4 relative overflow-hidden bg-gradient-to-br ${q.gradient}`}
                            >
                                <div className="absolute inset-0 flex items-center justify-center text-5xl transform group-hover:scale-110 transition-transform duration-500">
                                    {q.emoji}
                                </div>
                                {/* Timer badge */}
                                <div
                                    className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border"
                                    style={{
                                        background: 'rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(8px)',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        color: 'var(--hv-text-primary)',
                                        fontFamily: 'var(--font-mono)',
                                    }}
                                >
                                    {q.timer}
                                </div>
                            </div>

                            {/* Quest name */}
                            <h3
                                className="font-bold text-base sm:text-lg mb-1 text-[var(--hv-text-primary)]"
                                style={{ fontFamily: 'var(--font-syne)' }}
                            >
                                {q.name}
                            </h3>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                    {/* Avatar stack */}
                                    <div className="flex -space-x-2">
                                        {[0, 1, 2].map((j) => (
                                            <div
                                                key={j}
                                                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2"
                                                style={{
                                                    background: `hsl(${250 + j * 25}, 50%, ${45 + j * 10}%)`,
                                                    borderColor: 'var(--hv-bg-surface)',
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <span
                                        className="text-[10px] sm:text-xs"
                                        style={{
                                            color: 'var(--hv-text-muted)',
                                            fontFamily: 'var(--font-dm-sans)',
                                        }}
                                    >
                                        {q.active}+ active
                                    </span>
                                </div>
                                <span
                                    className="text-xs sm:text-sm font-bold"
                                    style={{
                                        color: 'var(--hv-accent-2)',
                                        fontFamily: 'var(--font-mono)',
                                    }}
                                >
                                    +{q.xp} XP
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
