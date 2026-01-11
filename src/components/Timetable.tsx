import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Pencil } from 'lucide-react';
import { Timetable as TimetableType, DAYS, Day, TimetableEntry } from '@/lib/types';
import { getCurrentDayName } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface TimetableProps {
  timetable: TimetableType;
  onUpdateEntry: (day: Day, entryId: string, updates: Partial<TimetableEntry>) => void;
  onAddEntry: (day: Day, entry: Omit<TimetableEntry, 'id'>) => void;
  onRemoveEntry: (day: Day, entryId: string) => void;
}

// Time slots matching the user's timetable exactly
const TIME_SLOTS = [
  { start: 8, end: 9, label: '08:00-09:00' },
  { start: 9, end: 10, label: '09:00-10:00' },
  { start: 10, end: 10.5, label: '10:00-10:30', isBreak: true, breakLabel: 'BREAK' },
  { start: 10.5, end: 11.5, label: '10:30-11:30' },
  { start: 11.5, end: 12.5, label: '11:30-12:30' },
  { start: 12.5, end: 13, label: '12:30-13:00', isBreak: true, breakLabel: 'LUNCH' },
  { start: 13, end: 14, label: '13:00-14:00' },
  { start: 14, end: 15, label: '14:00-15:00' },
  { start: 15, end: 16.5, label: '15:00-16:30' },
];

// Color presets matching user's exact CSS colors
const COLOR_PRESETS: Record<string, { bg: string; text: string; name: string }> = {
  blue: { bg: '#1e3a5f', text: '#66b3ff', name: 'AI' },      // AI IN CS
  pink: { bg: '#4c1d3d', text: '#ff66cc', name: 'EH' },      // ETHICAL HACKING
  green: { bg: '#1f4d3a', text: '#66ff99', name: 'DM' },     // DATA MINING
  yellow: { bg: '#3a3f1e', text: '#ffff66', name: 'EEFM' },  // EEFM
  purple: { bg: '#2d1e5f', text: '#bb99ff', name: 'NPACN' }, // NPACN
  orange: { bg: '#4a3a1e', text: '#ffcc66', name: 'OE' },    // OE
  red: { bg: '#3f1e1e', text: '#ff8866', name: 'LAB' },      // Labs (MADL, NDPL)
  cyan: { bg: '#1e4a4a', text: '#66ffff', name: 'Other' },
};

const getColor = (color?: string) => COLOR_PRESETS[color || 'blue'] || COLOR_PRESETS.blue;

interface ClassDialogProps {
  day: Day;
  entry?: TimetableEntry;
  onSave: (entry: Omit<TimetableEntry, 'id'>) => void;
  onClose: () => void;
  open: boolean;
}

const ClassDialog = ({ day, entry, onSave, onClose, open }: ClassDialogProps) => {
  const [shortName, setShortName] = useState('');
  const [fullName, setFullName] = useState('');
  const [room, setRoom] = useState('');
  const [startTime, setStartTime] = useState('9');
  const [endTime, setEndTime] = useState('10');
  const [color, setColor] = useState('blue');

  useEffect(() => {
    if (open) {
      setShortName(entry?.shortName || '');
      setFullName(entry?.fullName || '');
      setRoom(entry?.room || 'AB5-306');
      setStartTime(entry?.startHour.toString() || '9');
      setEndTime(entry?.endHour.toString() || '10');
      setColor(entry?.color || 'blue');
    }
  }, [open, entry]);

  const timeOptions = [
    { value: '8', label: '08:00' },
    { value: '9', label: '09:00' },
    { value: '10', label: '10:00' },
    { value: '10.5', label: '10:30' },
    { value: '11.5', label: '11:30' },
    { value: '12.5', label: '12:30' },
    { value: '13', label: '13:00' },
    { value: '14', label: '14:00' },
    { value: '15', label: '15:00' },
    { value: '16.5', label: '16:30' },
    { value: '17', label: '17:00' },
  ];

  const handleSubmit = () => {
    if (!shortName || !fullName) {
      toast.error('Please fill in required fields');
      return;
    }
    const start = parseFloat(startTime);
    const end = parseFloat(endTime);
    if (end <= start) {
      toast.error('End time must be after start time');
      return;
    }

    const formatTime = (h: number) => {
      const hours = Math.floor(h);
      const mins = (h % 1) * 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    onSave({
      shortName: shortName.toUpperCase(),
      fullName,
      room: room || 'TBA',
      startHour: start,
      endHour: end,
      time: `${formatTime(start)}-${formatTime(end)}`,
      color,
    });
    onClose();
    toast.success(entry ? 'Class updated' : 'Class added');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono">{entry ? 'Edit Class' : `Add Class to ${day}`}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Short Name *</Label>
              <Input 
                placeholder="e.g., MATH" 
                value={shortName} 
                onChange={(e) => setShortName(e.target.value.toUpperCase())} 
                className="font-mono font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Room</Label>
              <Input placeholder="e.g., AB5-306" value={room} onChange={(e) => setRoom(e.target.value)} className="font-mono" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Full Name *</Label>
            <Input placeholder="e.g., Mathematics" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="font-mono"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {timeOptions.map(t => (
                    <SelectItem key={t.value} value={t.value} className="font-mono">{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">End Time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="font-mono"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {timeOptions.map(t => (
                    <SelectItem key={t.value} value={t.value} className="font-mono">{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(COLOR_PRESETS).map(([key, c]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColor(key)}
                  className={cn(
                    'h-10 rounded-md border-2 transition-all',
                    color === key ? 'border-white scale-105 ring-2 ring-white/30' : 'border-transparent'
                  )}
                  style={{ backgroundColor: c.bg }}
                >
                  <span className="text-xs font-bold font-mono" style={{ color: c.text }}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full font-mono font-bold">
            {entry ? 'SAVE CHANGES' : 'ADD CLASS'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const Timetable = ({ timetable, onUpdateEntry, onAddEntry, onRemoveEntry }: TimetableProps) => {
  const [selectedDay, setSelectedDay] = useState<Day>('MONDAY');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<{ day: Day; entry: TimetableEntry } | null>(null);
  const [dragData, setDragData] = useState<{ day: Day; entry: TimetableEntry } | null>(null);
  const currentDay = getCurrentDayName();

  // Find class that starts at this slot
  const getClassAtSlot = (day: Day, slot: typeof TIME_SLOTS[0]): TimetableEntry | null => {
    const classes = timetable[day] || [];
    return classes.find(c => c.startHour >= slot.start && c.startHour < slot.end) || null;
  };

  // Check if slot is covered by a class starting earlier (including breaks)
  const isSlotCovered = (day: Day, slot: typeof TIME_SLOTS[0]): boolean => {
    const classes = timetable[day] || [];
    return classes.some(c => c.startHour < slot.start && c.endHour > slot.start);
  };

  // Calculate colspan for multi-slot classes (spans through breaks if class continues)
  const getColSpan = (entry: TimetableEntry, startSlotIndex: number): number => {
    let colSpan = 1;
    for (let i = startSlotIndex + 1; i < TIME_SLOTS.length; i++) {
      const slot = TIME_SLOTS[i];
      // Continue if the class extends past this slot's start time
      // This includes spanning through breaks
      if (entry.endHour > slot.start) {
        colSpan++;
      } else {
        break;
      }
    }
    return colSpan;
  };

  const formatTime = (h: number) => {
    const hours = Math.floor(h);
    const mins = (h % 1) * 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, day: Day, entry: TimetableEntry) => {
    setDragData({ day, entry });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', entry.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetDay: Day, targetSlot: typeof TIME_SLOTS[0]) => {
    e.preventDefault();
    if (!dragData || targetSlot.isBreak) {
      setDragData(null);
      return;
    }

    const { day: sourceDay, entry } = dragData;
    const duration = entry.endHour - entry.startHour;
    const newStartHour = targetSlot.start;
    const newEndHour = newStartHour + duration;

    // Check if slot is already occupied
    const targetClasses = timetable[targetDay] || [];
    const isOccupied = targetClasses.some(c => 
      c.id !== entry.id && 
      ((newStartHour >= c.startHour && newStartHour < c.endHour) ||
       (newEndHour > c.startHour && newEndHour <= c.endHour) ||
       (newStartHour <= c.startHour && newEndHour >= c.endHour))
    );

    if (isOccupied) {
      toast.error('Slot is already occupied');
      setDragData(null);
      return;
    }

    if (sourceDay === targetDay) {
      // Same day - just update
      onUpdateEntry(sourceDay, entry.id, {
        startHour: newStartHour,
        endHour: newEndHour,
        time: `${formatTime(newStartHour)}-${formatTime(newEndHour)}`,
      });
    } else {
      // Different day - remove and add
      onRemoveEntry(sourceDay, entry.id);
      onAddEntry(targetDay, {
        shortName: entry.shortName,
        fullName: entry.fullName,
        room: entry.room,
        color: entry.color,
        startHour: newStartHour,
        endHour: newEndHour,
        time: `${formatTime(newStartHour)}-${formatTime(newEndHour)}`,
      });
    }

    setDragData(null);
    toast.success('Class moved!');
  };

  const handleDragEnd = () => {
    setDragData(null);
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Header - Orange gradient like user's design */}
      <div 
        className="text-center p-5 rounded-lg"
        style={{ background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)' }}
      >
        <h1 className="text-xl font-bold tracking-widest text-black">
          SEMESTER VI / BTECH[CCE]-B
        </h1>
        <p className="text-sm mt-2 text-black font-semibold">ROOM: AB5-306</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Select value={selectedDay} onValueChange={(v) => setSelectedDay(v as Day)}>
            <SelectTrigger className="w-[140px] font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map(day => (
                <SelectItem key={day} value={day} className="font-mono">{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setAddDialogOpen(true)}
            className="font-mono font-bold"
            style={{ borderColor: '#ff6b00', color: '#ff6b00' }}
          >
            <Plus className="h-4 w-4 mr-1" /> ADD CLASS
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Drag classes to move • Click to edit</p>
      </div>

      {/* Timetable Grid */}
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-xs border-collapse" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th 
                  className="px-2 py-3 border font-bold tracking-wider text-black w-16"
                  style={{ backgroundColor: '#ff6b00', borderColor: '#333' }}
                >
                  DAY
                </th>
                {TIME_SLOTS.map((slot, i) => (
                  <th 
                    key={i}
                    className={cn(
                      'px-1 py-3 border font-bold text-[10px]',
                      slot.isBreak ? 'w-14' : ''
                    )}
                    style={{ 
                      backgroundColor: slot.isBreak ? '#0f0f0f' : '#ff6b00',
                      color: slot.isBreak ? '#666' : '#000',
                      borderColor: '#333'
                    }}
                  >
                    {slot.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map(day => (
                <tr 
                  key={day} 
                  className="transition-all"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td 
                    className={cn(
                      'px-2 py-3 border font-bold text-center tracking-widest text-black',
                      day === currentDay && 'ring-2 ring-inset ring-yellow-400'
                    )}
                    style={{ backgroundColor: '#ff6b00', borderColor: '#333' }}
                  >
                    {day.slice(0, 3)}
                  </td>
                  {TIME_SLOTS.map((slot, slotIndex) => {
                    // Skip if covered by previous class (including breaks covered by spanning classes)
                    if (isSlotCovered(day, slot)) {
                      return null;
                    }

                    // Break/Lunch slots (only render if not covered by a class)
                    if (slot.isBreak) {
                      return (
                        <td 
                          key={slotIndex}
                          className="py-3 border text-center font-semibold"
                          style={{ backgroundColor: '#0f0f0f', color: '#666', borderColor: '#333', fontSize: '10px' }}
                        >
                          {slot.breakLabel}
                        </td>
                      );
                    }

                    const entry = getClassAtSlot(day, slot);

                    if (entry) {
                      const colSpan = getColSpan(entry, slotIndex);
                      const color = getColor(entry.color);

                      return (
                        <td 
                          key={slotIndex}
                          colSpan={colSpan}
                          className="border p-1"
                          style={{ borderColor: '#333' }}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, day, slot)}
                        >
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, day, entry)}
                            onDragEnd={handleDragEnd}
                            onClick={() => setEditingEntry({ day, entry })}
                            className={cn(
                              'group w-full min-h-[50px] rounded px-2 py-2 text-center cursor-grab transition-all relative',
                              'hover:brightness-125 active:cursor-grabbing',
                              dragData?.entry.id === entry.id && 'opacity-50'
                            )}
                            style={{ backgroundColor: color.bg }}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <GripVertical className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: color.text }} />
                              <span className="font-bold text-sm" style={{ color: color.text }}>
                                {entry.shortName}
                              </span>
                            </div>
                            <div className="text-[9px] mt-1" style={{ color: '#999' }}>
                              {entry.room}
                            </div>
                            {/* Action buttons on hover */}
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingEntry({ day, entry });
                                }}
                                className="p-1 rounded transition-colors"
                                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                              >
                                <Pencil className="h-3 w-3" style={{ color: color.text }} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveEntry(day, entry.id);
                                  toast.success('Class removed');
                                }}
                                className="p-1 rounded transition-colors hover:bg-red-500/30"
                              >
                                <Trash2 className="h-3 w-3 text-red-400" />
                              </button>
                            </div>
                          </div>
                        </td>
                      );
                    }

                    // Empty slot - can drop here
                    return (
                      <td 
                        key={slotIndex}
                        className={cn(
                          'border transition-colors',
                          dragData && 'hover:bg-white/10'
                        )}
                        style={{ backgroundColor: '#0f0f0f', borderColor: '#333' }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, day, slot)}
                      >
                        <div className="h-[50px]" />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's Classes Summary */}
      <div className="rounded-lg border p-4" style={{ borderColor: '#333', backgroundColor: '#1a1a1a' }}>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: '#e6e6e6' }}>
          <span 
            className="inline-block w-2 h-2 rounded-full animate-pulse" 
            style={{ backgroundColor: '#22c55e' }} 
          />
          TODAY'S CLASSES ({currentDay.slice(0, 3)})
        </h3>
        <div className="flex flex-wrap gap-2">
          {(timetable[currentDay] || [])
            .sort((a, b) => a.startHour - b.startHour)
            .map(entry => {
              const color = getColor(entry.color);
              const now = new Date();
              const currentHour = now.getHours() + now.getMinutes() / 60;
              const isCurrent = currentHour >= entry.startHour && currentHour < entry.endHour;
              
              return (
                <div
                  key={entry.id}
                  className={cn(
                    'px-3 py-2 rounded text-xs transition-all cursor-pointer hover:brightness-125',
                    isCurrent && 'ring-2 ring-white/50'
                  )}
                  style={{ backgroundColor: color.bg }}
                  onClick={() => setEditingEntry({ day: currentDay, entry })}
                >
                  <span className="font-bold" style={{ color: color.text }}>{entry.shortName}</span>
                  <span className="ml-2" style={{ color: '#999' }}>{entry.time}</span>
                  {isCurrent && <span className="ml-2 text-[10px]" style={{ color: '#22c55e' }}>• NOW</span>}
                </div>
              );
            })}
          {(timetable[currentDay] || []).length === 0 && (
            <p className="text-sm" style={{ color: '#666' }}>No classes today 🎉</p>
          )}
        </div>
      </div>

      {/* Dialog */}
      <ClassDialog
        day={editingEntry?.day || selectedDay}
        entry={editingEntry?.entry}
        open={addDialogOpen || !!editingEntry}
        onSave={(entry) => {
          if (editingEntry) {
            onUpdateEntry(editingEntry.day, editingEntry.entry.id, entry);
          } else {
            onAddEntry(selectedDay, entry);
          }
        }}
        onClose={() => {
          setAddDialogOpen(false);
          setEditingEntry(null);
        }}
      />
    </div>
  );
};
