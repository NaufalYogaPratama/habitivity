import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';

// GET — Get current user's stats
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const user = await User.findById(session.user.id)
            .select('username stats inventory avatar')
            .lean();

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            username: user.username,
            stats: user.stats,
            inventory: user.inventory || [],
            avatar: user.avatar,
        });
    } catch (error) {
        console.error('User stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH — Update user's gamification stats (HP, XP, Gold, Level)
export async function PATCH(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        // Kita menerima nilai perubahan (add) atau nilai absolute (set)
        const { xpToAdd, goldToAdd, hpToSet, streakToAdd } = body;

        await connectDB();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Pastikan object stats ada
        if (!user.stats) {
            user.stats = { hp: 100, xp: 0, gold: 0, level: 1, streak: 0, longestStreak: 0 };
        }

        let isLevelUp = false;

        // 1. Update HP (Hukuman Pindah Tab)
        if (typeof hpToSet === 'number') {
            // Jaga HP agar tidak kurang dari 0 atau lebih dari 100
            user.stats.hp = Math.max(0, Math.min(100, hpToSet));
        }

        // 2. Update XP dan Sistem Leveling
        if (typeof xpToAdd === 'number') {
            user.stats.xp += xpToAdd;

            // Logika Leveling Sederhana: Tiap 1000 XP naik 1 level
            const newLevel = Math.floor(user.stats.xp / 1000) + 1;
            if (newLevel > user.stats.level) {
                user.stats.level = newLevel;
                isLevelUp = true;
                user.stats.hp = 100; // Bonus Level Up: HP kembali penuh
            }
        }

        // 3. Update Gold
        if (typeof goldToAdd === 'number') {
            user.stats.gold += goldToAdd;
        }

        // 4. Update Streak (Konsistensi)
        if (typeof streakToAdd === 'number') {
            user.stats.streak += streakToAdd;
            if (user.stats.streak > user.stats.longestStreak) {
                user.stats.longestStreak = user.stats.streak;
            }
        }

        await user.save();

        return NextResponse.json({
            message: 'Stats updated successfully',
            stats: user.stats,
            isLevelUp // Kirim flag ini ke frontend untuk trigger animasi Confetti/Notif
        }, { status: 200 });

    } catch (error) {
        console.error('Update stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}