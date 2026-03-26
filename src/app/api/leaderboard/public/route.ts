import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import Team from '@/models/Team';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
    try {
        await connectDB();

        // Top 6 Users by total XP (all-time)
        const topUsersRaw = await User.find({ role: 'user', accountStatus: 'active' })
            .sort({ 'stats.xp': -1 })
            .limit(6)
            .select('username stats.xp stats.level avatar')
            .lean();

        const topUsers = topUsersRaw.map((u: any, idx: number) => ({
            rank: idx + 1,
            name: u.username,
            level: u.stats?.level || 1,
            score: u.stats?.xp || 0,
            badges: [] as string[],
        }));

        // Top 4 Clans/Teams by aggregated member XP
        const topClansRaw = await User.aggregate([
            { $match: { role: 'user', teamId: { $exists: true, $ne: null } } },
            { $group: { _id: '$teamId', totalXp: { $sum: '$stats.xp' }, memberCount: { $sum: 1 } } },
            { $lookup: { from: 'teams', localField: '_id', foreignField: '_id', as: 'team' } },
            { $unwind: '$team' },
            { $sort: { totalXp: -1 } },
            { $limit: 4 },
            {
                $project: {
                    name: '$team.name',
                    icon: '$team.icon',
                    level: '$team.stats.level',
                    totalXp: 1,
                    memberCount: 1,
                }
            }
        ]);

        const topClans = topClansRaw.map((c: any, idx: number) => ({
            rank: idx + 1,
            name: c.name,
            level: c.level || 1,
            score: c.totalXp || 0,
            badges: [c.icon || '🛡️'],
        }));

        return NextResponse.json({ topUsers, topClans });
    } catch (error) {
        console.error('Public leaderboard error:', error);
        return NextResponse.json({ topUsers: [], topClans: [] });
    }
}
