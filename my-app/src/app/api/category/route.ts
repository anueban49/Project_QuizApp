import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { customAlphabet } from "nanoid";
import { NextRequest, NextResponse } from "next/server";


export const GET = async () => {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "unauthenticated" }, { status: 500 })
        }

        const res = await prisma.category.findMany({});
        if (!res) { return NextResponse.json({ message: "No data found" }, { status: 404 }) }
        return NextResponse.json({ res });

    } catch (e) { return NextResponse.json({ error: e }, { status: 500 }) }
}

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = await auth();
        const { name } = await req.json();

        if (!userId) {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 404 })
        }
        if (!name) {
            return NextResponse.json({ message: "Empty field" }, { status: 403 })
        }
        const newID = customAlphabet("4567890%$&@", 12)
        const res = await prisma.category.create({
            data: {
                id: newID(),
                name: name as string

            }
        })
        return NextResponse.json({ res }, { status: 200 })
    } catch (e) { return NextResponse.json({ error: e }, { status: 500 }) }
}