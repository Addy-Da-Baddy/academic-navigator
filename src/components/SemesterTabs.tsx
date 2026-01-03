import { Plus, X } from 'lucide-react';
import { Semester } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SemesterTabsProps {
  semesters: { [key: number]: Semester };
  activeSemester: number;
  maxSemester: number;
  onSemesterChange: (id: number) => void;
  onAddSemester: () => void;
  onRemoveSemester: (id: number) => void;
}

export const SemesterTabs = ({
  semesters,
  activeSemester,
  maxSemester,
  onSemesterChange,
  onAddSemester,
  onRemoveSemester,
}: SemesterTabsProps) => {
  const semesterIds = Object.keys(semesters).map(Number).sort((a, b) => a - b);
  const canAdd = semesterIds.length < maxSemester;
  const canRemove = semesterIds.length > 1;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {semesterIds.map(id => (
        <button
          key={id}
          onClick={() => onSemesterChange(id)}
          className={cn(
            'group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap',
            activeSemester === id
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          <span>Sem {id}</span>
          {canRemove && activeSemester === id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSemester(id);
              }}
              className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground/20 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-primary-foreground/30"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </button>
      ))}
      {canAdd && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddSemester}
          className="h-9 gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      )}
    </div>
  );
};
