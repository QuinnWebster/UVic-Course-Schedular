import { useState } from "react";
import { Container } from "@mui/material";

import CourseSelector from "../components/CourseSelector";
import CombinationList from "../components/CombinationList";

import type { Combination, LoadedCourse } from "../types/schedule";
import { generateCombinations } from "../utils/conflictChecker";

import {
  PageWrapper,
  Hero,
  Badge,
  Title,
  Highlight,
  Subtitle,
  SelectorWrapper,
  WarningAlert,
} from "./ScheduleBuilder.style";

export default function ScheduleBuilder() {
  const [combinations, setCombinations] = useState<Combination[] | null>(null);
  const [courseLabels, setCourseLabels] = useState<string[]>([]);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);

  const handleResults = (loaded: LoadedCourse[]) => {
    const errors = loaded
      .filter((l) => l.error || l.sections.length === 0)
      .map(
        (l) =>
          `${l.input.subject} ${l.input.courseNumber}: ${
            l.error ?? "no sections found"
          }`,
      );

    setLoadErrors(errors);

    const valid = loaded.filter((l) => !l.error && l.sections.length > 0);

    if (valid.length < 2) {
      setCombinations([]);
      setCourseLabels([]);
      return;
    }

    const labels = valid.map(
      (l) => `${l.input.subject} ${l.input.courseNumber}`,
    );
    const sectionGroups = valid.map((l) => l.sections);
    const combos = generateCombinations(sectionGroups);

    setCourseLabels(labels);
    setCombinations(combos);
  };

  return (
    <PageWrapper>
      <Container maxWidth="lg">
        {/* Hero */}
        <Hero>
          <Badge>University of Victoria</Badge>

          <Title>
            Schedule <Highlight>Builder</Highlight>
          </Title>

          <Subtitle>
            Add your courses and we'll find every conflict-free combination,
            visualized on a weekly calendar.
          </Subtitle>
        </Hero>

        {/* Selector */}
        <SelectorWrapper>
          <CourseSelector onResults={handleResults} />
        </SelectorWrapper>

        {/* Errors */}
        {loadErrors.map((e) => (
          <WarningAlert key={e} severity="warning">
            {e}
          </WarningAlert>
        ))}

        {/* Results */}
        {combinations !== null && (
          <CombinationList
            combinations={combinations}
            courseLabels={courseLabels}
          />
        )}
      </Container>
    </PageWrapper>
  );
}
