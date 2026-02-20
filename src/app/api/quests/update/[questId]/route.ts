import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Quest from "@/models/Quest";
import User from "@/models/User";
import { auth } from "@/auth";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ questId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { questId } = await params;
        const body = await request.json();
        const { status } = body;

        await connectDB();

        const quest = await Quest.findOne({ _id: questId, userId: session.user.id });
        if (!quest) {
            return NextResponse.json({ error: "Quest not found" }, { status: 404 });
        }

        const previousStatus = quest.status;
        quest.status = status || quest.status;

        if (status === 'completed' && previousStatus !== 'completed') {
            quest.completedAt = new Date();

            // Reward the user
            const xpReward = quest.rewards?.xp || 0;
            const goldReward = quest.rewards?.gold || 0;

            await User.findByIdAndUpdate(session.user.id, {
                $inc: {
                    "stats.xp": xpReward,
                    "stats.gold": goldReward,
                    "stats.streak": 1
                }
            });
        }

        await quest.save();

        return NextResponse.json({ message: "Quest updated successfully", quest });
    } catch (error: any) {
        console.error("PATCH Quest Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ questId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { questId } = await params;
        await connectDB();

        const result = await Quest.deleteOne({ _id: questId, userId: session.user.id });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Quest not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Quest deleted successfully" });
    } catch (error: any) {
        console.error("DELETE Quest Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
