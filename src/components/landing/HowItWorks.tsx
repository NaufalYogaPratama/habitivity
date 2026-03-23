'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

const steps = [
    {
        emoji: '🎒',
        num: '01',
        title: 'Set up your wallet',
        desc: 'Create your profile and connect your identity to start your journey.',
        gradient: 'from-violet-600 to-indigo-600',
    },
    {
        emoji: '📁',
        num: '02',
        title: 'Create Collection',
        desc: 'Define your habit categories and set your daily goals.',
        gradient: 'from-fuchsia-600 to-pink-600',
    },
    {
        emoji: '🖼️',
        num: '03',
        title: 'Add your NFTs',
        desc: 'Complete quests to mint your daily achievements as NFTs.',
        gradient: 'from-cyan-600 to-blue-600',
    },
    {
        emoji: '🏷️',
        num: '04',
        title: 'List them for sale',
        desc: 'Trade your XP and rewards in the community marketplace.',
        gradient: 'from-emerald-600 to-teal-600',
    },
];

export default function HowItWorks() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section ref={ref} id="community" className="py-20 sm:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.h2
                    className="text-2xl sm:text-3xl md:text-4xl font-[800] tracking-[-0.02em] text-center mb-14 sm:mb-20 text-[var(--hv-text-primary)]"
                    style={{ fontFamily: 'var(--font-syne)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    Create and Sell Your Habits
                </motion.h2>

                {/* Steps */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 relative"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    {/* Connector line (desktop) */}
                    <div
                        className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[1px]"
                        style={{
                            background:
                                'linear-gradient(90deg, transparent 0%, var(--hv-border-hover) 20%, var(--hv-border-hover) 80%, transparent 100%)',
                        }}
                    />

                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            className="group relative text-center md:text-left"
                        >
                            {/* Icon */}
                            <div className="flex justify-center md:justify-start mb-5">
                                <div
                                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}
                                    style={{
                                        boxShadow:
                                            '0 8px 24px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    {step.emoji}
                                </div>
                            </div>

                            {/* Step number */}
                            <p
                                className="text-xs mb-2"
                                style={{
                                    color: 'var(--hv-text-muted)',
                                    fontFamily: 'var(--font-mono)',
                                }}
                            >
                                {step.num}
                            </p>

                            {/* Title */}
                            <h3
                                className="font-bold text-sm sm:text-base mb-2 text-[var(--hv-text-primary)]"
                                style={{ fontFamily: 'var(--font-syne)' }}
                            >
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p
                                className="text-xs sm:text-sm leading-relaxed"
                                style={{
                                    color: 'var(--hv-text-secondary)',
                                    fontFamily: 'var(--font-dm-sans)',
                                }}
                            >
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
