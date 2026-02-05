import { NextResponse } from "next/server";
import { uploadToCloudinary } from "./../../lib/uploadToCloudinary";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as "room" | "resort" | "user";

    if (!file || !folder) {
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploaded = await uploadToCloudinary(buffer, folder);

    return NextResponse.json(uploaded);
}