import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import ShopItem from "@/models/ShopItem";
import User from "@/models/User";
import { auth } from "@/auth";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { itemId } = await request.json();
        if (!itemId) {
            return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
        }

        await connectDB();

        // 1. Get Item info
        const item = await ShopItem.findById(itemId);
        if (!item || !item.isActive) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        // 2. Get User info
        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 3. Check if user already owns the item (if it's an avatar item)
        if (item.type === 'avatar_item' && user.inventory.includes(item.name)) {
            return NextResponse.json({ error: "You already own this item" }, { status: 400 });
        }

        // 4. Check if user has enough gold
        if (user.stats.gold < item.price) {
            return NextResponse.json({ error: "Insufficient gold" }, { status: 400 });
        }

        // 5. Deduct gold and add to inventory
        user.stats.gold -= item.price;

        if (item.type === 'avatar_item') {
            user.inventory.push(item.name);

            // Auto-equip if it's an avatar item? Let's do it for now
            if (item.subType) {
                user.avatar.equipment[item.subType] = item.name;
            }
        } else if (item.type === 'boost') {
            // Handle boosts logic (e.g. adding multiplier or healing)
            if (item.stats?.hpBonus) {
                user.stats.hp = Math.min(100, user.stats.hp + item.stats.hpBonus);
            }
            // Consumable boosts might not need inventory tracking but immediate effect
        }

        await user.save();

        return NextResponse.json({
            message: `Successfully purchased ${item.name}`,
            userStats: user.stats,
            equipped: user.avatar.equipment
        });

    } catch (error: any) {
        console.error("Purchase Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
