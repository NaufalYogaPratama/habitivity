'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Icons (using emojis for now to keep it zero-dep, but could use Lucide)
const Icons = {
  Wallet: () => <span>👛</span>,
  Grid: () => <span>🔲</span>,
  Trending: () => <span>🔥</span>,
  Create: () => <span>✨</span>,
  User: () => <span>👤</span>,
  Search: () => <span>🔍</span>,
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

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
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-bold font-mono tracking-tighter">
              <span className="text-gradient">Habitivity</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <Link href="#explore" className="hover:text-white transition-colors">Explore</Link>
              <Link href="#creators" className="hover:text-white transition-colors">Creators</Link>
              <Link href="#community" className="hover:text-white transition-colors">Community</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-64 focus-within:border-violet-500/50 transition-colors">
              <Icons.Search />
              <input
                type="text"
                placeholder="Search quests, habits..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder:text-slate-500"
              />
            </div>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-white rounded-full text-[#0f1021] font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              Start Journey
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-violet-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                The #1 NFT-Gamified Life OS
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1]">
                Collect Habits. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">Build Your Legacy.</span>
              </h1>

              <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                Turn your daily routine into a high-value digital asset collection. Complete quests, earn XP, and mint your achievements.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all"
                >
                  Start Collecting
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-colors"
                >
                  View Demo
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold">98k+</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Users</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">12M+</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Quests Done</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">540k</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">NFTs Minted</p>
                </div>
              </div>
            </div>

            {/* 3D Card Visual */}
            <div className="relative perspective-1000 group">
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
                className="relative z-10 w-[380px] mx-auto bg-[#1a1b33]/90 border border-white/10 rounded-[32px] p-6 shadow-2xl backdrop-blur-xl"
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-6 relative overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                  <span className="text-8xl filter drop-shadow-xl animate-bounce duration-[3000ms]">🧘‍♂️</span>

                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                    Rare
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">Morning Zen Master</h3>
                      <p className="text-slate-400 text-sm">Mindfulness Collection</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Price</p>
                      <p className="text-violet-400 font-mono font-bold">500 XP</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-black/20 p-3 rounded-xl">
                    <span className="text-lg">🔥</span>
                    <span> highest bid <b>320 XP</b> by </span>
                    <span className="text-white font-medium truncate">@HabitHero...</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="py-3 rounded-xl bg-violet-600 font-bold text-sm hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20">
                      Place Bid
                    </button>
                    <button className="py-3 rounded-xl bg-white/5 border border-white/10 font-bold text-sm hover:bg-white/10 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Hot Bids / Trending Quests */}
        <section className="max-w-7xl mx-auto px-6 mb-32" id="explore">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-2xl">🔥</span> Trending Quests
            </h2>
            <Link href="/login" className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors">
              View All Quests →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group bg-[#1a1b33]/60 border border-white/5 rounded-[24px] p-4 hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-900/10 transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/3] rounded-2xl bg-slate-800/50 mb-4 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${i === 1 ? 'from-emerald-500/20 to-teal-500/20' :
                      i === 2 ? 'from-orange-500/20 to-red-500/20' :
                        i === 3 ? 'from-blue-500/20 to-cyan-500/20' :
                          'from-pink-500/20 to-rose-500/20'
                    }`} />
                  <div className="absolute inset-0 flex items-center justify-center text-5xl transform group-hover:scale-110 transition-transform duration-500">
                    {i === 1 ? '🏃‍♂️' : i === 2 ? '📚' : i === 3 ? '💧' : '🎨'}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold border border-white/10 text-white">
                    0{i}h : 30m
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-1">{
                  i === 1 ? '5k Runner' : i === 2 ? 'Read 30 Pages' : i === 3 ? 'Hydration Hit' : 'Create Art'
                }</h3>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(u => (
                        <div key={u} className="w-6 h-6 rounded-full bg-slate-700 border border-[#1a1b33]" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">12+ active</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Reward</p>
                    <p className="text-sm font-bold text-emerald-400">+{i * 50} XP</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Collections */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <h2 className="text-3xl font-bold mb-12">Top Collections over <span className="text-violet-400">last 7 days</span> ▾</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['Fitness Freaks', 'Code Warriors', 'Mindful Monks', 'Artistic Souls', 'Wealth Builders', 'Social Butterflies'].map((col, idx) => (
              <div key={idx} className="flex items-center gap-4 hover:bg-white/5 p-4 rounded-xl transition-colors cursor-pointer group">
                <span className="font-bold text-slate-500 w-4">{idx + 1}</span>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 relative overflow-hidden group-hover:border-violet-500/50 transition-colors">
                  {/* Placeholder avatar */}
                </div>
                <div>
                  <h4 className="font-bold group-hover:text-violet-400 transition-colors">{col}</h4>
                  <p className="text-sm text-slate-400">Floor: <span className="text-white font-medium">2,400 XP</span></p>
                </div>
                <div className="ml-auto text-right">
                  <p className={`text-sm font-bold ${idx % 2 === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {idx % 2 === 0 ? '+' : '-'}{Math.floor(Math.random() * 20)}%
                  </p>
                  <p className="text-xs text-slate-500">Vol: 12k</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/login" className="px-8 py-3 bg-[#1a1b33]/60 border border-white/10 rounded-full text-sm font-bold hover:bg-[#1a1b33] transition-colors">
              Go to Rankings
            </Link>
          </div>
        </section>

        {/* Create and Sell / How it Works */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <h2 className="text-3xl font-bold mb-12">Create and Sell Your Habits</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '👛', title: 'Set up your wallet', desc: 'Create your profile and connect your identity to start your journey.' },
              { icon: '📂', title: 'Create Collection', desc: 'Define your habit categories and set your daily goals.' },
              { icon: '🖼️', title: 'Add your NFTs', desc: 'Complete quests to mint your daily achievements as NFTs.' },
              { icon: '🏷️', title: 'List them for sale', desc: 'Trade your XP and rewards in the community marketplace.' },
            ].map((step, idx) => (
              <div key={idx} className="group relative">
                <div className="w-16 h-16 rounded-2xl bg-[#1a1b33] border border-white/10 flex items-center justify-center text-3xl mb-6 group-hover:bg-violet-600 transition-colors shadow-lg shadow-black/20">
                  {step.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>

                {/* Connector Line (except last) */}
                {idx !== 3 && (
                  <div className="hidden md:block absolute top-8 left-20 right-[-20%] h-[1px] bg-gradient-to-r from-violet-500/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="relative py-32 mt-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/20 pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-8">Ready to <span className="text-gradient">Mint Your Life?</span></h2>
            <p className="text-xl text-slate-400 mb-10">Join 98,000+ others who are turning their productivity into a game worth playing.</p>
            <Link
              href="/register"
              className="px-12 py-5 bg-white text-[#0f1021] rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)]"
            >
              Get Started Now
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
