'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer
            className="border-t py-14 sm:py-20"
            style={{
                background: 'var(--hv-bg-base)',
                borderColor: 'var(--hv-border)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Main 3-column layout */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12 mb-16 sm:mb-20">

                    {/* Left: Logo */}
                    <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
                        <Link href="#home">
                            <Image
                                src="/assets/logo/logo-full1.png"
                                alt="Habitivity Logo"
                                width={160}
                                height={2}
                                className="h-8 sm:h-14 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Center: Navigation Links */}
                    <div className="flex items-center justify-center text-center w-full md:w-1/3">
                        <ul className="flex flex-wrap justify-center gap-6 sm:gap-8">
                            <li>
                                <Link
                                    href="#home"
                                    className="text-sm sm:text-base font-medium transition-colors duration-200 hover:text-white"
                                    style={{
                                        color: 'var(--hv-text-muted)',
                                        fontFamily: 'var(--font-dm-sans)',
                                    }}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#explore"
                                    className="text-sm sm:text-base font-medium transition-colors duration-200 hover:text-white"
                                    style={{
                                        color: 'var(--hv-text-muted)',
                                        fontFamily: 'var(--font-dm-sans)',
                                    }}
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#how-it-works"
                                    className="text-sm sm:text-base font-medium transition-colors duration-200 hover:text-white"
                                    style={{
                                        color: 'var(--hv-text-muted)',
                                        fontFamily: 'var(--font-dm-sans)',
                                    }}
                                >
                                    How it works
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#leaderboard"
                                    className="text-sm sm:text-base font-medium transition-colors duration-200 hover:text-white"
                                    style={{
                                        color: 'var(--hv-text-muted)',
                                        fontFamily: 'var(--font-dm-sans)',
                                    }}
                                >
                                    Leaderboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Right: Tagline & Github */}
                    <div className="flex flex-col items-center md:items-end text-center md:text-right w-full md:w-1/3">
                        <p
                            className="text-base sm:text-sm mb-6 leading-relaxed max-w-[220px]"
                            style={{
                                color: 'var(--hv-text-muted)',
                                fontFamily: 'var(--font-dm-sans)',
                            }}
                        >
                            Gamify your life, mint your legacy.
                        </p>
                        <Link
                            href="https://github.com/NaufalYogaPratama/habitivity"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border border-[rgba(255,255,255,0.1)] hover:border-[#38BDF8] hover:bg-[rgba(56,189,248,0.1)] hover:scale-110 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] group"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.03)',
                            }}
                            aria-label="GitHub Repository"
                        >
                            <Github className="w-6 h-6 text-[#A1A1C7] group-hover:text-[#38BDF8] transition-colors" />
                        </Link>
                    </div>

                </div>

                {/* Bottom line */}
                <div
                    className="pt-8 border-t flex items-center justify-center md:justify-start"
                    style={{ borderColor: 'var(--hv-border)' }}
                >
                    <p
                        className="text-sm"
                        style={{
                            color: 'var(--hv-text-muted)',
                            fontFamily: 'var(--font-dm-sans)',
                        }}
                    >
                        © 2026 Habitivity. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
