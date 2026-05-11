import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";

import type { ScheduleFilters } from "../types/schedule";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface Props {
  filters: ScheduleFilters;
  setFilters: React.Dispatch<React.SetStateAction<ScheduleFilters>>;
}

export default function ScheduleFiltersPanel({ filters, setFilters }: Props) {
  const toggleNoClassDay = (day: number) => {
    const current = filters.noClassesOnDays ?? [];

    setFilters({
      ...filters,
      noClassesOnDays: current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day],
    });
  };

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filters
      </Typography>

      <Typography variant="body2" sx={{ mb: 1 }}>
        No classes on:
      </Typography>

      {DAYS.map((day, idx) => (
        <FormControlLabel
          key={day}
          control={
            <Checkbox
              checked={filters.noClassesOnDays?.includes(idx) ?? false}
              onChange={() => toggleNoClassDay(idx)}
            />
          }
          label={day}
        />
      ))}

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Earliest allowed class time
        </Typography>

        <TextField
          type="time"
          onChange={(e) => {
            const [h, m] = e.target.value.split(":").map(Number);

            setFilters({
              ...filters,
              earliestTime: {
                days: "all",
                time: h * 60 + m,
              },
            });
          }}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Latest allowed class time
        </Typography>

        <TextField
          type="time"
          onChange={(e) => {
            const [h, m] = e.target.value.split(":").map(Number);

            setFilters({
              ...filters,
              latestTime: {
                days: "all",
                time: h * 60 + m,
              },
            });
          }}
        />
      </Box>
    </Box>
  );
}
