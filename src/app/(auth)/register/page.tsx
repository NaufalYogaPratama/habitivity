'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

type RegisterForm = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterForm>();

    const password = watch('password');

    const onSubmit = async (data: RegisterForm) => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error || 'Registration failed');
                setLoading(false);
                return;
            }

            // Success - redirect to login
            router.push('/login?registered=true');
        } catch {
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 w-full max-w-md px-4">
            {/* Logo */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <span className="text-white text-lg font-bold">⚡</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                        ArcadeOS
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-1">Create Account</h1>
                <p className="text-slate-400">Start your journey to level up your life</p>
            </div>

            {/* Card */}
            <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {/* Username */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Username</label>
                        <input
                            type="text"
                            placeholder="CyberHero123"
                            {...register('username', {
                                required: 'Username is required',
                                minLength: { value: 3, message: 'Min 3 characters' },
                            })}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        />
                        {errors.username && <p className="text-red-400 text-xs">{errors.username.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Email</label>
                        <input
                            type="email"
                            placeholder="hero@arcadeos.id"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                            })}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        />
                        {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Min 6 characters' },
                            })}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        />
                        {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (v) => v === password || 'Passwords do not match',
                            })}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        />
                        {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Creating account...
                            </>
                        ) : (
                            '🚀 Create Account'
                        )}
                    </button>
                </form>

                {/* Link to login */}
                <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-slate-800 px-3 text-xs text-slate-500">Already have an account?</span>
                    </div>
                </div>

                <Link
                    href="/login"
                    className="block w-full text-center py-3 rounded-xl border border-indigo-500/40 text-indigo-400 font-medium hover:bg-indigo-500/10 transition-all"
                >
                    Sign In
                </Link>
            </div>

            <p className="text-center text-slate-600 text-xs mt-6">
                ArcadeOS · FICPACT CUP 2026
            </p>
        </div>
    );
}
