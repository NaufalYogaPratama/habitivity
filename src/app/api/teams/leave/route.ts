import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';

export async function POST() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const user = await User.findById(session.user.id);
        if (!user || !user.teamId) {
            return NextResponse.json({ error: 'Anda sedang tidak berada di klan.' }, { status: 400 });
        }

        const team = await Team.findById(user.teamId);

        // Remove from members
        if (team) {
            team.members = team.members.filter(m => m.toString() !== user._id.toString());

            // If empty, delete clan
            if (team.members.length === 0) {
                await Team.findByIdAndDelete(team._id);
            } else {
                // If leader left, reassign
                if (team.leaderId.toString() === user._id.toString()) {
                    team.leaderId = team.members[0];
                }
                await team.save();
            }
        }

        user.teamId = undefined;
        await user.save();

        return NextResponse.json({ message: 'Berhasil keluar dari tim/klan.' });
    } catch (error) {
        console.error('Leave team error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
