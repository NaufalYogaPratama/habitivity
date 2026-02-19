'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

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
        <div className="w-full max-w-md px-4">
            <div className="text-center mb-8">
                <Link href="/" className="inline-block text-3xl font-bold font-mono tracking-tighter mb-2">
                    <span className="text-gradient">Habitivity</span>
                </Link>
                <p className="text-slate-400">Welcome back, Hero.</p>
            </div>

            <Card className="glass border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
                    <CardDescription className="text-center text-slate-400">
                        Enter your credentials to access your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm flex items-center gap-2 mb-6">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="hero@habitivity.id"
                                                {...field}
                                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-violet-500/50"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-slate-300">Password</FormLabel>
                                            <Link href="#" className="text-xs text-violet-400 hover:text-violet-300">Forgot password?</Link>
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-violet-500/50"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold shadow-lg shadow-violet-500/25 h-11"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <div className="text-center text-sm w-full text-slate-400">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-violet-400 hover:text-violet-300 font-bold hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
