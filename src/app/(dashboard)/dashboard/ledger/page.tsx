import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import GoldLedgerClient from './GoldLedgerClient';

export default async function LedgerPage() {
    const session = await auth();
    if (!session) redirect('/login');

    return <GoldLedgerClient />;
}
