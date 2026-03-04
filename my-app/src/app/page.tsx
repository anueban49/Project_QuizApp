"use client";
import { Header } from "@/_parts/Header";

import { ContentSwitchPage } from "@/_parts/ContentSwitch";
import { useUser } from "@clerk/nextjs";
export default function Landing() {
  const { user } = useUser();
  return (
    <>
      <Header />

      <ContentSwitchPage id={user?.id as string} />
    </>
  );
}
