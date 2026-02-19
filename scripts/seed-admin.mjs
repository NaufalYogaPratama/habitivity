import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
try {
    const env = readFileSync(envPath, 'utf-8');
    env.split('\n').forEach((line) => {
        const [key, ...val] = line.split('=');
        if (key && val.length) process.env[key.trim()] = val.join('=').trim();
    });
} catch { }

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: {
        base: { type: String, default: 'CyberNinja' },
        equipment: { helm: String, armor: String, weapon: String, accessory: String },
        level: { type: Number, default: 1 },
        evolution: { type: String, default: 'Base' },
    },
    stats: {
        hp: { type: Number, default: 100 },
        xp: { type: Number, default: 0 },
        gold: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        streak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
    },
    status: {
        productivity: { type: String, default: 'steady' },
        finance: { type: String, default: 'balanced' },
        motivation: { type: String, default: 'neutral' },
    },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const ADMIN_EMAIL = 'habitivity@gmail.com';
const ADMIN_PASSWORD = 'habitivity123';
const ADMIN_USERNAME = 'habitivity_admin';

async function seedAdmin() {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
        if (existing.role === 'admin') {
            console.log('ℹ️  Admin account already exists:', ADMIN_EMAIL);
        } else {
            // Upgrade to admin
            await User.updateOne({ email: ADMIN_EMAIL }, { role: 'admin' });
            console.log('⬆️  Upgraded existing account to admin:', ADMIN_EMAIL);
        }
        await mongoose.disconnect();
        return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.create({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        username: ADMIN_USERNAME,
        role: 'admin',
    });

    console.log('👑 Admin account created!');
    console.log('   Email   :', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('   Username:', ADMIN_USERNAME);

    await mongoose.disconnect();
    console.log('✅ Done!');
}

seedAdmin().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
