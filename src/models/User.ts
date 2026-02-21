import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    username: string;
    role: 'user' | 'admin';
    accountStatus: 'active' | 'banned';
    avatar: {
        base: string;
        equipment: {
            helm: string;
            armor: string;
            weapon: string;
            accessory: string;
        };
        level: number;
        evolution: string;
    };
    stats: {
        hp: number;
        xp: number;
        gold: number;
        level: number;
        streak: number;
        longestStreak: number;
    };
    status: {
        productivity: string;
        finance: string;
        motivation: string;
    };
    regional: {
        city: string;
        university: string;
    };
    team: string;
    inventory: string[]; // List of owned shop item names or IDs
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: 3,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        accountStatus: {
            type: String,
            enum: ['active', 'banned'],
            default: 'active',
        },
        avatar: {
            base: { type: String, default: 'CyberNinja' },
            equipment: {
                helm: { type: String, default: '' },
                armor: { type: String, default: '' },
                weapon: { type: String, default: '' },
                accessory: { type: String, default: '' },
            },
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
        regional: {
            city: { type: String, default: '' },
            university: { type: String, default: '' },
        },
        team: { type: String, default: '' },
        inventory: [{ type: String }],
    },
    {
        timestamps: true,
    }
);

const User = models.User || model<IUser>('User', UserSchema);

export default User;
