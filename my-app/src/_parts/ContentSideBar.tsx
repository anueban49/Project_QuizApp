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
import { useEffect, useState } from "react";

export const ContentSideBar = () => {
  const { theme } = useTheme();
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const history = localStorage.getItem("ConversationHistory");
    if (!history) {
      return;
    }
    setHistory(JSON.parse(history));
  }, []);
  const getData = async () => {
    try {
      const res = await fetch("/mock-data");
      if (res) {console.log("mockdata success")}

    } catch (e) {
      console.log(e);
    }
  };
  getData();
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
        {history}
        {history.map((h, index) => (
          <div className="p-2 overflow-hidden">{h}</div>
        ))}
      </DrawerContent>
    </Drawer>
  );
};
