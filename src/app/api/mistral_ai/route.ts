import { NextResponse } from "next/server";
import { MistralRequest } from "@/lib/mistral_ai";

export async function POST(req: Request) {
    try {
        const { fileContent, outputFormat, websiteTree, language } = await req.json()
        const mistralResponse = await MistralRequest(
            'mistral-large-latest',
            'user',
            { fileContent, outputFormat, websiteTree, language }
        )
        const responseContent = mistralResponse?.choices?.[0]?.message?.content;
        return NextResponse.json({ message: "Data received successfully", content: responseContent });
    } catch (error) {
        console.error("Mistral api endpoint : ", error);
        return NextResponse.json({ message: "Failed to generate the content", error: String(error) });
    }

}