import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';

// GET — Top users by XP for leaderboard
export async function GET() {
    try {
        await connectDB();

        const topUsers = await User.find({ role: 'user' })
            .select('username stats.xp stats.level stats.streak stats.gold')
            .sort({ 'stats.xp': -1 })
            .limit(20)
            .lean();

        const leaderboard = topUsers.map((user, idx) => ({
            rank: idx + 1,
            id: user._id.toString(),
            username: user.username,
            xp: user.stats?.xp || 0,
            level: user.stats?.level || 1,
            streak: user.stats?.streak || 0,
            gold: user.stats?.gold || 0,
        }));

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error('Leaderboard error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
