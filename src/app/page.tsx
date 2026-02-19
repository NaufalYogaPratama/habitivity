'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Icons = {
  Search: () => <span>🔍</span>,
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1021] text-white overflow-x-hidden selection:bg-fuchsia-500/30">

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0f1021]/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-12">
            <Link href="/" className="text-xl sm:text-2xl font-bold font-mono tracking-tighter">
              <span className="text-gradient">Habitivity</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <Link href="#explore" className="hover:text-white transition-colors">Explore</Link>
              <Link href="#creators" className="hover:text-white transition-colors">Creators</Link>
              <Link href="#community" className="hover:text-white transition-colors">Community</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-64 focus-within:border-violet-500/50 transition-colors">
              <Icons.Search />
              <input
                type="text"
                placeholder="Search quests, habits..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder:text-slate-500"
              />
            </div>
            <Link
              href="/login"
              className="hidden sm:inline-block px-5 sm:px-6 py-2 sm:py-2.5 bg-white rounded-full text-[#0f1021] font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              Start Journey
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0f1021]/95 backdrop-blur-xl border-b border-white/5 px-4 pb-4 space-y-3">
            <Link href="#explore" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-300 hover:text-white">Explore</Link>
            <Link href="#creators" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-300 hover:text-white">Creators</Link>
            <Link href="#community" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-300 hover:text-white">Community</Link>
            <div className="pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-white rounded-full text-[#0f1021] font-bold text-sm"
              >
                Start Journey
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="relative pt-24 sm:pt-32 pb-20">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 sm:mb-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-violet-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                The #1 NFT-Gamified Life OS
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1]">
                Collect Habits. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">Build Your Legacy.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-lg leading-relaxed mx-auto lg:mx-0">
                Turn your daily routine into a high-value digital asset collection. Complete quests, earn XP, and mint your achievements.
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full font-bold text-sm sm:text-base shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all"
                >
                  Start Collecting
                </Link>
                <Link
                  href="/login"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-full font-bold text-sm sm:text-base hover:bg-white/10 transition-colors"
                >
                  View Demo
                </Link>
              </div>

              <div className="flex items-center gap-6 sm:gap-8 pt-2 sm:pt-4 justify-center lg:justify-start">
                <div>
                  <p className="text-xl sm:text-2xl font-bold">98k+</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Users</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">12M+</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Quests Done</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">540k</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">NFTs Minted</p>
                </div>
              </div>
            </div>

            {/* 3D Card Visual */}
            <div className="relative perspective-1000 group flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 to-fuchsia-600/30 blur-[60px] rounded-full" />

              <motion.div
                initial={{ rotateY: -10, rotateX: 5 }}
                animate={{
                  rotateY: [10, -10],
                  rotateX: [5, -5]
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 6,
                  ease: "easeInOut"
                }}
                className="relative z-10 w-[280px] sm:w-[340px] md:w-[380px] mx-auto bg-[#1a1b33]/90 border border-white/10 rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 shadow-2xl backdrop-blur-xl"
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-4 sm:mb-6 relative overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                  <span className="text-6xl sm:text-8xl filter drop-shadow-xl animate-bounce duration-[3000ms]">🧘‍♂️</span>

                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/20 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                    Rare
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base sm:text-xl font-bold">Morning Zen Master</h3>
                      <p className="text-slate-400 text-xs sm:text-sm">Mindfulness Collection</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] sm:text-xs text-slate-500">Price</p>
                      <p className="text-violet-400 font-mono font-bold text-sm sm:text-base">500 XP</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-black/20 p-2.5 sm:p-3 rounded-xl">
                    <span className="text-base sm:text-lg">🔥</span>
                    <span>highest bid <b>320 XP</b> by </span>
                    <span className="text-white font-medium truncate">@HabitHero...</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
                    <button className="py-2.5 sm:py-3 rounded-xl bg-violet-600 font-bold text-xs sm:text-sm hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20">
                      Place Bid
                    </button>
                    <button className="py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 font-bold text-xs sm:text-sm hover:bg-white/10 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Hot Bids / Trending Quests */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 sm:mb-32" id="explore">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">🔥</span> Trending Quests
            </h2>
            <Link href="/login" className="text-xs sm:text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors">
              View All →
            </Link>
          </div>

          {/* Horizontal scroll on mobile, grid on md+ */}
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-x-visible md:pb-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group bg-[#1a1b33]/60 border border-white/5 rounded-[20px] sm:rounded-[24px] p-3 sm:p-4 hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-900/10 transition-all duration-300 hover:-translate-y-1 min-w-[220px] sm:min-w-[260px] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink">
                <div className="aspect-[4/3] rounded-xl sm:rounded-2xl bg-slate-800/50 mb-3 sm:mb-4 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${i === 1 ? 'from-emerald-500/20 to-teal-500/20' :
                    i === 2 ? 'from-orange-500/20 to-red-500/20' :
                      i === 3 ? 'from-blue-500/20 to-cyan-500/20' :
                        'from-pink-500/20 to-rose-500/20'
                    }`} />
                  <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl transform group-hover:scale-110 transition-transform duration-500">
                    {i === 1 ? '🏃‍♂️' : i === 2 ? '📚' : i === 3 ? '💧' : '🎨'}
                  </div>
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/40 backdrop-blur-md px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold border border-white/10 text-white">
                    0{i}h : 30m
                  </div>
                </div>

                <h3 className="font-bold text-base sm:text-lg mb-1">{
                  i === 1 ? '5k Runner' : i === 2 ? 'Read 30 Pages' : i === 3 ? 'Hydration Hit' : 'Create Art'
                }</h3>

                <div className="flex items-center justify-between mt-3 sm:mt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(u => (
                        <div key={u} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-700 border border-[#1a1b33]" />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-400">12+ active</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] sm:text-xs text-slate-500">Reward</p>
                    <p className="text-xs sm:text-sm font-bold text-emerald-400">+{i * 50} XP</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Collections */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 sm:mb-32">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12">Top Collections over <span className="text-violet-400">last 7 days</span> ▾</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {['Fitness Freaks', 'Code Warriors', 'Mindful Monks', 'Artistic Souls', 'Wealth Builders', 'Social Butterflies'].map((col, idx) => (
              <div key={idx} className="flex items-center gap-3 sm:gap-4 hover:bg-white/5 p-3 sm:p-4 rounded-xl transition-colors cursor-pointer group">
                <span className="font-bold text-slate-500 w-4">{idx + 1}</span>
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 relative overflow-hidden group-hover:border-violet-500/50 transition-colors flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm sm:text-base group-hover:text-violet-400 transition-colors truncate">{col}</h4>
                  <p className="text-xs sm:text-sm text-slate-400">Floor: <span className="text-white font-medium">2,400 XP</span></p>
                </div>
                <div className="ml-auto text-right flex-shrink-0">
                  <p className={`text-xs sm:text-sm font-bold ${idx % 2 === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {idx % 2 === 0 ? '+' : '-'}{Math.floor(Math.random() * 20)}%
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-500">Vol: 12k</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link href="/login" className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#1a1b33]/60 border border-white/10 rounded-full text-sm font-bold hover:bg-[#1a1b33] transition-colors">
              Go to Rankings
            </Link>
          </div>
        </section>

        {/* Create and Sell / How it Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12">Create and Sell Your Habits</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: '👛', title: 'Set up your wallet', desc: 'Create your profile and connect your identity to start your journey.' },
              { icon: '📂', title: 'Create Collection', desc: 'Define your habit categories and set your daily goals.' },
              { icon: '🖼️', title: 'Add your NFTs', desc: 'Complete quests to mint your daily achievements as NFTs.' },
              { icon: '🏷️', title: 'List them for sale', desc: 'Trade your XP and rewards in the community marketplace.' },
            ].map((step, idx) => (
              <div key={idx} className="group relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#1a1b33] border border-white/10 flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6 group-hover:bg-violet-600 transition-colors shadow-lg shadow-black/20">
                  {step.icon}
                </div>
                <h3 className="font-bold text-sm sm:text-lg mb-1 sm:mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{step.desc}</p>

                {idx !== 3 && (
                  <div className="hidden md:block absolute top-6 sm:top-8 left-16 sm:left-20 right-[-20%] h-[1px] bg-gradient-to-r from-violet-500/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="relative py-20 sm:py-32 mt-20 sm:mt-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/20 pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-8">Ready to <span className="text-gradient">Mint Your Life?</span></h2>
            <p className="text-base sm:text-xl text-slate-400 mb-8 sm:mb-10">Join 98,000+ others who are turning their productivity into a game worth playing.</p>
            <Link
              href="/register"
              className="inline-block px-8 sm:px-12 py-4 sm:py-5 bg-white text-[#0f1021] rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-transform shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)]"
            >
              Get Started Now
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
