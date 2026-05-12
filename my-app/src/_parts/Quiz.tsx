"use client";
import { useState, useEffect } from "react";
import { useQuizgeek } from "@/providers/QuizgeekProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { LoaderIcon } from "lucide-react";
import type { Quiz } from "@/providers/QuizgeekProvider";
type QuizzingProps = Quiz & {
  answered: boolean;
  correct: boolean;
  selected?: string;
};
export function Quiz({ articleId }: { articleId: string }) {
  const { quiz, getArticleData } = useQuizgeek();
  const [quizzing, setQuizzing] = useState<QuizzingProps[] | null>(null);
  const { theme } = useTheme();
  const [loading, setloading] = useState(false);
  const [length, setLength] = useState<number>(0);
  const [steps, setSteps] = useState<number>(0);
  const [correct, setCorrect] = useState<number>(0);
  useEffect(() => {
    setloading(true);
    getArticleData(articleId).then(() => {
      setQuizzing(
        quiz?.map((q) => ({ ...q, answered: false, correct: false })) ?? [],
      );
      setLength(quiz?.length ?? 0);
      setloading(false);
    });
  }, []);
  function check(label: string, option: string) {
    if (label === option) {
      setCorrect(correct + 1);
      alert("Correct Answer!");
    } else {
      alert("Wrong answer");
    }
  }
  if (steps === length) {
    return (
      <div className="w-full h-8/12 flex flex-col gap-5 items-center justify-center">
        <h3>Finished!</h3>
        <h2>
          {correct}/{length} answered correctly
        </h2>
      </div>
    );
  }
  if (!articleId) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500">
        No Article Provided
      </div>
    );
  }
  return (
    <>
      <div
        className={`max-w-7xl px-10 flex flex-col w-full aspect-auto h-full justify-center items-center p-10`}
      >
        {loading || !quiz ? (
          <>
            <div className="flex flex-col w-full h-full justify-center items-center">
              <LoaderIcon className={`animate-spin duration-300`} />
            </div>
          </>
        ) : (
          <>
            {quizzing && (
              <>
                <h2 className="py-10">Question: {quizzing[steps].question}</h2>
                <div className={`grid grid-cols-2 grid-rows-2 gap-5 `}>
                  {quizzing[steps].options.map((q, index) => (
                    <div
                      onClick={() => {
                        check(q.label, quizzing[steps].answer);
                        setSteps(steps + 1);
                      }}
                      className={`rounded-2xl p-4  
                        text-xl shadow-sm 
                        ${theme === "dark" ? "dark shadow-black color-white" : "light shadow-gray color-black"} 
                        hover:duration-300 hover:scale-102 hover:font-bold
                        ${q.label === quizzing[steps].answer ? "border-green-500" : "border-red-500 animate-shake"}`}
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
          </>
        )}
      </div>
    </>
  );
}
