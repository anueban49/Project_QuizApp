import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { customAlphabet } from "nanoid";
import { auth } from "@clerk/nextjs/server";

export const POST = async (request: NextRequest) => {
  const apiKey = process.env.GENAI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  const { input, title } = await request.json();

  const prompt: string = input.trim();
  const newConvoId = customAlphabet("QXZY1234567890", 6);
  const newArticleId = customAlphabet("1234567890", 10);
  const { userId } = await auth();
  const clerkId = userId;
  console.log("aapi/articles in work");
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API key issue" }, { status: 500 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Summarize the article under 50 words",
      },
    });
    const fullText = await response.text;
    console.log(response.text);

    await prisma.article.create({
      data: {
        id: newArticleId(),
        orgArticle: prompt,
        sumArticle: fullText as string,
        title: title,
        userId: clerkId as string,
      },
    });

    return NextResponse.json({ res: fullText });
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 },
    );
  }
};

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "validation fail" }, { status: 403 });
  }
  try {
    const data = await prisma.article.findMany({ where: { userId: userId } });
    if (!data) {
      return NextResponse.json(
        { error: `data not found with user: ${userId}` },
        { status: 204 },
      );
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
  }
};
