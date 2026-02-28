"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type ScoreType = {
  balance: number;
  loadScore: () => Promise<void>;
  earnScore: () => Promise<void>;
  loseScore: () => Promise<void>;
};

const ScoreContext = createContext({} as ScoreType);

export const ScoreProvider = ({ children }: { children: ReactNode }) => {

    
  const [balance, setBalance] = useState(0);

  const loadScore = async(userId: string ) => {

  }

  const earnScore = async(userId: string) => {

  }

  const loseScore = async() => {

  }
  return <ScoreContext.Provider value={{}}>{children}</ScoreContext.Provider>;
};
