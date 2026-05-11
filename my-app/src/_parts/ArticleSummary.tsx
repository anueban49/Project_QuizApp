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
  const [sumArticle, setSumarticle] = useState("");
  const [loading, setLoading] = useState(false);

  const { summarizeArticle } = useQuizgeek();

  //user sends a message -> database assigns id, -> which is autoincrement() -> returns the id, saves the title & content, returns back to db and saved there.
  //in order to obtain the id, frontend will have to send request to server which will ... req -> res -> id -> then ai generate, then after generate, backend saves the convo

  const handleGenerate = async () => {
    //for ai content extraction
    //but id generation request must also go within.
    setLoading(true);
    const input = inputValue.trim();
    const Title = title.trim();
    const res = await summarizeArticle(input, Title);
    console.log("fulltext", res);
    setSumarticle(res.res);
  };
  useEffect(() => {}, []);
  return (
    <div className="w-full h-full flex flex-col items-center  transition-colors px-10 py-20">
      <div className="flex flex-col gap-4 p-10 justify-center">
        <div
          className={`flex gap-2 items-center text-2xl font-bold ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}
        >
          <Sparkles /> Article Quiz Generator
        </div>
        {firstchat ? (
          <>
            <div
              className={`w-full flex gap-4 ${theme === "dark" ? "text-slate-400" : "text-slate-700"} font-semibold`}
            >
              <BookIcon />
              Summarized Content
            </div>
            <p>{sumArticle}</p>
            <div
              className={`w-full flex gap-4 ${theme === "dark" ? "text-slate-400" : "text-slate-700"} font-semibold`}
            >
              <BookAlertIcon /> Original Article
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
              className={`w-full border-none inset-shadow-sm ${theme == "dark" ? "inset-shadow-black dark" : "inset-shadow-gray-300 bg-white"}`}
              placeholder="Write your article title"
            />
            <div className="flex gap-2 font-semibold text-zinc-600">
              <FileTextIcon />
              Article Content
            </div>
            <div className={`flex gap-2 w-full`}>
              <div className=" Container w-full h-full relative">
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
                  className={`w-full aspect-5/1 no-scrollbar resize-none border-none inset-shadow-sm ${theme === "dark" ? "dark inset-shadow-black" : "bg-white inset-shadow-gray-300"}`}
                ></textarea>
                <Button
                  variant={"ghost"}
                  size={"icon-lg"}
                  className={`absolute bottom-10 right-2 rounded-full ${theme === "dark" ? "bg-slate-800" : "bg-slate-100 color-black text-black"} absolute right-2 bottom-2`}
                  onClick={() => {
                    setFirstchat(true);
                    handleGenerate();
                  }}
                  disabled={
                    loading || inputValue.length === 0 || title.length === 0
                  }
                >
                  <ArrowUp
                    className={`${theme === "dark" ? "text-black" : "color-black"}}`}
                  />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
