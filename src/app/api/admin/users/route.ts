import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import { auth } from '@/auth';

export async function PUT(request: Request) {
    try {
        const session = await auth();
        const currentUser = session?.user as { role?: string };
        if (currentUser?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, action, payload } = body;

        if (!id || !action) {
            return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
        }

        await connectDB();

        if (action === 'ban' || action === 'unban') {
            const accStatus = action === 'ban' ? 'banned' : 'active';
            const updated = await User.findByIdAndUpdate(
                id,
                { accountStatus: accStatus },
                { new: true }
            );
            return NextResponse.json(updated);
        } else if (action === 'edit' && payload) {
            const updated = await User.findByIdAndUpdate(
                id,
                {
                    $set: {
                        'stats.level': payload.level,
                        'stats.hp': payload.hp,
                        'stats.gold': payload.gold,
                    }
                },
                { new: true }
            );
            return NextResponse.json(updated);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Admin API Users Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
