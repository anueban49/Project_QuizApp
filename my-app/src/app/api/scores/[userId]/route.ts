import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } },
) => {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ status: 404, message: "userId invalid" });
  }
  try {
    const savedScores = await prisma.points.findUnique({
      where: { userId: userId },
    });
    if (!savedScores || savedScores === undefined) {
      return NextResponse.json({ res: 0 });
    }
    return NextResponse.json(savedScores);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: e, status: 500 });
  }
};

