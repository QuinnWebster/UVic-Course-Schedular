import { useState } from "react";
import { Collapse, Divider, Fade, Stack } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

import {
  Container,
  Header,
  Title,
  Subtitle,
  CountChip,
  ComboCard,
  ComboHeaderRow,
  LeftGroup,
  OptionText,
  SectionChip,
  ExpandIconWrapper,
} from "./CombinationList.styles";

import { colors } from "../theme/colors";

import type { Combination } from "../types/schedule";
import { buildCalendarBlocks } from "../utils/conflictChecker";
import WeekCalendar from "./WeekCalendar";

const COURSE_COLORS = colors.course;

interface CombinationListProps {
  combinations: Combination[];
  courseLabels: string[];
}

export default function CombinationList({
  combinations,
  courseLabels,
}: CombinationListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (combinations.length === 0) {
    return (
      <Container>
        <Subtitle>
          No conflict-free combinations found for these courses.
        </Subtitle>
      </Container>
    );
  }

  return (
    <Fade in timeout={400}>
      <Container>
        <Header>
          <div>
            <Title variant="h5">Possible Schedules</Title>
            <Subtitle variant="body2">{courseLabels.join(" · ")}</Subtitle>
          </div>

          <CountChip
            label={`${combinations.length} combination${
              combinations.length !== 1 ? "s" : ""
            }`}
            size="small"
          />
        </Header>

        <Stack spacing={2}>
          {combinations.map((combo, idx) => {
            const isSelected = selectedId === combo.id;
            const blocks = buildCalendarBlocks(combo.sections);

            return (
              <ComboCard
                key={combo.id}
                selected={isSelected}
                onClick={() => setSelectedId(isSelected ? null : combo.id)}
              >
                <ComboHeaderRow>
                  <Stack useFlexGap>
                    <LeftGroup>
                      <CalendarMonthRoundedIcon
                        style={{
                          fontSize: 16,
                          color: isSelected ? colors.primary[500] : undefined,
                        }}
                      />

                      <OptionText selected={isSelected}>
                        Option {idx + 1}
                      </OptionText>
                    </LeftGroup>

                    <Divider orientation="vertical" flexItem />

                    {combo.sections.map((s, si) => {
                      const color = COURSE_COLORS[si % COURSE_COLORS.length];

                      return (
                        <SectionChip
                          key={s.crn}
                          label={`${s.subject} ${s.courseNumber} §${s.sequenceNumber}`}
                          size="small"
                          colorHex={color}
                        />
                      );
                    })}
                  </Stack>

                  <ExpandIconWrapper selected={isSelected}>
                    <ExpandMoreRoundedIcon />
                  </ExpandIconWrapper>
                </ComboHeaderRow>

                <Collapse in={isSelected} timeout={300}>
                  <WeekCalendar blocks={blocks} />
                </Collapse>
              </ComboCard>
            );
          })}
        </Stack>
      </Container>
    </Fade>
  );
}
