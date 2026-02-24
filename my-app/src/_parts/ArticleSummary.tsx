"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { useClerk } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { ReactEventHandler, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  BookIcon,
  File,
  FileTextIcon,
  LoaderIcon,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";

interface Conversation {
  id: string;
  timeStamp: Date;
  content: { orgArticle: string; sumArticle: string };
  title: string;
}
//user sends article -> orgArticletype, agents sends response -> sumarticle.

type Messages = {
  role: "user" | "agent";
  title: string;
  content: string;
};

export default function ArticleSummary() {
  const [firstchat, setFirstchat] = useState(false);
  const [inputValue, setInputValue] = useState<String | "">("");
  const [title, setTitle] = useState<String>("");
  const { theme } = useTheme();

  const [chat, setChat] = useState<Messages[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGenbtn, setShowgenbtn] = useState(false);

  useEffect(() => {
    if (!chat) {
      return;
    }
    localStorage.setItem("ConversationHistory", JSON.stringify(chat));
  }, [chat]);

  const BtnAppr = () => {
    return (
      <div
        className={`
        absolute bottom-5 right-5
        flex items-center overflow-hidden
        rounded-full transition-all duration-300 ease-in-out
        ${showGenbtn ? "w-32" : "w-10"}  
      `}
        onMouseEnter={() => setShowgenbtn(true)}
        onMouseLeave={() => setShowgenbtn(false)}
      >
        <Button
          className="w-full h-10 rounded-full flex items-center justify-center gap-2"
          disabled={inputValue === ""}
          onClick={() => {
            setFirstchat(true);
            handleGenerate();
          }}
        >
          <ArrowUp className="shrink-0" />

          {/* Text fades in and out */}
          <span
            className={`
            whitespace-nowrap transition-all duration-300
            ${showGenbtn ? "opacity-100 w-auto" : "opacity-0 w-0"}
          `}
          >
            Generate
          </span>
        </Button>
      </div>
    );
  };
  //user sends article, article is sent to database;
  //article has title, timestamp, content={orgArticle, summarized article.} and id.

  const handleGenerate = async () => {
    const input = inputValue.trim();
    const Title = title.trim();
    setChat((prev) => [
      ...prev,
      { role: "user", title: Title, content: input },
    ]);
    try {
      setLoading(true);
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ input: input }),
      });
      console.log(res);
      const data = await res.json();
      setChat((prev) => [
        ...prev,
        { role: "agent", title: Title, content: data.res },
      ]);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center  transition-colors px-10 py-20">
      <div className="flex flex-col gap-4 p-10 justify-center">
        <div className={`flex gap-2 items-center text-2xl font-bold `}>
          <Sparkles /> Article Quiz Generator
        </div>
        {firstchat ? (
          <>
            <div className="w-full flex gap-4 text-gray-500 font-semibold">
              <BookIcon />
              Summarized Content
              {title}
            </div>
            {chat.map((c, index) => (
              <>
                <div className="w-full text-sm" key={index}>
                  {c.role === "agent" && (
                    <>
                      <p>{c.content}</p>
                    </>
                  )}
                </div>
                <div className="" key={index + 10}>
                  {c.role === "user" && <>{c.content}</>}
                </div>
              </>
            ))}
          </>
        ) : (
          <>
            <p className="text-zinc-500">
              Paste your article below to generate a summarize and quiz
              question. Your articles will saved in the sidebar for future
              reference.
            </p>
            <div className="flex gap-2 font-semibold text-zinc-600">
              <FileTextIcon />
              Article Title
            </div>
            <input
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              className={`w-full border-none inset-shadow-sm ${theme == "dark" ? "inset-shadow-black dark" : "inset-shadow-gray-300"}`}
              placeholder="Write your article title"
            />
            <div className="flex gap-2 font-semibold text-zinc-600">
              <FileTextIcon />
              Article Content
            </div>
            <div className={`flex gap-2 w-full`}>
              <div className="realtiveContainer w-full h-full relative">
                <textarea
                  placeholder="Paste your article here or describe your idea"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setFirstchat(true);
                      handleGenerate();
                    }
                  }}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  className={`w-full aspect-5/1 no-scrollbar resize-none border-none inset-shadow-sm ${theme === "dark" ? "dark inset-shadow-black" : "light inset-shadow-gray-300"}`}
                ></textarea>
                <BtnAppr />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
