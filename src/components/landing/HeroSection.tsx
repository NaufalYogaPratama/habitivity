'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    motion,
    useScroll,
    useTransform,
    useInView,
} from 'framer-motion';
import { useCountUp } from '@/lib/animations';

/* ──────────────────────────────────────────────
   Animation Variants
   ────────────────────────────────────────────── */

const lineReveal = {
    hidden: { opacity: 0, y: '100%' },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
    }),
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
    }),
};

/* ──────────────────────────────────────────────
   Floating Particles Config
   ────────────────────────────────────────────── */

const particles = [
    { x: '18%', y: '14%', size: 5, color: '#7C5AF6', dur: 4.2, dx: 12, dy: -15 },
    { x: '78%', y: '18%', size: 4, color: '#C084FC', dur: 5.5, dx: -8, dy: 10 },
    { x: '88%', y: '52%', size: 3, color: '#38BDF8', dur: 3.8, dx: -14, dy: -12 },
    { x: '12%', y: '62%', size: 6, color: '#A78BFA', dur: 6.2, dx: 18, dy: 8 },
    { x: '52%', y: '6%', size: 3, color: '#4ADE80', dur: 4.8, dx: -10, dy: 16 },
    { x: '62%', y: '78%', size: 4, color: '#7C5AF6', dur: 5.1, dx: 14, dy: -10 },
    { x: '32%', y: '84%', size: 3, color: '#C084FC', dur: 3.5, dx: -12, dy: -18 },
    { x: '92%', y: '32%', size: 5, color: '#38BDF8', dur: 4.6, dx: 8, dy: 14 },
];

/* ──────────────────────────────────────────────
   StatCounter Sub-Component
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
                className="text-[28px] font-[800] tracking-[-0.03em]"
                style={{ fontFamily: 'var(--font-syne)', color: '#F8F8FF' }}
            >
                {count.toLocaleString()}
                {suffix}
            </p>
            <p
                className="text-[11px] uppercase tracking-[0.08em] mt-1"
                style={{ fontFamily: 'var(--font-dm-sans)', color: '#4A4A6A' }}
            >
                {label}
            </p>
        </div>
    );
}

/* ──────────────────────────────────────────────
   Hero Section
   ────────────────────────────────────────────── */

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

    // Parallax setup
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });
    const textY = useTransform(scrollYProgress, [0, 1], [0, -30]);
    const characterY = useTransform(scrollYProgress, [0, 1], [0, -60]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center overflow-hidden"
            style={{ paddingTop: 120, paddingBottom: 0 }}
        >
            {/* ════════════════════════════════════════════
          LAYER 0: BACKGROUND
          ════════════════════════════════════════════ */}
            <div className="absolute inset-0 z-0">
                {/* 1. Base radial gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse 80% 60% at 50% 40%, #1A0A3E 0%, #05050F 70%)',
                    }}
                />

                {/* 2. Aurora blob left-top */}
                <motion.div
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        width: 520,
                        height: 520,
                        top: -80,
                        left: -60,
                        background: 'rgba(124,90,246,0.22)',
                        filter: 'blur(120px)',
                    }}
                    animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' as const }}
                />

                {/* 3. Aurora blob right-bottom */}
                <motion.div
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        width: 400,
                        height: 400,
                        bottom: -40,
                        right: -60,
                        background: 'rgba(56,189,248,0.12)',
                        filter: 'blur(100px)',
                    }}
                    animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' as const }}
                />

                {/* 4. Grid dot overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            'radial-gradient(rgba(124,90,246,0.25) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                        opacity: 0.06,
                        maskImage:
                            'radial-gradient(ellipse 80% 70% at 50% 40%, black 0%, transparent 100%)',
                        WebkitMaskImage:
                            'radial-gradient(ellipse 80% 70% at 50% 40%, black 0%, transparent 100%)',
                    }}
                />

                {/* 5. Floating particles */}
                {particles.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            width: p.size,
                            height: p.size,
                            left: p.x,
                            top: p.y,
                            background: p.color,
                            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                        }}
                        animate={{
                            x: [0, p.dx, 0],
                            y: [0, p.dy, 0],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: p.dur,
                            repeat: Infinity,
                            ease: 'easeInOut' as const,
                            delay: i * 0.3,
                        }}
                    />
                ))}
            </div>

            {/* ════════════════════════════════════════════
          CONTENT GRID
          ════════════════════════════════════════════ */}
            <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* ────────────────────────────────────────
              LEFT COLUMN: TEXT
              ──────────────────────────────────────── */}
                    <motion.div
                        className="space-y-7 text-center lg:text-left relative z-10"
                        style={{ y: textY }}
                    >
                        {/* [1] Badge pill - removed by user request */}

                        {/* [2] Headline H1 — line reveal animation */}
                        <h1
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] font-[800] leading-[1.05] tracking-[-0.04em]"
                            style={{ fontFamily: 'var(--font-syne)' }}
                        >
                            {/* Line 1 */}
                            <span className="block overflow-hidden">
                                <motion.span
                                    className="block"
                                    custom={0.35}
                                    variants={lineReveal}
                                    initial="hidden"
                                    animate={isInView ? 'visible' : 'hidden'}
                                    style={{ color: '#F8F8FF' }}
                                >
                                    Collect Habits.
                                </motion.span>
                            </span>
                            {/* Line 2 */}
                            <span className="block overflow-hidden">
                                <motion.span
                                    className="block"
                                    custom={0.5}
                                    variants={lineReveal}
                                    initial="hidden"
                                    animate={isInView ? 'visible' : 'hidden'}
                                    style={{ color: '#F8F8FF' }}
                                >
                                    Build Your
                                </motion.span>
                            </span>
                            {/* Line 3 — gradient */}
                            <span className="block overflow-hidden">
                                <motion.span
                                    className="block"
                                    custom={0.65}
                                    variants={lineReveal}
                                    initial="hidden"
                                    animate={isInView ? 'visible' : 'hidden'}
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #A78BFA 0%, #C084FC 50%, #F0ABFC 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    Legacy.
                                </motion.span>
                            </span>
                        </h1>

                        {/* [3] Subtext */}
                        <motion.p
                            custom={0.75}
                            variants={fadeUp}
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            className="text-base sm:text-lg max-w-[420px] mx-auto lg:mx-0"
                            style={{
                                color: '#A1A1C7',
                                fontFamily: 'var(--font-dm-sans)',
                                fontWeight: 300,
                                lineHeight: 1.75,
                            }}
                        >
                            Turn your daily routine into a high-value digital asset collection.
                            Complete quests, earn XP, and mint your achievements.
                        </motion.p>

                        {/* [4] CTA Buttons */}
                        <motion.div
                            custom={0.9}
                            variants={fadeUp}
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            className="flex flex-wrap gap-3 justify-center lg:justify-start"
                        >
                            <Link
                                href="/register"
                                className="px-7 py-3 rounded-full font-bold text-sm text-white transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                                style={{
                                    background: 'linear-gradient(135deg, #7C5AF6, #C084FC)',
                                    boxShadow: '0 0 32px rgba(124,90,246,0.35)',
                                    fontFamily: 'var(--font-dm-sans)',
                                }}
                                onMouseEnter={(e) => {
                                    (e.target as HTMLElement).style.boxShadow =
                                        '0 0 48px rgba(124,90,246,0.55)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.target as HTMLElement).style.boxShadow =
                                        '0 0 32px rgba(124,90,246,0.35)';
                                }}
                            >
                                Start Collecting
                            </Link>
                            <Link
                                href="/login"
                                className="px-7 py-3 rounded-full font-bold text-sm transition-all duration-300 border hover:bg-[rgba(124,90,246,0.1)] hover:border-[rgba(124,90,246,0.5)]"
                                style={{
                                    borderColor: 'rgba(124,90,246,0.3)',
                                    color: '#F8F8FF',
                                    fontFamily: 'var(--font-dm-sans)',
                                }}
                            >
                                View Demo
                            </Link>
                        </motion.div>

                        {/* [5] Stats bar */}
                        {/* <motion.div
                            custom={1.05}
                            variants={fadeUp}
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            className="flex items-center gap-10 pt-3 justify-center lg:justify-start"
                        >
                            <StatCounter target={98000} suffix="+" label="Quests" />
                            <StatCounter target={12} suffix="M+" label="XP Earned" />
                            <StatCounter target={540} suffix="k" label="NFTs Minted" />
                        </motion.div> */}
                    </motion.div>

                    {/* ────────────────────────────────────────
              RIGHT COLUMN: VISUAL
              ──────────────────────────────────────── */}
                    <div className="relative hidden lg:block" style={{ height: 640 }}>
                        {/* [A] Glow behind character */}
                        <motion.div
                            className="absolute pointer-events-none"
                            style={{
                                width: 360,
                                height: 500,
                                right: 80,
                                bottom: 100,
                                background:
                                    'radial-gradient(ellipse at center, rgba(124,90,246,0.28) 0%, transparent 70%)',
                                filter: 'blur(40px)',
                            }}
                            animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
                        />

                        {/* [B] Hero character image */}
                        <motion.div
                            className="absolute"
                            style={{
                                right: -60,
                                bottom: 0,
                                width: 680,
                                height: 710,
                                y: characterY,
                            }}
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 1.2, delay: 0.4 }}
                        >
                            <div
                                className="relative w-full h-full"
                                style={{
                                    maskImage: `
                    linear-gradient(to bottom, black 50%, transparent 95%),
                    linear-gradient(to top, black 93%, transparent 98%),
                    linear-gradient(to left, black 40%, transparent 88%),
                    linear-gradient(to right, black 50%, transparent 80%)
                  `,
                                    maskComposite: 'intersect',
                                    WebkitMaskImage: `
                    linear-gradient(to bottom, black 50%, transparent 95%),
                    linear-gradient(to top, black 95%, transparent 98%),
                    linear-gradient(to left, black 40%, transparent 88%),
                    linear-gradient(to right, black 50%, transparent 80%)
                  `,
                                    WebkitMaskComposite: 'source-in',
                                    filter: 'saturate(1.1) contrast(1.05)',
                                }}
                            >
                                <Image
                                    src="/assets/hero.png"
                                    alt="Habitivity Hero Character"
                                    fill
                                    className="object-cover object-top"
                                    priority
                                    sizes="580px"
                                />
                            </div>
                        </motion.div>

                        {/* [C] Floating NFT Card */}
                        <motion.div
                            className="absolute z-20"
                            style={{ top: 60, left: -20 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : {}
                            }
                            transition={{ duration: 0.7, delay: 1.0, ease: [0.22, 1, 0.36, 1] as const }}
                        >
                            <motion.div
                                className="rounded-2xl p-3"
                                style={{
                                    width: 180,
                                    background: 'rgba(20,20,43,0.85)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(124,90,246,0.25)',
                                    boxShadow:
                                        '0 0 40px rgba(124,90,246,0.2), 0 20px 60px rgba(0,0,0,0.5)',
                                }}
                                animate={{ y: [-14, 14, -14] }}
                                transition={{
                                    duration: 3.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut' as const,
                                }}
                            >
                                {/* NFT image area */}
                                <div
                                    className="rounded-xl mb-2.5 relative overflow-hidden flex items-center justify-center"
                                    style={{
                                        aspectRatio: '1',
                                        background:
                                            'linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #a855f7 100%)',
                                    }}
                                >
                                    <Image
                                        src="/assets/hero3.png"
                                        alt="Zen Master"
                                        fill
                                        className="object-contain p-4 drop-shadow-2xl rounded-xl"
                                    />
                                    <div
                                        className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                                        style={{
                                            background: 'rgba(0,0,0,0.45)',
                                            backdropFilter: 'blur(8px)',
                                            color: '#fbbf24',
                                            border: '1px solid rgba(251,191,36,0.3)',
                                        }}
                                    >
                                        Rare
                                    </div>
                                </div>
                                {/* Card info */}
                                <p
                                    className="text-[12px] font-bold mb-0.5"
                                    style={{ fontFamily: 'var(--font-syne)', color: '#F8F8FF' }}
                                >
                                    Focus Arena
                                </p>
                                <p
                                    className="text-[10px] mb-2"
                                    style={{ fontFamily: 'var(--font-dm-sans)', color: '#38BDF8' }}
                                >
                                    Floor: 500 XP
                                </p>
                                {/* Buttons */}
                                <div className="grid grid-cols-2 gap-1.5">
                                    <button
                                        className="py-1.5 rounded-lg text-[9px] font-bold text-white"
                                        style={{
                                            background: 'linear-gradient(135deg, #7C5AF6, #C084FC)',
                                        }}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="py-1.5 rounded-lg text-[9px] font-bold border"
                                        style={{
                                            borderColor: 'rgba(124,90,246,0.3)',
                                            color: '#A1A1C7',
                                            background: 'transparent',
                                        }}
                                    >
                                        Details
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* [D] Floating XP Badges */}

                        {/* Badge 1 — Cyan: +150 XP Earned */}
                        <motion.div
                            className="absolute z-20"
                            style={{ bottom: 200, left: -40 }}
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: 1.3 }}
                        >
                            <motion.div
                                className="flex items-center gap-2 rounded-full px-3 py-1.5"
                                style={{
                                    background: 'rgba(56,189,248,0.12)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(56,189,248,0.3)',
                                    color: '#7dd3fc',
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: 12,
                                    fontWeight: 500,
                                }}
                                animate={{
                                    y: [-6, 10, -6],
                                    rotate: [-2, 2, -2],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut' as const,
                                }}
                            >
                                <motion.div
                                    className="rounded-full"
                                    style={{
                                        width: 6,
                                        height: 6,
                                        background: '#38BDF8',
                                        boxShadow: '0 0 8px #38BDF8',
                                    }}
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                +150 XP Earned
                            </motion.div>
                        </motion.div>

                        {/* Badge 2 — Green: 🏆 Streak x7 */}
                        <motion.div
                            className="absolute z-20"
                            style={{ top: 140, right: 10 }}
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: 1.5 }}
                        >
                            <motion.div
                                className="flex items-center gap-2 rounded-full px-3 py-1.5"
                                style={{
                                    background: 'rgba(74,222,128,0.10)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(74,222,128,0.3)',
                                    color: '#4ade80',
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: 12,
                                    fontWeight: 500,
                                }}
                                animate={{ y: [-14, 14, -14] }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: 'easeInOut' as const,
                                }}
                            >
                                <motion.div
                                    className="rounded-full"
                                    style={{
                                        width: 6,
                                        height: 6,
                                        background: '#4ADE80',
                                        boxShadow: '0 0 8px #4ADE80',
                                    }}
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 1.8, repeat: Infinity }}
                                />
                                🏆 Streak x7
                            </motion.div>
                        </motion.div>

                        {/* Badge 3 — Purple: ✦ Rare Mint */}
                        <motion.div
                            className="absolute z-20"
                            style={{ top: 300, right: -30 }}
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: 1.7 }}
                        >
                            <motion.div
                                className="flex items-center gap-2 rounded-full px-3 py-1.5"
                                style={{
                                    background: 'rgba(192,132,252,0.10)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(192,132,252,0.3)',
                                    color: '#C084FC',
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: 12,
                                    fontWeight: 500,
                                }}
                                animate={{
                                    y: [-6, 10, -6],
                                    rotate: [-2, 2, -2],
                                }}
                                transition={{
                                    duration: 3.8,
                                    repeat: Infinity,
                                    ease: 'easeInOut' as const,
                                }}
                            >
                                <motion.div
                                    className="rounded-full"
                                    style={{
                                        width: 6,
                                        height: 6,
                                        background: '#C084FC',
                                        boxShadow: '0 0 8px #C084FC',
                                    }}
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 1.6, repeat: Infinity }}
                                />
                                ✦ Rare Mint
                            </motion.div>
                        </motion.div>

                        {/* [E] Mini Quest Card */}
                        <motion.div
                            className="absolute z-20"
                            style={{ bottom: 100, right: -10 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: 1.2, ease: [0.22, 1, 0.36, 1] as const }}
                        >
                            <motion.div
                                className="rounded-xl p-3"
                                style={{
                                    width: 160,
                                    background: 'rgba(20,20,43,0.85)',
                                    backdropFilter: 'blur(16px)',
                                    border: '1px solid rgba(124,90,246,0.2)',
                                    boxShadow:
                                        '0 0 24px rgba(124,90,246,0.15), 0 12px 40px rgba(0,0,0,0.4)',
                                }}
                                animate={{
                                    y: [-6, 6, -6],
                                    rotate: [-1, 1, -1],
                                }}
                                transition={{
                                    duration: 4.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut' as const,
                                }}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-base">💻</span>
                                    <span
                                        className="text-[9px]"
                                        style={{
                                            fontFamily: 'var(--font-mono, monospace)',
                                            color: '#A1A1C7',
                                        }}
                                    >
                                        01h:30m
                                    </span>
                                </div>
                                {/* Title */}
                                <p
                                    className="text-[11px] font-bold mb-2"
                                    style={{ fontFamily: 'var(--font-dm-sans)', color: '#F8F8FF' }}
                                >
                                    Coding
                                </p>
                                {/* Progress bar */}
                                <div
                                    className="w-full rounded-full overflow-hidden mb-2"
                                    style={{ height: 3, background: 'rgba(124,90,246,0.15)' }}
                                >
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{
                                            background:
                                                'linear-gradient(90deg, #7C5AF6, #C084FC)',
                                        }}
                                        initial={{ width: '0%' }}
                                        animate={isInView ? { width: '68%' } : {}}
                                        transition={{ duration: 1.5, delay: 1.4, ease: 'easeOut' as const }}
                                    />
                                </div>
                                {/* Footer */}
                                <p
                                    className="text-[9px]"
                                    style={{ fontFamily: 'var(--font-dm-sans)', color: '#38BDF8' }}
                                >
                                    +50 XP on complete
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════
          BOTTOM FADE GRADIENT — connects to next section
          ════════════════════════════════════════════ */}
            <div
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                    bottom: 0,
                    height: 220,
                    zIndex: 20,
                    background: 'linear-gradient(to bottom, transparent 0%, #05050F 100%)',
                }}
            />
        </section>
    );
}