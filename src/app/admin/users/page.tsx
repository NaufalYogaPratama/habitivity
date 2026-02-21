import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import UsersClient from './users-client';

export default async function AdminUsersPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const currentUser = session.user as { name?: string; role?: string; email?: string };
    if (currentUser?.role !== 'admin') redirect('/dashboard');

    await connectDB();

    // Fetch all users (exclude admins)
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 }).lean();

    // Serialize MongoDB objects for client component
    const serializedUsers = users.map((user: any) => ({
        ...user,
        _id: user._id.toString(),
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString()
    }));

    return (
        <UsersClient initialUsers={serializedUsers} />
    );
}
