import { NextRequest, NextResponse } from "next/server";

import { GoogleGenAI } from "@google/genai";

export const POST = async (request: NextRequest) => {
  const apiKey = process.env.GENAI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API key issue" }, { status: 500 });
    }

    const { text } = await request.json();
    const prompt: string = text.trim();
    if (prompt) {
      console.log(prompt);
    }

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Summarize the article under 50 words",
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      fullText += chunk.text || "";
    }
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
