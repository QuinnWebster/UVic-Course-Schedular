export interface Schedule {
  days: string;
  time: string;
  startDate: string;
  endDate: string;
  room: string;
  building: string;
}

export interface Section {
  crn: string;
  section: string;
  title: string;
  subject: string;
  courseNumber: string;
  term: string;
  format: string;
  scheduleType: string;
  campus: string;
  credits: number;
  isOpen: boolean;
  enrollment: number;
  maxEnrollment: number;
  seatsAvailable: number;
  waitCount: number;
  waitCapacity: number;
  waitAvailable: number;
  instructors: string[];
  schedule: Schedule[];
}

export interface CourseResponse {
  subject: string;
  courseNumber: string;
  term: string;
  totalCount: number;
  sections: Section[];
  error?: string;
}

export interface SearchParams {
  subject: string;
  courseNumber: string;
  term: string;
}
