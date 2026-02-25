"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Quiz = {
    sourceArticle: string,
    options: string[]
}

export const QuizSection = () => {
  const [article, setArticle] = useState<String>("");

  const param = useParams();//articleId need to be passed.

  useEffect(() => {}, []);
  const generateQuiz = async () => {
    try {
        const quizOptions = await fetch("/", )
    } catch (e) {
      console.error(e);
    }
  };
  return (<></>)
};

//the homepage has two functions:
//on first chat, it has to show empty fields input.
//on article generation, it shows generated comp as well as quiz generate btn.

//this kinda applies to sidebar comp.