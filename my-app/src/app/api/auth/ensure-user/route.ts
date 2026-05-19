import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const name = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const displayName =
    name || clerkUser.username || clerkUser.emailAddresses?.[0]?.emailAddress || "Anonymous";

  await prisma.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      name: displayName,
      lastSeen: new Date(),
    },
    update: {
      name: displayName,
      lastSeen: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
