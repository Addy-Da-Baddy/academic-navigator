import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Subject, GRADE_SCALE } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddSubjectDialogProps {
  onAdd: (subject: Omit<Subject, 'id'>) => void;
}

export const AddSubjectDialog = ({ onAdd }: AddSubjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('3');
  const [gradePoint, setGradePoint] = useState('8.0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      credits: parseInt(credits),
      gradePoint: parseFloat(gradePoint),
      attendance: { attended: 0, total: 0 },
    });

    setName('');
    setCredits('3');
    setGradePoint('8.0');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              placeholder="e.g., Mathematics II"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Select value={credits} onValueChange={setCredits}>
                <SelectTrigger id="credits">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(c => (
                    <SelectItem key={c} value={c.toString()}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select value={gradePoint} onValueChange={setGradePoint}>
                <SelectTrigger id="grade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_SCALE.map(g => (
                    <SelectItem key={g.grade} value={g.point.toString()}>
                      {g.grade} ({g.point})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Subject</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
