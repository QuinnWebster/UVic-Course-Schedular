import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import type { Section } from "../types/courseTypes";
import SeatBar from "./SeatBar";

interface SectionCardProps {
  section: Section;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{
          fontSize: 9,
          color: "text.disabled",
          letterSpacing: 1.5,
          display: "block",
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
        {value || "—"}
      </Typography>
    </Box>
  );
}

export default function SectionCard({ section: s }: SectionCardProps) {
  const isOpen = s.isOpen;

  return (
    <Card
      variant="outlined"
      sx={{
        background: "rgba(15,23,42,0.7)",
        backdropFilter: "blur(12px)",
        borderColor: isOpen ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
        borderRadius: 3,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        },
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        {/* ── Header ── */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "'Space Mono', monospace",
                  color: "text.disabled",
                  letterSpacing: 1,
                }}
              >
                §{s.section}
              </Typography>
              <Chip
                label={`CRN ${s.crn}`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  fontFamily: "'Space Mono', monospace",
                  background: "rgba(255,255,255,0.05)",
                  color: "text.disabled",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            </Stack>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'DM Serif Display', serif",
                color: "text.primary",
                fontSize: 18,
              }}
            >
              {s.scheduleType}
            </Typography>
          </Box>

          <Chip
            label={isOpen ? "● OPEN" : "● CLOSED"}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: 0.5,
              background: isOpen
                ? "rgba(16,185,129,0.12)"
                : "rgba(239,68,68,0.12)",
              color: isOpen ? "#10b981" : "#ef4444",
              border: `1px solid ${isOpen ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
            }}
          />
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", mb: 2 }} />

        {/* ── Details grid ── */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={6} sm={3}>
            <DetailItem label="Format" value={s.format} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <DetailItem label="Credits" value={`${s.credits} units`} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <DetailItem label="Instructor" value={s.instructors.join(", ")} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <DetailItem label="Campus" value={s.campus} />
          </Grid>
        </Grid>

        {/* ── Schedule rows ── */}
        {s.schedule.map((sch, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              background: "rgba(30,41,59,0.5)",
              borderRadius: 2,
              px: 2,
              py: 1,
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Space Mono', monospace",
                color: "#7dd3fc",
                minWidth: 80,
              }}
            >
              {sch.days}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {sch.time}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {sch.startDate} – {sch.endDate}
            </Typography>
          </Box>
        ))}

        {/* ── Seat bar ── */}
        <Box mt={2}>
          <SeatBar enrolled={s.enrollment} max={s.maxEnrollment} />

          {s.waitCapacity > 0 && (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Typography variant="caption" color="text.disabled">
                Waitlist:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "'Space Mono', monospace",
                  color: "text.secondary",
                }}
              >
                {s.waitCount}/{s.waitCapacity}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: s.waitAvailable > 0 ? "#10b981" : "#ef4444" }}
              >
                ({s.waitAvailable} available)
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
