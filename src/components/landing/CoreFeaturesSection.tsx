'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

/* ──────────────────────────────────────────────
   Animation Variants
   ────────────────────────────────────────────── */

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
    }),
};

const cardReveal = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
    }),
};

/* ──────────────────────────────────────────────
   Card Particles Config
   ────────────────────────────────────────────── */

function CardParticles({ color, count = 5 }: { color: string; count?: number }) {
    const particleConfigs = Array.from({ length: count }, (_, i) => ({
        x: `${15 + ((i * 17 + 11) % 70)}%`,
        y: `${10 + ((i * 23 + 7) % 65)}%`,
        size: 2 + (i % 3),
        dx: (i % 2 === 0 ? 1 : -1) * (6 + (i * 3) % 8),
        dy: (i % 2 === 0 ? -1 : 1) * (8 + (i * 5) % 10),
        dur: 3 + (i * 0.7) % 3,
    }));

    return (
        <>
            {particleConfigs.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: p.x,
                        top: p.y,
                        background: color,
                        boxShadow: `0 0 ${p.size * 3}px ${color}`,
                    }}
                    animate={{
                        x: [0, p.dx, 0],
                        y: [0, p.dy, 0],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: p.dur,
                        repeat: Infinity,
                        ease: 'easeInOut' as const,
                        delay: i * 0.4,
                    }}
                />
            ))}
        </>
    );
}

/* ──────────────────────────────────────────────
   Card Data
   ────────────────────────────────────────────── */

const features = [
    {
        image: '/assets/quest.png',
        name: 'Quest Board',
        nameGradient: 'linear-gradient(135deg, #FF007A, #FF7EB3)',
        body: 'Buat quest, selesaikan tugas, raih XP. Setiap pencapaianmu tercatat sebagai aset digital yang berharga.',
        tag: 'Labor System · AI-Powered',
        borderColor: 'rgba(255,0,122,0.30)',
        glowShadow: '0 0 40px rgba(255,0,122,0.25)',
        illustrationBg: 'linear-gradient(135deg, #1A0510, #210A1A)',
        particleColor: '#FF007A',
        floatDuration: 3.0,
        infoLabel: 'PRODUCTIVITY ENGINE',
        infoName: 'Quest Board',
        infoDesc: 'AI otomatis klasifikasi difficulty, estimasi waktu, dan reward XP + Gold setiap quest.',
        featured: false,
    },
    {
        image: '/assets/focus.png',
        name: 'Focus Arena',
        nameGradient: 'linear-gradient(135deg, #A78BFA, #F0ABFC)',
        body: 'Aktifkan Pomodoro mode. HP-mu berkurang setiap kali kamu berpindah tab. Disiplin adalah satu-satunya jalan.',
        tag: 'Discipline System · HP Mechanic',
        borderColor: 'rgba(192,132,252,0.35)',
        glowShadow:
            '0 0 60px rgba(192,132,252,0.25), 0 0 120px rgba(124,90,246,0.15)',
        illustrationBg: 'linear-gradient(135deg, #1A0A2E, #150A28)',
        particleColor: '#C084FC',
        floatDuration: 2.5,
        infoLabel: 'CORE FEATURE',
        infoName: 'Focus Arena',
        infoDesc: 'Timer gamified dengan HP penalty system. Fokus atau bayar konsekuensinya.',
        featured: true,
    },
    {
        image: '/assets/gold.png',
        name: 'Gold Ledger',
        nameGradient: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
        body: 'Catat pengeluaran, pantau budget, dan dapatkan reward Gold ketika berhasil hemat. Keuanganmu adalah inventorymu.',
        tag: 'Economy System · Finance Gamified',
        borderColor: 'rgba(245,158,11,0.20)',
        glowShadow: '0 0 30px rgba(245,158,11,0.10)',
        illustrationBg: 'linear-gradient(135deg, #1A1208, #1F1508)',
        particleColor: '#F59E0B',
        floatDuration: 3.5,
        infoLabel: 'ECONOMY ENGINE',
        infoName: 'Gold Ledger',
        infoDesc: 'Gamifikasi keuangan pribadi. Hemat = Gold. Boros = Penalty. Hidup adalah RPG.',
        featured: false,
    },
];

/* ──────────────────────────────────────────────
   Feature Card Component
   ────────────────────────────────────────────── */

function FeatureCard({
    feature,
    delay,
}: {
    feature: (typeof features)[number];
    delay: number;
}) {
    return (
        <motion.div
            custom={delay}
            variants={cardReveal}
            className="flex flex-col"
            style={{
                marginTop: feature.featured ? -16 : 0,
                transform: feature.featured ? 'scale(1.04)' : undefined,
                transformOrigin: 'top center',
            }}
            whileHover={
                feature.featured
                    ? { scale: 1.06, transition: { duration: 0.3 } }
                    : { y: -6, transition: { duration: 0.3 } }
            }
        >
            {/* ──── TOP: NFT-style feature card ──── */}
            <div
                className="rounded-[20px] overflow-hidden cursor-pointer transition-shadow duration-500"
                style={{
                    background: '#0D0D20',
                    border: `1px solid ${feature.borderColor}`,
                    boxShadow: feature.glowShadow,
                }}
            >
                {/* Illustration area */}
                <div
                    className="relative overflow-hidden"
                    style={{
                        width: '100%',
                        aspectRatio: '1024 / 1536',
                        borderRadius: '20px 20px 0 0',
                    }}
                >
                    {/* Glow behind image */}
                    <div
                        className="absolute rounded-full pointer-events-none z-10"
                        style={{
                            width: 120,
                            height: 120,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: feature.particleColor,
                            filter: 'blur(50px)',
                            opacity: 0.35,
                        }}
                    />

                    {/* Particles */}
                    <div className="absolute inset-0 z-10">
                        <CardParticles color={feature.particleColor} count={5} />
                    </div>

                    {/* Feature image — full bleed cover */}
                    <Image
                        src={feature.image}
                        alt={feature.name}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center top' }}
                        sizes="(max-width: 768px) 100vw, 400px"
                    />
                </div>

                {/* Divider */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} />

                {/* Card name */}
                <p
                    className="text-center text-[15px] font-bold pt-3.5 pb-2 px-4"
                    style={{
                        fontFamily: 'var(--font-syne)',
                        background: feature.nameGradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    — {feature.name} —
                </p>

                {/* Body text */}
                <p
                    className="text-center text-[12px] leading-[1.7] px-4 pb-3"
                    style={{
                        color: '#A1A1C7',
                        fontFamily: 'var(--font-dm-sans)',
                        fontStyle: 'italic',
                    }}
                >
                    {feature.body}
                </p>

                {/* Tag label */}
                <p
                    className="text-center text-[10px] uppercase tracking-[0.06em] pb-4"
                    style={{
                        color: '#4A4A6A',
                        fontFamily: 'var(--font-dm-sans)',
                    }}
                >
                    {feature.tag}
                </p>
            </div>

            {/* ──── BOTTOM: Info card (no container) ──── */}
            <div className="pt-5 px-1">
                {/* Label */}
                <p
                    className="text-[10px] uppercase tracking-[0.08em] mb-1.5"
                    style={{
                        color: '#4A4A6A',
                        fontFamily: 'var(--font-dm-sans)',
                    }}
                >
                    {feature.infoLabel}
                </p>

                {/* Name */}
                <h3
                    className="text-lg font-bold mb-1.5"
                    style={{
                        color: '#F8F8FF',
                        fontFamily: 'var(--font-syne)',
                    }}
                >
                    {feature.infoName}
                </h3>

                {/* Description */}
                <p
                    className="text-[13px] leading-[1.7] mb-3"
                    style={{
                        color: '#A1A1C7',
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 300,
                    }}
                >
                    {feature.infoDesc}
                </p>

                {/* CTA */}
                {/* <Link
                    href="#"
                    className="text-[13px] font-medium transition-opacity hover:opacity-70 hover:underline"
                    style={{
                        color: '#A78BFA',
                        fontFamily: 'var(--font-dm-sans)',
                    }}
                >
                    Explore →
                </Link> */}
            </div>
        </motion.div>
    );
}

/* ──────────────────────────────────────────────
   Core Features Section
   ────────────────────────────────────────────── */

export default function CoreFeaturesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

    return (
        <section id="explore"
            ref={sectionRef}
            className="relative overflow-hidden"
            style={{
                background: '#05050F',
                paddingTop: 120,
                paddingBottom: 140,
                paddingLeft: 48,
                paddingRight: 48,
            }}
        >
            {/* ════════════════════════════════════════════
          BACKGROUND ORBS
          ════════════════════════════════════════════ */}

            {/* Orb 1 — solid purple circle (left-top) */}
            {/* <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: 140,
                    height: 140,
                    top: -40,
                    left: -20,
                    background: '#2D1B69',
                }}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const }}
            /> */}

            {/* Orb 2 — gradient ring/torus (right-top) */}
            {/* <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: 110,
                    height: 110,
                    top: 20,
                    right: 40,
                    background: 'transparent',
                    border: '12px solid transparent',
                    backgroundImage:
                        'linear-gradient(#05050F, #05050F), linear-gradient(135deg, #38BDF8, #7C5AF6)',
                    backgroundClip: 'padding-box, border-box',
                    backgroundOrigin: 'padding-box, border-box',
                }}
                animate={{ y: [0, 12, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
            /> */}

            {/* ════════════════════════════════════════════
          SECTION HEADER
          ════════════════════════════════════════════ */}

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
                        color: '#F8F8FF',
                    }}
                >
                    Three Systems.{' '}
                    <span
                        style={{
                            background: 'linear-gradient(135deg, #A78BFA, #C084FC)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        One OS.
                    </span>
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
                    Habitivity mengintegrasikan produktivitas, fokus, dan keuangan dalam
                    satu ekosistem gamifikasi yang saling memperkuat.
                </motion.p>
            </div>

            {/* ════════════════════════════════════════════
          3-COLUMN CARD GRID
          ════════════════════════════════════════════ */}

            <motion.div
                className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-7 items-start"
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
            >
                {features.map((feature, idx) => (
                    <FeatureCard key={idx} feature={feature} delay={0.1 + idx * 0.1} />
                ))}
            </motion.div>

            {/* Featured card glow pulse — animated via CSS since it's a box-shadow on the center card */}
            {/* Already handled in the card's boxShadow prop */}
        </section>
    );
}
