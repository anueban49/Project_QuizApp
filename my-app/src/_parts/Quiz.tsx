"use client";
import { useState, useEffect } from "react";
import { useQuizgeek } from "@/providers/QuizgeekProvider";
import { useTheme } from "@/providers/ThemeProvider";
import type { Quiz } from "@/providers/QuizgeekProvider";
import { LoadingScreen } from "./LoadingScreen";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
type QuizzingProps = Quiz & {
  answered: boolean;
  correct: boolean;
  selected?: string;
};
type QuizResourceProps = {
  articleId?: string;
  savedQuiz?: Quiz[];
}
function shuffle(arr: Quiz[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[r]] = [arr[r], arr[i]]
  }
  return arr;
}
export function Quiz({ articleId, savedQuiz }: { articleId: string; savedQuiz?: Quiz[] | null }) {
  const { quiz, loading } = useQuizgeek();
  const [quizzing, setQuizzing] = useState<QuizzingProps[]>([]);
  const { theme } = useTheme();
  const [length, setLength] = useState<number>(0);
  const [steps, setSteps] = useState<number>(0);
  const [correct, setCorrect] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [steps]);

  useEffect(() => {
    const source = savedQuiz ?? quiz;
    if (!source || source.length === 0) {
      setQuizzing([]);
      setLength(0);
      setSteps(0);
      setSelected(null);
      return;
    }

    const shuffled = shuffle([...source]); // copy first, shuffle once
    const quizData = shuffled.map((q) => ({ ...q, answered: false, correct: false }));
    setQuizzing(quizData);
    setLength(quizData.length);
    setSteps(0);
    setSelected(null);
  }, [savedQuiz, quiz]);

  const currentQuestion = quizzing[steps] ?? null;
  const quizComplete = quizzing.length > 0 && steps >= quizzing.length;

  function check(label: string, option: string) {
    setSelected(label);
    if (label === option) {
      setCorrect((prev) => prev + 1);
    }
    setTimeout(() => {
      setSteps((prev) => prev + 1);
    }, 2000);
  }


  const isLoading = loading && (!quizzing || quizzing.length === 0);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div
          className={`mx-auto max-w-7xl px-10 flex flex-col w-full  h-full justify-center items-center p-10`}
        >
          {quizComplete ? (
            <div className="text-center">
              <h2 className="py-10 text-2xl font-bold">Quiz complete!</h2>
              <p>
                Score: {correct}/{length}
              </p>
            </div>
          ) : currentQuestion ? (
            <>
              <Button
                disabled={steps === 0}
                onClick={() => {
                  setSteps(steps - 1);

                }}><ChevronLeft /></Button>
              <h2 className="py-10">Question: {currentQuestion.question}</h2>
              <div className={`grid grid-cols-2 grid-rows-2 gap-5 w-full p-5 `}>
                {currentQuestion.options.map((q, index) => (
                  <div
                    className={`hover:cursor-pointer hover:shadow-slate-500 shadow-sm rounded-2xl`}
                    onClick={() => {
                      check(q.label, currentQuestion.answer);
                    }}
                    key={index}
                  >
                    {selected ? (
                      q.label === currentQuestion.answer ? (
                        <div
                          className={`flex gap-2 items-baseline p-2 rounded-2xl 
                          bg-green-300/50 inset-shadow-sm inset-shadow-slate-500/50
                          ${theme === "dark" ? "dark shadow-black color-white" : "light shadow-gray color-black"}`}
                        >
                          <p>{q.label}.</p>
                          <p>{q.text}</p>
                        </div>
                      ) : q.label === selected ? (
                        <div
                          className={`flex gap-2 items-baseline p-2 rounded-2xl 
                          bg-red-300/50 inset-shadow-sm inset-shadow-slate-500/50
                          ${theme === "dark" ? "dark shadow-black color-white" : "light shadow-gray color-black"}`}
                        >
                          <p>{q.label}.</p>
                          <p>{q.text}</p>
                        </div>
                      ) : (
                        <div
                          className={`flex gap-2 items-baseline p-2 rounded-2xl ${theme === "dark" ? "dark shadow-black color-white" : "light shadow-gray color-black"}`}
                        >
                          <p>{q.label}.</p>
                          <p>{q.text}</p>
                        </div>
                      )
                    ) : (
                      <div
                        className={`flex gap-2 items-baseline p-2 rounded-2xl ${theme === "dark" ? "dark shadow-black color-white" : "light shadow-gray color-black"}`}
                      >
                        <p>{q.label}.</p>
                        <p>{q.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div>
                {selected ? (
                  selected === currentQuestion.answer ? (
                    <h2 className="text-green-500 text-2xl font-bold">
                      Correct
                    </h2>
                  ) : (
                    <h2 className="text-red-500 text-2xl font-bold">Fail</h2>
                  )
                ) : (
                  <></>
                )}
              </div>
              <h3> Question {steps + 1}</h3>
              <h3>
                Correct: {correct}/{length}
              </h3>
            </>
          ) : (
            <div className="text-center">Loading quiz...</div>
          )}
        </div>
      )}
    </>
  );
}
