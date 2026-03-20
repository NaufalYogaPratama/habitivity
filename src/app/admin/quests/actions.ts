'use server';

import { auth } from '@/auth';
import connectDB from '@/lib/db/mongodb';
import Quest from '@/models/Quest';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';

export async function createAdminQuestAction(data: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    targetUserId: string;
}) {
    try {
        const session = await auth();
        // Check admin role just to be safe
        if (!session?.user || (session.user as any)?.role !== 'admin') {
            return { error: 'Unauthorized' };
        }

        await connectDB();

        let baseRewards = { xp: 100, gold: 20 };
        switch (data.difficulty) {
            case "easy": baseRewards = { xp: 50, gold: 10 }; break;
            case "medium": baseRewards = { xp: 100, gold: 20 }; break;
            case "hard": baseRewards = { xp: 200, gold: 40 }; break;
            case "expert": baseRewards = { xp: 400, gold: 80 }; break;
        }

        if (data.targetUserId === 'all') {
            // Assign to all users
            const users = await User.find({ role: 'user' }, '_id').lean();
            const questsToInsert = users.map(u => ({
                userId: u._id,
                title: data.title,
                description: data.description || "",
                category: data.category || "work",
                difficulty: data.difficulty || "medium",
                rewards: baseRewards,
                isAdmin: true,
            }));
            if (questsToInsert.length > 0) {
                await Quest.insertMany(questsToInsert);
            }
        } else {
            // Assign to specific user
            await Quest.create({
                userId: data.targetUserId,
                title: data.title,
                description: data.description || "",
                category: data.category || "work",
                difficulty: data.difficulty || "medium",
                rewards: baseRewards,
                isAdmin: true,
            });
        }

        revalidatePath('/admin/quests');
        return { success: true };
    } catch (error: any) {
        console.error('Error creating admin quest:', error);
        return { error: error.message || 'Internal Server Error' };
    }
}
