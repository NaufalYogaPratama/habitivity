import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { joinCode } = body;

        if (!joinCode) {
            return NextResponse.json({ error: 'Kode clan wajib diisi' }, { status: 400 });
        }

        await connectDB();

        // Check user
        const user = await User.findById(session.user.id);
        if (user.teamId) {
            return NextResponse.json({ error: 'Anda sudah berada di klan/tim' }, { status: 400 });
        }

        // Find Team
        const codeUpper = joinCode.toUpperCase();
        const team = await Team.findOne({ joinCode: codeUpper });
        if (!team) {
            return NextResponse.json({ error: 'Kode clan tidak valid' }, { status: 400 });
        }

        if (team.members.length >= 50) {
            return NextResponse.json({ error: 'Klan sudah penuh (Maks: 50)' }, { status: 400 });
        }

        // Add user
        team.members.push(user._id);
        await team.save();

        user.teamId = team._id;
        await user.save();

        return NextResponse.json({ message: 'Berhasil bergabung dengan clan!' });
    } catch (error) {
        console.error('Join team error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
