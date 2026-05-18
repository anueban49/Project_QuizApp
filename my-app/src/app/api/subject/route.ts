import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { customAlphabet, nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {

    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthenticated" }, { status: 404 })
        }
        const result = await prisma.subject.findMany({});
        return NextResponse.json({ result }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 })
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const { name } = await req.json();
        if (!name) {
            return NextResponse.json({ error: "empty field " }, { status: 403 });
        }
        const newID = customAlphabet("1234567890", 10);

        const res = await prisma.subject.create({
            data: {
                id: newID(),
                name: name
            }
        })
        if (!res) { return NextResponse.json({ error: "failed to create a new subject enitity" }, { status: 500 }) }
        return NextResponse.json({ message: "success" },
            { status: 200 })

    } catch (e) { return NextResponse.json({ error: e }, { status: 500 }) }
}