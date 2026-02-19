import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IFocusSession extends Document {
    userId: mongoose.Types.ObjectId;
    mode: 'quick-sprint' | 'deep-work' | 'marathon';
    duration: number; // seconds
    xpEarned: number;
    hpRemaining: number;
    status: 'completed' | 'gave-up';
    completedAt: Date;
}

const FocusSessionSchema = new Schema<IFocusSession>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        mode: {
            type: String,
            enum: ['quick-sprint', 'deep-work', 'marathon'],
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        xpEarned: {
            type: Number,
            default: 0,
        },
        hpRemaining: {
            type: Number,
            default: 100,
        },
        status: {
            type: String,
            enum: ['completed', 'gave-up'],
            required: true,
        },
        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Index for leaderboard queries
FocusSessionSchema.index({ userId: 1, completedAt: -1 });

const FocusSession = models.FocusSession || model<IFocusSession>('FocusSession', FocusSessionSchema);

export default FocusSession;
