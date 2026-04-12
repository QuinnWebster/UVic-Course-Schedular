import { Chip, Typography, Box } from "@mui/material";

interface TermBadgeProps {
  label: string;
}

export default function TermBadge({ label }: TermBadgeProps) {
  return (
    <Box mb={2.5}>
      <Typography
        variant="overline"
        sx={{
          color: "text.disabled",
          letterSpacing: 1.5,
          fontSize: 10,
          display: "block",
          mb: 1,
        }}
      >
        Semester
      </Typography>
      <Chip
        label={label}
        variant="outlined"
        sx={{
          color: "#7dd3fc",
          borderColor: "rgba(125,211,252,0.3)",
          background: "rgba(125,211,252,0.06)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          height: 34,
        }}
      />
    </Box>
  );
}
