import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/mongodb';
import LedgerConfig from '@/models/LedgerConfig';

// POST — Create a new savings goal
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, icon, target } = await request.json();

        if (!name || !target || target <= 0) {
            return NextResponse.json({ error: 'Invalid goal data' }, { status: 400 });
        }

        await connectDB();

        const config = await LedgerConfig.findOneAndUpdate(
            { userId: session.user.id },
            {
                $push: {
                    savingsGoals: { name, icon: icon || '🎯', target, current: 0 },
                },
                $setOnInsert: {
                    userId: session.user.id,
                    budgetAmount: 0,
                    budgetPeriod: 'daily',
                    savingStreak: 0,
                    shieldActive: false,
                    lastStreakDate: '',
                },
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ config }, { status: 201 });
    } catch (error) {
        console.error('Goals POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT — Add amount to a savings goal
export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { goalId, amount } = await request.json();

        if (!goalId || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        await connectDB();

        // First, get the goal to check target
        const config = await LedgerConfig.findOne({
            userId: session.user.id,
            'savingsGoals._id': goalId,
        });

        if (!config) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        const goal = config.savingsGoals.find(
            (g: { _id: { toString: () => string } }) => g._id.toString() === goalId
        );
        if (!goal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        const newCurrent = Math.min(goal.target, goal.current + amount);

        await LedgerConfig.updateOne(
            { userId: session.user.id, 'savingsGoals._id': goalId },
            { $set: { 'savingsGoals.$.current': newCurrent } }
        );

        return NextResponse.json({ success: true, newCurrent });
    } catch (error) {
        console.error('Goals PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE — Remove a savings goal
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { goalId } = await request.json();

        if (!goalId) {
            return NextResponse.json({ error: 'Missing goal ID' }, { status: 400 });
        }

        await connectDB();

        await LedgerConfig.updateOne(
            { userId: session.user.id },
            { $pull: { savingsGoals: { _id: goalId } } }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Goals DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
