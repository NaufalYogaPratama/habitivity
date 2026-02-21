import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import FocusSession from '@/models/FocusSession';
import Quest from '@/models/Quest';
import AnalyticsClient from './analytics-client';

export default async function AdminAnalyticsPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const currentUser = session.user as { name?: string; role?: string; email?: string };
    if (currentUser?.role !== 'admin') redirect('/dashboard');

    await connectDB();

    // 1. User Registration over the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usersList = await User.find({ role: 'user', createdAt: { $gte: thirtyDaysAgo } }).select('createdAt').lean();

    // Agregate by Date string for users
    const userGrowthMap: Record<string, number> = {};
    usersList.forEach((u: any) => {
        const dateStr = u.createdAt.toISOString().split('T')[0];
        userGrowthMap[dateStr] = (userGrowthMap[dateStr] || 0) + 1;
    });

    // 2. Focus Duration over the last 30 days
    const sessionsList = await FocusSession.find({ status: 'completed', createdAt: { $gte: thirtyDaysAgo } }).select('duration createdAt').lean();
    const focusMap: Record<string, number> = {};
    sessionsList.forEach((s: any) => {
        const dateStr = s.createdAt.toISOString().split('T')[0];
        focusMap[dateStr] = (focusMap[dateStr] || 0) + (s.duration / 60); // store in minutes
    });

    // Generate Array of the last 30 days
    const daysArr = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        daysArr.push(d.toISOString().split('T')[0]);
    }

    const chartData = daysArr.map(date => ({
        date,
        newUsers: userGrowthMap[date] || 0,
        focusMinutes: Math.round(focusMap[date] || 0)
    }));

    // 3. Economy (Total Gold in Circulation vs Spend)
    const totalGoldResult = await User.aggregate([
        { $match: { role: 'user' } },
        { $group: { _id: null, totalGold: { $sum: '$stats.gold' } } }
    ]);
    const totalGold = totalGoldResult[0]?.totalGold || 0;

    // We can infer spend by counting total items purchased across all users
    const totalItemsResult = await User.aggregate([
        { $match: { role: 'user' } },
        { $project: { itemsCount: { $size: { $ifNull: ['$inventory', []] } } } },
        { $group: { _id: null, totalPurchases: { $sum: '$itemsCount' } } }
    ]);
    const totalPurchases = totalItemsResult[0]?.totalPurchases || 0;

    // 4. Quests Engagement (Completed vs Failed)
    const completedQuests = await Quest.countDocuments({ status: 'completed' });
    const activeQuests = await Quest.countDocuments({ status: 'active' });

    const statsOverview = {
        totalGold,
        totalPurchases,
        completedQuests,
        activeQuests
    };

    return (
        <AnalyticsClient
            chartData={chartData}
            statsOverview={statsOverview}
            totalUsers={await User.countDocuments({ role: 'user' })}
            totalFocusMins={Math.round(chartData.reduce((acc, curr) => acc + curr.focusMinutes, 0))}
        />
    );
}
