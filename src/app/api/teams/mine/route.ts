import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Find user & their team
        const user = await User.findById(session.user.id);
        if (!user || !user.teamId) {
            return NextResponse.json({ team: null }, { status: 200 }); // User not in a team
        }

        // Get team details
        const team = await Team.findById(user.teamId).lean();
        if (!team) {
            // Team was deleted?
            user.teamId = undefined;
            await user.save();
            return NextResponse.json({ team: null }, { status: 200 });
        }

        // Populate members
        const membersData = await User.find({ _id: { $in: team.members } })
            .select('username avatar stats.level stats.xp')
            .lean();

        // Calculate total xp dynamically just to be safe
        let realtimeTotalXp = 0;
        const formattedMembers = membersData.map(m => {
            realtimeTotalXp += (m.stats?.xp || 0);
            return {
                _id: m._id,
                username: m.username,
                avatar: m.avatar,
                level: m.stats?.level || 1,
                xp: m.stats?.xp || 0
            };
        });

        // Set isLeader flag
        const isLeader = team.leaderId.toString() === user._id.toString();

        return NextResponse.json({
            team: {
                ...team,
                stats: {
                    ...team.stats,
                    totalXp: realtimeTotalXp
                },
                membersList: formattedMembers,
                isLeader
            }
        });
    } catch (error) {
        console.error('Fetch my team error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
