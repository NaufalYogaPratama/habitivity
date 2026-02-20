import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import ShopItem from "@/models/ShopItem";
import { auth } from "@/auth";

const INITIAL_ITEMS = [
    // HELMS
    { name: "Basic Helm", description: "Standard issue protection.", type: "avatar_item", subType: "helm", rarity: "common", price: 100, icon: "🪖" },
    { name: "Cyber Visor", description: "Enhanced HUD for better focus.", type: "avatar_item", subType: "helm", rarity: "rare", price: 500, icon: "🥽" },
    { name: "Void Crown", description: "Regal headwear from the abyss.", type: "avatar_item", subType: "helm", rarity: "epic", price: 1500, icon: "👑" },
    { name: "Infinity Halo", description: "Divine wisdom flows through you.", type: "avatar_item", subType: "helm", rarity: "legendary", price: 5000, icon: "😇" },

    // ARMOR
    { name: "Standard Suit", description: "Durable work attire.", type: "avatar_item", subType: "armor", rarity: "common", price: 150, icon: "👕" },
    { name: "Stealth Vest", description: "Avoid distractions with ease.", type: "avatar_item", subType: "armor", rarity: "rare", price: 750, icon: "🦺" },
    { name: "Plasma Core", description: "Energy-infused defensive plated.", type: "avatar_item", subType: "armor", rarity: "epic", price: 2000, icon: "🛡️" },
    { name: "Quantum Shield", description: "Phases out stress and interruptions.", type: "avatar_item", subType: "armor", rarity: "legendary", price: 6000, icon: "🔮" },

    // WEAPONS
    { name: "Training Blade", description: "Sharpens your productivity.", type: "avatar_item", subType: "weapon", rarity: "common", price: 200, icon: "🗡️" },
    { name: "Laser Dagger", description: "Precise cuts through tasks.", type: "avatar_item", subType: "weapon", rarity: "rare", price: 1000, icon: "🔪" },
    { name: "Void Saber", description: "Destroys procrastination.", type: "avatar_item", subType: "weapon", rarity: "epic", price: 3000, icon: "⚔️" },
    { name: "Excalibur NG", description: "The legendary blade of focus.", type: "avatar_item", subType: "weapon", rarity: "legendary", price: 10000, icon: "🗡️" },

    // ACCESSORIES
    { name: "Power Glove", description: "Type faster, work harder.", type: "avatar_item", subType: "accessory", rarity: "common", price: 100, icon: "🧤" },
    { name: "Hologram Wing", description: "Fly over your deadlines.", type: "avatar_item", subType: "accessory", rarity: "rare", price: 600, icon: "🦋" },
    { name: "Time Ring", description: "Bends time to your whim.", type: "avatar_item", subType: "accessory", rarity: "epic", price: 1800, icon: "💍" },
    { name: "Infinity Gauntlet", description: "Snap your fingers to finish daily habits.", type: "avatar_item", subType: "accessory", rarity: "legendary", price: 8000, icon: "🧤" },

    // EXCLUSIVE
    { name: "Founder's Cape", description: "A mark of the early heroes.", type: "exclusive", rarity: "legendary", price: 20000, icon: "🧥" },
    { name: "Nebula Wings", description: "Limited time event item.", type: "exclusive", rarity: "epic", price: 12000, icon: "🌌" },

    // BOOSTS
    { name: "XP Multiplier", description: "Earn 2x XP for 24 hours.", type: "boost", rarity: "rare", price: 500, icon: "⚡", stats: { xpMultiplier: 2 } },
    { name: "HP Shield", description: "Protection from tab penalty for 1 session.", type: "boost", rarity: "rare", price: 300, icon: "🛡️", stats: { hpBonus: 50 } },
];

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        let items = await ShopItem.find({ isActive: true });

        // Seed if empty
        if (items.length === 0) {
            await ShopItem.insertMany(INITIAL_ITEMS);
            items = await ShopItem.find({ isActive: true });
        }

        return NextResponse.json({ items });
    } catch (error: any) {
        console.error("GET Shop Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
