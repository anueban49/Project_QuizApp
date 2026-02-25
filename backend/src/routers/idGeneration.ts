import type { RequestHandler } from "express";
import { customAlphabet } from "nanoid";
import prisma from "../lib/prisma";
const a_id = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);
const q_id = customAlphabet("1234567890", 5);
export const articleIdGenerator: RequestHandler = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "id issue" });
  }
  try {
    let articleId = a_id();
    while (true) {
      const existingId = prisma.article.findUnique({
        where: { id: articleId },
      });
      if (!existingId) break;
      articleId = a_id();
    }
    return res.status(200).json({ articleId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const quizIdGenerator: RequestHandler = async (req, res) => {
  //from request, get the articleid.
  //if article id exists, assign quizzes id for that article.
  const receivedId = req.body;
  if (!receivedId) {
    return res.status(400).json({ message: "ID issue" });
  }
  try {
    const quizzesId = q_id();
    const articleId = prisma.article.findUnique({ where: { id: receivedId } });
    if (!articleId) {
      return res.status(404).json({ message: "article id not found" });
    }
    return res.status(200).json({ quizzesId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "iwuebforb" });
  }
};
