import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('q');

        // Find teams
        let filter = {};
        if (search) {
            filter = { name: { $regex: search, $options: 'i' } };
        }

        const teams = await Team.find(filter)
            .select('name description stats icon members')
            .sort({ 'stats.totalXp': -1 })
            .limit(20)
            .lean();

        // Calculate member counts manually since members is an array of IDs
        const formattedTeams = teams.map(t => ({
            _id: t._id,
            name: t.name,
            description: t.description,
            icon: t.icon,
            level: t.stats?.level || 1,
            totalXp: t.stats?.totalXp || 0,
            memberCount: t.members?.length || 0
        }));

        return NextResponse.json({ teams: formattedTeams });
    } catch (error) {
        console.error('Fetch teams error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function generateJoinCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, description, icon } = body;

        if (!name || name.length < 3) {
            return NextResponse.json({ error: 'Nama tim terlalu pendek' }, { status: 400 });
        }

        await connectDB();

        // Check if user is already in a team
        const user = await User.findById(session.user.id);
        if (user.teamId) {
            return NextResponse.json({ error: 'Anda sudah berada di dalam tim klan.' }, { status: 400 });
        }

        // Check if clan name exists
        const existing = await Team.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existing) {
            return NextResponse.json({ error: 'Nama Tim sudah dipakai.' }, { status: 400 });
        }

        // Create new Team
        const joinCode = generateJoinCode();
        const newTeam = new Team({
            name,
            description: description || '',
            icon: icon || '🛡️',
            leaderId: user._id,
            members: [user._id],
            joinCode
        });

        await newTeam.save();

        user.teamId = newTeam._id;
        await user.save();

        return NextResponse.json({ team: newTeam }, { status: 201 });
    } catch (error) {
        console.error('Create team error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
