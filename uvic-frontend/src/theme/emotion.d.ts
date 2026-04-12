import "@emotion/react";
import { darkTheme } from "./theme";

type AppTheme = typeof darkTheme;

declare module "@emotion/react" {
  export type Theme = AppTheme;
}
