"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Quiz = {
  question: string;
  option: string[]
  answer: string[]
}

export const QuizSection = () => {
  const [article, setArticle] = useState<String>("");
  const [quiz, setQuiz] = useState<Quiz[]>([])

  const param = useParams();//articleId need to be passed.


  return (<></>)
};

//the homepage has two functions:
//on first chat, it has to show empty fields input.
//on article generation, it shows generated comp as well as quiz generate btn.

//this kinda applies to sidebar comp.