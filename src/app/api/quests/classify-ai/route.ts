import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required for AI classification" },
        { status: 400 }
      );
    }

    const prompt = `You are an AI assistant in an RPG productivity app. Categorize and analyze the following quest based on its title and description.
Title: "${title}"
Description: "${description || "No description provided"}"

Provide the response STRICTLY as a JSON object with the following structure:
{
  "difficulty": "easy" | "medium" | "hard" | "expert",
  "estimatedTime": "string (e.g., '30 mins', '2 hours')",
  "category": "work" | "learning" | "personal" | "health" | "finance",
  "skills": ["string", "string", "string"], // max 3 relevant skills
  "confidence": number // 0 to 1
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You only output JSON. Do not include markdown block ticks like ```json.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from Groq");
    }

    const parsedResult = JSON.parse(result);

    return NextResponse.json(parsedResult, { status: 200 });
  } catch (error: any) {
    console.error("AI Classification Error:", error);
    return NextResponse.json(
      { error: "Failed to classify quest", details: error.message },
      { status: 500 }
    );
  }
}
