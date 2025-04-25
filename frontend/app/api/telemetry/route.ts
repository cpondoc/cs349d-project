// app/api/telemetry/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("path");
  console.log(filePath)

  if (!filePath) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  try {
    const absPath = path.join(process.cwd(), filePath);

    // Check if file exists first
    let data = "";
    try {
      data = await fs.readFile(absPath, "utf-8");
    } catch (readError) {
      // File doesn't exist or is unreadable — just return empty
      console.warn("Telemetry file not found or unreadable:", readError);
      return NextResponse.json({ data: "" });
    }

    return NextResponse.json({ data });
  } catch (e) {
    console.error("Unexpected error:", e);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
