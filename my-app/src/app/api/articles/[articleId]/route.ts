import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ articleId: string }> },
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

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ articleId: string }> },
) => {
  const { articleId } = await params;
  if (!articleId) {
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 404 },
    );
  }
  try {
    await prisma.article.delete({ where: { id: articleId } });
    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 },
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ articleId: string }> },
) => {
  const { articleId } = await params;
  if (!articleId) {
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 404 },
    );
  }
  try {
    const newData = await req.json();
    const data = await prisma.article.update({
      where: { id: articleId },
      data: {
        title: newData.title,
        orgArticle: newData.orgArticle,
        sumArticle: newData.sumArticle,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 },
    );
  }
};
