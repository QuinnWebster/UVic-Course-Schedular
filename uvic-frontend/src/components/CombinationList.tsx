import { useState } from "react";
import { Box, Collapse, Fade, Stack, Typography } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import type { Combination } from "../types/schedule";
import { buildCalendarBlocks } from "../utils/conflictChecker";
import WeekCalendar from "./WeekCalendar";

interface CombinationListProps {
  combinations: Combination[];
  courseLabels: string[]; // e.g. ["CSC 225", "SENG 265"]
}

export default function CombinationList({
  combinations,
  courseLabels,
}: CombinationListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (combinations.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography sx={{ fontSize: 16, color: "text.secondary" }}>
          No schedules available for these courses.
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={300}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 600,
              color: "text.primary",
              mb: 0.5,
            }}
          >
            Schedules
          </Typography>

          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            {courseLabels.join(" · ")}
          </Typography>

          <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
            {combinations.length} option
            {combinations.length !== 1 ? "s" : ""}
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          {combinations.map((combo, idx) => {
            const isSelected = selectedId === combo.id;
            const blocks = buildCalendarBlocks(combo.sections);

            return (
              <Box
                key={combo.id}
                onClick={() => setSelectedId(isSelected ? null : combo.id)}
                sx={{
                  border: "1px solid",
                  borderColor: isSelected ? "#007AFF" : "#e5e7eb",
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                }}
              >
                {/* Row */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2.5,
                    py: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: "text.primary",
                      }}
                    >
                      Option {idx + 1}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "text.secondary",
                        mt: 0.3,
                      }}
                    >
                      {combo.sections
                        .map((s) => `${s.subject} ${s.courseNumber}`)
                        .join(" · ")}
                    </Typography>
                  </Box>

                  <ExpandMoreRoundedIcon
                    sx={{
                      fontSize: 20,
                      color: "text.secondary",
                      transform: isSelected ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </Box>

                {/* Expanded calendar */}
                <Collapse in={isSelected} timeout={200}>
                  <Box sx={{ borderTop: "1px solid #f1f5f9" }}>
                    <WeekCalendar blocks={blocks} />
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Fade>
  );
}
