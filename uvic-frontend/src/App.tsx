import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import CourseSearchPage from "./pages/CourseSearchPage";
import ScheduleBuilder from "./pages/ScheduleBuilder";
import { darkTheme } from "./theme/theme";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <ThemeProvider theme={muiTheme}>
      <EmotionThemeProvider theme={darkTheme}>
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
      </EmotionThemeProvider>
    </ThemeProvider>
  );
}
