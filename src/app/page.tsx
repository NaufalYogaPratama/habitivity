import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArcadeOS — Level Up Your Life',
  description: 'The ultimate gamified productivity ecosystem. Manage quests, focus sessions, and finances — powered by AI. Built for FICPACT CUP 2026.',
};

const features = [
  {
    icon: '⚔️',
    title: 'Quest Board',
    desc: 'AI-powered task management. Every quest is classified by difficulty, XP reward, and gold reward automatically.',
    badge: 'AI-Powered',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    glow: 'shadow-indigo-500/20',
    border: 'border-indigo-500/10 hover:border-indigo-500/30',
  },
  {
    icon: '🎯',
    title: 'Focus Arena',
    desc: 'Gamified Pomodoro timer. Your HP drops when you switch tabs — stay focused or face the consequences.',
    badge: 'Real-time',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    glow: 'shadow-emerald-500/20',
    border: 'border-emerald-500/10 hover:border-emerald-500/30',
  },
  {
    icon: '💰',
    title: 'Gold Ledger',
    desc: 'Gamified expense tracking. Save money, earn gold bonuses. Overspend, lose HP. Your wallet, your game.',
    badge: 'Gamified',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    glow: 'shadow-amber-500/20',
    border: 'border-amber-500/10 hover:border-amber-500/30',
  },
  {
    icon: '🤖',
    title: 'AI Status System',
    desc: 'AI detects your current state — On Fire, Steady, Struggling, or Burnout Risk — and adapts quests accordingly.',
    badge: 'Adaptive',
    badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    glow: 'shadow-violet-500/20',
    border: 'border-violet-500/10 hover:border-violet-500/30',
  },
];

const stats = [
  { value: '4', label: 'Core Systems', icon: '⚙️' },
  { value: 'AI', label: 'Quest Classification', icon: '🤖' },
  { value: '∞', label: 'Achievements', icon: '🏆' },
  { value: '2', label: 'Player Roles', icon: '👥' },
];

const roles = [
  {
    icon: '🧑‍💻',
    title: 'User',
    desc: 'The Hero',
    features: ['Quest management', 'Focus Arena with HP', 'Gold Ledger tracking', 'AI status detection', 'Leaderboard & shop'],
    cta: 'Start as Hero',
    href: '/register',
    gradient: 'from-indigo-600 to-violet-600',
    glow: 'shadow-indigo-500/40',
    badge: 'Default Role',
    badgeColor: 'bg-indigo-500/20 text-indigo-300',
  },
  {
    icon: '👑',
    title: 'Admin',
    desc: 'The Overlord',
    features: ['Full analytics dashboard', 'User management', 'Global quest creation', 'Shop item management', 'Platform impact data'],
    cta: 'Join as Admin',
    href: '/register',
    gradient: 'from-violet-600 to-purple-700',
    glow: 'shadow-violet-500/40',
    badge: 'Special Role',
    badgeColor: 'bg-violet-500/20 text-violet-300',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-60 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/20 to-violet-600/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-violet-600/15 to-purple-600/15 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-600/10 to-orange-600/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <span className="text-white font-bold">⚡</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            ArcadeOS
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#roles" className="hover:text-white transition-colors">Roles</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 transition-all text-sm font-medium shadow-lg shadow-indigo-500/30"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-6 pt-16 pb-24 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          FICPACT CUP 2026 · Gamified Productivity
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
          <span className="text-white">Level Up</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Your Life
          </span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The world&apos;s first <span className="text-white font-medium">Life Operating System</span> that turns your daily grind into an epic RPG adventure. Quests, focus sessions, and finances — all gamified and powered by AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-violet-500 transition-all shadow-2xl shadow-indigo-500/40 flex items-center justify-center gap-2"
          >
            🚀 Start Your Journey
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 text-slate-300 font-semibold text-lg hover:border-white/20 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            ⚡ Sign In
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 backdrop-blur-sm"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-indigo-400 font-semibold text-sm uppercase tracking-widest">Core Systems</span>
          <h2 className="text-4xl font-extrabold text-white mt-2">
            Four Pillars of Mastery
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Every feature is designed to reinforce the others. Progress in one system fuels growth across all.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat) => (
            <div
              key={feat.title}
              className={`bg-[#1E293B]/70 border ${feat.border} rounded-2xl p-6 backdrop-blur-sm shadow-xl ${feat.glow} transition-all group`}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-700/60 border border-white/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-white font-bold">{feat.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${feat.badgeColor} font-medium`}>
                  {feat.badge}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-violet-400 font-semibold text-sm uppercase tracking-widest">The Loop</span>
          <h2 className="text-4xl font-extrabold text-white mt-2">How ArcadeOS Works</h2>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-violet-500/50 to-transparent hidden md:block" />
          <div className="space-y-8">
            {[
              { step: '01', icon: '📝', title: 'Create Your Quest', desc: 'Describe your task. AI instantly classifies it — difficulty, XP, gold reward, skills required.' },
              { step: '02', icon: '🎯', title: 'Enter the Focus Arena', desc: 'Start your Pomodoro session. Stay focused or your HP drops when you switch tabs.' },
              { step: '03', icon: '✅', title: 'Complete & Earn', desc: 'Finish your quest. Gain XP, gold, and level up your character with NFT-style items.' },
              { step: '04', icon: '📊', title: 'AI Adapts to You', desc: 'The AI reads your patterns and surfaces quests that match your current state.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 md:pl-20 relative">
                <div className="absolute left-4 top-3 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/30 hidden md:flex flex-shrink-0">
                  {item.step}
                </div>
                <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="text-white font-bold">{item.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-widest">Choose Your Path</span>
          <h2 className="text-4xl font-extrabold text-white mt-2">Two Roles, One Ecosystem</h2>
          <p className="text-slate-400 mt-3">Pick your role when you register. Each has a unique dashboard.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.title}
              className="bg-slate-800/50 border border-white/5 rounded-2xl p-7 flex flex-col hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="text-4xl mb-3">{role.icon}</div>
                  <h3 className="text-2xl font-extrabold text-white">{role.title}</h3>
                  <p className="text-slate-400 text-sm">{role.desc}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${role.badgeColor} font-medium`}>
                  {role.badge}
                </span>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {role.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={role.href}
                className={`block text-center py-3.5 rounded-xl bg-gradient-to-r ${role.gradient} text-white font-bold hover:opacity-90 transition-all shadow-xl ${role.glow}`}
              >
                {role.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="relative z-10 px-6 py-20 max-w-3xl mx-auto text-center">
        <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 rounded-3xl p-12 backdrop-blur-sm">
          <div className="text-5xl mb-4">⚡</div>
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Play?</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
            Join the revolution. Turn your daily habits into an epic adventure starting today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-violet-500 transition-all shadow-2xl shadow-indigo-500/40"
            >
              🚀 Create Free Account
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 text-slate-300 font-semibold text-lg hover:border-white/20 hover:bg-white/5 hover:text-white transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-white text-xs">⚡</span>
          </div>
          <span className="font-semibold text-slate-400">ArcadeOS</span>
        </div>
        <p className="text-slate-600">Built for FICPACT CUP 2026 · Web Development Competition</p>
        <p className="text-slate-700 text-xs mt-1">Theme: Gamified Productivity · &quot;Level Up Your Life&quot;</p>
      </footer>
    </div>
  );
}
