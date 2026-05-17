import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { customAlphabet } from "nanoid";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

export const POST = async (request: NextRequest) => {
  const client = new OpenAI();
  const { input, title } = await request.json();

  const prompt: string = input.trim();
  const newArticleId = customAlphabet("1234567890", 10);
  const { userId } = await auth();
  const clerkId = userId;
  console.log("api/articles in work");
  try {

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      instructions: "Summarize article given by user."
    })
    console.log(response)
    const fullText = response.output_text;

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
  console.log("hello aricles get")
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
