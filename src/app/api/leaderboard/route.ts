import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import FocusSession from '@/models/FocusSession';
import LedgerEntry from '@/models/LedgerEntry';
import mongoose from 'mongoose';
import Team from '@/models/Team';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);

        const category = searchParams.get('category') || 'xp'; // xp, savings, focus, streak, level, regional, team
        const timeframe = searchParams.get('timeframe') || 'weekly'; // daily, weekly, monthly, all
        const regionType = searchParams.get('regionType') || 'city'; // city, university

        // Calculate date range
        let dateFilter: any = {};
        const now = new Date();
        if (timeframe === 'daily') {
            const start = new Date(now);
            start.setHours(0, 0, 0, 0);
            dateFilter = { $gte: start };
        } else if (timeframe === 'weekly') {
            const start = new Date(now);
            start.setDate(now.getDate() - 7);
            dateFilter = { $gte: start };
        } else if (timeframe === 'monthly') {
            const start = new Date(now);
            start.setMonth(now.getMonth() - 1);
            dateFilter = { $gte: start };
        }

        let leaderboard = [];

        if (category === 'xp') {
            // XP Leaderboard (Total XP from FocusSessions in timeframe)
            const focusSessionsDateFilter = timeframe === 'all' ? {} : { completedAt: dateFilter };

            const results = await FocusSession.aggregate([
                { $match: { status: 'completed', ...focusSessionsDateFilter } },
                { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
                { $unwind: '$user' },
                { $match: { 'user.role': 'user' } },
                { $group: { _id: '$userId', totalXp: { $sum: '$xpEarned' }, user: { $first: '$user' } } },
                { $sort: { totalXp: -1 } },
                { $limit: 20 },
                {
                    $project: {
                        username: '$user.username',
                        avatar: '$user.avatar',
                        value: '$totalXp',
                        level: '$user.stats.level',
                        displayValue: { $concat: [{ $toString: '$totalXp' }, ' XP'] }
                    }
                }
            ]);
            leaderboard = results;

        } else if (category === 'focus') {
            // Focus Legends (Total focus hours)
            const focusSessionsDateFilter = timeframe === 'all' ? {} : { completedAt: dateFilter };

            const results = await FocusSession.aggregate([
                { $match: { status: 'completed', ...focusSessionsDateFilter } },
                { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } }, // Corrected localField to 'userId'
                { $unwind: '$user' },
                { $match: { 'user.role': 'user' } }, // Exclude admin users
                { $group: { _id: '$userId', totalSeconds: { $sum: '$duration' }, user: { $first: '$user' } } },
                { $sort: { totalSeconds: -1 } },
                { $limit: 20 },
                {
                    $project: {
                        username: '$user.username',
                        avatar: '$user.avatar',
                        value: '$totalSeconds',
                        level: '$user.stats.level',
                        displayValue: {
                            $concat: [
                                { $toString: { $floor: { $divide: ['$totalSeconds', 3600] } } },
                                'h ',
                                { $toString: { $floor: { $divide: [{ $mod: ['$totalSeconds', 3600] }, 60] } } },
                                'm'
                            ]
                        }
                    }
                }
            ]);
            leaderboard = results;

        } else if (category === 'streak') {
            // Streak Kings (Current streak from User stats)
            const results = await User.find({ role: 'user' })
                .sort({ 'stats.streak': -1 })
                .limit(20)
                .select('username avatar stats.streak stats.level')
                .lean();

            leaderboard = results.map(u => ({
                username: u.username,
                avatar: u.avatar,
                value: u.stats.streak,
                level: u.stats.level,
                displayValue: `${u.stats.streak} Streak`
            }));

        } else if (category === 'level') {
            // Level Highest
            const results = await User.find({ role: 'user' })
                .sort({ 'stats.level': -1, 'stats.xp': -1 })
                .limit(20)
                .select('username avatar stats.level stats.xp')
                .lean();

            leaderboard = results.map(u => ({
                username: u.username,
                avatar: u.avatar,
                value: u.stats.level,
                level: u.stats.level,
                displayValue: `Level ${u.stats.level}`
            }));

        } else if (category === 'savings') {
            // Savings Masters
            const results = await User.find({ role: 'user' })
                .sort({ 'stats.gold': -1 })
                .limit(20)
                .select('username avatar stats.gold stats.level')
                .lean();

            leaderboard = results.map(u => ({
                username: u.username,
                avatar: u.avatar,
                value: u.stats.gold,
                level: u.stats.level,
                displayValue: `${u.stats.gold.toLocaleString()} Gold`
            }));
        } else if (category === 'regional') {
            // Regional / University Leaderboard
            const field = regionType === 'university' ? 'regional.university' : 'regional.city';

            const results = await User.aggregate([
                { $match: { role: 'user', [field]: { $nin: ['', null] } } },
                { $group: { _id: `$${field}`, totalXp: { $sum: '$stats.xp' }, memberCount: { $sum: 1 } } },
                { $sort: { totalXp: -1 } },
                { $limit: 10 },
                {
                    $project: {
                        username: '$_id',
                        value: '$totalXp',
                        memberCount: '$memberCount'
                    }
                }
            ]);

            leaderboard = results.map(r => ({
                ...r,
                level: 0,
                region: r.username,
                displayValue: `${(r.value || 0).toLocaleString()} XP (${r.memberCount} Mhs)`
            }));
        } else if (category === 'team') {
            // Clan / Team Leaderboard
            const results = await User.aggregate([
                { $match: { role: 'user', teamId: { $exists: true, $ne: null } } },
                { $group: { _id: '$teamId', totalXp: { $sum: '$stats.xp' }, memberCount: { $sum: 1 } } },
                { $lookup: { from: 'teams', localField: '_id', foreignField: '_id', as: 'teamDetails' } },
                { $unwind: '$teamDetails' },
                { $sort: { totalXp: -1 } },
                { $limit: 10 },
                {
                    $project: {
                        username: '$teamDetails.name',
                        value: '$totalXp',
                        level: '$teamDetails.stats.level',
                        memberCount: '$memberCount'
                    }
                }
            ]);
            leaderboard = results.map(r => ({
                ...r,
                displayValue: `${(r.value || 0).toLocaleString()} XP (${r.memberCount} Mhs)`
            }));
        }

        // Add Rank
        leaderboard = leaderboard.map((item, idx) => ({
            ...item,
            rank: idx + 1
        }));

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error('Leaderboard error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
