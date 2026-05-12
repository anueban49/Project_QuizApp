"use client";
import { Button } from "@/components/ui/button";
import { Article } from "@/providers/QuizgeekProvider";
import { Trash, Pen } from "lucide-react";
import { useState } from "react";
import { useQuizgeek } from "@/providers/QuizgeekProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { LoadingScreen } from "./LoadingScreen";
interface NotebookProp {
  prop: Article;
  operationable: boolean;
}
export const NoteBook = ({ prop, operationable }: NotebookProp) => {
  const [mode, setMode] = useState<"edit" | "read">("read");
  const [resummarize, setResumarize] = useState(false);
  const [form, setForm] = useState<Article>(prop as Article);
  const { deleteArticle, updateArticle, loading, summarizeArticle } =
    useQuizgeek();
  const { theme } = useTheme();
  const handleSubmit = () => {
    updateArticle(prop.id, form);
    setMode("read");
  };

  const handleCancel = () => {
    setForm(prop);
    setMode("read");
  };
  if (loading) {
    return <LoadingScreen />;
  }
  if (mode === "edit") {
    return (
      <div className="p-5 rounded w-full flex flex-col gap-3 border">
        <h2 className="font-semibold">Editing article</h2>

        <label className="flex flex-col gap-1 text-sm">
          Title
          <input
            name="title"
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
            }}
            className="border rounded px-2 py-1"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Original
          <textarea
            name="orgArticle"
            value={form.orgArticle}
            onChange={(e) => {
              setForm({ ...form, orgArticle: e.target.value });
            }}
            rows={4}
            className={`border rounded px-2 py-1 resize-none no-scrollbar aspect-3/1 ${theme === "dark" ? "dark" : "light"}`}
          />
        </label>
        {resummarize && (
          <h4 className="animate-pulse duration-300">Please wait... </h4>
        )}
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSubmit} disabled={resummarize}>
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            disabled={resummarize}
          >
            Cancel
          </Button>
          {prop !== form && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setResumarize(true);
                summarizeArticle(form.orgArticle, form.title).then((res) => {
                  setForm({ ...form, sumArticle: res.res });
                  setResumarize(false);
                });
              }}
              disabled={resummarize}
            >
              Re-Summarize
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded w-full h-full flex flex-col gap-2 relative">
      {operationable === true && (
        <div className="absolute top-10 right-10 ">
          <Button
            className="m-1"
            size={"icon"}
            variant={"ghost"}
            onClick={() => {
              deleteArticle(prop.id as string);
            }}
          >
            <Trash />
          </Button>
          <Button
            className="m-1"
            size={"icon"}
            variant={"ghost"}
            onClick={() => {
              setMode("edit");
            }}
          >
            <Pen />
          </Button>
        </div>
      )}
      {prop ? (
        <>
          <h1>{prop?.title}</h1>
          <div>
            <h3>Original:</h3> <p>{prop?.orgArticle}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3>Summarized:</h3>
            <p>{prop?.sumArticle}</p>
          </div>
        </>
      ) : (
        <>
          <p className="text-slate-500">
            Select or chooose and article to view
          </p>
        </>
      )}
    </div>
  );
};
