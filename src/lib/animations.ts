'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';

/* ──────────────────────────────────────────────
   Reusable Framer Motion Variants
   ────────────────────────────────────────────── */

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

export const fadeDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5 },
    },
};

export const fadeLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
};

export const fadeRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
};

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 },
    },
};

export const staggerContainerFast: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.05 },
    },
};

export const staggerContainerSlow: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
    },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: 'backOut' },
    },
};

export const floatingAnimation = {
    animate: {
        y: [-12, 12, -12],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut' as const,
        },
    },
};

export const floatingAnimationSlow = {
    animate: {
        y: [-8, 8, -8],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut' as const,
        },
    },
};

export const floatingAnimationReverse = {
    animate: {
        y: [12, -12, 12],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut' as const,
        },
    },
};

export const pulseGlow = {
    animate: {
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut' as const,
        },
    },
};

/* ──────────────────────────────────────────────
   useCountUp — animated counter hook
   ────────────────────────────────────────────── */

export function useCountUp(target: number, duration: number = 2) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        const start = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(eased * target));
            if (progress === 1) clearInterval(timer);
        }, 16);
        return () => clearInterval(timer);
    }, [inView, target, duration]);

    return { count, ref };
}
