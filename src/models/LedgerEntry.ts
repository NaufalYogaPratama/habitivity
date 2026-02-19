import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface ILedgerEntry extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    category: 'food' | 'transport' | 'entertainment' | 'shopping' | 'bills' | 'health' | 'education' | 'other';
    note: string;
    date: Date;
}

const LedgerEntrySchema = new Schema<ILedgerEntry>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            enum: ['food', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'education', 'other'],
            required: true,
        },
        note: {
            type: String,
            default: '',
            maxlength: 100,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Index for querying by user + date range
LedgerEntrySchema.index({ userId: 1, date: -1 });

const LedgerEntry = models.LedgerEntry || model<ILedgerEntry>('LedgerEntry', LedgerEntrySchema);

export default LedgerEntry;
