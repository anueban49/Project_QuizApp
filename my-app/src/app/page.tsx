"use client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
export default function Page() {
  const [firstchat, setFirstchat] = useState(false);
  const [inputValue, setInputValue] = useState<String | "">("");
  const { theme } = useTheme();
  const { user } = useClerk();

  const handleGenerate = async () => {
    const input = inputValue.trim();
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ input: input }),
      });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-center transition-colors">
        {firstchat ? (
          <></>
        ) : (
          <>
            <Card
              className={`opacity-40 w-2/3 aspect-5/1 flex flex-col p-10 items-center border-none ${theme === "dark" ? "bg-zinc-900" : ""}`}
            >
              <h2>Hello, {user?.firstName}</h2>
              <div className={`flex gap-2 w-full`}>
                <textarea
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  className={`w-full aspect-13/1 text-2xl no-scrollbar resize-none border-none inset-shadow-sm ${theme === "dark" ? "dark inset-shadow-black" : "light inset-shadow-gray-300"}`}
                ></textarea>
                <Button
                  disabled={inputValue === ""}
                  onClick={() => {
                    setFirstchat(true);
                    handleGenerate();
                  }}
                >
                  <ArrowUp />
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
