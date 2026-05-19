"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function EnsureDbUserRegistered() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    const ensureUser = async () => {
      try {
        await fetch("/api/auth/ensure-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Failed to register Clerk user in DB", error);
      }
    };

    ensureUser();
  }, [isSignedIn]);

  return null;
}
