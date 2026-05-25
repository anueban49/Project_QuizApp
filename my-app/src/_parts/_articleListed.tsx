"use client";

import { Article } from "@/providers/QuizgeekProvider";
import { useEffect, useState } from "react";
type ListContentProps = {
  items: Article[];
  activeId?: string;
  onSelect: (item: Article) => void;
};
export const ListContent = ({
  items,
  activeId,
  onSelect,
}: ListContentProps) => {
  const [active, setActive] = useState<any>()
  return (
    items && (
      <div className={`flex flex-col gap-2 w-full h-300 `}>
        {items.map((h) => (
          <div
            onClick={() => {
              onSelect(h);
              setActive(h)
            }}
            key={h.id}
            className={`p-2 rounded  flex flex-col gap ${active === h && "inset-shadow-sm inset-shadow-slate-500/50"} `}
          >
            <h4 className="font-medium">{h.title}</h4>
            <p className="text-sm">
              {new Date(h.updatedAt).toLocaleDateString() as string}
            </p>
          </div>
        ))}
      </div>
    )
  );
};
