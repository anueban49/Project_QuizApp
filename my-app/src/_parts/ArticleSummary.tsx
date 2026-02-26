"use client";

import { useQuizgeek } from "@/providers/QuizgeekProvider";
import { ReactEventHandler, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";

import {
  ArrowUp,
  BookAlertIcon,
  BookIcon,
  File,
  FileTextIcon,
  LoaderIcon,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";

//user sends article -> orgArticletype, agents sends response -> sumarticle.

export default function ArticleSummary() {
  const [firstchat, setFirstchat] = useState(false);
  const [inputValue, setInputValue] = useState<String | "">("");
  const [title, setTitle] = useState<String>("");
  const { theme } = useTheme();

  const [conversation, setConversation] = useState<History[]>([]); //for history sidebar
  const [loading, setLoading] = useState(false);
  const [showGenbtn, setShowgenbtn] = useState(false);

  const { summarizeArticle, sumArticle } = useQuizgeek();

  //user sends a message -> database assigns id, -> which is autoincrement() -> returns the id, saves the title & content, returns back to db and saved there.
  //in order to obtain the id, frontend will have to send request to server which will ... req -> res -> id -> then ai generate, then after generate, backend saves the convo

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
    //for ai content extraction
    //but id generation request must also go within.
    setLoading(true);
    const input = inputValue.trim();
    summarizeArticle(input);
  };
  useEffect(() => {}, []);
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
            </div>
            <p>{sumArticle}</p>
            <div className="w-full flex gap-4 text-gray-500 font-semibold">
              <BookAlertIcon /> Summarized Content
            </div>

            <p className={`text-sm overflow-y-scroll aspect-9/1`}>
              {inputValue}
            </p>
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
