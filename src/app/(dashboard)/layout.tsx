import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './dashboard-layout-client';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    const user = session.user as { id?: string; name?: string; role?: string; email?: string };

    if (user.id) {
        await connectDB();
        const dbUser = await User.findById(user.id).select('accountStatus');
        if (dbUser && dbUser.accountStatus === 'banned') {
            redirect('/banned');
        }
    }

    return (
        <DashboardLayoutClient user={{ name: user?.name, email: user?.email }}>
            {children}
        </DashboardLayoutClient>
    );
}
