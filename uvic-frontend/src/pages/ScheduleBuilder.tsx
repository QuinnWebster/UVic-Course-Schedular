import { useState } from "react";
import { Alert, Box, Typography } from "@mui/material";
import CourseSelector from "../components/CourseSelector";
import CombinationList from "../components/CombinationList";
import ScheduleFiltersPanel from "../components/ScheduleFiltersPanel";
import type {
  Combination,
  LoadedCourse,
  ScheduleFilters,
} from "../types/schedule";
import { generateCombinations } from "../utils/conflictChecker";

export default function ScheduleBuilder() {
  const [combinations, setCombinations] = useState<Combination[] | null>(null);
  const [courseLabels, setCourseLabels] = useState<string[]>([]);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);
  const [filters, setFilters] = useState<ScheduleFilters>({});

  const handleResults = (loaded: LoadedCourse[]) => {
    const errors = loaded
      .filter((l) => l.error || l.bundles.length === 0)
      .map(
        (l) =>
          `${l.input.subject} ${l.input.courseNumber}: ${
            l.error ?? "no valid lecture/lab combinations found"
          }`,
      );

    setLoadErrors(errors);

    const valid = loaded.filter((l) => !l.error && l.bundles.length > 0);

    if (valid.length < 1) {
      setCombinations([]);
      setCourseLabels([]);
      return;
    }

    const labels = valid.map(
      (l) => `${l.input.subject} ${l.input.courseNumber}`,
    );

    const sectionGroups = valid.map((l) => l.bundles);

    const combos = generateCombinations(sectionGroups, filters);

    setCourseLabels(labels);
    setCombinations(combos);
  };

  return (
    <Box sx={{ minHeight: "100vh", width: "100%" }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 1,
            fontWeight: 500,
          }}
        >
          University of Victoria
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 34, sm: 48 },
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "text.primary",
            mb: 1,
          }}
        >
          Schedule Builder
        </Typography>

        <Typography
          sx={{
            fontSize: 16,
            color: "text.secondary",
            maxWidth: 420,
            mx: "auto",
            lineHeight: 1.5,
          }}
        >
          Add your courses and we’ll generate conflict-free schedules in a
          simple weekly view.
        </Typography>
      </Box>

      {/* Selector */}
      <Box>
        <CourseSelector onResults={handleResults} />
      </Box>

      <ScheduleFiltersPanel filters={filters} setFilters={setFilters} />

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
    </Box>
  );
}
