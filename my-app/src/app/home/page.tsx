"use client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { useClerk } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { ArrowUp, LoaderIcon } from "lucide-react";
import { useEffect } from "react";

interface Conversation {
  timeStamp: Date;
  messages: Messages[];
}
type Messages = {
  role: "user" | "agent";
  content: string;
};

export default function Page() {
  const [firstchat, setFirstchat] = useState(false);
  const [inputValue, setInputValue] = useState<String | "">("");
  const { theme } = useTheme();
  const { user } = useClerk();
  const [chat, setChat] = useState<Messages[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!chat) {
      return;
    }
    localStorage.setItem("ConversationHistory", JSON.stringify(chat));
  }, [chat]);
  const handleGenerate = async () => {
    const input = inputValue.trim();
    setChat((prev) => [...prev, { role: "user", content: input }]);
    try {
      setLoading(true);
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ input: input }),
      });
      console.log(res);
      const data = await res.json();
      setChat((prev) => [...prev, { role: "agent", content: data.res }]);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-center transition-colors px-10">
        <>
          {firstchat ? (
            <div className="flex flex-col gap-5">
              {chat.map((e, index) => (
                <>
                  {loading ? (
                    <>
                      {e.role === "user" ? (
                        <>
                          <Card
                            className={`self-end max-w-[80%] bg-gray-300 ${loading && "animate-pulse"}`}
                            key={index}
                          >
                            <CardContent>{e.content}</CardContent>
                          </Card>
                        </>
                      ) : (
                        <>
                          <Card className="p-0 w-10 aspect-square flex justify-center items-center self-start">
                            <LoaderIcon className="animate-spin" />
                          </Card>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Card
                        className={`${e.role === "user" ? "justify-end bg-gray-300" : "self-start bg-gray-500"}`}
                        key={index}
                      >
                        <CardContent>{e.content}</CardContent>
                      </Card>
                    </>
                  )}
                </>
              ))}
              <div className="w-full flex gap-5">
                <Input></Input>
                <Button size={"icon"}>
                  <ArrowUp />
                </Button>{" "}
              </div>
            </div>
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
        </>
      </div>
    </>
  );
}
