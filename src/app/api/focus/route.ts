import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/mongodb';
import FocusSession from '@/models/FocusSession';
import User from '@/models/User';

// POST — Save a completed focus session
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { mode, duration, xpEarned, hpRemaining, status } = await request.json();

        if (!mode || !duration || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        // Save focus session
        const focusSession = await FocusSession.create({
            userId: session.user.id,
            mode,
            duration,
            xpEarned: xpEarned || 0,
            hpRemaining: hpRemaining ?? 100,
            status,
            completedAt: new Date(),
        });

        // Update user stats
        if (status === 'completed' && xpEarned > 0) {
            const user = await User.findById(session.user.id);
            if (user) {
                user.stats.xp += xpEarned;
                user.stats.streak += 1;
                if (user.stats.streak > user.stats.longestStreak) {
                    user.stats.longestStreak = user.stats.streak;
                }
                // Level up: every 1000 XP = 1 level
                user.stats.level = Math.floor(user.stats.xp / 1000) + 1;
                await user.save();
            }
        } else if (status === 'gave-up') {
            await User.findByIdAndUpdate(session.user.id, {
                $set: { 'stats.streak': 0 },
            });
        }

        return NextResponse.json({ session: focusSession }, { status: 201 });
    } catch (error) {
        console.error('Focus API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET — Get user's focus stats
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const userId = session.user.id;

        // Count completed sessions
        const sessionsCompleted = await FocusSession.countDocuments({
            userId,
            status: 'completed',
        });

        // Total focus time (sum of duration for completed sessions)
        const totalTimeResult = await FocusSession.aggregate([
            { $match: { userId: new (await import('mongoose')).Types.ObjectId(userId), status: 'completed' } },
            { $group: { _id: null, totalTime: { $sum: '$duration' } } },
        ]);
        const totalFocusTime = totalTimeResult[0]?.totalTime || 0;

        // Get user streak
        const user = await User.findById(userId).select('stats.streak');
        const currentStreak = user?.stats?.streak || 0;

        // Recent sessions (last 10)
        const recentSessions = await FocusSession.find({ userId })
            .sort({ completedAt: -1 })
            .limit(10)
            .lean();

        return NextResponse.json({
            sessionsCompleted,
            totalFocusTime,
            currentStreak,
            recentSessions,
        });
    } catch (error) {
        console.error('Focus GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
