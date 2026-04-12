import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { CourseResponse, SearchParams } from "../types/courseTypes";
import { fetchCourses } from "../api/courses";
import TermBadge from "./TermBadge";

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

const TERMS = [{ value: "202605", label: "Summer 2026 (May – Aug)" }];

interface SearchFormProps {
  onResult: (result: CourseResponse) => void;
  onLoading: (loading: boolean) => void;
}

export default function SearchForm({ onResult, onLoading }: SearchFormProps) {
  const [subject, setSubject] = useState("CSC");
  const [courseNumber, setCourseNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!courseNumber.trim()) {
      setError("Please enter a course number.");
      return;
    }
    setError("");
    setLoading(true);
    onLoading(true);

    const params: SearchParams = {
      subject,
      courseNumber: courseNumber.trim(),
      term: TERMS[0].value,
    };

    try {
      const result = await fetchCourses(params);
      onResult(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: "rgba(15,23,42,0.8)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 4,
        p: { xs: 3, sm: 4 },
        backdropFilter: "blur(20px)",
      }}
    >
      <TermBadge label={TERMS[0].label} />

      <Stack direction={{ xs: "column", sm: "row" }}>
        {/* Subject */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel sx={{ color: "text.disabled" }}>Subject</InputLabel>
          <Select
            value={subject}
            label="Subject"
            onChange={(e) => setSubject(e.target.value)}
            sx={{
              color: "text.primary",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.2)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(125,211,252,0.5)",
              },
              ".MuiSvgIcon-root": { color: "text.disabled" },
            }}
          >
            {SUBJECTS.map((s) => (
              <MenuItem
                key={s}
                value={s}
                sx={{ fontFamily: "'Space Mono', monospace", fontSize: 13 }}
              >
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Course number */}
        <TextField
          size="small"
          label="Course Number"
          placeholder="e.g. 111, 225"
          value={courseNumber}
          onChange={(e) => setCourseNumber(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          sx={{
            flex: 1,
            "& label": { color: "text.disabled" },
            "& label.Mui-focused": { color: "#7dd3fc" },
            "& .MuiInputBase-input": { color: "text.primary" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.1)",
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.2)",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              { borderColor: "rgba(125,211,252,0.5)" },
          }}
        />

        {/* Search button */}
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          sx={{
            background: "#0284c7",
            px: 3.5,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
            whiteSpace: "nowrap",
            "&:hover": { background: "#0ea5e9" },
            "&:disabled": {
              background: "rgba(255,255,255,0.08)",
              color: "text.disabled",
            },
          }}
          startIcon={
            loading ? (
              <CircularProgress size={14} sx={{ color: "inherit" }} />
            ) : null
          }
        >
          {loading ? "Searching…" : "Search →"}
        </Button>
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#fca5a5",
            "& .MuiAlert-icon": { color: "#ef4444" },
          }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
}
