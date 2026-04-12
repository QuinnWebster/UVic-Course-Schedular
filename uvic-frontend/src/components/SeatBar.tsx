import { Box, LinearProgress, Typography } from "@mui/material";

interface SeatBarProps {
  enrolled: number;
  max: number;
}

function getColor(pct: number): string {
  if (pct >= 100) return "#ef4444";
  if (pct >= 80) return "#f59e0b";
  return "#10b981";
}

export default function SeatBar({ enrolled, max }: SeatBarProps) {
  const pct = max > 0 ? Math.min((enrolled / max) * 100, 100) : 0;
  const color = getColor(pct);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="caption" color="text.disabled">
          Enrollment
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontFamily: "'Space Mono', monospace",
            color: "text.secondary",
          }}
        >
          {enrolled}/{max} ({Math.round(pct)}%)
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.06)",
          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
            borderRadius: 3,
            transition: "transform 0.8s ease",
          },
        }}
      />
    </Box>
  );
}
