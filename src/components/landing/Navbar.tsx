'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';
import { fadeDown, staggerContainerFast } from '@/lib/animations';

const navItems = [
    { label: 'Explore', href: '#explore' },
    { label: 'Quests', href: '#quests' },
    { label: 'Collections', href: '#collections' },
    { label: 'Community', href: '#community' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-[var(--hv-bg-surface)]/80 backdrop-blur-2xl border-b border-[var(--hv-border)]'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-6 lg:gap-10">
                    <Link href="/" className="flex items-center gap-2 pt-1">
                        <Image
                            src="/assets/logo/logo-full.png"
                            alt="Habitivity"
                            width={140}
                            height={36}
                            className="h-54 w-auto"
                            priority
                        />
                    </Link>

                    <motion.div
                        className="hidden md:flex items-center gap-8"
                        variants={staggerContainerFast}
                        initial="hidden"
                        animate="visible"
                    >
                        {navItems.map((item) => (
                            <motion.div key={item.label} variants={fadeDown}>
                                <Link
                                    href={item.href}
                                    className="text-sm font-medium text-[var(--hv-text-secondary)] hover:text-[var(--hv-text-primary)] transition-colors duration-200"
                                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Right: Search + CTA + Hamburger */}
                <div className="flex items-center gap-3">
                    {/* Search bar (desktop) */}
                    <div className="hidden lg:flex items-center bg-[var(--hv-bg-surface)] border border-[var(--hv-border)] rounded-full px-4 py-2 w-56 focus-within:border-[var(--hv-primary)]/50 transition-colors">
                        <Search className="w-4 h-4 text-[var(--hv-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search quests..."
                            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-[var(--hv-text-primary)] placeholder:text-[var(--hv-text-muted)]"
                            style={{ fontFamily: 'var(--font-dm-sans)' }}
                        />
                    </div>

                    {/* CTA button */}
                    <Link
                        href="/register"
                        className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(124,90,246,0.5)]"
                        style={{
                            background: 'linear-gradient(135deg, var(--hv-primary) 0%, var(--hv-accent) 100%)',
                            fontFamily: 'var(--font-dm-sans)',
                        }}
                    >
                        Start Journey
                    </Link>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden w-10 h-10 rounded-xl bg-[var(--hv-bg-surface)] border border-[var(--hv-border)] flex items-center justify-center text-[var(--hv-text-secondary)] hover:text-[var(--hv-text-primary)] transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="md:hidden overflow-hidden bg-[var(--hv-bg-surface)]/95 backdrop-blur-2xl border-b border-[var(--hv-border)]"
                    >
                        <div className="px-4 pb-4 pt-2 space-y-1">
                            {navItems.map((item, idx) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="block py-3 text-sm font-medium text-[var(--hv-text-secondary)] hover:text-[var(--hv-text-primary)] transition-colors"
                                        style={{ fontFamily: 'var(--font-dm-sans)' }}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="pt-3">
                                <Link
                                    href="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="block w-full text-center py-3 rounded-full text-sm font-bold text-white"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, var(--hv-primary) 0%, var(--hv-accent) 100%)',
                                    }}
                                >
                                    Start Journey
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
