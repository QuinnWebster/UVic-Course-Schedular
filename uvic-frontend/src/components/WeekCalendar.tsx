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
  const TIME_COL_WIDTH = 56;
  const DAY_COL_MIN = 90;

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          borderBottom: "1px solid #f1f5f9",
          backgroundColor: "#fafafa",
        }}
      >
        <Box sx={{ minWidth: TIME_COL_WIDTH }} />

        {DAYS.map((day) => (
          <Box
            key={day}
            sx={{
              flex: 1,
              minWidth: DAY_COL_MIN,
              textAlign: "center",
              py: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: "text.secondary",
              }}
            >
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Body */}
      <Box sx={{ display: "flex" }}>
        {/* Time column */}
        <Box
          sx={{
            minWidth: TIME_COL_WIDTH,
            position: "relative",
            height: TOTAL_HEIGHT,
            borderRight: "1px solid #f1f5f9",
          }}
        >
          {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => (
            <Typography
              key={i}
              sx={{
                position: "absolute",
                top: i * HOUR_HEIGHT - 6,
                right: 8,
                fontSize: 11,
                color: "text.secondary",
              }}
            >
              {formatTime((START_HOUR + i) * 60)}
            </Typography>
          ))}
        </Box>

        {/* Days */}
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
                borderRight: "1px solid #f8fafc",
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
                    borderTop: "1px solid #f1f5f9",
                  }}
                />
              ))}

              {/* Events */}
              {dayBlocks.map((block, bi) => {
                const top = minutesToPx(block.startMinutes);
                const height = minutesToPx(block.endMinutes) - top;

                return (
                  <Box
                    key={bi}
                    sx={{
                      position: "absolute",
                      top,
                      left: 4,
                      right: 4,
                      height: Math.max(height, 28),
                      borderRadius: 1.5,
                      px: 1,
                      py: 0.5,
                      backgroundColor: block.color + "22",
                      border: `1px solid ${block.color}55`,
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "text.primary",
                        lineHeight: 1.2,
                      }}
                      noWrap
                    >
                      {block.section.subject} {block.section.courseNumber}
                    </Typography>

                    {height > 36 && (
                      <Typography
                        sx={{
                          fontSize: 10,
                          color: "text.secondary",
                          lineHeight: 1.2,
                        }}
                      >
                        {block.section.sequenceNumber}
                      </Typography>
                    )}

                    {height > 52 && (
                      <Typography
                        sx={{
                          fontSize: 10,
                          color: "text.secondary",
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
