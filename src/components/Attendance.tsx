import { useState } from 'react';
import { Plus, Minus, AlertTriangle, CheckCircle } from 'lucide-react';
import { AppData, Semester, Subject } from '@/lib/types';
import { getAttendancePercentage, getAttendanceStatus } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SemesterTabs } from './SemesterTabs';

interface AttendanceProps {
  data: AppData;
  currentSemester: Semester;
  activeSemester: number;
  onSemesterChange: (id: number) => void;
  onAddSemester: () => void;
  onRemoveSemester: (id: number) => void;
  onUpdateAttendance: (semesterId: number, subjectId: string, delta: number, type: 'attended' | 'total') => void;
  onSetAttendance: (semesterId: number, subjectId: string, attended: number, total: number) => void;
}

export const Attendance = ({
  data,
  currentSemester,
  activeSemester,
  onSemesterChange,
  onAddSemester,
  onRemoveSemester,
  onUpdateAttendance,
  onSetAttendance,
}: AttendanceProps) => {
  // Calculate overall attendance
  const totalClasses = currentSemester?.subjects.reduce((acc, s) => acc + s.attendance.total, 0) || 0;
  const attendedClasses = currentSemester?.subjects.reduce((acc, s) => acc + s.attendance.attended, 0) || 0;
  const overallPercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 100;
  const overallStatus = getAttendanceStatus(overallPercentage);

  const subjectsBelow75 = currentSemester?.subjects.filter(s => getAttendancePercentage(s) < 75).length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Overall Attendance</p>
          <div className="mt-2 flex items-end gap-2">
            <span className={cn(
              'font-mono text-4xl font-bold',
              overallStatus === 'success' && 'text-success',
              overallStatus === 'warning' && 'text-warning',
              overallStatus === 'danger' && 'text-destructive'
            )}>
              {overallPercentage.toFixed(1)}%
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {attendedClasses} / {totalClasses} classes attended
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Subjects at Risk</p>
          <div className="mt-2 flex items-center gap-3">
            <span className={cn(
              'font-mono text-4xl font-bold',
              subjectsBelow75 > 0 ? 'text-destructive' : 'text-success'
            )}>
              {subjectsBelow75}
            </span>
            {subjectsBelow75 > 0 ? (
              <AlertTriangle className="h-6 w-6 text-destructive" />
            ) : (
              <CheckCircle className="h-6 w-6 text-success" />
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {subjectsBelow75 > 0 ? 'Below 75% threshold' : 'All subjects above 75%'}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Subjects</p>
          <div className="mt-2">
            <span className="font-mono text-4xl font-bold text-foreground">
              {currentSemester?.subjects.length || 0}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Tracked this semester
          </p>
        </div>
      </div>

      {/* Semester Tabs */}
      <SemesterTabs
        semesters={data.semesters}
        activeSemester={activeSemester}
        maxSemester={data.maxSemester}
        onSemesterChange={onSemesterChange}
        onAddSemester={onAddSemester}
        onRemoveSemester={onRemoveSemester}
      />

      {/* Attendance Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Subject</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Present</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Missed</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Percentage</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentSemester?.subjects.map(subject => {
                const percentage = getAttendancePercentage(subject);
                const status = getAttendanceStatus(percentage);
                const missed = subject.attendance.total - subject.attendance.attended;

                return (
                  <tr key={subject.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-card-foreground">{subject.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        min="0"
                        value={subject.attendance.total}
                        onChange={(e) => {
                          const newTotal = Math.max(0, parseInt(e.target.value) || 0);
                          const newAttended = Math.min(subject.attendance.attended, newTotal);
                          onSetAttendance(activeSemester, subject.id, newAttended, newTotal);
                        }}
                        className="w-16 h-8 text-center font-mono"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        min="0"
                        max={subject.attendance.total}
                        value={subject.attendance.attended}
                        onChange={(e) => {
                          const newAttended = Math.max(0, Math.min(subject.attendance.total, parseInt(e.target.value) || 0));
                          onSetAttendance(activeSemester, subject.id, newAttended, subject.attendance.total);
                        }}
                        className="w-16 h-8 text-center font-mono"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        min="0"
                        max={subject.attendance.total}
                        value={missed}
                        onChange={(e) => {
                          const newMissed = Math.max(0, Math.min(subject.attendance.total, parseInt(e.target.value) || 0));
                          const newAttended = subject.attendance.total - newMissed;
                          onSetAttendance(activeSemester, subject.id, newAttended, subject.attendance.total);
                        }}
                        className="w-16 h-8 text-center font-mono"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn(
                          'font-mono text-sm font-medium',
                          status === 'success' && 'text-success',
                          status === 'warning' && 'text-warning',
                          status === 'danger' && 'text-destructive'
                        )}>
                          {percentage.toFixed(1)}%
                        </span>
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              status === 'success' && 'bg-success',
                              status === 'warning' && 'bg-warning',
                              status === 'danger' && 'bg-destructive'
                            )}
                            style={{ width: `${Math.min(100, percentage)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => {
                            onUpdateAttendance(activeSemester, subject.id, 1, 'attended');
                            onUpdateAttendance(activeSemester, subject.id, 1, 'total');
                          }}
                        >
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => onUpdateAttendance(activeSemester, subject.id, 1, 'total')}
                        >
                          Absent
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(!currentSemester?.subjects.length) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No subjects in this semester. Add subjects from the Dashboard.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
