" use client";

import { SignIn, SignUp } from "@clerk/nextjs";

export default function AuthPage() {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <SignIn />
      </div>
    </>
  );
}
