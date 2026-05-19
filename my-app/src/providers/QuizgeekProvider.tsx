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

type NormalizedQuizOption = { label: string; text: string };

type NormalizedQuiz = {
  question: string;
  options: NormalizedQuizOption[];
  answer: string;
};

const normalizeQuizOptions = (
  options: any,
): NormalizedQuizOption[] | null => {
  if (!Array.isArray(options)) return null;
  return options
    .map((option: any, index: number) => {
      if (typeof option === "string") {
        return { label: String.fromCharCode(65 + index), text: option.trim() };
      }
      if (typeof option === "object" && option !== null) {
        const label = typeof option.label === "string" ? option.label.trim().toUpperCase() : String.fromCharCode(65 + index);
        const text = typeof option.text === "string" ? option.text.trim() : "";
        if (!text) return null;
        return { label, text };
      }
      return null;
    })
    .filter((item): item is NormalizedQuizOption => Boolean(item));
};

const normalizeQuizData = (raw: any): NormalizedQuiz[] | null => {
  if (!Array.isArray(raw)) return null;

  const normalized = raw
    .map((item: any) => {
      if (typeof item !== "object" || item === null) return null;

      const question = typeof item.question === "string" ? item.question.trim() : "";
      const options = normalizeQuizOptions(item.options);
      if (!question || !options || options.length === 0) return null;

      let answer = typeof item.answer === "string" ? item.answer.trim() : "";
      if (!answer) return null;

      const matched = options.find(
        (opt) =>
          opt.label.toUpperCase() === answer.toUpperCase() ||
          opt.text.toLowerCase() === answer.toLowerCase() ||
          opt.text.toLowerCase() === answer.replace(/^"|"$/g, "").toLowerCase(),
      );
      if (matched) {
        answer = matched.label;
      }

      if (!options.some((opt) => opt.label.toUpperCase() === answer.toUpperCase())) return null;

      return {
        question,
        options,
        answer: answer.toUpperCase(),
      };
    })
    .filter((item): item is NormalizedQuiz => Boolean(item));

  return normalized.length > 0 ? normalized : null;
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
  getSavedQuiz: (articleId: string) => Promise<Quiz[] | null>;
  saveQuiz: (articleId: string, quizData?: Quiz[]) => Promise<void>;
}

export const QuizgeekProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<Article[]>([]); //for getting articles for the user
  const [article, setArticle] = useState<Article | null>(null); //for getting individual article data
  const [quiz, setQuiz] = useState<Quiz[] | null>(null);
  const [active, setActive] = useState<OperationType>("ArticleSummary");
  const [loading, setLoading] = useState(false);


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
      console.log("on frontend:", data.fulltext);
      return data.fulltext;
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
        const errorBody = await res.json().catch(() => null);
        throw new Error(
          errorBody?.error ? String(errorBody.error) : "failed to generate quiz",
        );
      }

      const rawData = await res.json();
      const normalizedData = normalizeQuizData(rawData);
      if (!normalizedData) {
        throw new Error("Invalid quiz format returned from API");
      }
      setQuiz(normalizedData);
      setLoading(false);
    } catch (e) {
      console.error("generateQuiz error", e);
      setLoading(false);
    }
  };

  const getSavedQuiz = async (articleId: string) => {
    if (!articleId) {
      console.error("getSavedQuiz: articleId is required");
      return null;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/articles/${articleId}/quizzes`);
      if (!res.ok) {
        console.error("getSavedQuiz failed", res.statusText);
        setQuiz(null);
        setLoading(false);
        return null;
      }
      const data = await res.json();
      const normalizedData = normalizeQuizData(data);
      setQuiz(normalizedData);
      setLoading(false);
      return normalizedData;
    } catch (e) {
      console.error("getSavedQuiz error", e);
      setQuiz(null);
      setLoading(false);
      return null;
    }
  };

  const saveQuiz = async (articleId: string, quizData?: Quiz[]) => {
    if (!articleId) {
      console.error("saveQuiz: articleId is required");
      return;
    }
    const payload = quizData ?? quiz;
    if (!payload || payload.length === 0) {
      console.error("saveQuiz: no quiz data available to save");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/articles/${articleId}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quiz: payload }),
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(
          errorBody?.error ? String(errorBody.error) : "failed to save quiz",
        );
      }
      const savedQuiz = await res.json();
      const normalizedData = normalizeQuizData(savedQuiz);
      if (normalizedData) {
        setQuiz(normalizedData);
      }
      setLoading(false);
    } catch (e) {
      console.error("saveQuiz error", e);
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
        getSavedQuiz,
        saveQuiz,
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
