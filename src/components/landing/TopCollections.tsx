'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { fadeLeft, staggerContainerFast } from '@/lib/animations';

const collections = [
    { name: 'Fitness Freaks', floor: '2,400', change: 15.2, positive: true, volume: '24.5k' },
    { name: 'Code Warriors', floor: '3,100', change: 8.7, positive: true, volume: '18.2k' },
    { name: 'Mindful Monks', floor: '1,800', change: 3.1, positive: false, volume: '12.8k' },
    { name: 'Artistic Souls', floor: '4,200', change: 22.4, positive: true, volume: '31.6k' },
    { name: 'Wealth Builders', floor: '5,600', change: 9.3, positive: false, volume: '42.1k' },
    { name: 'Social Butterflies', floor: '1,200', change: 11.8, positive: true, volume: '8.9k' },
];

export default function TopCollections() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });

    return (
        <section ref={ref} id="collections" className="py-20 sm:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-10 sm:mb-14">
                    <h2
                        className="text-2xl sm:text-3xl md:text-4xl font-[800] tracking-[-0.02em] text-[var(--hv-text-primary)]"
                        style={{ fontFamily: 'var(--font-syne)' }}
                    >
                        Top Collections over{' '}
                        <span
                            className="border-b border-dotted"
                            style={{
                                color: 'var(--hv-primary-light)',
                                borderColor: 'var(--hv-primary-light)',
                            }}
                        >
                            last 7 days
                        </span>
                    </h2>
                </div>

                {/* Table header (desktop) */}
                <div
                    className="hidden sm:grid grid-cols-[40px_1fr_120px_100px_100px] gap-4 px-4 pb-3 mb-2 text-xs uppercase tracking-[0.1em] border-b"
                    style={{
                        color: 'var(--hv-text-muted)',
                        borderColor: 'var(--hv-border)',
                        fontFamily: 'var(--font-dm-sans)',
                    }}
                >
                    <span>#</span>
                    <span>Collection</span>
                    <span className="text-right">Floor Price</span>
                    <span className="text-right">Change</span>
                    <span className="text-right">Volume</span>
                </div>

                {/* Rows */}
                <motion.div
                    variants={staggerContainerFast}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    {collections.map((col, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeLeft}
                            className="group grid grid-cols-[40px_1fr_auto] sm:grid-cols-[40px_1fr_120px_100px_100px] gap-4 px-4 py-4 items-center cursor-pointer transition-colors duration-200 border-b hover:bg-[var(--hv-bg-surface)]"
                            style={{ borderColor: 'rgba(124,90,246,0.08)' }}
                        >
                            {/* Rank */}
                            <span
                                className="text-sm"
                                style={{
                                    color: 'var(--hv-text-muted)',
                                    fontFamily: 'var(--font-mono)',
                                }}
                            >
                                {idx + 1}
                            </span>

                            {/* Name + Thumbnail */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex-shrink-0 border transition-colors group-hover:border-[var(--hv-border-hover)]"
                                    style={{
                                        background: `linear-gradient(135deg, hsl(${260 + idx * 15}, 50%, 25%) 0%, hsl(${280 + idx * 15}, 60%, 35%) 100%)`,
                                        borderColor: 'var(--hv-border)',
                                    }}
                                />
                                <div className="min-w-0">
                                    <h4
                                        className="font-bold text-sm truncate transition-colors group-hover:text-[var(--hv-primary-light)]"
                                        style={{
                                            color: 'var(--hv-text-primary)',
                                            fontFamily: 'var(--font-dm-sans)',
                                        }}
                                    >
                                        {col.name}
                                    </h4>
                                    <p
                                        className="text-xs sm:hidden"
                                        style={{ color: 'var(--hv-text-muted)' }}
                                    >
                                        Floor: {col.floor} XP
                                    </p>
                                </div>
                            </div>

                            {/* Floor Price (desktop) */}
                            <span
                                className="hidden sm:block text-right text-sm font-medium"
                                style={{
                                    color: 'var(--hv-text-primary)',
                                    fontFamily: 'var(--font-mono)',
                                }}
                            >
                                {col.floor} XP
                            </span>

                            {/* Change */}
                            <div className="flex items-center justify-end gap-1">
                                <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                                    style={{
                                        background: col.positive
                                            ? 'rgba(74, 222, 128, 0.1)'
                                            : 'rgba(248, 113, 113, 0.1)',
                                        color: col.positive
                                            ? 'var(--hv-accent-green)'
                                            : 'var(--hv-accent-red)',
                                    }}
                                >
                                    {col.positive ? (
                                        <ArrowUp className="w-3 h-3" />
                                    ) : (
                                        <ArrowDown className="w-3 h-3" />
                                    )}
                                    {col.change}%
                                </span>
                            </div>

                            {/* Volume (desktop) */}
                            <span
                                className="hidden sm:block text-right text-sm"
                                style={{
                                    color: 'var(--hv-text-secondary)',
                                    fontFamily: 'var(--font-mono)',
                                }}
                            >
                                {col.volume}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <div className="text-center mt-10 sm:mt-14">
                    <Link
                        href="#"
                        className="inline-flex items-center px-7 py-3 rounded-full text-sm font-bold transition-all duration-300 border hover:bg-[var(--hv-primary)]/10"
                        style={{
                            borderColor: 'var(--hv-border)',
                            color: 'var(--hv-text-primary)',
                            fontFamily: 'var(--font-dm-sans)',
                        }}
                    >
                        Go to Rankings
                    </Link>
                </div>
            </div>
        </section>
    );
}
