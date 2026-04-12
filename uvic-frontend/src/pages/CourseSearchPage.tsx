import { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import SearchForm from "../components/SearchFormOuter";
import SectionList from "../components/SectionList";
import type { CourseResponse } from "../types/courseTypes";

export default function CourseSearchPage() {
  const [result, setResult] = useState<CourseResponse | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 6, sm: 10 } }}>
      <Container maxWidth="md">
        <Box textAlign="center" mb={7}>
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
            Course{" "}
            <Box
              component="span"
              sx={{ fontStyle: "italic", color: "#7dd3fc" }}
            >
              Availability
            </Box>
          </Typography>
          <Typography
            variant="body1"
            color="text.disabled"
            sx={{ maxWidth: 380, mx: "auto" }}
          >
            Live seat counts and schedules pulled directly from Banner.
          </Typography>
        </Box>

        <Box mb={5}>
          <SearchForm onResult={setResult} onLoading={setLoading} />
        </Box>

        {!loading && result && <SectionList result={result} />}
      </Container>
    </Box>
  );
}
