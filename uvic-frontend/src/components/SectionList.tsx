import { Box, Fade, Stack, Typography } from "@mui/material";
import type { CourseResponse } from "../types/courseTypes";
import SectionCard from "./SectionCard";

interface SectionListProps {
  result: CourseResponse;
}

export default function SectionList({ result }: SectionListProps) {
  const { subject, courseNumber, totalCount, sections } = result;
  const title = sections[0]?.title ?? "";

  return (
    <Fade in timeout={400}>
      <Box>
        {/* Summary header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="baseline"
          mb={3}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'DM Serif Display', serif",
                color: "text.primary",
                display: "inline",
              }}
            >
              {subject} {courseNumber}
            </Typography>
            {title && (
              <Typography
                variant="body2"
                sx={{ display: "inline", ml: 1.5, color: "text.disabled" }}
              >
                {title}
              </Typography>
            )}
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Space Mono', monospace",
              color: "text.disabled",
              whiteSpace: "nowrap",
            }}
          >
            {totalCount} section{totalCount !== 1 ? "s" : ""}
          </Typography>
        </Box>

        {/* No results */}
        {totalCount === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography color="text.disabled">
              No sections found for this course in the selected term.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {sections.map((s) => (
              <SectionCard key={s.crn} section={s} />
            ))}
          </Stack>
        )}
      </Box>
    </Fade>
  );
}
