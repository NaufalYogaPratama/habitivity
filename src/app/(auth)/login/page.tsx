'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password. Please try again.');
                setLoading(false);
                return;
            }

            // Fetch session to determine role-based redirect
            const res = await fetch('/api/auth/session');
            const session = await res.json();
            const role = session?.user?.role;

            if (role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch {
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 w-full max-w-md px-4">
            {/* Logo */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <span className="text-white text-lg font-bold">⚡</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                        ArcadeOS
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-1">Welcome back</h1>
                <p className="text-slate-400">Sign in to continue your journey</p>
            </div>

            {/* Card */}
            <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Email</label>
                        <input
                            type="email"
                            placeholder="hero@arcadeos.id"
                            {...register('email', { validate: (v) => loginSchema.shape.email.safeParse(v).success || 'Invalid email' })}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register('password', { validate: (v) => loginSchema.shape.password.safeParse(v).success || 'Min 6 characters' })}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            '⚡ Sign In'
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-slate-800 px-3 text-xs text-slate-500">Don&apos;t have an account?</span>
                    </div>
                </div>

                <Link
                    href="/register"
                    className="block w-full text-center py-3 rounded-xl border border-indigo-500/40 text-indigo-400 font-medium hover:bg-indigo-500/10 transition-all"
                >
                    Create Account
                </Link>
            </div>

            <p className="text-center text-slate-600 text-xs mt-6">
                ArcadeOS · FICPACT CUP 2026
            </p>
        </div>
    );
}
