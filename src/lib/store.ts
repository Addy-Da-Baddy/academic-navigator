import { AppData, Semester, Subject, TimetableEntry, Day, DAYS } from './types';

const STORAGE_KEY = 'academicNavigatorData';

const generateId = () => Math.random().toString(36).substring(2, 11);

const DEFAULT_DATA: AppData = {
  semesters: {
    1: {
      id: 1,
      name: 'Semester 1',
      subjects: [
        { id: generateId(), name: 'Engineering Mathematics - I', credits: 4, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Engineering Physics', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Mechanics of Solids', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Basic Electronics', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Basic Mechanical Engineering', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Communication Skills in English', credits: 2, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Universal Human Values and Professional Ethics (MLC)', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Engineering Physics Lab', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Workshop Practice', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Engineering Graphics - I', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
      ],
    },
    2: {
      id: 2,
      name: 'Semester 2',
      subjects: [
        { id: generateId(), name: 'Engineering Mathematics - II', credits: 4, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Engineering Chemistry', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Biology for Engineers', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Basic Electrical Technology', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Problem Solving Using Computers', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Environmental Studies', credits: 2, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Human Rights and Constitution (MLC)', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Engineering Chemistry Lab', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'PSUC Lab', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Engineering Graphics - II', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
      ],
    },
    3: {
      id: 3,
      name: 'Semester 3',
      subjects: [
        { id: generateId(), name: 'Engineering Mathematics - III', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Data Structures', credits: 4, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Digital Systems and Computer Organization', credits: 4, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Object Oriented Programming', credits: 4, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Principles of Data Communication', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Data Structures Lab', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Digital Systems Lab', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Object Oriented Programming Lab', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
      ],
    },
    4: {
      id: 4,
      name: 'Semester 4',
      subjects: [
        { id: generateId(), name: 'Engineering Mathematics - IV', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Database Management Systems', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Design and Analysis of Algorithms', credits: 4, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Computer Networks and Protocols', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Operating Systems', credits: 4, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Software Design Technology', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Database Systems Lab', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Operating Systems Lab', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
      ],
    },
    5: {
      id: 5,
      name: 'Semester 5',
      subjects: [
        { id: generateId(), name: 'Essentials of Management', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Information Security', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Embedded System Design', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Wireless Communication and Computing', credits: 4, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Statistical Data Analytics', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Embedded System Design Lab', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Information Security Lab', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
      ],
    },
    6: {
      id: 6,
      name: 'Semester 6',
      subjects: [
        { id: generateId(), name: 'Engineering Economics and Financial Management', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Network Design and Programming', credits: 4, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Data Mining', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Ethical Hacking', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Applied Data Analytics', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Mobile Application Development Lab', credits: 2, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Network Design and Programming Lab', credits: 1, gradePoint: -1, attendance: { attended: 0, total: 0 } },
      ],
    },
    7: {
      id: 7,
      name: 'Semester 7',
      subjects: [
        { id: generateId(), name: 'PE - 3 / Minor Specialization', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'PE - 4 / Minor Specialization', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'PE - 5', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'PE - 6', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'PE - 7', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'OE - 2 (MLC)', credits: 0, gradePoint: -1, attendance: { attended: 0, total: 0 } },
      ],
    },
    8: {
      id: 8,
      name: 'Semester 8',
      subjects: [
        { id: generateId(), name: 'Internship / Project Work', credits: 12, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Professional Elective - 8', credits: 3, gradePoint: -1, attendance: { attended: 0, total: 0 } },
        { id: generateId(), name: 'Seminar', credits: 2, gradePoint: -1, attendance: { attended: 0, total: 0 } },
      ],
    },
  },
  timetable: {
    MONDAY: [
      { id: generateId(), shortName: 'ADA', fullName: 'Applied Data Analytics', time: '08:00-09:00', room: 'AB5-306', startHour: 8, endHour: 9 },
      { id: generateId(), shortName: 'DM', fullName: 'Data Mining', time: '09:00-10:00', room: 'AB5-306', startHour: 9, endHour: 10 },
      { id: generateId(), shortName: 'EEFM', fullName: 'Engineering Economics and Financial Management', time: '10:30-11:30', room: 'AB5-306', startHour: 10.5, endHour: 11.5 },
      { id: generateId(), shortName: 'RW', fullName: 'Reporting and Writing', time: '11:30-12:30', room: 'AB5-306', startHour: 11.5, endHour: 12.5 },
      { id: generateId(), shortName: 'MADL+NDPL', fullName: 'Mobile Application Development Lab + Network Design and Programming Lab', time: '14:00-16:30', room: 'AB5-306', startHour: 14, endHour: 16.5 },
    ],
    TUESDAY: [
      { id: generateId(), shortName: 'EH', fullName: 'Ethical Hacking', time: '13:00-14:00', room: 'AB5-306', startHour: 13, endHour: 14 },
      { id: generateId(), shortName: 'NPACN', fullName: 'Network Programming and Advanced Communication Networks', time: '14:00-15:00', room: 'AB5-306', startHour: 14, endHour: 15 },
    ],
    WEDNESDAY: [
      { id: generateId(), shortName: 'EH', fullName: 'Ethical Hacking', time: '08:00-09:00', room: 'AB5-306', startHour: 8, endHour: 9 },
      { id: generateId(), shortName: 'NPACN', fullName: 'Network Programming and Advanced Communication Networks', time: '09:00-10:00', room: 'AB5-306', startHour: 9, endHour: 10 },
      { id: generateId(), shortName: 'ADA', fullName: 'Applied Data Analytics', time: '10:30-11:30', room: 'AB5-306', startHour: 10.5, endHour: 11.5 },
      { id: generateId(), shortName: 'DM', fullName: 'Data Mining', time: '11:30-12:30', room: 'AB5-306', startHour: 11.5, endHour: 12.5 },
    ],
    THURSDAY: [
      { id: generateId(), shortName: 'MADL+NDPL', fullName: 'Mobile Application Development Lab + Network Design and Programming Lab', time: '08:30-11:00', room: 'AB5-306', startHour: 8.5, endHour: 11 },
      { id: generateId(), shortName: 'EEFM', fullName: 'Engineering Economics and Financial Management', time: '13:00-14:00', room: 'AB5-306', startHour: 13, endHour: 14 },
      { id: generateId(), shortName: 'RW', fullName: 'Reporting and Writing', time: '14:00-15:00', room: 'AB5-306', startHour: 14, endHour: 15 },
    ],
    FRIDAY: [
      { id: generateId(), shortName: 'EEFM', fullName: 'Engineering Economics and Financial Management', time: '08:00-09:00', room: 'AB5-306', startHour: 8, endHour: 9 },
      { id: generateId(), shortName: 'RW', fullName: 'Reporting and Writing', time: '09:00-10:00', room: 'AB5-306', startHour: 9, endHour: 10 },
      { id: generateId(), shortName: 'EH', fullName: 'Ethical Hacking', time: '10:30-11:30', room: 'AB5-306', startHour: 10.5, endHour: 11.5 },
      { id: generateId(), shortName: 'NPACN', fullName: 'Network Programming and Advanced Communication Networks', time: '11:30-12:30', room: 'AB5-306', startHour: 11.5, endHour: 12.5 },
    ],
    SATURDAY: [
      { id: generateId(), shortName: 'ADA', fullName: 'Applied Data Analytics', time: '13:00-14:00', room: 'AB5-306', startHour: 13, endHour: 14 },
      { id: generateId(), shortName: 'DM', fullName: 'Data Mining', time: '14:00-15:00', room: 'AB5-306', startHour: 14, endHour: 15 },
      { id: generateId(), shortName: 'NPACN', fullName: 'Network Programming and Advanced Communication Networks', time: '15:30-16:30', room: 'AB5-306', startHour: 15.5, endHour: 16.5 },
    ],
  },
  maxSemester: 8,
  targetCGPA: 9.0,
  currentSemester: 6,
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return DEFAULT_DATA;
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
};

export const calculateSGPA = (semester: Semester): { sgpa: number; totalCredits: number } => {
  if (!semester.subjects.length) return { sgpa: 0, totalCredits: 0 };
  
  let totalWeightedPoints = 0;
  let totalCredits = 0;
  
  semester.subjects.forEach(subject => {
    // Skip subjects with no grade yet (gradePoint = -1)
    if (subject.gradePoint >= 0) {
      totalWeightedPoints += subject.credits * subject.gradePoint;
      totalCredits += subject.credits;
    }
  });
  
  return {
    sgpa: totalCredits > 0 ? totalWeightedPoints / totalCredits : 0,
    totalCredits,
  };
};

export const calculateCGPA = (semesters: { [key: number]: Semester }): { cgpa: number; totalCredits: number } => {
  let totalWeightedPoints = 0;
  let totalCredits = 0;
  
  Object.values(semesters).forEach(semester => {
    semester.subjects.forEach(subject => {
      // Skip subjects with no grade yet (gradePoint = -1)
      if (subject.gradePoint >= 0) {
        totalWeightedPoints += subject.credits * subject.gradePoint;
        totalCredits += subject.credits;
      }
    });
  });
  
  return {
    cgpa: totalCredits > 0 ? totalWeightedPoints / totalCredits : 0,
    totalCredits,
  };
};

export const getAttendancePercentage = (subject: Subject): number => {
  if (subject.attendance.total === 0) return 100;
  return (subject.attendance.attended / subject.attendance.total) * 100;
};

export const getAttendanceStatus = (percentage: number): 'success' | 'warning' | 'danger' => {
  if (percentage >= 75) return 'success';
  if (percentage >= 60) return 'warning';
  return 'danger';
};

export const getCurrentDayName = (): Day => {
  const days: Day[] = ['SUNDAY' as Day, 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const today = days[new Date().getDay()];
  return DAYS.includes(today as Day) ? today as Day : 'MONDAY';
};

export const getUpcomingClass = (timetable: TimetableEntry[]): TimetableEntry | null => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHour + currentMinutes / 60;
  
  const sortedClasses = [...timetable].sort((a, b) => a.startHour - b.startHour);
  
  // Find current or next class
  for (const entry of sortedClasses) {
    if (currentTime < entry.endHour) {
      return entry;
    }
  }
  
  return null;
};

export { generateId, DEFAULT_DATA };
