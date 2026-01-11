import { useAcademicData } from '@/hooks/useAcademicData';
import { Navbar } from '@/components/Navbar';
import { Dashboard } from '@/components/Dashboard';
import { Analytics } from '@/components/Analytics';
import { Attendance } from '@/components/Attendance';
import { Timetable } from '@/components/Timetable';

const Index = () => {
  const {
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
    setAttendance,
    markPresent,
    markAbsent,
    setTargetCGPA,
    updateTimetableEntry,
    addTimetableEntry,
    removeTimetableEntry,
    importTimetable,
    importData,
  } = useAcademicData();

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="container py-6">
        {currentView === 'dashboard' && (
          <Dashboard
            data={data}
            currentSemester={currentSemester}
            activeSemester={activeSemester}
            sgpaData={sgpaData}
            cgpaData={cgpaData}
            onSemesterChange={setActiveSemester}
            onAddSemester={addSemester}
            onRemoveSemester={removeSemester}
            onUpdateSubject={updateSubject}
            onAddSubject={addSubject}
            onRemoveSubject={removeSubject}
            onSetTargetCGPA={setTargetCGPA}
            onImportData={importData}
          />
        )}
        
        {currentView === 'analytics' && (
          <Analytics data={data} cgpaData={cgpaData} />
        )}
        
        {currentView === 'attendance' && (
          <Attendance
            data={data}
            currentSemester={currentSemester}
            activeSemester={activeSemester}
            onSemesterChange={setActiveSemester}
            onAddSemester={addSemester}
            onRemoveSemester={removeSemester}
            onUpdateAttendance={updateAttendance}
            onSetAttendance={setAttendance}
            onMarkPresent={markPresent}
            onMarkAbsent={markAbsent}
          />
        )}
        
        {currentView === 'timetable' && (
          <Timetable
            timetable={data.timetable}
            onUpdateEntry={updateTimetableEntry}
            onAddEntry={addTimetableEntry}
            onRemoveEntry={removeTimetableEntry}
            onImportTimetable={importTimetable}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
