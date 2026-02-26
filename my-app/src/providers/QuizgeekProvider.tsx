"use client";

import { useContext, useState, useEffect } from "react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { QuizgeekContext } from "./QuizgeekContext";
// main functionality of this provider:
//  • summary creation
//  • quiz generation (calls server API)
//  • points system

// quiz shape returned by the API
export type Quiz = {
  question: string;
  options: string[];
  answer: string;
};
type Article = {
  id: string;
  title: string;
  orgArticle: string;
  sumArticle: string;
  createdAt: Date;
  conversationId?: string;
};

interface Conversation {
  createdAt: Date;
  title: string;
  id: string;
  articles: Article[];
  userId: string;
} //for sidebar componet voila

export interface QuizApptypes {
  summarizeArticle: (orgArticle: string) => Promise<void>;
  generateQuiz: (articleId: string) => Promise<void>;
  sumArticle: string;
  quiz: Quiz | null;
  history: Conversation[];
  article: Article | null;
  getConversationHistory: (userid: string) => Promise<void>;
  getArticleData: (articleId: string) => Promise<Article | undefined>;
}

export const QuizgeekProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<Conversation[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [sumArticle, setSumArticle] = useState<string>("");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/auth/signin");
    }
    if (user) {
      setUserId(user?.id as string);
    }
  }, [isLoaded, user, router]);

  // client‑side helper that talks to the server route instead of
  // dealing with NextRequest/NextResponse directly.  the type issue you saw
  // was caused by trying to use `NextRequest` in a browser context and by
  // sometimes returning a `NextResponse` while the interface promised `void`.
  const getConversationHistory = async () => {
    try {
      const res = await fetch(`/api/conversations/${userId}`);
      if (!res.ok) throw new Error("failed to fetch history");
      const data: Conversation[] = await res.json();
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
  };
  const getArticleData = async (articleId: string) => {
    try {
      const res = await fetch(`/api/articles/${articleId}`);
      if (!res.ok) {
        setArticle(null);
        return;
      }
      const data: Article = await res.json();
      setArticle(data);
      return data;
    } catch (e) {
      console.error(e);
    }
  };

  const generateQuiz = async (articleId: string) => {
    const fetched = await getArticleData(articleId);
    if (!fetched) {
      console.error("generateQuiz: article not found");
      return;
    }

    const input = `${fetched.orgArticle}\n\nSummary:\n${fetched.sumArticle}`;
    try {
      const res = await fetch(`/api/articles/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!res.ok) {
        throw new Error("failed to generate quiz");
      }

      const data = await res.json();
      // the API returns { res: Quiz }
      setQuiz(data.res);
    } catch (e) {
      console.error("generateQuiz error", e);
    }
  };

  const summarizeArticle = async (orgArticle: string) => {
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ input: orgArticle }),
      });
      const data = await res.json();
      setSumArticle(data.res);
    } catch (e) {
      console.error(e);
    }
    setSumArticle(orgArticle);
  };

  return (
    <QuizgeekContext.Provider
      value={{
        generateQuiz,
        sumArticle,
        summarizeArticle,
        quiz,
        history,
        article,
        getConversationHistory,
        getArticleData,
      }}
    >
      {children}
    </QuizgeekContext.Provider>
  );
};
export const useQuizgeek = () => {
  const context = useContext(QuizgeekContext);
  if (!context) {
    throw new Error("Quizgeek provider issue blah blah");
  }
  return context;
};
