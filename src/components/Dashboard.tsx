import { useState } from 'react';
import { Target, TrendingUp, BookOpen, Award, Pencil, Check } from 'lucide-react';
import { Semester, AppData } from '@/lib/types';
import { StatCard } from './StatCard';
import { ProgressRing } from './ProgressRing';
import { SemesterTabs } from './SemesterTabs';
import { SubjectCard } from './SubjectCard';
import { AddSubjectDialog } from './AddSubjectDialog';
import { Subject } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  onSetTargetCGPA: (target: number) => void;
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
  onSetTargetCGPA,
}: DashboardProps) => {
  const progressToTarget = (cgpaData.cgpa / data.targetCGPA) * 100;
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetValue, setTargetValue] = useState(data.targetCGPA.toString());

  const handleSaveTarget = () => {
    const value = parseFloat(targetValue);
    if (!isNaN(value) && value >= 0 && value <= 10) {
      onSetTargetCGPA(value);
    }
    setIsEditingTarget(false);
  };

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
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Target className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target CGPA</p>
                {isEditingTarget ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      className="h-7 w-20 font-mono text-lg font-bold"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveTarget()}
                    />
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSaveTarget}>
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-2xl font-bold text-foreground">{data.targetCGPA.toFixed(1)}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 opacity-50 hover:opacity-100"
                      onClick={() => {
                        setTargetValue(data.targetCGPA.toString());
                        setIsEditingTarget(true);
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{progressToTarget.toFixed(0)}% achieved</p>
        </div>
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
