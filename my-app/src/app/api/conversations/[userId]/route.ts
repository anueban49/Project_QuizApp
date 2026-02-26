import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (request: NextRequest, context: any) => {
  try {
    const { userId } = context.params as { userId: string };
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      include: { articles: true },
    });
    // convert Dates to ISO since NextResponse.json serializes OK
    const cleaned = conversations.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      articles: c.articles.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
      })),
    }));
    return NextResponse.json(cleaned);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "failed to load history" }, { status: 500 });
  }
};
