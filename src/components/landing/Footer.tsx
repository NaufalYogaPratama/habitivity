'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Github, MessageCircle } from 'lucide-react';

const productLinks = [
    { label: 'Explore', href: '#explore' },
    { label: 'Quests', href: '#quests' },
    { label: 'Collections', href: '#collections' },
    { label: 'Leaderboard', href: '#' },
    { label: 'Marketplace', href: '#' },
];

const communityLinks = [
    { label: 'Discord', href: '#' },
    { label: 'Twitter', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'Suggest Feature', href: '#' },
];

const socialIcons = [
    { Icon: Twitter, href: '#', label: 'Twitter' },
    { Icon: MessageCircle, href: '#', label: 'Discord' },
    { Icon: Github, href: '#', label: 'Github' },
];

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
                {/* Main grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
                    {/* Column 1: Logo + Tagline + Social */}
                    <div className="col-span-2 md:col-span-1">
                        <Image
                            src="/assets/logo/logo-full.png"
                            alt="Habitivity"
                            width={130}
                            height={34}
                            className="h-54 w-auto mb-4"
                        />
                        <p
                            className="text-sm mb-5 leading-relaxed"
                            style={{
                                color: 'var(--hv-text-muted)',
                                fontFamily: 'var(--font-dm-sans)',
                            }}
                        >
                            Gamify your life. Mint your legacy.
                        </p>
                        <div className="flex items-center gap-3">
                            {socialIcons.map(({ Icon, href, label }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border hover:bg-[var(--hv-primary)]/10 hover:border-[var(--hv-border-hover)]"
                                    style={{
                                        borderColor: 'var(--hv-border)',
                                        color: 'var(--hv-text-muted)',
                                    }}
                                >
                                    <Icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Product */}
                    <div>
                        <h4
                            className="text-xs font-bold uppercase tracking-[0.12em] mb-4"
                            style={{
                                color: 'var(--hv-text-secondary)',
                                fontFamily: 'var(--font-dm-sans)',
                            }}
                        >
                            Product
                        </h4>
                        <ul className="space-y-2.5">
                            {productLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm transition-colors duration-200 hover:text-[var(--hv-text-primary)]"
                                        style={{
                                            color: 'var(--hv-text-muted)',
                                            fontFamily: 'var(--font-dm-sans)',
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Community */}
                    <div>
                        <h4
                            className="text-xs font-bold uppercase tracking-[0.12em] mb-4"
                            style={{
                                color: 'var(--hv-text-secondary)',
                                fontFamily: 'var(--font-dm-sans)',
                            }}
                        >
                            Community
                        </h4>
                        <ul className="space-y-2.5">
                            {communityLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm transition-colors duration-200 hover:text-[var(--hv-text-primary)]"
                                        style={{
                                            color: 'var(--hv-text-muted)',
                                            fontFamily: 'var(--font-dm-sans)',
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h4
                            className="text-xs font-bold uppercase tracking-[0.12em] mb-4"
                            style={{
                                color: 'var(--hv-text-secondary)',
                                fontFamily: 'var(--font-dm-sans)',
                            }}
                        >
                            Stay Updated
                        </h4>
                        <p
                            className="text-xs mb-3 leading-relaxed"
                            style={{
                                color: 'var(--hv-text-muted)',
                                fontFamily: 'var(--font-dm-sans)',
                            }}
                        >
                            Get the latest updates on new quests and features.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 min-w-0 px-3 py-2 rounded-l-lg text-xs bg-[var(--hv-bg-surface)] border border-r-0 text-[var(--hv-text-primary)] placeholder:text-[var(--hv-text-muted)] outline-none focus:border-[var(--hv-primary)]"
                                style={{
                                    borderColor: 'var(--hv-border)',
                                    fontFamily: 'var(--font-dm-sans)',
                                }}
                            />
                            <button
                                className="px-3 py-2 rounded-r-lg text-xs font-bold text-white flex-shrink-0 transition-opacity hover:opacity-90"
                                style={{
                                    background:
                                        'linear-gradient(135deg, var(--hv-primary) 0%, var(--hv-accent) 100%)',
                                    fontFamily: 'var(--font-dm-sans)',
                                }}
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ borderColor: 'var(--hv-border)' }}
                >
                    <p
                        className="text-xs"
                        style={{
                            color: 'var(--hv-text-muted)',
                            fontFamily: 'var(--font-dm-sans)',
                        }}
                    >
                        © 2026 Habitivity. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <span
                            className="text-xs px-2 py-0.5 rounded border"
                            style={{
                                borderColor: 'var(--hv-border)',
                                color: 'var(--hv-text-muted)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                            }}
                        >
                            Built on Web3
                        </span>
                        <Link
                            href="#"
                            className="text-xs transition-colors hover:text-[var(--hv-text-primary)]"
                            style={{
                                color: 'var(--hv-text-muted)',
                                fontFamily: 'var(--font-dm-sans)',
                            }}
                        >
                            Privacy
                        </Link>
                        <Link
                            href="#"
                            className="text-xs transition-colors hover:text-[var(--hv-text-primary)]"
                            style={{
                                color: 'var(--hv-text-muted)',
                                fontFamily: 'var(--font-dm-sans)',
                            }}
                        >
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
