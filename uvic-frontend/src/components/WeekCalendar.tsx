import { Box, Typography } from "@mui/material";
import type { CalendarBlock } from "../types/schedule";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const START_HOUR = 8; // 8:00 AM
const END_HOUR = 21; // 9:00 PM
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
const HOUR_HEIGHT = 56; // px per hour
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

function minutesToPx(minutes: number): number {
  return ((minutes - START_HOUR * 60) / TOTAL_MINUTES) * TOTAL_HEIGHT;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${m.toString().padStart(2, "0")} ${suffix}`;
}

interface WeekCalendarProps {
  blocks: CalendarBlock[];
}

export default function WeekCalendar({ blocks }: WeekCalendarProps) {
  const TIME_COL_WIDTH = 52;
  const DAY_COL_MIN = 80;

  return (
    <Box
      sx={{
        background: "rgba(15,23,42,0.7)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Day headers */}
      <Box
        sx={{
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        {/* Time gutter header */}
        <Box sx={{ minWidth: TIME_COL_WIDTH, flexShrink: 0 }} />
        {DAYS.map((day) => (
          <Box
            key={day}
            sx={{
              flex: 1,
              minWidth: DAY_COL_MIN,
              textAlign: "center",
              py: 1.5,
              borderLeft: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Space Mono', monospace",
                color: "text.disabled",
                fontSize: 11,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Grid body */}
      <Box sx={{ display: "flex", overflowX: "auto" }}>
        {/* Time labels column */}
        <Box
          sx={{
            minWidth: TIME_COL_WIDTH,
            flexShrink: 0,
            position: "relative",
            height: TOTAL_HEIGHT,
          }}
        >
          {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                top: i * HOUR_HEIGHT - 7,
                right: 8,
                width: "100%",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: 9,
                  color: "text.disabled",
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {formatTime((START_HOUR + i) * 60)}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Day columns */}
        {DAYS.map((day, dayIdx) => {
          const dayBlocks = blocks.filter((b) => b.day === dayIdx);
          return (
            <Box
              key={day}
              sx={{
                flex: 1,
                minWidth: DAY_COL_MIN,
                position: "relative",
                height: TOTAL_HEIGHT,
                borderLeft: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {/* Hour lines */}
              {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    top: i * HOUR_HEIGHT,
                    left: 0,
                    right: 0,
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                  }}
                />
              ))}

              {/* Course blocks */}
              {dayBlocks.map((block, bi) => {
                const top = minutesToPx(block.startMinutes);
                const height = minutesToPx(block.endMinutes) - top;
                return (
                  <Box
                    key={bi}
                    sx={{
                      position: "absolute",
                      left: 3,
                      right: 3,
                      top,
                      height: Math.max(height, 24),
                      background: block.color,
                      opacity: 0.88,
                      borderRadius: 1.5,
                      px: 1,
                      py: 0.5,
                      overflow: "hidden",
                      boxShadow: `0 2px 8px ${block.color}44`,
                      cursor: "default",
                      transition: "opacity 0.15s",
                      "&:hover": { opacity: 1 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {block.section.subject} {block.section.courseNumber}
                    </Typography>
                    {height > 30 && (
                      <Typography
                        sx={{
                          fontSize: 9,
                          color: "rgba(255,255,255,0.8)",
                          lineHeight: 1.2,
                        }}
                      >
                        {block.section.sequenceNumber}
                      </Typography>
                    )}
                    {height > 44 && (
                      <Typography
                        sx={{
                          fontSize: 9,
                          color: "rgba(255,255,255,0.7)",
                          lineHeight: 1.2,
                        }}
                      >
                        {formatTime(block.startMinutes)}–
                        {formatTime(block.endMinutes)}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
