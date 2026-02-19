import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/mongodb';
import LedgerEntry from '@/models/LedgerEntry';
import LedgerConfig from '@/models/LedgerConfig';
import User from '@/models/User';

// POST — Add a new expense
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount, category, note } = await request.json();

        if (!amount || amount <= 0 || !category) {
            return NextResponse.json({ error: 'Invalid expense data' }, { status: 400 });
        }

        await connectDB();

        const userId = session.user.id;

        // Create entry
        const entry = await LedgerEntry.create({
            userId,
            amount,
            category,
            note: note || '',
            date: new Date(),
        });

        // Calculate today's total spending for gold penalty/reward
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todaySpending = await LedgerEntry.aggregate([
            { $match: { userId: new (await import('mongoose')).Types.ObjectId(userId), date: { $gte: todayStart, $lte: todayEnd } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const totalSpent = todaySpending[0]?.total || 0;

        // Get user's budget config
        const config = await LedgerConfig.findOne({ userId });
        const budgetAmount = config?.budgetAmount || 0;
        const budgetPeriod = config?.budgetPeriod || 'daily';
        const dailyBudget = budgetPeriod === 'monthly' ? Math.round(budgetAmount / 30) : budgetAmount;

        let goldDelta = 0;
        let shieldActive = config?.shieldActive || false;

        if (dailyBudget > 0) {
            const pct = (totalSpent / dailyBudget) * 100;
            if (pct > 100) {
                goldDelta = -5;
                shieldActive = false;
            }
        }

        // Update user gold
        if (goldDelta !== 0) {
            const user = await User.findById(userId);
            if (user) {
                user.stats.gold = Math.max(0, user.stats.gold + goldDelta);
                await user.save();
            }
        }

        // Update shield in config
        if (config && shieldActive !== config.shieldActive) {
            config.shieldActive = shieldActive;
            await config.save();
        }

        return NextResponse.json({ entry, goldDelta }, { status: 201 });
    } catch (error) {
        console.error('Ledger POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET — Get user's expenses (optional ?date=YYYY-MM-DD for filtering)
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const userId = session.user.id;
        const { searchParams } = new URL(request.url);
        const dateFilter = searchParams.get('date'); // YYYY-MM-DD

        let query: Record<string, unknown> = { userId };

        if (dateFilter) {
            const start = new Date(dateFilter);
            start.setHours(0, 0, 0, 0);
            const end = new Date(dateFilter);
            end.setHours(23, 59, 59, 999);
            query = { ...query, date: { $gte: start, $lte: end } };
        }

        const expenses = await LedgerEntry.find(query)
            .sort({ date: -1 })
            .limit(100)
            .lean();

        return NextResponse.json({ expenses });
    } catch (error) {
        console.error('Ledger GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE — Remove expense by ID
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: 'Missing expense ID' }, { status: 400 });
        }

        await connectDB();

        const deleted = await LedgerEntry.findOneAndDelete({
            _id: id,
            userId: session.user.id,
        });

        if (!deleted) {
            return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Ledger DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
