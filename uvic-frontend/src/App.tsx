import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import CourseSearchPage from "./pages/CourseSearchPage";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#020817",
      paper: "#0f172a",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
      disabled: "#475569",
    },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        body {
          background: #020817;
        }

        /* Subtle grid overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(125,211,252,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125,211,252,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        #root {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <CourseSearchPage />
    </ThemeProvider>
  );
}
