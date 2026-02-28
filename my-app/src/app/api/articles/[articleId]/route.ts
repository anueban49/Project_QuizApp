import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const GET = async (
  req: NextRequest,
  { params }: { params: { articleId: string } },
) => {
  //fetch the article by id
  const { articleId } = await params;
  if (!articleId) {
    return NextResponse.json(
      { error: "Faied to fetch article" },
      { status: 404 },
    );
  }
  try {
    const data = await prisma.article.findUnique({ where: { id: articleId } });
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
  }
};
