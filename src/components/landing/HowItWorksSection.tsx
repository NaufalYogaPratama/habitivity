'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { UserCircle, Zap, Timer, Trophy } from 'lucide-react';

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

const slideFromRight = {
    hidden: { opacity: 0, x: 60 },
    visible: (delay: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
    }),
};

const slideFromLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: (delay: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
    }),
};

/* ──────────────────────────────────────────────
   Steps Data
   ────────────────────────────────────────────── */

const steps = [
    {
        num: '01',
        Icon: UserCircle,
        accent: '#A78BFA',
        nodeGradient: 'linear-gradient(135deg, #7C5AF6, #A78BFA)',
        title: 'Bangun Identitasmu',
        desc: 'Buat akun, pilih avatar karakter RPG-mu, dan atur preferensi produktivitas. Ini bukan sekedar profil — ini adalah karakter game-mu.',
        pills: ['Pilih Avatar', 'Setup Profil', 'Mulai Gratis'],
        side: 'right' as const,
    },
    {
        num: '02',
        Icon: Zap,
        accent: '#4ADE80',
        nodeGradient: 'linear-gradient(135deg, #4ADE80, #38BDF8)',
        title: 'Buat & Klasifikasi Quest',
        desc: 'Ketik tugasmu, biarkan AI menganalisis. Dalam hitungan detik: difficulty, estimasi waktu, XP reward, dan Gold reward ditentukan otomatis untukmu.',
        pills: ['AI Classification', 'XP Reward', 'Auto Difficulty'],
        side: 'left' as const,
    },
    {
        num: '03',
        Icon: Timer,
        accent: '#C084FC',
        nodeGradient: 'linear-gradient(135deg, #C084FC, #7C5AF6)',
        title: 'Aktifkan Focus Arena',
        desc: 'Mulai timer Pomodoro. HP-mu terjaga selama kamu di tab ini. Berpindah tab = HP berkurang. Disiplin bukan pilihan, ini mekanik game-nya.',
        pills: ['Pomodoro Timer', 'HP System', 'Focus Mode'],
        side: 'right' as const,
    },
    {
        num: '04',
        Icon: Trophy,
        accent: '#F59E0B',
        nodeGradient: 'linear-gradient(135deg, #F59E0B, #F0ABFC)',
        title: 'Klaim & Kelola Reward',
        desc: 'Quest selesai = XP + Gold masuk ke inventory. Pantau keuangan di Gold Ledger, beli item di Shop, naik level, dan kuasai leaderboard.',
        pills: ['XP + Gold', 'Level Up', 'Leaderboard'],
        side: 'left' as const,
    },
];

/* ──────────────────────────────────────────────
   Step Card Component
   ────────────────────────────────────────────── */

function StepCard({
    step,
    index,
}: {
    step: (typeof steps)[number];
    index: number;
}) {
    const { Icon, accent } = step;
    const delay = index * 0.15;
    const variant = step.side === 'right' ? slideFromRight : slideFromLeft;

    return (
        <motion.div
            custom={delay}
            variants={variant}
            className="cursor-pointer transition-all duration-300 relative group max-w-[320px] sm:max-w-[420px]"
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
        >
            <div
                className="rounded-[20px] p-5 sm:p-8 md:p-9 transition-all duration-300 relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${accent}1A 0%, rgba(13,13,32,0.8) 100%)`,
                    border: `1px solid ${accent}26`,
                    backdropFilter: 'blur(16px)',
                    boxShadow: `inset 0 0 30px ${accent}08`,
                }}
                onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = `${accent}66`;
                    el.style.boxShadow = `inset 0 0 40px ${accent}14, 0 8px 40px ${accent}1A`;
                }}
                onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = `${accent}26`;
                    el.style.boxShadow = `inset 0 0 30px ${accent}08`;
                }}
            >
                {/* Glow blob behind card top-left */}
                <div
                    className="absolute -top-10 -left-10 w-40 h-40 blur-3xl opacity-30 transition-opacity duration-300 group-hover:opacity-60 pointer-events-none"
                    style={{ background: accent }}
                />
                {/* Icon pill */}
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                        background: `${accent}10`,
                        border: `1px solid ${accent}33`,
                    }}
                >
                    <Icon size={22} color={accent} />
                </div>

                {/* Step number label */}
                <p
                    className="text-[10px] uppercase tracking-[0.12em] font-semibold mt-3.5"
                    style={{ color: accent, fontFamily: 'var(--font-dm-sans)' }}
                >
                    LANGKAH {step.num}
                </p>

                {/* Title */}
                <h3
                    className="text-[18px] sm:text-[22px] font-[800] tracking-[-0.02em] mt-1 mb-2.5"
                    style={{ color: '#F8F8FF', fontFamily: 'var(--font-syne)' }}
                >
                    {step.title}
                </h3>

                {/* Description */}
                <p
                    className="text-[13px] sm:text-[15px] leading-[1.75] mb-5"
                    style={{
                        color: '#A1A1C7',
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 300,
                    }}
                >
                    {step.desc}
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-1.5">
                    {step.pills.map((pill) => (
                        <span
                            key={pill}
                            className="text-[11px] rounded-full px-2.5 py-1 border"
                            style={{
                                background: `${accent}14`,
                                borderColor: `${accent}33`,
                                color: accent,
                                fontFamily: 'var(--font-dm-sans)',
                            }}
                        >
                            {pill}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

/* ──────────────────────────────────────────────
   Step Node (center indicator)
   ────────────────────────────────────────────── */

function StepNode({
    step,
    index,
    isInView,
}: {
    step: (typeof steps)[number];
    index: number;
    isInView: boolean;
}) {
    return (
        <div className="relative flex items-center justify-center">
            {/* Pulse ring */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: 64,
                    height: 64,
                    background: step.accent,
                    opacity: 0,
                }}
                animate={
                    isInView
                        ? {
                            scale: [1, 1.8, 1],
                            opacity: [0.3, 0, 0.3],
                        }
                        : {}
                }
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.4,
                    ease: 'easeInOut' as const,
                }}
            />

            {/* Node circle */}
            <motion.div
                className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                    background: step.nodeGradient,
                    border: '3px solid rgba(124,90,246,0.4)',
                    boxShadow:
                        '0 0 0 8px rgba(124,90,246,0.08), 0 0 32px rgba(124,90,246,0.3)',
                }}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{
                    duration: 0.5,
                    delay: index * 0.15 + 0.2,
                    ease: 'backOut' as const,
                }}
            >
                <span
                    className="text-lg font-[800]"
                    style={{ fontFamily: 'var(--font-syne)', color: '#F8F8FF' }}
                >
                    {step.num}
                </span>
            </motion.div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   How It Works Section
   ────────────────────────────────────────────── */

export default function HowItWorksSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerInView = useInView(sectionRef, { once: true, amount: 0.1 });
    const stepsRef = useRef<HTMLDivElement>(null);
    const stepsInView = useInView(stepsRef, { once: true, amount: 0.1 });

    const { scrollYProgress } = useScroll({
        target: stepsRef,
        offset: ['start center', 'end center'],
    });

    return (
        <section
            ref={sectionRef}
            id="how-it-works"
            className="relative overflow-hidden"
            style={{
                background: '#05050F',
                paddingTop: 120,
                paddingBottom: 140,
            }}
        >
            {/* ════════════════════════════════════════════
          BACKGROUND AMBIENT
          ════════════════════════════════════════════ */}

            {/* Center blob */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 600,
                    height: 400,
                    top: '30%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background:
                        'radial-gradient(ellipse, rgba(124,90,246,0.08) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Right blob */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    width: 300,
                    height: 300,
                    right: -100,
                    top: '20%',
                    background:
                        'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
            />

            {/* Left blob */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    width: 280,
                    height: 280,
                    left: -100,
                    bottom: '20%',
                    background:
                        'radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' as const }}
            />

            {/* ════════════════════════════════════════════
          SECTION HEADER
          ════════════════════════════════════════════ */}

            <div className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-12 text-center mb-24">
                {/* Badge pill */}
                <motion.div
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    animate={headerInView ? 'visible' : 'hidden'}
                    className="inline-block mb-5"
                >
                    {/* <span
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] tracking-[0.03em] font-medium border"
                        style={{
                            borderColor: 'rgba(124,90,246,0.3)',
                            background: 'rgba(124,90,246,0.1)',
                            color: '#A78BFA',
                            fontFamily: 'var(--font-dm-sans)',
                        }}
                    >
                        ⚡ Mulai dalam 4 Langkah
                    </span> */}
                </motion.div>

                {/* Title — line reveal */}
                <h2
                    className="font-[800] tracking-[-0.04em] mb-5"
                    style={{
                        fontFamily: 'var(--font-syne)',
                        fontSize: 'clamp(48px, 5.5vw, 72px)',
                        lineHeight: 1.05,
                    }}
                >
                    <span className="block overflow-hidden">
                        <motion.span
                            className="block"
                            custom={0.15}
                            variants={lineReveal}
                            initial="hidden"
                            animate={headerInView ? 'visible' : 'hidden'}
                            style={{ color: '#F8F8FF' }}
                        >
                            From Zero to
                        </motion.span>
                    </span>
                    <span className="block overflow-hidden">
                        <motion.span
                            className="block"
                            custom={0.3}
                            variants={lineReveal}
                            initial="hidden"
                            animate={headerInView ? 'visible' : 'hidden'}
                            style={{
                                background:
                                    'linear-gradient(135deg, #A78BFA 0%, #C084FC 50%, #F0ABFC 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Hero.
                        </motion.span>
                    </span>
                </h2>

                {/* Subtitle */}
                <motion.p
                    custom={0.45}
                    variants={fadeUp}
                    initial="hidden"
                    animate={headerInView ? 'visible' : 'hidden'}
                    className="mx-auto"
                    style={{
                        maxWidth: 400,
                        fontSize: 16,
                        lineHeight: 1.75,
                        color: '#A1A1C7',
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 300,
                    }}
                >
                    Setup sekali, jalankan selamanya. Habitivity merancang setiap langkahmu
                    menjadi sebuah quest.
                </motion.p>
            </div>

            {/* ════════════════════════════════════════════
          ZIG-ZAG STEPS
          ════════════════════════════════════════════ */}

            <div
                ref={stepsRef}
                className="relative max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-12"
            >
                {/* ── Connector Line (desktop) ── */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-0"
                    style={{ top: '100px', bottom: '100px', width: 2 }}
                >
                    <motion.svg
                        width="2"
                        height="100%"
                        className="overflow-visible"
                        style={{ display: 'block' }}
                    >
                        <defs>
                            <linearGradient id="neonGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7C5AF6" />
                                <stop offset="33%" stopColor="#4ADE80" />
                                <stop offset="66%" stopColor="#C084FC" />
                                <stop offset="100%" stopColor="#F59E0B" />
                            </linearGradient>
                        </defs>
                        {/* Base solid line */}
                        <line
                            x1="1"
                            y1="0"
                            x2="1"
                            y2="100%"
                            stroke="rgba(124,90,246,0.15)"
                            strokeWidth="2"
                        />
                        {/* Neon glow scroll progress line */}
                        <motion.line
                            x1="1"
                            y1="0"
                            x2="1"
                            y2="100%"
                            stroke="url(#neonGrad)"
                            strokeWidth="3"
                            style={{
                                pathLength: scrollYProgress,
                                filter: 'drop-shadow(0 0 10px rgba(124,90,246,0.8))',
                            }}
                        />
                    </motion.svg>
                </div>

                {/* ── Connector Line (mobile) ── */}
                <div className="md:hidden absolute left-6 z-0"
                    style={{ top: '32px', bottom: '130px', width: 2 }}
                >
                    <motion.svg
                        width="2"
                        height="100%"
                        className="overflow-visible"
                        style={{ display: 'block' }}
                    >
                        <defs>
                            <linearGradient id="neonGradMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7C5AF6" />
                                <stop offset="33%" stopColor="#4ADE80" />
                                <stop offset="66%" stopColor="#C084FC" />
                                <stop offset="100%" stopColor="#F59E0B" />
                            </linearGradient>
                        </defs>
                        {/* Base solid line */}
                        <line
                            x1="1"
                            y1="0"
                            x2="1"
                            y2="100%"
                            stroke="rgba(124,90,246,0.15)"
                            strokeWidth="2"
                        />
                        {/* Neon glow scroll progress line */}
                        <motion.line
                            x1="1"
                            y1="0"
                            x2="1"
                            y2="100%"
                            stroke="url(#neonGradMobile)"
                            strokeWidth="3"
                            style={{
                                pathLength: scrollYProgress,
                                filter: 'drop-shadow(0 0 10px rgba(124,90,246,0.8))',
                            }}
                        />
                    </motion.svg>
                </div>

                {/* ── Steps ── */}
                <motion.div
                    className="flex flex-col"
                    initial="hidden"
                    animate={stepsInView ? 'visible' : 'hidden'}
                >
                    {steps.map((step, index) => (
                        <div key={step.num} className="mb-20 last:mb-0">
                            {/* Desktop: zig-zag grid */}
                            <div className="hidden md:grid md:grid-cols-[1fr_80px_1fr] items-center min-h-[180px]">
                                {step.side === 'right' ? (
                                    <>
                                        {/* Empty left */}
                                        <div />
                                        {/* Center node */}
                                        <div className="flex justify-center">
                                            <StepNode
                                                step={step}
                                                index={index}
                                                isInView={stepsInView}
                                            />
                                        </div>
                                        {/* Card right */}
                                        <StepCard step={step} index={index} />
                                    </>
                                ) : (
                                    <>
                                        {/* Card left */}
                                        <div className="flex justify-end">
                                            <StepCard step={step} index={index} />
                                        </div>
                                        {/* Center node */}
                                        <div className="flex justify-center">
                                            <StepNode
                                                step={step}
                                                index={index}
                                                isInView={stepsInView}
                                            />
                                        </div>
                                        {/* Empty right */}
                                        <div />
                                    </>
                                )}
                            </div>

                            {/* Mobile: stacked with node on left */}
                            <div className="md:hidden flex gap-5 items-start">
                                {/* Node (on the line) */}
                                <div className="flex-shrink-0 -ml-[7px]">
                                    <StepNode
                                        step={step}
                                        index={index}
                                        isInView={stepsInView}
                                    />
                                </div>
                                {/* Card */}
                                <div className="flex-1 max-w-[480px]">
                                    <StepCard step={step} index={index} />
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
