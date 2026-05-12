"use client";
import { useState, useEffect } from "react";
import { useQuizgeek } from "@/providers/QuizgeekProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { LoaderIcon } from "lucide-react";
import type { Quiz } from "@/providers/QuizgeekProvider";
import { LoadingScreen } from "./LoadingScreen";
type QuizzingProps = Quiz & {
  answered: boolean;
  correct: boolean;
  selected?: string;
};
export function Quiz({ articleId }: { articleId: string }) {
  const { quiz, getArticleData } = useQuizgeek();
  const [quizzing, setQuizzing] = useState<QuizzingProps[]>([]);
  const { theme } = useTheme();
  const [loading, setloading] = useState(false);
  const [length, setLength] = useState<number>(0);
  const [steps, setSteps] = useState<number>(0);
  const [correct, setCorrect] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    setSelected(null);
  }, [steps]);

  useEffect(() => {
    setloading(true);
    getArticleData(articleId);
  }, [articleId]);

  useEffect(() => {
    if (quiz && quiz.length > 0) {
      const quizData = quiz.map((q) => ({ ...q, answered: false, correct: false }));
      setQuizzing(quizData);
      setLength(quizData.length);
      setloading(false);
    }
  }, [quiz]);

  const currentQuestion = quizzing[steps] ?? null;
  const quizComplete = quizzing.length > 0 && steps >= quizzing.length;

  function check(label: string, option: string) {
    setSelected(label);
    if (label === option) {
      setCorrect((prev) => prev + 1);
    }
    setTimeout(() => {
      setSteps((prev) => prev + 1);
    }, 1000);

    console.log(correct);
    console.log(steps);
  }
  // if (steps === length) {
  //   return (
  //     <div className="w-full h-8/12 flex flex-col gap-5 items-center justify-center">
  //       <h3>Finished!</h3>
  //       <h2>
  //         {correct}/{length} answered correctly
  //       </h2>
  //     </div>
  //   );
  // }

  return (
    <>
      {loading ? (
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
              <h2 className="py-10">Question: {currentQuestion.question}</h2>
              <div className={`grid grid-cols-2 grid-rows-2 gap-5 `}>
                {currentQuestion.options.map((q, index) => (
                  <div
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
