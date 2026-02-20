import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IShopItem extends Document {
    name: string;
    description: string;
    type: 'avatar_item' | 'boost' | 'theme' | 'exclusive';
    subType?: 'helm' | 'armor' | 'weapon' | 'accessory';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    price: number;
    icon: string;
    stats?: {
        xpMultiplier?: number;
        hpBonus?: number;
        shieldDuration?: number;
    };
    isActive: boolean;
    createdAt: Date;
}

const ShopItemSchema = new Schema<IShopItem>(
    {
        name: { type: String, required: true },
        description: { type: String },
        type: {
            type: String,
            enum: ['avatar_item', 'boost', 'theme', 'exclusive'],
            required: true
        },
        subType: {
            type: String,
            enum: ['helm', 'armor', 'weapon', 'accessory']
        },
        rarity: {
            type: String,
            enum: ['common', 'rare', 'epic', 'legendary'],
            default: 'common'
        },
        price: { type: Number, required: true },
        icon: { type: String },
        stats: {
            xpMultiplier: { type: Number },
            hpBonus: { type: Number },
            shieldDuration: { type: Number }
        },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

const ShopItem = models.ShopItem || model<IShopItem>('ShopItem', ShopItemSchema);

export default ShopItem;
