import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(session.user.id).select('avatar stats inventory').lean();

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            avatar: user.avatar,
            level: user.stats?.level || 1,
            inventory: user.inventory || []
        });
    } catch (error) {
        console.error('Fetch avatar error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { base, equipment } = body;

        await connectDB();
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (base) user.avatar.base = base;

        if (equipment) {
            if (equipment.helm !== undefined) user.avatar.equipment.helm = equipment.helm;
            if (equipment.armor !== undefined) user.avatar.equipment.armor = equipment.armor;
            if (equipment.weapon !== undefined) user.avatar.equipment.weapon = equipment.weapon;
            if (equipment.accessory !== undefined) user.avatar.equipment.accessory = equipment.accessory;
        }

        // Calculate Evolution based on level automatically just to be sure
        const level = user.stats.level;
        if (level >= 51) user.avatar.evolution = 'Mythic';
        else if (level >= 31) user.avatar.evolution = 'Legendary';
        else if (level >= 21) user.avatar.evolution = 'Elite';
        else if (level >= 11) user.avatar.evolution = 'Enhanced';
        else user.avatar.evolution = 'Base';

        await user.save();

        return NextResponse.json({ message: 'Avatar updated successfully', avatar: user.avatar });
    } catch (error) {
        console.error('Update avatar error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
