import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './dashboard-layout-client';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    const user = session.user as { name?: string; role?: string; email?: string };

    return (
        <DashboardLayoutClient user={{ name: user?.name, email: user?.email }}>
            {children}
        </DashboardLayoutClient>
    );
}
