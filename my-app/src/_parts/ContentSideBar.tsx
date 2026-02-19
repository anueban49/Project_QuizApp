"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PanelLeft, PanelRight } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

export const ContentSideBar = () => {
  const { theme } = useTheme();
  return (
    <Drawer direction="left">
      <DrawerTrigger>
        <Button>
          <PanelRight />
        </Button>
      </DrawerTrigger>
      <DrawerClose>
        <PanelLeft />
      </DrawerClose>
      <DrawerContent></DrawerContent>
    </Drawer>
  );
};
