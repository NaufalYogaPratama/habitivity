'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { fadeUp, staggerContainer } from '@/lib/animations';

interface QuestData {
    emoji: string;
    name: string;
    xp: number;
    gold: number;
    rarity: string;
    gradient: string;
    category: string;
}

// No dummy data, pull directly from DB Global Quests
export default function TrendingQuests() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const [quests, setQuests] = useState<QuestData[]>([]);

    useEffect(() => {
        const fetchQuests = async () => {
            try {
                const res = await fetch('/api/landing/stats');
                if (res.ok) {
                    const data = await res.json();
                    setQuests(data.trendingQuests || []);
                    return;
                }
            } catch (e) {
                console.error('Failed to fetch trending quests:', e);
            }
            // Fallback to empty if fails
            setQuests([]);
        };
        fetchQuests();
    }, []);

    return (
        <section
            ref={ref}
            id="quests"
            className="py-20 sm:py-32 relative overflow-hidden"
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
                        href="/register"
                        className="text-sm font-medium transition-colors hover:opacity-80"
                        style={{
                            color: 'var(--hv-primary-light)',
                            fontFamily: 'var(--font-dm-sans)',
                        }}
                    >
                        Join Now →
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
                                {/* Rarity badge */}
                                <div
                                    className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider"
                                    style={{
                                        background: 'rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(8px)',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        color: 'var(--hv-text-primary)',
                                        fontFamily: 'var(--font-mono)',
                                    }}
                                >
                                    {q.rarity}
                                </div>
                            </div>

                            {/* Quest name */}
                            <h3
                                className="font-bold text-base sm:text-lg mb-1 text-[var(--hv-text-primary)] truncate"
                                style={{ fontFamily: 'var(--font-syne)' }}
                            >
                                {q.name}
                            </h3>
                            <p className="text-xs mb-2" style={{ color: 'var(--hv-text-muted)' }}>
                                {q.category}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-3">
                                <span
                                    className="text-xs sm:text-sm font-bold"
                                    style={{
                                        color: 'var(--hv-accent-2)',
                                        fontFamily: 'var(--font-mono)',
                                    }}
                                >
                                    +{q.xp} XP
                                </span>
                                <span
                                    className="text-xs font-bold"
                                    style={{
                                        color: 'var(--hv-accent-gold, #f59e0b)',
                                        fontFamily: 'var(--font-mono)',
                                    }}
                                >
                                    +{q.gold}g
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
