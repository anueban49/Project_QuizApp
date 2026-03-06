"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PanelLeft, PanelRight } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { ReactNode, useEffect, useState } from "react";
import { useQuizgeek } from "@/providers/QuizgeekProvider";
import { Article } from "@/prisma/generated/client";
import { useUser } from "@clerk/nextjs";

const DisplayHistory = ({ props }: { props: Article[] }) => {
  const { theme } = useTheme();
  const { active, setActive, getArticleData } = useQuizgeek();
  const { user } = useUser();
  useEffect(() => {
    getArticleData(user?.id as string);
  }, []);
  return (
    <>
      <div className={`gap-4 flex flex-col-reverse`}>
        {props.map((prop) => (
          <div
            key={prop.id}
            onClick={() => {
              setActive("ArticlesArchive");
              getArticleData(prop.id);
            }}
            className={`p-4 rounded-2xl shadow-sm ${theme === "dark" ? "dark shadow-black" : "light shadow-gray-300"}`}
          >
            <h4 className="font-bold">{prop.title}</h4>
          </div>
        ))}
      </div>
    </>
  );
};
export const ContentSideBar = () => {
  const { theme } = useTheme();
  const { history, getArticlesHistory } = useQuizgeek();

  useEffect(() => {
    getArticlesHistory();
  }, []);

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className={`rounded-full shadow-md ${theme === "dark" ? "bg-zinc-800" : "bg-gray-100 color-black"}`}
        >
          <PanelRight className={`${theme === "dark" ? "" : "text-black"}`} />
        </Button>
      </DrawerTrigger>

      <DrawerContent
        suppressHydrationWarning
        className={`${theme === "dark" ? "dark" : ""} p-5 flex flex-col gap-2`}
      >
        <div className="flex gap-2">
          <DrawerClose asChild>
            <Button size={"icon"} className="rounded-full">
              <PanelLeft />
            </Button>
          </DrawerClose>
          <DrawerTitle>History</DrawerTitle>
        </div>
        {history.length !== 0 ? (
          <DisplayHistory props={history} />
        ) : (
          <>No conversation has been found yet</>
        )}
      </DrawerContent>
    </Drawer>
  );
};
