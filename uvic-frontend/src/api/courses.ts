import type { CourseResponse, SearchParams } from "../types/courseTypes";

const BASE_URL = "http://localhost:5000/api";

export async function fetchCourses(
  params: SearchParams,
): Promise<CourseResponse> {
  const { subject, courseNumber, term } = params;
  const url = `${BASE_URL}/courses?subject=${encodeURIComponent(subject)}&courseNumber=${encodeURIComponent(courseNumber)}&term=${encodeURIComponent(term)}`;

  const res = await fetch(url);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Server error: ${res.status}`);
  }

  return res.json();
}
