import { useState } from 'react';
import { Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { Timetable as TimetableType, DAYS, Day, TimetableEntry } from '@/lib/types';
import { getCurrentDayName, getUpcomingClass } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TimetableProps {
  timetable: TimetableType;
}

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM

export const Timetable = ({ timetable }: TimetableProps) => {
  const [view, setView] = useState<'week' | 'day'>('week');
  const currentDay = getCurrentDayName();
  const todayClasses = timetable[currentDay] || [];
  const upcomingClass = getUpcomingClass(todayClasses);

  const showClassInfo = (entry: TimetableEntry) => {
    toast.info(entry.fullName, {
      description: `${entry.time} • Room ${entry.room}`,
      duration: 3000,
    });
  };

  const getClassForTimeSlot = (day: Day, hour: number): TimetableEntry | null => {
    const classes = timetable[day] || [];
    return classes.find(c => c.startHour <= hour && c.endHour > hour) || null;
  };

  const isClassStart = (day: Day, hour: number): boolean => {
    const classes = timetable[day] || [];
    return classes.some(c => c.startHour === hour);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Weekly Schedule</h2>
          <p className="text-sm text-muted-foreground">Your class timetable at a glance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('week')}
          >
            Week View
          </Button>
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('day')}
          >
            Day View
          </Button>
        </div>
      </div>

      {/* Up Next Card */}
      {view === 'day' && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Up Next</p>
              {upcomingClass ? (
                <>
                  <p className="font-medium text-foreground">{upcomingClass.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {upcomingClass.time} • Room {upcomingClass.room}
                  </p>
                </>
              ) : (
                <p className="font-medium text-foreground">No more classes today</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Week View */}
      {view === 'week' && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="sticky left-0 bg-muted/80 backdrop-blur-sm px-3 py-3 text-left text-sm font-medium text-muted-foreground w-20">
                    Time
                  </th>
                  {DAYS.map(day => (
                    <th
                      key={day}
                      className={cn(
                        'px-3 py-3 text-center text-sm font-medium',
                        day === currentDay ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {day.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOURS.map(hour => (
                  <tr key={hour} className="border-b border-border last:border-0">
                    <td className="sticky left-0 bg-card px-3 py-2 text-sm font-mono text-muted-foreground border-r border-border">
                      {hour.toString().padStart(2, '0')}:00
                    </td>
                    {DAYS.map(day => {
                      const classEntry = getClassForTimeSlot(day, hour);
                      const isStart = isClassStart(day, hour);

                      if (classEntry && !isStart) {
                        return null; // Skip cells that are part of multi-hour classes
                      }

                      const rowSpan = classEntry ? classEntry.endHour - classEntry.startHour : 1;

                      return (
                        <td
                          key={`${day}-${hour}`}
                          className={cn(
                            'px-1 py-1 text-center',
                            day === currentDay && 'bg-primary/5'
                          )}
                          rowSpan={rowSpan}
                        >
                          {classEntry ? (
                            <button
                              onClick={() => showClassInfo(classEntry)}
                              className="w-full h-full min-h-[48px] rounded-lg bg-primary/10 border border-primary/20 px-2 py-2 text-left transition-all hover:bg-primary/20 hover:border-primary/40"
                            >
                              <div className="font-medium text-sm text-primary">{classEntry.shortName}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{classEntry.room}</div>
                            </button>
                          ) : (
                            <div className="h-12" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Day View */}
      {view === 'day' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="space-y-3">
            {todayClasses.length > 0 ? (
              todayClasses
                .sort((a, b) => a.startHour - b.startHour)
                .map((entry, index) => {
                  const now = new Date();
                  const currentHour = now.getHours() + now.getMinutes() / 60;
                  const isCurrent = currentHour >= entry.startHour && currentHour < entry.endHour;
                  const isPast = currentHour >= entry.endHour;

                  return (
                    <div
                      key={entry.id}
                      className={cn(
                        'rounded-xl border p-4 transition-all',
                        isCurrent && 'border-primary bg-primary/5 shadow-glow',
                        isPast && 'opacity-50',
                        !isCurrent && !isPast && 'border-border bg-card hover:border-primary/30'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium text-primary">{entry.shortName}</span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-primary-foreground animate-pulse-subtle">
                                Now
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-foreground">{entry.fullName}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {entry.time}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            Room {entry.room}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
                <CalendarIcon className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No classes scheduled for today</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
