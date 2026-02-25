import { createContext, useContext, useState, useEffect } from "react";
import { ReactNode } from "react";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
//main functionality of this:
//creating the summary -> communicating with the backend.
//creating the quiz
//points system
type Quiz = {
  question: string;
  options: string[];
};
interface QuizApptypes {
  summarizeArticle: (orgArticle: string) => Promise<void>;
  generateQuiz: (request: NextRequest) => Promise<void>;
  sumArticle: string;
  quiz: Quiz;
}
const QuizgeekContext = createContext({} as QuizApptypes);

const QuizgeekProvider = ({ children }: { children: ReactNode }) => {
  const [sumArticle, setSumArticle] = useState<string>("");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const apiKey = process.env.GENAI_API_KEY;
  if (!apiKey) {
    console.error("APIkey issue [contextProvider]");
  }

  const generateQuiz = async (request: NextRequest) => {
    const ai = new GoogleGenAI({ apiKey });
    try {
      const { input } = await request.json();
      const prompt: string = input.trim();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `Generate a quiz with 4 options, each option answer consisting of single word, given input.  Respond in EXACT JSON format, nothing else, no extra text:
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
        console.log("error [json format - provider_]");
      }

      const quiz = JSON.parse(match[0]);
      console.log(quiz)
    } catch (e) {
      console.error(e);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 },
      );
    }
  };

  return (
    <QuizgeekContext.Provider
      value={{ generateQuiz, sumArticle, summarizeArticle, quiz }}
    >
      {children}
    </QuizgeekContext.Provider>
  );
};
