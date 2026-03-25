import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import Team from '@/models/Team';
import Quest from '@/models/Quest';
import FocusSession from '@/models/FocusSession';
import LedgerConfig from '@/models/LedgerConfig';
import LedgerEntry from '@/models/LedgerEntry';

export async function GET() {
    try {
        await connectDB();

        // 1. Delete testing data (Leave Admin users intact so you can still login)
        await User.deleteMany({ role: 'user' });
        await Team.deleteMany({});
        await Quest.deleteMany({});
        await FocusSession.deleteMany({});
        await LedgerConfig.deleteMany({});
        await LedgerEntry.deleteMany({});

        // 2. Create impressive Gaming/Habit Clans
        const ghostLeader = new mongoose.Types.ObjectId();
        const teams = await Team.insertMany([
            { name: 'Code Warriors', icon: '💻', description: 'Commit early, push often.', stats: { totalXp: 18400, level: 15 }, maxMembers: 50, leaderId: ghostLeader, joinCode: 'CODE123' },
            { name: 'Night Owls', icon: '🦉', description: 'Productivity when the world sleeps.', stats: { totalXp: 15200, level: 12 }, maxMembers: 50, leaderId: ghostLeader, joinCode: 'OWL456' },
            { name: 'Fitness Freaks', icon: '💪', description: 'No pain no gain.', stats: { totalXp: 14100, level: 11 }, maxMembers: 50, leaderId: ghostLeader, joinCode: 'FIT789' },
            { name: 'Zen Masters', icon: '🧘', description: 'Mind over matter.', stats: { totalXp: 12500, level: 9 }, maxMembers: 50, leaderId: ghostLeader, joinCode: 'ZEN000' },
        ]);

        // 3. Create dummy users for the Leaderboard
        const hashedPassword = "$2a$10$tZ8Q08f5sZ7XvH.Y47uS0.5rDqO7iQYwD5jXW0N7hMv28r/9a0NWe"; // "password123"
        const dummyUsers = await User.insertMany([
            { email: 'sarah@itb.ac.id', username: 'Sarah_ITB', password: hashedPassword, role: 'user', stats: { xp: 8400, gold: 2300, level: 8, hp: 100, streak: 21 }, avatar: { base: 'PixelHero', equipment: { helm: 'Cyber Visor' }, level: 8, evolution: 'Mythic' }, regional: { university: 'Institut Teknologi Bandung' }, teamId: teams[0]._id },
            { email: 'alex@ui.ac.id', username: 'Alex_UI', password: hashedPassword, role: 'user', stats: { xp: 7200, gold: 1200, level: 7, hp: 100, streak: 12 }, avatar: { base: 'CyberNinja', equipment: { weapon: 'Void Saber' }, level: 7, evolution: 'Legendary' }, regional: { university: 'Universitas Indonesia' }, teamId: teams[1]._id },
            { email: 'budi@ugm.ac.id', username: 'Budi_UGM', password: hashedPassword, role: 'user', stats: { xp: 6100, gold: 800, level: 6, hp: 100, streak: 5 }, avatar: { base: 'ForestMage', equipment: {}, level: 6, evolution: 'Enhanced' }, regional: { university: 'Universitas Gadjah Mada' }, teamId: teams[2]._id },
            { email: 'citra@binus.ac.id', username: 'Citra_BINUS', password: hashedPassword, role: 'user', stats: { xp: 5800, gold: 1100, level: 5, hp: 100, streak: 8 }, avatar: { base: 'PixelHero', equipment: {}, level: 5, evolution: 'Base' }, regional: { university: 'Binus University' }, teamId: teams[3]._id },
            { email: 'kevin@itb.ac.id', username: 'Kevin_ITB', password: hashedPassword, role: 'user', stats: { xp: 4400, gold: 900, level: 4, hp: 100, streak: 3 }, avatar: { base: 'CyberNinja', equipment: {}, level: 4, evolution: 'Base' }, regional: { university: 'Institut Teknologi Bandung' }, teamId: teams[0]._id },
        ]);

        // Push their IDs to team members array
        await Team.findByIdAndUpdate(teams[0]._id, { $push: { members: { $each: [dummyUsers[0]._id, dummyUsers[4]._id] } } });
        await Team.findByIdAndUpdate(teams[1]._id, { $push: { members: dummyUsers[1]._id } });
        await Team.findByIdAndUpdate(teams[2]._id, { $push: { members: dummyUsers[2]._id } });
        await Team.findByIdAndUpdate(teams[3]._id, { $push: { members: dummyUsers[3]._id } });

        // 4. Create Global Quests (for Landing Page!)
        let adminId = new mongoose.Types.ObjectId(); // Fallback dummy ID if no admin exists
        const actualAdmin = await User.findOne({ role: 'admin' });
        if (actualAdmin) {
            adminId = actualAdmin._id;
        } else {
            // Protect script if totally new db
            await User.create({ email: 'admin@habitivity.com', username: 'MasterAdmin', password: hashedPassword, role: 'admin' });
            const newAdmin = await User.findOne({ role: 'admin' });
            adminId = newAdmin!._id;
        }

        await Quest.insertMany([
            { userId: adminId, title: 'Hackathon Grand Final', category: 'work', difficulty: 'expert', status: 'pending', rewards: { xp: 1000, gold: 500 }, isAdmin: true },
            { userId: adminId, title: 'Code Refactoring Session', category: 'learning', difficulty: 'hard', status: 'pending', rewards: { xp: 300, gold: 100 }, isAdmin: true },
            { userId: adminId, title: '2 Hours Deep Work', category: 'finance', difficulty: 'medium', status: 'pending', rewards: { xp: 150, gold: 40 }, isAdmin: true },
            { userId: adminId, title: 'Daily Workout', category: 'health', difficulty: 'easy', status: 'pending', rewards: { xp: 50, gold: 15 }, isAdmin: true },
        ]);

        return NextResponse.json({ success: true, message: 'Habitivity Demo DB Seeded Successfully!' });
    } catch (error: any) {
        console.error('Seed error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
