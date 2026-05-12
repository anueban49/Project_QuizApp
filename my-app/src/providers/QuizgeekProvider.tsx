"use client";

import { useContext, useState } from "react";
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
export interface QuizType {
  articleId: string;
  difficulty?: string;
  size?: number | string;
  userApiKey?: string;
  language?: string;
}
export type Article = {
  id: string;
  title: string;
  orgArticle: string;
  sumArticle: string;
  createdAt: Date;
  userId: string;
  updatedAt: Date;
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
  loading: boolean;
  setLoading: (loading: boolean) => void;
  active: OperationType;
  setActive: (active: OperationType) => void;
  summarizeArticle: (orgArticle: string, title: string) => Promise<any>;
  getArticlesHistory: () => Promise<void>;
  history: Article[];
  getArticleData: (articleId: string) => Promise<Article | undefined>;
  generateQuiz: (params: {
    articleId: string;
    size?: string;
    difficulty?: string;
    userApiKey?: string;
    language?: string;
  }) => Promise<void>;
  quiz: Quiz[] | null;
  article: Article | null;
  deleteArticle: (articleId: string) => Promise<void>;
  updateArticle: (
    articleId: string,
    updatedData: Partial<Article>,
  ) => Promise<void>;
}

export const QuizgeekProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<Article[]>([]); //for getting articles for the user
  const [article, setArticle] = useState<Article | null>(null); //for getting individual article data
  const [quiz, setQuiz] = useState<Quiz[] | null>(null);
  const [active, setActive] = useState<OperationType>("ArticleSummary");
  const [loading, setLoading] = useState(false);

  //on first landing, articleSum will be active. by allowing function to change in between of these, setActive has to change accordingly.
  //export the change statement function.
  //what does the function does is: if active is "..." the viewPage has to change to component.
  //the control thingy has to be in drawer comp.

  const summarizeArticle = async (orgArticle: string, title: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ input: orgArticle, title: title }),
      });
      const data = await res.json();
      setLoading(false);
      return data;
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };
  const getArticlesHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/articles", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!res.ok) {
        console.log("history-data res failure [quizgeekprovider]");
        setLoading(false);
        return;
      }
      const data: Article[] = await res.json();
      setHistory(data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };
  const getArticleData = async (articleId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/articles/${articleId}`);
      if (!res.ok) {
        setArticle(null);
        setLoading(false);
        return;
      }
      const data: Article = await res.json();
      setArticle(data);
      setLoading(false);
      return data;
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const generateQuiz = async (params: {
    articleId: string;
    size?: string;
    difficulty?: string;
    userApiKey?: string;
    language?: string;
  }) => {
    if (!params.articleId) {
      console.error("no articleId provided");
      return;
    }
    const fetched = await getArticleData(params.articleId);
    if (!fetched) {
      console.error("generateQuiz: article not found");
      return;
    }

    const input = `${fetched.orgArticle}\n\nSummary:\n${fetched.sumArticle}`;
    
    try {
      setLoading(true);
      const res = await fetch(`/api/articles/${params.articleId}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          userApiKey: params.userApiKey,
          size: params.size,
          difficulty: params.difficulty,
          language: params.language,
        }),
      });

      if (!res.ok) {
        throw new Error("failed to generate quiz");
      }

      const data = await res.json();
      // API returns the quiz object directly
      setQuiz(data);
      setLoading(false);
    } catch (e) {
      console.error("generateQuiz error", e);
      setLoading(false);
    }
  };

  const deleteArticle = async (articleId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("failed to delete article");
      }
      await getArticlesHistory();
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const updateArticle = async (
    articleId: string,
    updatedData: Partial<Article>,
  ) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        throw new Error("failed to update article");
      }
      const updatedArticle = await res.json();
      if (article && article.id === articleId) {
        setArticle(updatedArticle);
      }
      await getArticlesHistory();
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  return (
    <QuizgeekContext.Provider
      value={{
        loading,
        setLoading,
        setActive,
        active,
        history,
        generateQuiz,
        getArticlesHistory,
        summarizeArticle,
        quiz,
        article,
        getArticleData,
        deleteArticle,
        updateArticle,
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
