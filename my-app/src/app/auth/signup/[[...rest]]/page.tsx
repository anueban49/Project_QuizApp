"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        {" "}
        <SignUp />
      </div>
    </>
  );
}
