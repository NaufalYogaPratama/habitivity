'use server';

import { signOut } from '@/auth';
import { redirect } from 'next/navigation';

export async function adminSignOutAction() {
    try {
        await signOut({ redirectTo: '/' });
    } catch (error: any) {
        // Next.js redirect throws a special error — rethrow it
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        // Fallback redirect
        redirect('/');
    }
}
