import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminShopClient from './shop-client';

export default async function AdminShopPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const user = session.user as { role?: string };
    if (user?.role !== 'admin') redirect('/dashboard');

    return <AdminShopClient />;
}
