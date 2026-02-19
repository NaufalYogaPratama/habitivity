import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface ISavingsGoal {
    name: string;
    icon: string;
    target: number;
    current: number;
}

export interface ILedgerConfig extends Document {
    userId: mongoose.Types.ObjectId;
    budgetAmount: number;
    budgetPeriod: 'daily' | 'monthly';
    savingStreak: number;
    shieldActive: boolean;
    lastStreakDate: string;
    savingsGoals: ISavingsGoal[];
}

const SavingsGoalSchema = new Schema<ISavingsGoal>(
    {
        name: { type: String, required: true },
        icon: { type: String, default: '🎯' },
        target: { type: Number, required: true, min: 0 },
        current: { type: Number, default: 0, min: 0 },
    },
    { _id: true }
);

const LedgerConfigSchema = new Schema<ILedgerConfig>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },
        budgetAmount: {
            type: Number,
            default: 0,
        },
        budgetPeriod: {
            type: String,
            enum: ['daily', 'monthly'],
            default: 'daily',
        },
        savingStreak: {
            type: Number,
            default: 0,
        },
        shieldActive: {
            type: Boolean,
            default: false,
        },
        lastStreakDate: {
            type: String,
            default: '',
        },
        savingsGoals: {
            type: [SavingsGoalSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const LedgerConfig = models.LedgerConfig || model<ILedgerConfig>('LedgerConfig', LedgerConfigSchema);

export default LedgerConfig;
