'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const resetSchema = z.object({
    email: z.string().email('Format email tidak valid'),
    newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<ResetForm>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            email: '',
            newPassword: '',
        },
    });

    const onSubmit = async (data: ResetForm) => {
        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                toast.success('Password berhasil direset! Silakan login kemari. 🚀');
                router.push('/login');
            } else {
                toast.error(result.error || 'Verifikasi gagal. Pastikan Email terdaftar.');
            }
        } catch (error) {
            toast.error('Gagal terhubung ke server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md px-4 py-6 sm:py-0">
            {/* Header Login */}
            <div className="text-center mb-3">
                <Link href="/" className="flex justify-center mb-3 transition-transform hover:scale-105 duration-300">
                    <Image
                        src="/assets/logo/logo-full1.png"
                        alt="Habitivity Logo"
                        width={180}
                        height={45}
                        className="object-contain drop-shadow-lg w-auto h-auto"
                        priority
                    />
                </Link>
                <p className="text-slate-400">Memory Recovery Module.</p>
            </div>

            <Card className="glass border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-center text-white">Reset Password</CardTitle>
                    <CardDescription className="text-center text-slate-400">
                        Masukkan email Anda untuk mereset sandi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Registered Email</FormLabel>
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
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">New Password</FormLabel>
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
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/25 h-11 mt-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        Memori sudah pulih?{' '}
                        <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
                            Kembali ke Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
