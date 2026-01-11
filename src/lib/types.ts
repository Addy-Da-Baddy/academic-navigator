export interface Subject {
  id: string;
  name: string;
  credits: number;
  gradePoint: number;
  attendance: {
    attended: number;
    total: number;
  };
}

export interface Semester {
  id: number;
  name: string;
  subjects: Subject[];
}

export interface TimetableEntry {
  id: string;
  shortName: string;
  fullName: string;
  time: string;
  room: string;
  startHour: number;
  endHour: number;
  color?: string;
}

export interface Timetable {
  [day: string]: TimetableEntry[];
}

export interface AppData {
  semesters: { [key: number]: Semester };
  timetable: Timetable;
  maxSemester: number;
  targetCGPA: number;
  currentSemester: number;
}

export type ViewType = 'dashboard' | 'analytics' | 'attendance' | 'timetable';

export const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
export type Day = typeof DAYS[number];

export const GRADE_SCALE = [
  { grade: 'O', point: 10.0, description: 'Outstanding' },
  { grade: 'A+', point: 9.0, description: 'Excellent' },
  { grade: 'A', point: 8.0, description: 'Very Good' },
  { grade: 'B+', point: 7.0, description: 'Good' },
  { grade: 'B', point: 6.0, description: 'Above Average' },
  { grade: 'C', point: 5.0, description: 'Average' },
  { grade: 'P', point: 4.0, description: 'Pass' },
  { grade: 'F', point: 0.0, description: 'Fail' },
];
