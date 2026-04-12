import { useState } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import CourseSearchPage from "./pages/CourseSearchPage";
import ScheduleBuilder from "./pages/ScheduleBuilder";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#020817", paper: "#0f172a" },
    text: { primary: "#f1f5f9", secondary: "#94a3b8", disabled: "#475569" },
  },
  typography: { fontFamily: "'DM Sans', sans-serif" },
  components: {
    MuiCard: { defaultProps: { elevation: 0 } },
    MuiChip: { styleOverrides: { root: { borderRadius: 8 } } },
  },
});

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        body { background: #020817; }
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
        #root { position: relative; z-index: 1; }
      `}</style>

      {/* Nav */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(2,8,23,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              color: "text.disabled",
              minHeight: 52,
              px: 3,
            },
            "& .Mui-selected": { color: "#7dd3fc !important" },
            "& .MuiTabs-indicator": { backgroundColor: "#7dd3fc" },
          }}
        >
          <Tab label="Course Search" />
          <Tab label="Schedule Builder" />
        </Tabs>
      </Box>

      {tab === 0 && <CourseSearchPage />}
      {tab === 1 && <ScheduleBuilder />}
    </ThemeProvider>
  );
}
