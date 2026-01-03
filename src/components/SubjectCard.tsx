import { Trash2, BookOpen } from 'lucide-react';
import { Subject, GRADE_SCALE } from '@/lib/types';
import { getAttendancePercentage, getAttendanceStatus } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SubjectCardProps {
  subject: Subject;
  onUpdate: (updates: Partial<Subject>) => void;
  onRemove: () => void;
}

export const SubjectCard = ({ subject, onUpdate, onRemove }: SubjectCardProps) => {
  const attendancePercent = getAttendancePercentage(subject);
  const attendanceStatus = getAttendanceStatus(attendancePercent);

  const statusColors = {
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-destructive',
  };

  const currentGrade = GRADE_SCALE.find(g => g.point === subject.gradePoint)?.grade || 'N/A';

  return (
    <div className="group relative rounded-xl border border-border bg-card p-4 transition-all card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-card-foreground truncate">{subject.name}</h3>
            <p className="text-sm text-muted-foreground">
              {subject.credits} credits
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <Select
              value={subject.gradePoint.toString()}
              onValueChange={(value) => onUpdate({ gradePoint: parseFloat(value) })}
            >
              <SelectTrigger className="w-[100px] h-9 font-mono text-lg font-bold text-primary border-none bg-transparent hover:bg-muted/50">
                <SelectValue>
                  {currentGrade} ({subject.gradePoint.toFixed(1)})
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {GRADE_SCALE.map((grade) => (
                  <SelectItem key={grade.grade} value={grade.point.toString()}>
                    <span className="font-mono font-semibold">{grade.grade}</span>
                    <span className="ml-2 text-muted-foreground">({grade.point}) - {grade.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Grade Point</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Attendance Bar */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Attendance</span>
          <span className={cn(
            'font-mono font-medium',
            attendanceStatus === 'success' && 'text-success',
            attendanceStatus === 'warning' && 'text-warning',
            attendanceStatus === 'danger' && 'text-destructive'
          )}>
            {attendancePercent.toFixed(0)}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={cn('h-full rounded-full transition-all duration-500', statusColors[attendanceStatus])}
            style={{ width: `${attendancePercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {subject.attendance.attended} / {subject.attendance.total} classes
        </p>
      </div>
    </div>
  );
};
