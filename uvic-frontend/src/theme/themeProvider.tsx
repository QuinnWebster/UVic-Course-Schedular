import { ThemeProvider as EmotionProvider } from "@emotion/react";
import { darkTheme } from "./theme";
import type { ReactNode } from "react";

export default function AppThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <EmotionProvider theme={darkTheme}>{children}</EmotionProvider>;
}
