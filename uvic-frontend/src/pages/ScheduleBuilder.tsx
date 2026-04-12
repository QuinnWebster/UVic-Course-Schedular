import { useState } from "react";
import { Alert, Box, Container, Typography } from "@mui/material";
import CourseSelector from "../components/CourseSelector";
import CombinationList from "../components/CombinationList";
import type { Combination, LoadedCourse } from "../types/schedule";
import { generateCombinations } from "../utils/conflictChecker";

export default function ScheduleBuilder() {
  const [combinations, setCombinations] = useState<Combination[] | null>(null);
  const [courseLabels, setCourseLabels] = useState<string[]>([]);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);

  const handleResults = (loaded: LoadedCourse[]) => {
    const errors = loaded
      .filter((l) => l.error || l.sections.length === 0)
      .map(
        (l) =>
          `${l.input.subject} ${l.input.courseNumber}: ${l.error ?? "no sections found"}`,
      );

    setLoadErrors(errors);

    const valid = loaded.filter((l) => !l.error && l.sections.length > 0);
    if (valid.length < 2) {
      setCombinations([]);
      setCourseLabels([]);
      return;
    }

    const labels = valid.map(
      (l) => `${l.input.subject} ${l.input.courseNumber}`,
    );
    const sectionGroups = valid.map((l) => l.sections);
    const combos = generateCombinations(sectionGroups);

    setCourseLabels(labels);
    setCombinations(combos);
  };

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 6, sm: 10 } }}>
      <Container maxWidth="lg">
        {/* Hero */}
        <Box>
          <Box
            sx={{
              display: "inline-block",
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              letterSpacing: 3,
              color: "#7dd3fc",
              textTransform: "uppercase",
              mb: 2,
              px: 2,
              py: 0.5,
              border: "1px solid rgba(125,211,252,0.2)",
              borderRadius: 20,
            }}
          >
            University of Victoria
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: { xs: 38, sm: 56 },
              lineHeight: 1.1,
              color: "text.primary",
              mb: 1.5,
            }}
          >
            Schedule{" "}
            <Box
              component="span"
              sx={{ fontStyle: "italic", color: "#7dd3fc" }}
            >
              Builder
            </Box>
          </Typography>
          <Typography
            variant="body1"
            color="text.disabled"
            sx={{ maxWidth: 420, mx: "auto" }}
          >
            Add your courses and we'll find every conflict-free combination,
            visualized on a weekly calendar.
          </Typography>
        </Box>

        {/* Selector */}
        <Box>
          <CourseSelector onResults={handleResults} />
        </Box>

        {/* Load errors */}
        {loadErrors.map((e) => (
          <Alert
            key={e}
            severity="warning"
            sx={{
              mb: 2,
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
              color: "#fcd34d",
              "& .MuiAlert-icon": { color: "#f59e0b" },
            }}
          >
            {e}
          </Alert>
        ))}

        {/* Results */}
        {combinations !== null && (
          <CombinationList
            combinations={combinations}
            courseLabels={courseLabels}
          />
        )}
      </Container>
    </Box>
  );
}
