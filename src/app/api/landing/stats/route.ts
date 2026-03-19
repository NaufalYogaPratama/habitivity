import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Quest from '@/models/Quest';
import Team from '@/models/Team';

// Public API — no auth needed (landing page data)
export async function GET() {
    try {
        await connectDB();

        // Trending Quests: 4 most recent active quests
        const recentQuests = await Quest.find({ status: { $in: ['pending', 'in_progress'] } })
            .sort({ createdAt: -1 })
            .limit(4)
            .select('title category difficulty rewards createdAt')
            .lean();

        const CATEGORY_EMOJI: Record<string, string> = {
            work: '💼', learning: '📚', personal: '🧩', health: '❤️', finance: '💰',
        };
        const CATEGORY_GRADIENT: Record<string, string> = {
            work: 'from-blue-500/30 to-indigo-600/20',
            learning: 'from-emerald-500/30 to-teal-600/20',
            personal: 'from-purple-500/30 to-fuchsia-600/20',
            health: 'from-rose-500/30 to-orange-600/20',
            finance: 'from-amber-500/30 to-yellow-600/20',
        };
        const DIFFICULTY_LABEL: Record<string, string> = {
            easy: 'Common', medium: 'Rare', hard: 'Epic', expert: 'Legendary',
        };

        const trendingQuests = recentQuests.map((q: any) => ({
            emoji: CATEGORY_EMOJI[q.category] || '⚔️',
            name: q.title,
            xp: q.rewards?.xp || 100,
            gold: q.rewards?.gold || 20,
            rarity: DIFFICULTY_LABEL[q.difficulty] || 'Rare',
            gradient: CATEGORY_GRADIENT[q.category] || 'from-blue-500/30 to-indigo-600/20',
            category: q.category?.charAt(0).toUpperCase() + q.category?.slice(1) || 'Quest',
        }));

        // Top Collections: teams ranked by XP
        const topTeams = await Team.find()
            .sort({ 'stats.totalXp': -1 })
            .limit(6)
            .select('name icon stats members')
            .lean();

        const topCollections = topTeams.map((t: any) => ({
            name: t.name,
            icon: t.icon || '🛡️',
            totalXp: t.stats?.totalXp || 0,
            level: t.stats?.level || 1,
            members: t.members?.length || 0,
        }));

        // Total counts for social proof
        const totalQuests = await Quest.countDocuments();
        const completedQuests = await Quest.countDocuments({ status: 'completed' });

        return NextResponse.json({
            trendingQuests,
            topCollections,
            stats: { totalQuests, completedQuests },
        });
    } catch (error) {
        console.error('Landing stats error:', error);
        return NextResponse.json({
            trendingQuests: [],
            topCollections: [],
            stats: { totalQuests: 0, completedQuests: 0 },
        });
    }
}
