import { colors } from "./colors";

export const lightTheme = {
  mode: "light",
  bg: {
    primary: "#ffffff",
    secondary: colors.neutral[100],
  },
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    disabled: colors.neutral[400],
  },
  border: {
    subtle: "rgba(0,0,0,0.08)",
  },
  card: {
    default: "#ffffff",
    hover: colors.neutral[100],
    selected: "rgba(125,211,252,0.08)",
    border: "rgba(0,0,0,0.08)",
    borderSelected: "rgba(125,211,252,0.4)",
  },
};

export const darkTheme = {
  mode: "dark",
  bg: {
    primary: colors.neutral[900],
    secondary: "rgba(15,23,42,0.7)",
  },
  text: {
    primary: "#ffffff",
    secondary: colors.neutral[400],
    disabled: colors.neutral[500],
  },
  border: {
    subtle: "rgba(255,255,255,0.07)",
  },
  card: {
    default: "rgba(15,23,42,0.7)",
    hover: colors.neutral[800],
    selected: "rgba(125,211,252,0.05)",
    border: "rgba(255,255,255,0.07)",
    borderSelected: "rgba(125,211,252,0.25)",
  },
};
