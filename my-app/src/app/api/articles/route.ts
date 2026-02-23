import { NextRequest, NextResponse } from "next/server";

import { GoogleGenAI } from "@google/genai";

export const POST = async (request: NextRequest) => {
  const apiKey = process.env.GENAI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API key issue" }, { status: 500 });
    }

    const { input } = await request.json();
    const prompt: string = input.trim();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Summarize the article under 50 words",
      },
    });
    const fullText = response.text;
    return NextResponse.json({ res: fullText });
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 },
    );
  }
};
