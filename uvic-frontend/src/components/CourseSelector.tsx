import { useState } from "react";
import { CircularProgress, InputLabel, MenuItem, Stack } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import {
  Container,
  TermChip,
  SectionLabel,
  IndexText,
  StyledFormControl,
  StyledSelect,
  StyledTextField,
  RemoveButton,
  AddButton,
  ErrorAlert,
  SubmitButton,
} from "./CourseSelector.style";

import type { CourseInput, LoadedCourse } from "../types/schedule";
import { fetchCourses } from "../api/courses";

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
    if (valid.length < 2) {
      setError("Add at least 2 courses to build a schedule.");
      return;
    }
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
          return { input, sections: res.sections };
        } catch (e) {
          return {
            input,
            sections: [],
            error: e instanceof Error ? e.message : "Failed",
          };
        }
      }),
    );

    setLoading(false);
    onResults(results);
  };

  return (
    <Container>
      <div>
        <TermChip label="☀️  Summer 2026 (May – Aug)" variant="outlined" />
      </div>

      <SectionLabel variant="overline">Courses</SectionLabel>

      <Stack>
        {inputs.map((input, idx) => (
          <Stack key={input.id} direction="row">
            <IndexText>{idx + 1}</IndexText>

            <StyledFormControl size="small">
              <InputLabel>Subject</InputLabel>

              <StyledSelect
                value={input.subject}
                label="Subject"
                onChange={(e) =>
                  updateRow(input.id, "subject", e.target.value as string)
                }
              >
                {SUBJECTS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </StyledSelect>
            </StyledFormControl>

            <StyledTextField
              size="small"
              label="Number"
              placeholder="e.g. 225"
              value={input.courseNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateRow(input.id, "courseNumber", e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                e.key === "Enter" && handleSearch()
              }
            />

            <RemoveButton
              size="small"
              onClick={() => removeRow(input.id)}
              disabled={inputs.length === 1}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </RemoveButton>
          </Stack>
        ))}
      </Stack>

      <AddButton size="small" startIcon={<AddRoundedIcon />} onClick={addRow}>
        Add another course
      </AddButton>

      {error && <ErrorAlert severity="error">{error}</ErrorAlert>}

      <SubmitButton
        variant="contained"
        fullWidth
        onClick={handleSearch}
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={16} /> : <SearchRoundedIcon />
        }
      >
        {loading ? "Fetching sections…" : "Find Combinations"}
      </SubmitButton>
    </Container>
  );
}
