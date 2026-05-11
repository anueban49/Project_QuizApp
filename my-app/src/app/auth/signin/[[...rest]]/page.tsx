" use client";

import { SignIn } from "@clerk/nextjs";

export default function AuthPage() {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <SignIn
          appearance={{
            elements: {
              card: "bg-zinc-900 shadow-2xl rounded-2xl border border-zinc-800",
              headerTitle: "text-white font-bold text-2xl",
              headerSubtitle: "text-zinc-400",
              formFieldLabel: "text-zinc-300 text-sm",
              formFieldInput:
                "bg-zinc-800 border-zinc-700 text-white rounded-lg focus:ring-purple-500",
              formButtonPrimary:
                "bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium",
              footerActionLink: "text-purple-400 hover:text-purple-300",
              socialButtonsBlockButton:
                "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700",
            },
          }}
        />
      </div>
    </>
  );
}
