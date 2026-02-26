import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const POST = async (request: NextRequest) => {
  const apiKey = process.env.GENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key issue" }, { status: 500 });
  }

  try {
    const { input } = await request.json();
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: input,
      config: {
        systemInstruction: "Generate a multiple-choice quiz (question with 4 options and the correct answer) based on the provided text",
      },
    });
    const fullText = response.text || "";
    // The client expects { res: Quiz }
    let parsed;
    try {
      parsed = JSON.parse(fullText);
    } catch {
      // if AI didn't return valid JSON, just send raw text
      parsed = fullText;
    }
    return NextResponse.json({ res: parsed });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
