'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BannedPage() {
    useEffect(() => {
        // Automatically sign out the banned user's token session
        signOut({ redirect: false });
    }, []);

    return (
        <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#151823] p-8 rounded-3xl border border-red-500/20 text-center space-y-6 shadow-2xl shadow-red-500/10">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                    <span className="text-4xl">🚫</span>
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Account Banned</h1>
                    <p className="text-slate-400 text-sm">
                        This account has been permanently restricted by an Administrator due to severe violations of the hero code.
                    </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 text-left border border-white/5">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Status Report</p>
                    <p className="text-sm text-slate-300">Your access to the dashboard and game features has been revoked immediately. Contact support if you believe this was a mistake.</p>
                </div>

                <Link href="/login" className="block w-full">
                    <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold shadow-lg shadow-red-500/25">
                        Return to Sign In
                    </Button>
                </Link>
            </div>
        </div>
    );
}
