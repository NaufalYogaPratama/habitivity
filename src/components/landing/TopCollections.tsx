'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { fadeUp } from '@/lib/animations';

interface LeaderboardItem {
    rank: number;
    name: string;
    level: number;
    score: number;
    badges: string[];
}

export default function TopCollections() {
    const [activeTab, setActiveTab] = useState<'users' | 'guilds'>('users');
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    const [topUsers, setTopUsers] = useState<LeaderboardItem[]>([]);
    const [topClans, setTopClans] = useState<LeaderboardItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/leaderboard/public');
                const data = await res.json();
                if (data.topUsers) setTopUsers(data.topUsers);
                if (data.topClans) setTopClans(data.topClans);
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const data = activeTab === 'users' ? topUsers : topClans;

    return (
        <section id="leaderboard" ref={ref} className="relative py-24 sm:py-32 overflow-hidden w-full max-w-[1240px] mx-auto px-4 sm:px-6">
            {/* Background ambient light */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#38BDF8] opacity-[0.07] blur-[150px] rounded-full pointer-events-none" />

            {/* Header Area */}
            <div className="max-w-[1280px] mx-auto text-center mb-16">
                <motion.h2
                    custom={0.1}
                    variants={fadeUp}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="font-[800] tracking-[-0.03em] mb-5"
                    style={{
                        fontFamily: 'var(--font-syne)',
                        fontSize: 'clamp(42px, 5vw, 64px)',
                        background: 'linear-gradient(135deg, #A78BFA, #F0ABFC)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Leaderboard.
                </motion.h2>

                <motion.p
                    custom={0.25}
                    variants={fadeUp}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="mx-auto"
                    style={{
                        maxWidth: 480,
                        fontSize: 16,
                        lineHeight: 1.75,
                        color: '#A1A1C7',
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 300,
                    }}
                >
                    See who is rising to the top. Climb the ranks to etch your name in the immutable ledger.
                </motion.p>
            </div>
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="flex flex-col items-center text-center mb-16 relative z-10"
            >
                {/* Tab Switcher */}
                <div className="flex items-center p-1.5 rounded-full bg-[rgba(13,13,32,0.8)] border border-[rgba(255,255,255,0.08)] backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-10 py-3 rounded-full text-sm font-bold tracking-widest transition-all duration-300 uppercase ${activeTab === 'users' ? 'bg-[#A78BFA] text-[#05050F] shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 'text-[#A1A1C7] hover:text-white'}`}
                        style={{ fontFamily: 'var(--font-dm-sans)' }}
                    >
                        Top Users
                    </button>
                    <button
                        onClick={() => setActiveTab('guilds')}
                        className={`px-10 py-3 rounded-full text-sm font-bold tracking-widest transition-all duration-300 uppercase ${activeTab === 'guilds' ? 'bg-[#F0ABFC] text-[#05050F] shadow-[0_0_20px_rgba(167,139,250,0.4)]' : 'text-[#A1A1C7] hover:text-white'}`}
                        style={{ fontFamily: 'var(--font-dm-sans)' }}
                    >
                        Top Clans
                    </button>
                </div>
            </motion.div>

            {/* Leaderboard Table Container */}
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="relative z-10 w-full max-w-[1000px] mx-auto rounded-[32px] p-[1.5px] overflow-hidden"
                style={{
                    background: 'linear-gradient(180deg, #A78BFA 0%, rgba(167,139,250,0.3) 50%, rgba(255,255,255,0.02) 100%)',
                    boxShadow: '0 30px 100px -20px #F0ABFC'
                }}
            >
                <div className="w-full h-full bg-[#070714] backdrop-blur-xl rounded-[30px] overflow-hidden">

                    {/* Table Header */}
                    <div className="grid grid-cols-[80px_1fr_120px_180px] text-[12px] font-bold tracking-[0.2em] uppercase text-[#6B7280] border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                        <div className="text-center py-6 border-r border-[rgba(255,255,255,0.05)]">Rank</div>
                        <div className="py-6 px-8 border-r border-[rgba(255,255,255,0.05)]">{activeTab === 'users' ? 'Player' : 'Guild'}</div>
                        <div className="text-center py-6 border-r border-[rgba(255,255,255,0.05)]">Level</div>
                        <div className="text-center py-6">Score</div>
                    </div>

                    {/* Table Body */}
                    <div className="flex flex-col min-h-[400px]">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20 text-[#6B7280]">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-6 h-6 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs uppercase tracking-widest font-bold">Loading...</span>
                                </div>
                            </div>
                        ) : data.length === 0 ? (
                            <div className="flex items-center justify-center py-20 text-[#6B7280]">
                                <span className="text-sm">Belum ada data {activeTab === 'users' ? 'user' : 'clan'}.</span>
                            </div>
                        ) : (
                            data.map((item, idx) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="grid grid-cols-[80px_1fr_120px_180px] border-b border-[rgba(255,255,255,0.03)] last:border-0 items-center hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
                                >
                                    {/* Rank (Col 1) */}
                                    <div className="flex justify-center py-6 border-r border-[rgba(255,255,255,0.05)] h-full">
                                        {item.rank <= 3 ? (
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base bg-gradient-to-br ${item.rank === 1 ? 'from-[#FDE047] to-[#F59E0B] text-[#451A03] shadow-[0_0_20px_rgba(253,224,71,0.6)]' : item.rank === 2 ? 'from-[#E2E8F0] to-[#94A3B8] text-[#0F172A]' : 'from-[#FDBA74] to-[#B45309] text-[#451A03]'}`}>
                                                {item.rank}
                                            </div>
                                        ) : (
                                            <div className="text-[#A1A1C7] font-bold font-mono text-xl">{item.rank}</div>
                                        )}
                                    </div>

                                    {/* Name (Col 2) */}
                                    <div className="flex items-center gap-4 py-6 px-8 border-r border-[rgba(255,255,255,0.05)] h-full">
                                        <div
                                            className="w-12 h-12 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all overflow-hidden relative group-hover:scale-110"
                                            style={{
                                                background: activeTab === 'users' ? `hsla(${190 + idx * 45}, 80%, 50%, 0.15)` : `hsla(${270 + idx * 45}, 80%, 50%, 0.15)`,
                                                borderColor: activeTab === 'users' ? `hsla(${190 + idx * 45}, 80%, 50%, 0.3)` : `hsla(${270 + idx * 45}, 80%, 50%, 0.3)`
                                            }}
                                        >
                                            <Image
                                                src={activeTab === 'users' ? '/assets/logo/icon-profile.png' : '/assets/logo/icon-clans.png'}
                                                alt={activeTab === 'users' ? 'Profile Icon' : 'Clan Icon'}
                                                fill
                                                className="object-contain p-2"
                                                style={{ filter: `hue-rotate(${idx * 70}deg) brightness(1.2)` }}
                                            />
                                        </div>
                                        <div>
                                            <div className="font-bold text-[#F8F8FF] text-xl tracking-wide group-hover:text-[#38BDF8] transition-colors" style={{ fontFamily: 'var(--font-syne)' }}>{item.name}</div>
                                            <div className="flex gap-2 mt-1">
                                                {item.badges.map((b, i) => <span key={i} className="text-sm">{b}</span>)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Level (Col 3) */}
                                    <div className="flex justify-center items-center py-6 border-r border-[rgba(255,255,255,0.05)] h-full">
                                        <div className="px-4 py-1.5 rounded-full bg-[rgba(167,139,250,0.1)] border border-[rgba(167,139,250,0.3)] text-[#A78BFA] font-mono text-base font-bold">
                                            Lv.{item.level}
                                        </div>
                                    </div>

                                    {/* Score (Col 4) */}
                                    <div className="flex justify-center items-center py-6 h-full">
                                        <div className="font-mono text-[#38BDF8] text-2xl font-bold tracking-tight">
                                            {item.score.toLocaleString()} <span className="text-[#6B7280] text-sm tracking-normal uppercase ml-1">XP</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                </div>
            </motion.div>
        </section>
    );
}
