import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { customAlphabet } from "nanoid";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

export const POST = async (request: NextRequest) => {
  const client = new OpenAI();
  const { input, title, subject, category } = await request.json();

  const prompt: string = input.trim();
  const newArticleId = customAlphabet("1234567890", 10);
  const { userId } = await auth();
  console.log("api/articles in work");
  try {

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      instructions: "The user is a student who wishes to deeply understand and study their major. Summarize article given by user in most short and sweet way possible to ensure their academic advance  ",
    });

    const fullText =
      response.output_text ??
      response.output
        ?.map((item: any) =>
          item?.content
            ?.map((contentItem: any) =>
              typeof contentItem?.text === "string" ? contentItem.text : "",
            )
            .filter(Boolean)
            .join("")
        )
        .filter(Boolean)
        .join("\n") ??
      "";

    await prisma.article.create({
      data: {
        id: newArticleId(),
        orgArticle: prompt,
        sumArticle: fullText as string,
        title: title,
        userId: userId!,
        subject: subject ?? ["no subject"],
        category: category ?? "no category"
      },
    });

    return NextResponse.json({ fulltext: fullText });
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
