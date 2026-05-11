import type { Section } from "./courseTypes";

// One selected course input by the user
export interface CourseInput {
  id: string; // unique id for react key
  subject: string;
  courseNumber: string;
}

// A fetched course with all its sections loaded
export interface LoadedCourse {
  input: CourseInput;
  bundles: Section[][];
  error?: string;
}

// A conflict-free combination: one section per course
export interface Combination {
  id: string;
  sections: Section[]; // one per course
  hasConflict: boolean;
}

// A parsed time block for calendar rendering
export interface CalendarBlock {
  section: Section;
  day: number; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri
  startMinutes: number; // minutes from midnight
  endMinutes: number;
  color: string;
}

export interface ScheduleFilters {
  noClassesOnDays?: number[]; // [0, 4] => Monday + Friday

  earliestTime?: {
    days: number[] | "all";
    time: number; // minutes
  };

  latestTime?: {
    days: number[] | "all";
    time: number; // minutes
  };
}
