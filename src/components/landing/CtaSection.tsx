'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { scaleIn } from '@/lib/animations';

export default function CtaSection() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section
            ref={ref}
            className="relative py-24 sm:py-36 overflow-hidden"
        >
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,90,246,0.15) 0%, transparent 70%)',
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
                    style={{ background: 'var(--hv-primary)', filter: 'blur(120px)' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 max-w-3xl mx-auto text-center px-4 sm:px-6"
                variants={scaleIn}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
            >
                <h2
                    className="text-3xl sm:text-5xl md:text-6xl font-[800] tracking-[-0.03em] mb-6 sm:mb-8"
                    style={{ fontFamily: 'var(--font-syne)' }}
                >
                    <span className="text-[var(--hv-text-primary)]">Ready to </span>
                    <span className="text-gradient-primary">Mint Your Life?</span>
                </h2>

                <p
                    className="text-base sm:text-lg mb-8 sm:mb-12 max-w-xl mx-auto leading-relaxed"
                    style={{
                        color: 'var(--hv-text-secondary)',
                        fontFamily: 'var(--font-dm-sans)',
                    }}
                >
                    Join 98,000+ others turning their productivity into a game worth playing.
                </p>

                <Link
                    href="/register"
                    className="inline-flex items-center px-10 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg transition-all duration-300 border backdrop-blur-sm hover:bg-white hover:text-[var(--hv-bg-base)] hover:scale-105"
                    style={{
                        borderColor: 'rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--hv-text-primary)',
                        fontFamily: 'var(--font-dm-sans)',
                        minWidth: '220px',
                        justifyContent: 'center',
                    }}
                >
                    Get Started Now
                </Link>
            </motion.div>
        </section>
    );
}
