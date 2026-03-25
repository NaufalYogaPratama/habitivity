'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fadeUp } from '@/lib/animations';

export default function CtaSection() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section
            ref={ref}
            className="relative py-24 sm:py-32 px-4 sm:px-6 w-full max-w-[1240px] mx-auto flex justify-center overflow-hidden"
        >
            {/* The main wide banner card */}
            <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="relative w-full overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 md:p-16 lg:p-20 group"
                style={{
                    borderRadius: '120px 32px 32px 32px',
                    // Deep navy-to-black gradient
                    background: 'linear-gradient(135deg, #0D0D20 0%, #030308 100%)',
                    // Purple outer glow and subtle inner edge
                    boxShadow:
                        '0 20px 80px -20px rgba(124, 90, 246, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                }}
            >
                {/* ── Gradient Border Masking ── */}
                <div
                    className="absolute inset-0 pointer-events-none p-[1.5px]"
                    style={{
                        borderRadius: '120px 32px 32px 32px',
                        background:
                            'linear-gradient(to right, #38BDF8 0%, #7C5AF6 40%, rgba(240, 171, 252, 0.2) 70%, transparent 90%)',
                        WebkitMask:
                            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        opacity: 0.9,
                    }}
                />

                {/* ── Ambient Background Glows inside the card ── */}
                {/* Glows removed per user request */}

                {/* ── Left Content (Text & CTA) ── */}
                <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-16 md:mb-0">
                    <span
                        className="inline-flex items-center text-[11px] sm:text-[12px] font-bold tracking-[0.15em] uppercase mb-6 px-4 py-1.5 rounded-full"
                        style={{
                            color: '#A78BFA',
                            background: 'rgba(167, 139, 250, 0.1)',
                            border: '1px solid rgba(167, 139, 250, 0.3)',
                            fontFamily: 'var(--font-dm-sans)',
                        }}
                    >
                        Pioneer The Future
                    </span>

                    <h2
                        className="text-4xl sm:text-5xl lg:text-6xl font-[800] tracking-[-0.03em] mb-6"
                        style={{ fontFamily: 'var(--font-syne)', lineHeight: 1.15 }}
                    >
                        <span style={{ color: '#F8F8FF' }}>Ready to </span>
                        <br className="hidden md:block" />
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #38BDF8 0%, #C084FC 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Mint Your Life?
                        </span>
                    </h2>

                    <p
                        className="text-base sm:text-lg mb-10 max-w-[420px] mx-auto md:mx-0 leading-relaxed"
                        style={{
                            color: '#A1A1C7',
                            fontFamily: 'var(--font-dm-sans)',
                            fontWeight: 300,
                        }}
                    >
                        Turn your productivity into a game worth
                        playing. Claim your avatar, complete quests, and unlock a new dimension of focus.
                    </p>

                    <Link
                        href="/register"
                        className="relative flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg text-white transition-all overflow-hidden"
                        style={{
                            background: 'linear-gradient(90deg, #7C5AF6 0%, #38BDF8 100%)',
                            boxShadow: '0 10px 40px -10px rgba(56, 189, 248, 0.6)',
                            fontFamily: 'var(--font-dm-sans)',
                        }}
                    >
                        <span className="relative z-10">Let's Begin</span>
                        <ArrowRight size={20} className="relative z-10" />

                        {/* Interactive hover overlay */}
                        <div className="absolute inset-0 bg-white opacity-0 transition-opacity hover:opacity-20 z-0" />
                    </Link>
                </div>

                {/* ── Right Content (Neon Orb Image) ── */}
                <div className="relative z-10 w-full md:w-1/2 flex justify-center md:justify-end">
                    <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[460px] lg:h-[524px]">
                        {/* Core glow behind orb */}


                        {/* Static image with radial fade on all sides */}
                        <div
                            className="w-full h-full relative"
                            style={{
                                WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                            }}
                        >
                            <Image
                                src="/assets/cta.png"
                                alt="Swirling Holographic Neon Orb"
                                fill
                                className="object-cover object-center"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
