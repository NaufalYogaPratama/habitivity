import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';

// GET — Get current user's stats
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const user = await User.findById(session.user.id)
            .select('username stats')
            .lean();

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            username: user.username,
            stats: user.stats,
        });
    } catch (error) {
        console.error('User stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
