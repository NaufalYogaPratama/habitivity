import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface ITeam extends Document {
    name: string;
    description: string;
    joinCode: string;
    leaderId: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    stats: {
        totalXp: number;
        level: number;
    };
    icon: string;
    createdAt: Date;
    updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
    {
        name: {
            type: String,
            required: [true, 'Nama Tim wajib diisi'],
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        description: {
            type: String,
            default: 'Tim pahlawan Habitivity!',
            maxlength: 200,
        },
        joinCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        leaderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        stats: {
            totalXp: { type: Number, default: 0 },
            level: { type: Number, default: 1 },
        },
        icon: { type: String, default: '🛡️' },
    },
    {
        timestamps: true,
    }
);

const Team = models.Team || model<ITeam>('Team', TeamSchema);

export default Team;
