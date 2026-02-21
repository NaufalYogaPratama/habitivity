'use server';

import { signOut } from '@/auth';

export async function adminSignOutAction() {
    await signOut({ redirectTo: '/' });
}
