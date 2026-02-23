"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
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
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button size="icon" className="rounded-full">
          <PanelRight />
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
          <h3>History</h3>
        </div>
        {history.map((h, index) => (
          <div className="p-2 overflow-hidden">{h}</div>
        ))}
      </DrawerContent>
    </Drawer>
  );
};
