import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import FocusArenaClient from './FocusArenaClient';

export default async function FocusPage() {
    const session = await auth();
    if (!session) redirect('/login');

    return <FocusArenaClient />;
}
