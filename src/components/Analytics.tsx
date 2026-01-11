import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { AppData, Semester } from '@/lib/types';
import { calculateSGPA } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

interface AnalyticsProps {
  data: AppData;
  cgpaData: { cgpa: number; totalCredits: number };
}

export const Analytics = ({ data, cgpaData }: AnalyticsProps) => {
  // Prepare semester-wise data for charts (only include semesters with graded subjects)
  const semesterData = Object.keys(data.semesters)
    .map(Number)
    .sort((a, b) => a - b)
    .map(id => {
      const semester = data.semesters[id];
      const { sgpa, totalCredits } = calculateSGPA(semester);
      const gradedSubjects = semester.subjects.filter(s => s.gradePoint >= 0);
      return {
        name: `Sem ${id}`,
        sgpa: parseFloat(sgpa.toFixed(2)),
        credits: totalCredits,
        subjects: gradedSubjects.length,
        hasGrades: gradedSubjects.length > 0,
      };
    });

  // Calculate cumulative CGPA trend (only include subjects with valid grades)
  let cumulativeCredits = 0;
  let cumulativePoints = 0;
  const cgpaTrend = semesterData
    .filter(sem => sem.hasGrades) // Only include semesters with graded subjects
    .map(sem => {
      const semesterDetail = data.semesters[parseInt(sem.name.split(' ')[1])];
      semesterDetail.subjects.forEach(s => {
        // Only include subjects with valid grades (gradePoint >= 0)
        if (s.gradePoint >= 0) {
          cumulativePoints += s.credits * s.gradePoint;
          cumulativeCredits += s.credits;
        }
      });
      return {
        ...sem,
        cgpa: cumulativeCredits > 0 ? parseFloat((cumulativePoints / cumulativeCredits).toFixed(2)) : 0,
      };
    });

  // Subject distribution across all semesters (only graded subjects)
  const allSubjects = Object.values(data.semesters).flatMap(s => s.subjects);
  const gradedSubjects = allSubjects.filter(s => s.gradePoint >= 0);
  const gradeDistribution = [
    { range: '9-10', count: gradedSubjects.filter(s => s.gradePoint >= 9).length, color: 'hsl(var(--success))' },
    { range: '8-9', count: gradedSubjects.filter(s => s.gradePoint >= 8 && s.gradePoint < 9).length, color: 'hsl(var(--primary))' },
    { range: '7-8', count: gradedSubjects.filter(s => s.gradePoint >= 7 && s.gradePoint < 8).length, color: 'hsl(var(--warning))' },
    { range: '<7', count: gradedSubjects.filter(s => s.gradePoint >= 0 && s.gradePoint < 7).length, color: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current CGPA</p>
              <p className="font-mono text-2xl font-bold text-foreground">{cgpaData.cgpa.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Target className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Target CGPA</p>
              <p className="font-mono text-2xl font-bold text-foreground">{data.targetCGPA.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Credits</p>
              <p className="font-mono text-2xl font-bold text-foreground">{cgpaData.totalCredits}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Graded Subjects</p>
              <p className="font-mono text-2xl font-bold text-foreground">{gradedSubjects.length}<span className="text-sm text-muted-foreground">/{allSubjects.length}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* CGPA Trend Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-medium text-card-foreground">CGPA Trend</h3>
          <div className="h-80">
            {cgpaTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cgpaTrend}>
                <defs>
                  <linearGradient id="cgpaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  domain={[(dataMin: number) => Math.max(0, Math.floor(dataMin) - 1), (dataMax: number) => Math.min(10, Math.ceil(dataMax) + 1)]} 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickFormatter={(value) => value.toFixed(1)}
                  tickCount={5}
                  interval={0}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [value.toFixed(2), 'CGPA']}
                />
                <Area
                  type="monotone"
                  dataKey="cgpa"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#cgpaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No graded semesters yet
              </div>
            )}
          </div>
        </div>

        {/* SGPA by Semester */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-medium text-card-foreground">SGPA by Semester</h3>
          <div className="h-80">
            {semesterData.filter(s => s.hasGrades).length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterData.filter(s => s.hasGrades)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  domain={[(dataMin: number) => Math.max(0, Math.floor(dataMin) - 1), (dataMax: number) => Math.min(10, Math.ceil(dataMax) + 1)]} 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickFormatter={(value) => value.toFixed(1)}
                  tickCount={5}
                  interval={0}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [value.toFixed(2), 'SGPA']}
                />
                <Bar dataKey="sgpa" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No graded semesters yet
              </div>
            )}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-medium text-card-foreground">Grade Distribution</h3>
          <div className="h-80">
            {gradedSubjects.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  allowDecimals={false}
                  domain={[0, 'auto']}
                  tickFormatter={(value) => Math.floor(value).toString()}
                />
                <YAxis type="category" dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} width={50} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [Math.floor(value), 'Subjects']}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No graded subjects yet
              </div>
            )}
          </div>
        </div>

        {/* Credits per Semester */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-medium text-card-foreground">Credits Earned per Semester</h3>
          <div className="h-80">
            {semesterData.filter(s => s.hasGrades).length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterData.filter(s => s.hasGrades)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  allowDecimals={false}
                  tickFormatter={(value) => Math.floor(value).toString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [Math.floor(value), 'Credits']}
                />
                <Bar dataKey="credits" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No graded semesters yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
