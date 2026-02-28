import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  const userId = req.headers.get("id");
  if (!userId) {
    return NextResponse.json(
      { error: "Idetification src times out" },
      { status: 401 },
    );
  }

  localStorage.setItem("client", userId);
  return NextResponse.json({ success: true }, { status: 201 });
};
