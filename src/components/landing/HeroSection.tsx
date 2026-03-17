'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import {
    fadeUp,
    fadeIn,
    fadeRight,
    staggerContainerSlow,
    scaleIn,
    floatingAnimation,
    floatingAnimationReverse,
    floatingAnimationSlow,
    pulseGlow,
    useCountUp,
} from '@/lib/animations';

/* ──────────────────────────────────────────────
   Stat Counter Sub-Component
   ────────────────────────────────────────────── */
function StatCounter({
    target,
    suffix,
    label,
}: {
    target: number;
    suffix: string;
    label: string;
}) {
    const { count, ref } = useCountUp(target);
    return (
        <div ref={ref}>
            <p
                className="text-2xl sm:text-3xl font-bold text-[var(--hv-text-primary)]"
                style={{ fontFamily: 'var(--font-mono)' }}
            >
                {count.toLocaleString()}
                {suffix}
            </p>
            <p
                className="text-[10px] sm:text-xs text-[var(--hv-text-muted)] uppercase tracking-[0.15em] mt-1"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
                {label}
            </p>
        </div>
    );
}

/* ──────────────────────────────────────────────
   Floating Particles
   ────────────────────────────────────────────── */
const particles = [
    { size: 4, x: '10%', y: '20%', color: 'var(--hv-primary)', dur: 4 },
    { size: 6, x: '85%', y: '15%', color: 'var(--hv-accent)', dur: 5 },
    { size: 3, x: '70%', y: '75%', color: 'var(--hv-accent-2)', dur: 3.5 },
    { size: 5, x: '20%', y: '80%', color: 'var(--hv-primary-light)', dur: 6 },
    { size: 4, x: '90%', y: '50%', color: 'var(--hv-accent)', dur: 4.5 },
    { size: 7, x: '50%', y: '10%', color: 'var(--hv-primary)', dur: 5.5 },
    { size: 3, x: '35%', y: '60%', color: 'var(--hv-accent-2)', dur: 3 },
    { size: 5, x: '60%', y: '90%', color: 'var(--hv-primary-light)', dur: 4 },
    { size: 4, x: '15%', y: '45%', color: 'var(--hv-accent)', dur: 7 },
    { size: 6, x: '75%', y: '35%', color: 'var(--hv-primary)', dur: 3.8 },
];

/* ──────────────────────────────────────────────
   Hero Section
   ────────────────────────────────────────────── */
export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center overflow-hidden"
        >
            {/* ── Background Layer ── */}
            <div className="absolute inset-0 z-0">
                {/* Radial gradient base */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse 80% 60% at 50% 50%, #1A0A3E 0%, var(--hv-bg-base) 70%)',
                    }}
                />

                {/* Aurora blob left-top */}
                <motion.div
                    className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-20"
                    style={{ background: 'var(--hv-primary)', filter: 'blur(120px)' }}
                    animate={{ y: [-20, 20, -20] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Aurora blob right-bottom */}
                <motion.div
                    className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-10"
                    style={{ background: 'var(--hv-accent-2)', filter: 'blur(100px)' }}
                    animate={{ y: [15, -15, 15] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.06]" />

                {/* Floating particles */}
                {particles.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: p.size,
                            height: p.size,
                            left: p.x,
                            top: p.y,
                            background: p.color,
                            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                        }}
                        animate={{
                            y: [-(p.size * 2), p.size * 2, -(p.size * 2)],
                            x: [-(p.size), p.size, -(p.size)],
                            opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                            duration: p.dur,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.3,
                        }}
                    />
                ))}
            </div>

            {/* ── Content ── */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24 sm:pt-32 pb-16 sm:pb-24">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* ── Left Column: Text ── */}
                    <motion.div
                        className="space-y-6 sm:space-y-8 text-center lg:text-left"
                        variants={staggerContainerSlow}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                    >
                        {/* Badge pill */}
                        <motion.div variants={scaleIn} className="inline-block">
                            <span
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border"
                                style={{
                                    borderColor: 'rgba(124,90,246,0.3)',
                                    background: 'rgba(124,90,246,0.1)',
                                    color: 'var(--hv-primary-light)',
                                    fontFamily: 'var(--font-dm-sans)',
                                }}
                            >
                                ✦ The #1 Gamified Habit OS
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <div>
                            <motion.h1
                                variants={fadeUp}
                                className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-[800] leading-[1.05] tracking-[-0.03em]"
                                style={{ fontFamily: 'var(--font-syne)' }}
                            >
                                <motion.span
                                    className="block text-[var(--hv-text-primary)]"
                                    variants={fadeUp}
                                >
                                    Collect Habits.
                                </motion.span>
                                <motion.span
                                    className="block text-[var(--hv-text-primary)]"
                                    variants={fadeUp}
                                >
                                    Build Your
                                </motion.span>
                                <motion.span className="block text-gradient-primary" variants={fadeUp}>
                                    Legacy.
                                </motion.span>
                            </motion.h1>
                        </div>

                        {/* Subheadline */}
                        <motion.p
                            variants={fadeIn}
                            className="text-base sm:text-lg max-w-md leading-relaxed mx-auto lg:mx-0"
                            style={{
                                color: 'var(--hv-text-secondary)',
                                fontFamily: 'var(--font-dm-sans)',
                            }}
                        >
                            Turn your daily routine into a high-value digital asset collection.
                            Complete quests, earn XP, and mint your achievements as unique NFTs.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={fadeUp}
                            className="flex flex-wrap gap-3 justify-center lg:justify-start"
                        >
                            <Link
                                href="/register"
                                className="px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(124,90,246,0.5)]"
                                style={{
                                    background:
                                        'linear-gradient(135deg, var(--hv-primary) 0%, var(--hv-accent) 100%)',
                                    fontFamily: 'var(--font-dm-sans)',
                                }}
                            >
                                Start Collecting
                            </Link>
                            <Link
                                href="/login"
                                className="px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-300 border hover:bg-[var(--hv-primary)]/10"
                                style={{
                                    borderColor: 'rgba(124,90,246,0.3)',
                                    color: 'var(--hv-text-primary)',
                                    fontFamily: 'var(--font-dm-sans)',
                                }}
                            >
                                View Demo
                            </Link>
                        </motion.div>

                        {/* Stats bar */}
                        <motion.div
                            variants={fadeUp}
                            className="flex items-center gap-8 sm:gap-10 pt-4 justify-center lg:justify-start"
                        >
                            <StatCounter target={98000} suffix="+" label="Quests" />
                            <StatCounter target={12} suffix="M+" label="XP Earned" />
                            <StatCounter target={540} suffix="k" label="NFTs Minted" />
                        </motion.div>
                    </motion.div>

                    {/* ── Right Column: Visual ── */}
                    <motion.div
                        className="relative flex justify-center items-center min-h-[420px] sm:min-h-[520px]"
                        initial={{ opacity: 0, x: 60 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Glow behind card */}
                        <div
                            className="absolute inset-0 m-auto w-[300px] h-[360px] rounded-3xl opacity-30"
                            style={{
                                background:
                                    'radial-gradient(circle, var(--hv-primary-glow) 0%, transparent 70%)',
                                filter: 'blur(40px)',
                            }}
                        />

                        {/* Main NFT Hero Card */}
                        <motion.div
                            className="relative z-10 w-[260px] sm:w-[280px] rounded-2xl p-4 sm:p-5"
                            style={{
                                background: 'var(--hv-bg-elevated)',
                                border: '1px solid rgba(124,90,246,0.2)',
                                boxShadow: '0 0 60px rgba(124,90,246,0.2)',
                            }}
                            {...floatingAnimation}
                        >
                            {/* Card image area */}
                            <div className="aspect-square rounded-xl mb-4 relative overflow-hidden flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #a855f7 100%)',
                                }}
                            >
                                <div
                                    className="absolute inset-0 opacity-20"
                                    style={{
                                        backgroundImage:
                                            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")",
                                    }}
                                />
                                <span className="text-6xl sm:text-7xl filter drop-shadow-xl">🧘‍♂️</span>

                                {/* Rare badge */}
                                <div
                                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-300 border border-amber-400/30"
                                    style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
                                >
                                    Rare
                                </div>
                            </div>

                            {/* Card info */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3
                                            className="text-sm sm:text-base font-bold text-[var(--hv-text-primary)]"
                                            style={{ fontFamily: 'var(--font-syne)' }}
                                        >
                                            Morning Zen Master
                                        </h3>
                                        <p
                                            className="text-xs mt-0.5"
                                            style={{
                                                color: 'var(--hv-text-muted)',
                                                fontFamily: 'var(--font-dm-sans)',
                                            }}
                                        >
                                            Mindfulness Collection
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px]" style={{ color: 'var(--hv-text-muted)' }}>
                                            Floor
                                        </p>
                                        <p
                                            className="text-sm font-bold"
                                            style={{ color: 'var(--hv-primary-light)', fontFamily: 'var(--font-mono)' }}
                                        >
                                            500 XP
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="flex items-center gap-2 text-xs p-2.5 rounded-lg"
                                    style={{
                                        background: 'rgba(0,0,0,0.3)',
                                        color: 'var(--hv-text-secondary)',
                                    }}
                                >
                                    <span className="text-sm">🔥</span>
                                    <span>
                                        highest bid <b className="text-[var(--hv-text-primary)]">320 XP</b>
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating XP Badge */}
                        <motion.div
                            className="absolute z-20 px-3 py-2 rounded-xl text-sm font-bold"
                            style={{
                                bottom: '15%',
                                left: '5%',
                                background: 'rgba(56, 189, 248, 0.15)',
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                color: '#7dd3fc',
                                fontFamily: 'var(--font-mono)',
                                boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)',
                            }}
                            {...floatingAnimationReverse}
                        >
                            <motion.div {...pulseGlow}>+150 XP</motion.div>
                        </motion.div>

                        {/* Mini Quest Card */}
                        <motion.div
                            className="absolute z-20 p-3 rounded-xl w-[150px] sm:w-[160px]"
                            style={{
                                top: '10%',
                                right: '2%',
                                background: 'var(--hv-bg-elevated)',
                                border: '1px solid var(--hv-border)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            }}
                            {...floatingAnimationSlow}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🏃</span>
                                <span
                                    className="text-xs font-bold text-[var(--hv-text-primary)]"
                                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                                >
                                    5k Runner
                                </span>
                            </div>
                            {/* Progress bar */}
                            <div
                                className="w-full h-1.5 rounded-full overflow-hidden"
                                style={{ background: 'var(--hv-bg-surface)' }}
                            >
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                        background:
                                            'linear-gradient(90deg, var(--hv-primary), var(--hv-accent-2))',
                                    }}
                                    initial={{ width: '0%' }}
                                    animate={isInView ? { width: '72%' } : {}}
                                    transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
                                />
                            </div>
                            {/* Avatar stack */}
                            <div className="flex items-center gap-1.5 mt-2">
                                <div className="flex -space-x-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="w-4 h-4 rounded-full border"
                                            style={{
                                                background: `hsl(${260 + i * 30}, 60%, ${50 + i * 10}%)`,
                                                borderColor: 'var(--hv-bg-elevated)',
                                            }}
                                        />
                                    ))}
                                </div>
                                <span
                                    className="text-[10px]"
                                    style={{ color: 'var(--hv-text-muted)' }}
                                >
                                    12+
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
