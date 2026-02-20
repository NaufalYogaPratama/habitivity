import mongoose, { Schema, Document } from 'mongoose';

// 1. Definisi Interface TypeScript untuk Autocomplete & Type Checking
export interface IQuest extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: 'work' | 'learning' | 'personal' | 'health' | 'finance';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  aiAnalysis?: {
    estimatedTime: number;
    xpReward: number;
    goldReward: number;
    skills: string[];
    confidence: number;
  };
  timerUsed: boolean;
  completedAt?: Date;
  createdAt: Date;
}

// 2. Definisi Schema Mongoose
const QuestSchema = new Schema<IQuest>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  category: {
    type: String,
    enum: ['work', 'learning', 'personal', 'health', 'finance'],
    default: 'work'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending'
  },
  aiAnalysis: {
    estimatedTime: { type: Number },
    xpReward: { type: Number },
    goldReward: { type: Number },
    skills: [{ type: String }],
    confidence: { type: Number }
  },
  timerUsed: { 
    type: Boolean, 
    default: false 
  },
  completedAt: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 3. Export Model (Mencegah OverwriteError di Next.js Hot Reload)
export default mongoose.models.Quest || mongoose.model<IQuest>('Quest', QuestSchema);