import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
interface QuizOptionalType {
  input: string;
  difficulty?: string;
  size?: number;
  userApiKey?: string;
  language?: string;
}
export const POST = async (request: NextRequest) => {
  const { input, ...options } = await request.json();
  let apiKey = options.userApiKey || process.env.GENAI_API_KEY;
  let difficulty = options.difficulty || "medium";
  let size = options.size || 3;
  let language = options.language || "english";
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API key issue" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt: string = options.input.trim();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `Generate ${size} quiz questions with given article. Respond in EXACT JSON format, nothing else, no extra text:
        [{"question": "your question here",
        "options": [
              { "label": "A", "text": "option 1" },
              { "label": "B", "text": "option 2" },
              { "label": "C", "text": "option 3" },
              { "label": "D", "text": "option 4" }
            ],
        "answer": "..."
        }, ... ] `,
      },
    });
    const fullText: any = response.text;
    console.log(fullText);
    const match = fullText.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json(
        { error: "AI returned invalid format" },
        { status: 500 },
      );
    }

    const quiz = JSON.parse(match[0]);
    console.log(quiz);
    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 },
    );
  }
};
