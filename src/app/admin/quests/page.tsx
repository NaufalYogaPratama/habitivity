import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db/mongodb';
import Quest from '@/models/Quest';
import User from '@/models/User';
import AdminQuestsClient from './quests-client';

export default async function AdminQuestsPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const currentUser = session.user as { name?: string; role?: string; email?: string };
    if (currentUser?.role !== 'admin') redirect('/dashboard');

    await connectDB();

    // Fetch all quests with user info
    const quests = await Quest.find({})
        .sort({ createdAt: -1 })
        .populate('userId', 'username email')
        .lean();

    const serializedQuests = quests.map((q: any) => ({
        _id: q._id.toString(),
        title: q.title,
        description: q.description || '',
        category: q.category,
        difficulty: q.difficulty,
        status: q.status,
        rewards: q.rewards || { xp: 0, gold: 0 },
        user: q.userId ? {
            username: q.userId.username || 'Unknown',
            email: q.userId.email || '',
        } : { username: 'Unknown', email: '' },
        createdAt: q.createdAt?.toISOString?.() || new Date().toISOString(),
        completedAt: q.completedAt?.toISOString?.() || null,
    }));

    // Stats
    const totalQuests = quests.length;
    const completedQuests = quests.filter((q: any) => q.status === 'completed').length;
    const pendingQuests = quests.filter((q: any) => q.status === 'pending').length;
    const inProgressQuests = quests.filter((q: any) => q.status === 'in_progress').length;

    return (
        <AdminQuestsClient
            initialQuests={serializedQuests}
            stats={{ totalQuests, completedQuests, pendingQuests, inProgressQuests }}
        />
    );
}
