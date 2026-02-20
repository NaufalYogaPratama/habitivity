import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Quest from "@/models/Quest";
import { auth } from "@/auth";

// 1. GET: Mengambil daftar semua Quest milik User yang sedang login
export async function GET(request: Request) {
  try {
    // Cek sesi user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Ambil URL untuk mengecek apakah ada query parameter (misal filter status)
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    // Siapkan query filter
    const query: any = { userId: session.user.id };
    if (statusFilter) {
      query.status = statusFilter;
    }

    // Cari quest berdasarkan userId, urutkan dari yang terbaru
    const quests = await Quest.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ quests }, { status: 200 });
  } catch (error: any) {
    console.error("GET Quests Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// 2. POST: Membuat Quest baru
export async function POST(request: Request) {
  try {
    // Cek sesi user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, difficulty } = body;

    // Validasi input dasar
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Default reward berdasarkan difficulty (Bisa diganti nanti dengan AI )
    let baseRewards = { xp: 50, gold: 10 };
    switch (difficulty) {
      case "easy":
        baseRewards = { xp: 20, gold: 5 };
        break;
      case "medium":
        baseRewards = { xp: 50, gold: 15 };
        break;
      case "hard":
        baseRewards = { xp: 100, gold: 30 };
        break;
      case "expert":
        baseRewards = { xp: 200, gold: 50 };
        break;
    }

    // Buat Quest baru
    const newQuest = await Quest.create({
      userId: session.user.id,
      title,
      description: description || "",
      category: category || "work",
      difficulty: difficulty || "medium",
      rewards: baseRewards, // Masukkan reward ke dalam schema
    });

    return NextResponse.json(
      { message: "Quest created successfully", quest: newQuest },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Quest Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}