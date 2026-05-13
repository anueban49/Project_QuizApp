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
  console.log("hello articles/id/quizzes post")
  try {
    const props: QuizOptionalType = await request.json();
    let apiKey = "";
    if (props.userApiKey) {
      apiKey = props.userApiKey;
    } else {
      apiKey = process.env.GENAI_API_KEY as string;
    }

    if (!apiKey) {
      return NextResponse.json({ error: "API key issue" }, { status: 500 });
    }
    if (props) {
      console.log("input submitted 18 route.ts quizzes");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt: string = props.input.trim();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `Generate ${props?.size ?? "3"} quiz questions with difficulty of ${props?.difficulty ?? "medium"} in ${props?.language ?? "english"} with given article. Respond in EXACT JSON format, nothing else, no extra text:
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

    const cleaned = fullText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) {
      return NextResponse.json(
        { error: "AI returned invalid format" },
        { status: 500 },
      );
    }

    const quiz = JSON.parse(match[0]);
    if (!Array.isArray(quiz) || quiz.length === 0) {
      return NextResponse.json(
        { error: "AI returned invalid quiz format" },
        { status: 500 },
      );
    }

    console.log("Parsed quiz payload:", quiz);
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
