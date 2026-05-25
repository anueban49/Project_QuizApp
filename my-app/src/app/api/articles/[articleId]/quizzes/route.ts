import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { customAlphabet } from "nanoid";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
interface QuizOptionalType {
  input?: string;
  difficulty?: string;
  size?: number;
  userApiKey?: string;
  language?: string;
  quiz?: any[];
}

type QuizItem = {
  question: string;
  options: Array<{ label: string; text: string }>;
  answer: string;
};

const makeId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

const normalizeQuizItem = (item: any): QuizItem | null => {
  if (typeof item !== "object" || item === null) return null;

  const question = typeof item.question === "string" ? item.question.trim() : "";
  const rawOptions: any[] = Array.isArray(item.options) ? item.options : [];

  const options: Array<{ label: string; text: string }> = rawOptions
    .map((option: any, index: number) => {
      if (typeof option === "string") {
        return {
          label: String.fromCharCode(65 + index),
          text: option.trim(),
        };
      }
      if (typeof option === "object" && option !== null) {
        const label = typeof option.label === "string" ? option.label.trim().toUpperCase() : String.fromCharCode(65 + index);
        const text = typeof option.text === "string" ? option.text.trim() : "";
        if (!text) return null;
        return { label, text };
      }
      return null;
    })
    .filter((option: { label: string; text: string } | null): option is { label: string; text: string } => Boolean(option));

  if (!question || options.length === 0) return null;

  const rawAnswer = typeof item.answer === "string" ? item.answer.trim() : "";
  if (!rawAnswer) return null;

  const matchedLabel = options.find(
    (opt) =>
      opt.label.toUpperCase() === rawAnswer.toUpperCase() ||
      opt.text.toLowerCase() === rawAnswer.toLowerCase() ||
      opt.text.toLowerCase() === rawAnswer.replace(/^"|"$/g, "").toLowerCase(),
  )?.label;

  const answer = matchedLabel ? matchedLabel : rawAnswer.toUpperCase().slice(0, 1);
  if (!options.some((opt) => opt.label.toUpperCase() === answer.toUpperCase())) return null;

  return {
    question,
    options,
    answer: answer.toUpperCase(),
  };
};

const buildStoreableQuizRecords = (
  quiz: QuizItem[],
  articleId: string,
  userId: string,
) =>
  quiz.map((item) => ({
    id: makeId(),
    articleId,
    userId,
    correctOption: item.answer,
    options: [
      {
        question: item.question,
        choices: item.options,
      },
    ],
  })) as any[];

const parseSavedQuizRecord = (record: any): QuizItem | null => {
  if (!record || !record.options || !Array.isArray(record.options)) return null;
  const first = record.options[0];
  if (first && typeof first === "object" && first !== null && Array.isArray(first.choices)) {
    return {
      question: typeof first.question === "string" ? first.question : "",
      options: first.choices.map((opt: any, index: number) => {
        if (typeof opt === "string") {
          return {
            label: String.fromCharCode(65 + index),
            text: opt.trim(),
          };
        }
        if (typeof opt === "object" && opt !== null) {
          return {
            label: typeof opt.label === "string" ? opt.label.trim().toUpperCase() : String.fromCharCode(65 + index),
            text: typeof opt.text === "string" ? opt.text.trim() : "",
          };
        }
        return { label: String.fromCharCode(65 + index), text: "" };
      }),
      answer: typeof record.correctOption === "string" ? record.correctOption.toUpperCase() : "",
    };
  }

  if (Array.isArray(record.options)) {
    const options = record.options
      .map((opt: any, index: number) => {
        if (typeof opt === "string") {
          return {
            label: String.fromCharCode(65 + index),
            text: opt.trim(),
          };
        }
        if (typeof opt === "object" && opt !== null) {
          return {
            label: typeof opt.label === "string" ? opt.label.trim().toUpperCase() : String.fromCharCode(65 + index),
            text: typeof opt.text === "string" ? opt.text.trim() : "",
          };
        }
        return null;
      })
      .filter((opt: any): opt is { label: string; text: string } => Boolean(opt));
    return {
      question: typeof record.question === "string" ? record.question : "",
      options,
      answer: typeof record.correctOption === "string" ? record.correctOption.toUpperCase() : "",
    };
  }

  return null;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> },
) => {
  const { articleId } = await params;
  if (!articleId) {
    return NextResponse.json({ error: "Missing article id" }, { status: 400 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const savedQuiz = (await prisma.quiz.findMany({
      where: { articleId, userId },
      orderBy: { createdAt: "asc" },
    })) as any[];

    const parsedQuiz = savedQuiz
      .map(parseSavedQuizRecord)
      .filter((item): item is QuizItem => Boolean(item));

    return NextResponse.json(parsedQuiz);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch saved quiz" }, { status: 500 });
  }
};

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> },
) => {
  const { articleId } = await params;
  if (!articleId) {
    return NextResponse.json({ error: "Missing article id" }, { status: 400 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const props: QuizOptionalType = await request.json();
    let quizItems: QuizItem[] | null = null;

    if (Array.isArray(props.quiz) && props.quiz.length > 0) {
      quizItems = props.quiz
        .map(normalizeQuizItem)
        .filter((item): item is QuizItem => Boolean(item));
    }

    if (!quizItems) {
      const apiKey = props.userApiKey ? props.userApiKey : (process.env.GENAI_API_KEY as string);
      if (!apiKey) {
        return NextResponse.json({ error: "API key issue" }, { status: 500 });
      }
      if (!props.input) {
        return NextResponse.json({ error: "Missing input for quiz generation" }, { status: 400 });
      }

      const client = new OpenAI;
      const prompt = props.input.trim();
      const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
        instructions: `Generate ${props?.size ?? "3"} quiz questions with difficulty of ${props?.difficulty ?? "medium"} in ${props?.language ?? "english"} with given article. 
          Quiz contents must be academic, educational, and be sure to hand out creative, rich question. If given difficulty is hard, make the quiz unversity level
          Respond in EXACT JSON format, nothing else, no extra text:
          [{"question": "your question here",
          "options": [
                { "label": "A", "text": "option 1" },
                { "label": "B", "text": "option 2" },
                { "label": "C", "text": "option 3" },
                { "label": "D", "text": "option 4" }
              ],
          "answer": "..."
          }, ... ] 
          `,
      })
      const fullText =
        typeof response.output_text === "string"
          ? response.output_text
          : Array.isArray(response.output)
          ? response.output
              .map((item: any) =>
                item?.content
                  ?.map((contentItem: any) =>
                    typeof contentItem?.text === "string" ? contentItem.text : "",
                  )
                  .filter(Boolean)
                  .join("")
              )
              .filter(Boolean)
              .join("\n")
          : typeof response.text === "string"
          ? response.text
          : "";

      const cleaned = fullText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const match = cleaned.match(/\[[\s\S]*\]/);
      if (!match) {
        return NextResponse.json({ error: "AI returned invalid format" }, { status: 500 });
      }

      const rawQuiz = JSON.parse(match[0]);
      if (!Array.isArray(rawQuiz) || rawQuiz.length === 0) {
        return NextResponse.json({ error: "AI returned invalid quiz format" }, { status: 500 });
      }

      quizItems = rawQuiz
        .map(normalizeQuizItem)
        .filter((item): item is QuizItem => Boolean(item));
    }

    if (!quizItems || quizItems.length === 0) {
      return NextResponse.json({ error: "No valid quiz items available" }, { status: 500 });
    }

    const storeData = buildStoreableQuizRecords(quizItems, articleId, userId);
    await prisma.quiz.deleteMany({ where: { articleId, userId } });
    await prisma.quiz.createMany({ data: storeData });

    return NextResponse.json(quizItems);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
