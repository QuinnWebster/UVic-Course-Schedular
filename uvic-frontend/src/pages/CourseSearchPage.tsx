import { useState } from "react";
import { Container } from "@mui/material";

import SearchForm from "../components/SearchFormOuter";
import SectionList from "../components/SectionList";
import type { CourseResponse } from "../types/courseTypes";

import {
  PageWrapper,
  Header,
  Badge,
  Title,
  Highlight,
  Subtitle,
  FormWrapper,
} from "./CourseSearchPage.style";

export default function CourseSearchPage() {
  const [result, setResult] = useState<CourseResponse | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <PageWrapper>
      <Container maxWidth="md">
        <Header>
          <Badge>University of Victoria</Badge>

          <Title variant="h1">
            Course <Highlight>Availability</Highlight>
          </Title>

          <Subtitle variant="body1">
            Live seat counts and schedules pulled directly from Banner.
          </Subtitle>
        </Header>

        <FormWrapper>
          <SearchForm onResult={setResult} onLoading={setLoading} />
        </FormWrapper>

        {!loading && result && <SectionList result={result} />}
      </Container>
    </PageWrapper>
  );
}
