"use client";

import { useContext, useState, useEffect } from "react";
import { ReactNode } from "react";
import { QuizgeekContext } from "./QuizgeekContext";
// main functionality of this provider:
//  • summary creation
//  • quiz generation (calls server API)
//  • points system

// quiz shape returned by the API
export type Quiz = {
  question: string;
  // API may return options as strings or objects like { label, text }
  options: Array<{ label: string; text: string }>;
  answer: string;
};
type Article = {
  id: string;
  title: string;
  orgArticle: string;
  sumArticle: string;
  createdAt: Date;
  userId: string;
};
export type UserType = {
  id: string | null;
  data: Article[];
  points: number;
};

export type OperationType =
  | "ArticleSummary"
  | "ArticlesArchive"
  | "QuizSection";

export interface QuizApptypes {
  active: OperationType;
  setActive: (active: OperationType) => void;
  summarizeArticle: (orgArticle: string, title: string) => Promise<string>;
  getArticlesHistory: () => Promise<void>;
  history: Article[];
  getArticleData: (articleId: string) => Promise<Article | undefined>;
  generateQuiz: (articleId: string) => Promise<void>;
  quiz: Quiz | null;
  article: Article | null;
}

export const QuizgeekProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<Article[]>([]); //for getting articles for the user
  const [article, setArticle] = useState<Article | null>(null); //for getting individual article data
  const [sumArticle, setSumArticle] = useState<string | null>(null); //for processing article/making one
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [active, setActive] = useState<OperationType>("ArticleSummary");

  //on first landing, articleSum will be active. by allowing function to change in between of these, setActive has to change accordingly.
  //export the change statement function.
  //what does the function does is: if active is "..." the viewPage has to change to component.
  //the control thingy has to be in drawer comp.

  const summarizeArticle = async (orgArticle: string, title: string) => {
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ input: orgArticle, title: title }),
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.error(e);
    }
    setSumArticle(orgArticle);

    useEffect(() => {}, [sumArticle]);
  };
  const getArticlesHistory = async () => {
    try {
      // endpoint is plural 'articles' and returns array directly
      const res = await fetch("/api/articles", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!res.ok) {
        console.log("history-data res failure [quizgeekprovider]");
        return;
      }
      const data: Article[] = await res.json();
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
    if (active === "QuizSection") {
      const fetched = await getArticleData(articleId);
      if (!fetched) {
        console.error("generateQuiz: article not found");
        return;
      }

      const input = `${fetched.orgArticle}\n\nSummary:\n${fetched.sumArticle}`;
      try {
        const res = await fetch(`/api/articles/${articleId}/quizzes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input }),
        });

        if (!res.ok) {
          throw new Error("failed to generate quiz");
        }

        const data = await res.json();
        // accept either { res: Quiz } or Quiz directly
        setQuiz((data as any).res ?? (data as any));
      } catch (e) {
        console.error("generateQuiz error", e);
      }
    }
  };

  return (
    <QuizgeekContext.Provider
      value={{
        setActive,
        active,
        history,
        generateQuiz,
        getArticlesHistory,
        summarizeArticle,
        quiz,
        article,
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
