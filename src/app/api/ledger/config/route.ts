import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/mongodb';
import LedgerConfig from '@/models/LedgerConfig';

// GET — Get user's budget config
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        let config = await LedgerConfig.findOne({ userId: session.user.id }).lean();

        if (!config) {
            // Return defaults
            config = {
                budgetAmount: 0,
                budgetPeriod: 'daily',
                savingStreak: 0,
                shieldActive: false,
                lastStreakDate: '',
                savingsGoals: [],
            } as any;
        }

        return NextResponse.json({ config });
    } catch (error) {
        console.error('LedgerConfig GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT — Set/update budget
export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { budgetAmount, budgetPeriod } = await request.json();

        if (!budgetAmount || budgetAmount <= 0) {
            return NextResponse.json({ error: 'Invalid budget amount' }, { status: 400 });
        }

        if (!['daily', 'monthly'].includes(budgetPeriod)) {
            return NextResponse.json({ error: 'Invalid budget period' }, { status: 400 });
        }

        await connectDB();

        const config = await LedgerConfig.findOneAndUpdate(
            { userId: session.user.id },
            {
                $set: { budgetAmount, budgetPeriod },
                $setOnInsert: {
                    userId: session.user.id,
                    savingStreak: 0,
                    shieldActive: false,
                    lastStreakDate: '',
                    savingsGoals: [],
                },
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ config });
    } catch (error) {
        console.error('LedgerConfig PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
