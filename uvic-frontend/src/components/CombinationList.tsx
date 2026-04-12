import { useState } from "react";
import {
  Box,
  Chip,
  Collapse,
  Divider,
  Fade,
  Stack,
  Typography,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import type { Combination } from "../types/schedule";
import { buildCalendarBlocks } from "../utils/conflictChecker";
import WeekCalendar from "./WeekCalendar";

const COURSE_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#f97316",
  "#ec4899",
];

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
      <Box>
        <Typography color="text.disabled">
          No conflict-free combinations found for these courses.
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={400}>
      <Box>
        {/* Header */}
        <Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'DM Serif Display', serif",
                color: "text.primary",
              }}
            >
              Possible Schedules
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {courseLabels.join(" · ")}
            </Typography>
          </Box>
          <Chip
            label={`${combinations.length} combination${combinations.length !== 1 ? "s" : ""}`}
            size="small"
            sx={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              background: "rgba(125,211,252,0.08)",
              color: "#7dd3fc",
              border: "1px solid rgba(125,211,252,0.2)",
            }}
          />
        </Box>

        <Stack spacing={2}>
          {combinations.map((combo, idx) => {
            const isSelected = selectedId === combo.id;
            const blocks = buildCalendarBlocks(combo.sections);

            return (
              <Box
                key={combo.id}
                sx={{
                  background: isSelected
                    ? "rgba(125,211,252,0.05)"
                    : "rgba(15,23,42,0.7)",
                  border: `1px solid ${isSelected ? "rgba(125,211,252,0.25)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 3,
                  overflow: "hidden",
                  backdropFilter: "blur(12px)",
                  transition: "border-color 0.2s, background 0.2s",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedId(isSelected ? null : combo.id)}
              >
                {/* Combo header row */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 3,
                    py: 2,
                  }}
                >
                  <Stack useFlexGap>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarMonthRoundedIcon
                        sx={{
                          fontSize: 16,
                          color: isSelected ? "#7dd3fc" : "text.disabled",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 12,
                          color: isSelected ? "#7dd3fc" : "text.disabled",
                        }}
                      >
                        Option {idx + 1}
                      </Typography>
                    </Box>

                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ borderColor: "rgba(255,255,255,0.07)" }}
                    />

                    {/* Section chips */}
                    {combo.sections.map((s, si) => (
                      <Chip
                        key={s.crn}
                        label={`${s.subject} ${s.courseNumber} §${s.sequenceNumber}`}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: 11,
                          fontFamily: "'Space Mono', monospace",
                          background: `${COURSE_COLORS[si % COURSE_COLORS.length]}22`,
                          color: COURSE_COLORS[si % COURSE_COLORS.length],
                          border: `1px solid ${COURSE_COLORS[si % COURSE_COLORS.length]}44`,
                        }}
                      />
                    ))}
                  </Stack>

                  <ExpandMoreRoundedIcon
                    sx={{
                      color: "text.disabled",
                      fontSize: 20,
                      flexShrink: 0,
                      ml: 2,
                      transition: "transform 0.2s",
                      transform: isSelected ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </Box>

                {/* Calendar expand */}
                <Collapse in={isSelected} timeout={300}>
                  <Box>
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
