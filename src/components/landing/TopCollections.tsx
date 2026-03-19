'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowUp, Users, Zap } from 'lucide-react';
import { fadeLeft, staggerContainerFast } from '@/lib/animations';

interface TeamData {
    name: string;
    icon: string;
    totalXp: number;
    level: number;
    members: number;
}

// Fallback when DB has no teams yet
const FALLBACK_TEAMS: TeamData[] = [
    { name: 'Fitness Freaks', icon: '💪', totalXp: 2400, level: 5, members: 8 },
    { name: 'Code Warriors', icon: '⚔️', totalXp: 3100, level: 7, members: 12 },
    { name: 'Mindful Monks', icon: '🧘', totalXp: 1800, level: 4, members: 6 },
    { name: 'Artistic Souls', icon: '🎨', totalXp: 4200, level: 9, members: 15 },
    { name: 'Wealth Builders', icon: '💰', totalXp: 5600, level: 11, members: 10 },
    { name: 'Social Butterflies', icon: '🦋', totalXp: 1200, level: 3, members: 4 },
];

export default function TopCollections() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });
    const [teams, setTeams] = useState<TeamData[]>([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch('/api/landing/stats');
                if (res.ok) {
                    const data = await res.json();
                    if (data.topCollections?.length > 0) {
                        setTeams(data.topCollections);
                        return;
                    }
                }
            } catch (e) {
                console.error('Failed to fetch top collections:', e);
            }
            // Fallback to sample data if DB is empty or fetch fails
            setTeams(FALLBACK_TEAMS);
        };
        fetchTeams();
    }, []);

    return (
        <section ref={ref} id="collections" className="py-20 sm:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-10 sm:mb-14">
                    <h2
                        className="text-2xl sm:text-3xl md:text-4xl font-[800] tracking-[-0.02em] text-[var(--hv-text-primary)]"
                        style={{ fontFamily: 'var(--font-syne)' }}
                    >
                        Top Guilds{' '}
                        <span
                            className="border-b border-dotted"
                            style={{
                                color: 'var(--hv-primary-light)',
                                borderColor: 'var(--hv-primary-light)',
                            }}
                        >
                            by XP
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
                    <span>Guild</span>
                    <span className="text-right">Total XP</span>
                    <span className="text-right">Level</span>
                    <span className="text-right">Members</span>
                </div>

                {/* Rows */}
                <motion.div
                    variants={staggerContainerFast}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    {teams.map((team, idx) => (
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

                            {/* Name + Icon */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex-shrink-0 border transition-colors group-hover:border-[var(--hv-border-hover)] flex items-center justify-center text-xl"
                                    style={{
                                        background: `linear-gradient(135deg, hsl(${260 + idx * 15}, 50%, 25%) 0%, hsl(${280 + idx * 15}, 60%, 35%) 100%)`,
                                        borderColor: 'var(--hv-border)',
                                    }}
                                >
                                    {team.icon}
                                </div>
                                <div className="min-w-0">
                                    <h4
                                        className="font-bold text-sm truncate transition-colors group-hover:text-[var(--hv-primary-light)]"
                                        style={{
                                            color: 'var(--hv-text-primary)',
                                            fontFamily: 'var(--font-dm-sans)',
                                        }}
                                    >
                                        {team.name}
                                    </h4>
                                    <p
                                        className="text-xs sm:hidden"
                                        style={{ color: 'var(--hv-text-muted)' }}
                                    >
                                        {team.totalXp.toLocaleString()} XP • Lv.{team.level}
                                    </p>
                                </div>
                            </div>

                            {/* Total XP (desktop) */}
                            <span
                                className="hidden sm:block text-right text-sm font-medium"
                                style={{
                                    color: 'var(--hv-text-primary)',
                                    fontFamily: 'var(--font-mono)',
                                }}
                            >
                                {team.totalXp.toLocaleString()} XP
                            </span>

                            {/* Level */}
                            <div className="flex items-center justify-end gap-1">
                                <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                                    style={{
                                        background: 'rgba(74, 222, 128, 0.1)',
                                        color: 'var(--hv-accent-green, #4ade80)',
                                    }}
                                >
                                    <Zap className="w-3 h-3" />
                                    Lv.{team.level}
                                </span>
                            </div>

                            {/* Members (desktop) */}
                            <span
                                className="hidden sm:flex items-center justify-end gap-1 text-right text-sm"
                                style={{
                                    color: 'var(--hv-text-secondary)',
                                    fontFamily: 'var(--font-mono)',
                                }}
                            >
                                <Users className="w-3 h-3" />
                                {team.members}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <div className="text-center mt-10 sm:mt-14">
                    <Link
                        href="/register"
                        className="inline-flex items-center px-7 py-3 rounded-full text-sm font-bold transition-all duration-300 border hover:bg-[var(--hv-primary)]/10"
                        style={{
                            borderColor: 'var(--hv-border)',
                            color: 'var(--hv-text-primary)',
                            fontFamily: 'var(--font-dm-sans)',
                        }}
                    >
                        Join a Guild →
                    </Link>
                </div>
            </div>
        </section>
    );
}
