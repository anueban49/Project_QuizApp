import { NextRequest, NextResponse } from "next/server";
import { useParams } from "next/navigation";
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
        systemInstruction: `Generate a quiz question with given article. Respond in EXACT JSON format, nothing else, no extra text:
        {"question": "your question here",
        "options": [
              { "label": "A", "text": "option 1" },
              { "label": "B", "text": "option 2" },
              { "label": "C", "text": "option 3" },
              { "label": "D", "text": "option 4" }
            ],
        } `,
      },
    });
    const fullText: any = response.text;

    const match = fullText.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json(
        { error: "AI returned invalid format" },
        { status: 500 },
      );
    }

    const quiz = JSON.parse(match[0]);

    return NextResponse.json({ res: quiz });
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 },
    );
  }
};
