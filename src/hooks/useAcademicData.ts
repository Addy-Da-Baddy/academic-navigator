import { useState, useEffect, useCallback } from 'react';
import { AppData, Subject, Semester, ViewType, TimetableEntry, Day } from '@/lib/types';
import { loadData, saveData, generateId, calculateSGPA, calculateCGPA } from '@/lib/store';

export const useAcademicData = () => {
  const [data, setData] = useState<AppData>(loadData);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [activeSemester, setActiveSemester] = useState<number>(1);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const updateSubject = useCallback((semesterId: number, subjectId: string, updates: Partial<Subject>) => {
    setData(prev => ({
      ...prev,
      semesters: {
        ...prev.semesters,
        [semesterId]: {
          ...prev.semesters[semesterId],
          subjects: prev.semesters[semesterId].subjects.map(s =>
            s.id === subjectId ? { ...s, ...updates } : s
          ),
        },
      },
    }));
  }, []);

  const addSubject = useCallback((semesterId: number, subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subject,
      id: generateId(),
    };
    setData(prev => ({
      ...prev,
      semesters: {
        ...prev.semesters,
        [semesterId]: {
          ...prev.semesters[semesterId],
          subjects: [...prev.semesters[semesterId].subjects, newSubject],
        },
      },
    }));
  }, []);

  const removeSubject = useCallback((semesterId: number, subjectId: string) => {
    setData(prev => ({
      ...prev,
      semesters: {
        ...prev.semesters,
        [semesterId]: {
          ...prev.semesters[semesterId],
          subjects: prev.semesters[semesterId].subjects.filter(s => s.id !== subjectId),
        },
      },
    }));
  }, []);

  const addSemester = useCallback(() => {
    const existingIds = Object.keys(data.semesters).map(Number);
    const newId = Math.max(...existingIds, 0) + 1;
    
    if (newId > data.maxSemester) return;
    
    setData(prev => ({
      ...prev,
      semesters: {
        ...prev.semesters,
        [newId]: {
          id: newId,
          name: `Semester ${newId}`,
          subjects: [],
        },
      },
    }));
    setActiveSemester(newId);
  }, [data.semesters, data.maxSemester]);

  const removeSemester = useCallback((semesterId: number) => {
    if (Object.keys(data.semesters).length <= 1) return;
    
    setData(prev => {
      const { [semesterId]: removed, ...rest } = prev.semesters;
      return {
        ...prev,
        semesters: rest,
      };
    });
    
    const remainingIds = Object.keys(data.semesters).map(Number).filter(id => id !== semesterId);
    setActiveSemester(Math.min(...remainingIds));
  }, [data.semesters]);

  const updateAttendance = useCallback((semesterId: number, subjectId: string, delta: number, type: 'attended' | 'total') => {
    setData(prev => ({
      ...prev,
      semesters: {
        ...prev.semesters,
        [semesterId]: {
          ...prev.semesters[semesterId],
          subjects: prev.semesters[semesterId].subjects.map(s => {
            if (s.id !== subjectId) return s;
            const newValue = Math.max(0, s.attendance[type] + delta);
            // Ensure attended doesn't exceed total
            const attended = type === 'attended' 
              ? Math.min(newValue, s.attendance.total)
              : s.attendance.attended;
            const total = type === 'total' 
              ? Math.max(newValue, s.attendance.attended)
              : s.attendance.total;
            return {
              ...s,
              attendance: { attended, total },
            };
          }),
        },
      },
    }));
  }, []);

  const setTargetCGPA = useCallback((target: number) => {
    setData(prev => ({
      ...prev,
      targetCGPA: Math.max(0, Math.min(10, target)),
    }));
  }, []);

  const updateTimetableEntry = useCallback((day: Day, entryId: string, updates: Partial<TimetableEntry>) => {
    setData(prev => ({
      ...prev,
      timetable: {
        ...prev.timetable,
        [day]: prev.timetable[day].map(entry =>
          entry.id === entryId ? { ...entry, ...updates } : entry
        ),
      },
    }));
  }, []);

  const addTimetableEntry = useCallback((day: Day, entry: Omit<TimetableEntry, 'id'>) => {
    const newEntry: TimetableEntry = {
      ...entry,
      id: generateId(),
    };
    setData(prev => ({
      ...prev,
      timetable: {
        ...prev.timetable,
        [day]: [...(prev.timetable[day] || []), newEntry].sort((a, b) => a.startHour - b.startHour),
      },
    }));
  }, []);

  const removeTimetableEntry = useCallback((day: Day, entryId: string) => {
    setData(prev => ({
      ...prev,
      timetable: {
        ...prev.timetable,
        [day]: prev.timetable[day].filter(entry => entry.id !== entryId),
      },
    }));
  }, []);

  const currentSemester = data.semesters[activeSemester];
  const sgpaData = currentSemester ? calculateSGPA(currentSemester) : { sgpa: 0, totalCredits: 0 };
  const cgpaData = calculateCGPA(data.semesters);

  return {
    data,
    currentView,
    setCurrentView,
    activeSemester,
    setActiveSemester,
    currentSemester,
    sgpaData,
    cgpaData,
    updateSubject,
    addSubject,
    removeSubject,
    addSemester,
    removeSemester,
    updateAttendance,
    setTargetCGPA,
    updateTimetableEntry,
    addTimetableEntry,
    removeTimetableEntry,
  };
};
