import { Target, TrendingUp, BookOpen, Award } from 'lucide-react';
import { Semester, AppData } from '@/lib/types';
import { StatCard } from './StatCard';
import { ProgressRing } from './ProgressRing';
import { SemesterTabs } from './SemesterTabs';
import { SubjectCard } from './SubjectCard';
import { AddSubjectDialog } from './AddSubjectDialog';
import { Subject } from '@/lib/types';

interface DashboardProps {
  data: AppData;
  currentSemester: Semester;
  activeSemester: number;
  sgpaData: { sgpa: number; totalCredits: number };
  cgpaData: { cgpa: number; totalCredits: number };
  onSemesterChange: (id: number) => void;
  onAddSemester: () => void;
  onRemoveSemester: (id: number) => void;
  onUpdateSubject: (semesterId: number, subjectId: string, updates: Partial<Subject>) => void;
  onAddSubject: (semesterId: number, subject: Omit<Subject, 'id'>) => void;
  onRemoveSubject: (semesterId: number, subjectId: string) => void;
}

export const Dashboard = ({
  data,
  currentSemester,
  activeSemester,
  sgpaData,
  cgpaData,
  onSemesterChange,
  onAddSemester,
  onRemoveSemester,
  onUpdateSubject,
  onAddSubject,
  onRemoveSubject,
}: DashboardProps) => {
  const progressToTarget = (cgpaData.cgpa / data.targetCGPA) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current SGPA"
          value={sgpaData.sgpa}
          subtitle={`${sgpaData.totalCredits} credits this semester`}
          icon={TrendingUp}
          variant="primary"
        />
        <StatCard
          title="Cumulative CGPA"
          value={cgpaData.cgpa}
          subtitle={`${cgpaData.totalCredits} total credits`}
          icon={Award}
          variant="success"
        />
        <StatCard
          title="Target CGPA"
          value={data.targetCGPA}
          subtitle={`${progressToTarget.toFixed(0)}% achieved`}
          icon={Target}
        />
        <StatCard
          title="Total Subjects"
          value={currentSemester?.subjects.length || 0}
          subtitle="Active this semester"
          icon={BookOpen}
        />
      </div>

      {/* Progress Ring Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">CGPA Progress</h3>
            <div className="flex flex-col items-center gap-4">
              <ProgressRing
                value={cgpaData.cgpa}
                max={10}
                size={160}
                strokeWidth={10}
                variant="primary"
              />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {(data.targetCGPA - cgpaData.cgpa).toFixed(2)} points to target
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <SemesterTabs
              semesters={data.semesters}
              activeSemester={activeSemester}
              maxSemester={data.maxSemester}
              onSemesterChange={onSemesterChange}
              onAddSemester={onAddSemester}
              onRemoveSemester={onRemoveSemester}
            />
            <AddSubjectDialog onAdd={(subject) => onAddSubject(activeSemester, subject)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {currentSemester?.subjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onUpdate={(updates) => onUpdateSubject(activeSemester, subject.id, updates)}
                onRemove={() => onRemoveSubject(activeSemester, subject.id)}
              />
            ))}
            {(!currentSemester?.subjects.length) && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
                <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No subjects added yet</p>
                <p className="text-xs text-muted-foreground/70">Click "Add Subject" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
