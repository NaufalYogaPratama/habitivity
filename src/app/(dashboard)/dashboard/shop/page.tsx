import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ShopClient from './shop-client';


export default async function ShopPage() {
    const session = await auth();
    if (!session) redirect('/login');

    return <ShopClient />;
}
