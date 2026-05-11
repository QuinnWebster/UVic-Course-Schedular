import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import type { CourseInput, LoadedCourse } from "../types/schedule";
import { fetchCourses } from "../api/courses";
import { buildCourseBundles } from "../utils/conflictChecker";

const SUBJECTS = [
  "CSC",
  "SENG",
  "ECE",
  "MATH",
  "STAT",
  "PHYS",
  "CHEM",
  "BIOL",
  "ENGR",
  "ECON",
  "PSYC",
  "PHIL",
  "ENGL",
  "HIST",
  "POLI",
  "GEOG",
  "ANTH",
  "SOCI",
  "NURS",
  "EDUC",
  "LAWS",
  "BUSI",
  "HINF",
  "ADMN",
];

const TERM = "202605";

interface CourseSelectorProps {
  onResults: (loaded: LoadedCourse[]) => void;
}

let inputIdCounter = 0;
function newId() {
  return `course-${inputIdCounter++}`;
}

export default function CourseSelector({ onResults }: CourseSelectorProps) {
  const [inputs, setInputs] = useState<CourseInput[]>([
    { id: newId(), subject: "CSC", courseNumber: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addRow = () => {
    setInputs((prev) => [
      ...prev,
      { id: newId(), subject: "CSC", courseNumber: "" },
    ]);
  };

  const removeRow = (id: string) => {
    setInputs((prev) => prev.filter((i) => i.id !== id));
  };

  const updateRow = (id: string, field: keyof CourseInput, value: string) => {
    setInputs((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    );
  };
  const handleSearch = async () => {
    const valid = inputs.filter((i) => i.courseNumber.trim());

    if (valid.length < 1) {
      setError("Add at least one course.");
      return;
    }
    // if (valid.length < 2) {
    //   setError("Add at least 2 courses to build a schedule.");
    //   return;
    // }

    setError("");
    setLoading(true);

    const results = await Promise.all(
      valid.map(async (input): Promise<LoadedCourse> => {
        try {
          const res = await fetchCourses({
            subject: input.subject,
            courseNumber: input.courseNumber.trim(),
            term: TERM,
          });

          const bundles = buildCourseBundles(res.sections);

          console.log("The bundles for", input, "are", bundles);

          return {
            input,
            bundles,
          };
        } catch (e) {
          return {
            input,
            bundles: [],
            error: e instanceof Error ? e.message : "Failed",
          };
        }
      }),
    );

    setLoading(false);
    onResults(results);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        p: { xs: 3, sm: 4 },
        maxWidth: 520,
        mx: "auto",
      }}
    >
      {/* Term */}
      <Typography
        sx={{
          fontSize: 14,
          color: "text.secondary",
          mb: 2,
          fontWeight: 500,
        }}
      >
        Summer 2026 (May – Aug)
      </Typography>

      {/* Section label */}
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: "text.primary",
          mb: 1.5,
        }}
      >
        Courses
      </Typography>

      <Stack spacing={1.5}>
        {inputs.map((input, idx) => (
          <Stack key={input.id} direction="row" spacing={1.5}>
            {/* Index */}
            <Typography
              sx={{
                fontSize: 13,
                color: "text.secondary",
                width: 16,
              }}
            >
              {idx + 1}
            </Typography>

            {/* Subject */}
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <Select
                value={input.subject}
                displayEmpty
                onChange={(e) => updateRow(input.id, "subject", e.target.value)}
              >
                <MenuItem value="" disabled>
                  Subject
                </MenuItem>
                {SUBJECTS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Number */}
            <TextField
              size="small"
              placeholder="225"
              value={input.courseNumber}
              onChange={(e) =>
                updateRow(input.id, "courseNumber", e.target.value)
              }
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              sx={{ flex: 1 }}
            />

            {/* Remove */}
            <IconButton
              size="small"
              onClick={() => removeRow(input.id)}
              disabled={inputs.length === 1}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      {/* Add */}
      <Button
        size="small"
        onClick={addRow}
        sx={{
          textTransform: "none",
          fontSize: 14,
          mb: 3,
        }}
      >
        Add course
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={handleSearch}
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={16} /> : <SearchRoundedIcon />
        }
        sx={{
          backgroundColor: "#007AFF",
          borderRadius: 2,
          textTransform: "none",
          fontSize: 15,
          fontWeight: 500,
          py: 1.2,
          "&:hover": {
            backgroundColor: "#0066d6",
          },
        }}
      >
        {loading ? "Fetching sections…" : "Find Schedules"}
      </Button>
    </Box>
  );
}
