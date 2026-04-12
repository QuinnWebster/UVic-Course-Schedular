export interface Schedule {
  days: string;
  time: string;
  startDate: string;
  endDate: string;
  room: string;
  building: string;
}

export interface MeetingTime {
  beginTime?: string;
  endTime?: string;
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface MeetingFaculty {
  meetingTime?: MeetingTime;
}

export interface Section {
  crn: string;
  section: string;
  sequenceNumber: string;
  linkIdentifier?: string;
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
  // Raw meeting data used by conflict checker
  meetingsFaculty: MeetingFaculty[];
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
