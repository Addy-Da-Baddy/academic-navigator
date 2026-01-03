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
  // Prepare semester-wise data for charts
  const semesterData = Object.keys(data.semesters)
    .map(Number)
    .sort((a, b) => a - b)
    .map(id => {
      const semester = data.semesters[id];
      const { sgpa, totalCredits } = calculateSGPA(semester);
      return {
        name: `Sem ${id}`,
        sgpa: parseFloat(sgpa.toFixed(2)),
        credits: totalCredits,
        subjects: semester.subjects.length,
      };
    });

  // Calculate cumulative CGPA trend
  let cumulativeCredits = 0;
  let cumulativePoints = 0;
  const cgpaTrend = semesterData.map(sem => {
    const semesterDetail = data.semesters[parseInt(sem.name.split(' ')[1])];
    semesterDetail.subjects.forEach(s => {
      cumulativePoints += s.credits * s.gradePoint;
      cumulativeCredits += s.credits;
    });
    return {
      ...sem,
      cgpa: cumulativeCredits > 0 ? parseFloat((cumulativePoints / cumulativeCredits).toFixed(2)) : 0,
    };
  });

  // Subject distribution across all semesters
  const allSubjects = Object.values(data.semesters).flatMap(s => s.subjects);
  const gradeDistribution = [
    { range: '9-10', count: allSubjects.filter(s => s.gradePoint >= 9).length, color: 'hsl(var(--success))' },
    { range: '8-9', count: allSubjects.filter(s => s.gradePoint >= 8 && s.gradePoint < 9).length, color: 'hsl(var(--primary))' },
    { range: '7-8', count: allSubjects.filter(s => s.gradePoint >= 7 && s.gradePoint < 8).length, color: 'hsl(var(--warning))' },
    { range: '<7', count: allSubjects.filter(s => s.gradePoint < 7).length, color: 'hsl(var(--destructive))' },
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
              <p className="text-sm text-muted-foreground">Total Subjects</p>
              <p className="font-mono text-2xl font-bold text-foreground">{allSubjects.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* CGPA Trend Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-medium text-card-foreground">CGPA Trend</h3>
          <div className="h-64">
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
                <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
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
          </div>
        </div>

        {/* SGPA by Semester */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-medium text-card-foreground">SGPA by Semester</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="sgpa" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-medium text-card-foreground">Grade Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credits per Semester */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-medium text-card-foreground">Credits per Semester</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="credits" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
