"use client";
import { useState, useEffect } from "react";
import { useQuizgeek } from "@/providers/QuizgeekProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function Quiz() {
  const { generateQuiz, quiz, article, getArticleData } = useQuizgeek();
  const { theme } = useTheme();
  const [loading, setloading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setloading(true);
    generateQuiz(article?.id as string);
    if (quiz) {
      setloading(false);
    }

    setloading(false);
  }, []);
  console.log(quiz)
  function check(label: string, option: string) {
    if (label === option) {
      alert("Correct Answer!");
    }
    alert("wrong asnwer");
  }
  return (
    <>
      <div
        className={`max-w-7xl px-10 flex flex-col w-full aspect-auto h-full justify-center items-center p-10`}
      >
        <Button size={"icon"} className={`self-start`} onClick={() => {router.push("/")}}>
          <ChevronLeft />
        </Button>

        {loading ? (
          <>
            <div className="flex flex-col w-full h-full justify-center items-center">
         
              <LoaderIcon className={`animate-spin duration-300`} />
            </div>
          </>
        ) : (
          <>

            <h2 className="py-10">Question: {quiz?.question}</h2>
            <div className={`grid grid-cols-2 grid-rows-2 gap-5 `}>
              {quiz?.options.map((q, index) => (
                <div
                  onClick={() => {
                    check(q.label, quiz.answer);
                  }}
                  className={`rounded-2xl p-4  text-xl shadow-sm ${theme === "dark" ? "dark shadow-black color-white" : "light shadow-gray color-black"} hover:duration-300 hover:scale-102 hover:font-bold`}
                  key={index}
                >
                  <div className={` flex gap-2 items-baseline`}>
                    <p
                      className={`w-10 aspect-square rounded-full p-1 border flex justify-center items-center  `}
                    >
                      {q.label}
                    </p>
                    {q.text}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
