import { NextResponse } from "next/server";
import { MistralRequest } from "@/lib/mistral_ai";

export async function POST(req: Request) {
    const data = await req.json()
    console.log("Received data:", data)

    return NextResponse.json({ message: "Data received successfully", data })
}