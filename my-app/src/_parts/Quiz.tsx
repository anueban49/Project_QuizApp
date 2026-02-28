"use client";
import { useState, useEffect } from "react";
import { useQuizgeek } from "@/providers/QuizgeekProvider";
import { useTheme } from "@/providers/ThemeProvider";

export function Quiz() {
  const { generateQuiz, quiz, article, getArticleData } = useQuizgeek();
  const { theme } = useTheme();
  useEffect(() => {
    generateQuiz(article?.id as string);
    if (quiz) {
      console.log("quiz", quiz);
    }
  }, []);
  function check(label: string, option: string) {
    if (label === option) {
      alert("Correct Answer!");
    }
    alert("wrong asnwer");
  }
  return (
    <div className={`max-w-7xl px-10`}>
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
    </div>
  );
}
