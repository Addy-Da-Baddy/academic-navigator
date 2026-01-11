import { useState, useRef } from 'react';
import { Target, TrendingUp, BookOpen, Award, Pencil, Check, Download, Upload, FileJson, FileText, FileUp, Link, Copy } from 'lucide-react';
import { Semester, AppData } from '@/lib/types';
import { StatCard } from './StatCard';
import { ProgressRing } from './ProgressRing';
import { SemesterTabs } from './SemesterTabs';
import { SubjectCard } from './SubjectCard';
import { AddSubjectDialog } from './AddSubjectDialog';
import { Subject } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { calculateSGPA } from '@/lib/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import LZString from 'lz-string';

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
  onImportData: (data: any) => void;
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
  onImportData,
}: DashboardProps) => {
  const progressToTarget = (cgpaData.cgpa / data.targetCGPA) * 100;
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetValue, setTargetValue] = useState(data.targetCGPA.toString());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveTarget = () => {
    const value = parseFloat(targetValue);
    if (!isNaN(value) && value >= 0 && value <= 10) {
      onSetTargetCGPA(value);
    }
    setIsEditingTarget(false);
  };

  const downloadTemplate = () => {
    const template = {
      targetCGPA: 9.0,
      semesters: [
        {
          id: 1,
          name: "Semester 1",
          subjects: [
            { name: "Subject Name", credits: 4, gradePoint: 10 },
            { name: "Another Subject", credits: 3, gradePoint: "N/A" }
          ]
        },
        {
          id: 2,
          name: "Semester 2",
          subjects: [
            { name: "Subject Name", credits: 4, gradePoint: 9 }
          ]
        }
      ]
    };
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'academic-data-template.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded - fill it and upload');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        // Validate structure
        if (!jsonData.semesters || !Array.isArray(jsonData.semesters)) {
          toast.error('Invalid format: missing semesters array');
          return;
        }

        for (const sem of jsonData.semesters) {
          if (!sem.subjects || !Array.isArray(sem.subjects)) {
            toast.error('Invalid format: each semester needs subjects array');
            return;
          }
          for (const sub of sem.subjects) {
            if (!sub.name || sub.credits === undefined) {
              toast.error('Invalid format: subjects need name and credits');
              return;
            }
          }
        }

        onImportData(jsonData);
        toast.success('Data imported successfully!');
      } catch (error) {
        toast.error('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    
    // Reset input so same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const exportAsJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      targetCGPA: data.targetCGPA,
      cgpa: cgpaData.cgpa,
      totalCredits: cgpaData.totalCredits,
      semesters: Object.values(data.semesters).map(sem => ({
        id: sem.id,
        name: sem.name,
        sgpa: calculateSGPA(sem).sgpa,
        subjects: sem.subjects.map(sub => ({
          name: sub.name,
          credits: sub.credits,
          gradePoint: sub.gradePoint === -1 ? 'N/A' : sub.gradePoint,
        })),
      })),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `academic-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported as JSON');
  };

  const exportAsPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to export PDF');
      return;
    }

    const semesterRows = Object.values(data.semesters).map(sem => {
      const sgpa = calculateSGPA(sem).sgpa;
      const subjectRows = sem.subjects.map(sub => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${sub.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${sub.credits}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${sub.gradePoint === -1 ? 'N/A' : sub.gradePoint}</td>
        </tr>
      `).join('');

      return `
        <div style="margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; color: #333;">${sem.name} (SGPA: ${sgpa.toFixed(2)})</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Subject</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Credits</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Grade Point</th>
              </tr>
            </thead>
            <tbody>${subjectRows}</tbody>
          </table>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Academic Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #1a1a1a; margin-bottom: 8px; }
            .summary { background: #f9f9f9; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
            .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
            .stat { text-align: center; }
            .stat-value { font-size: 28px; font-weight: bold; color: #2563eb; }
            .stat-label { font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Academic Report</h1>
          <p style="color: #666; margin-bottom: 24px;">Generated on ${new Date().toLocaleDateString()}</p>
          
          <div class="summary">
            <div class="summary-grid">
              <div class="stat">
                <div class="stat-value">${cgpaData.cgpa.toFixed(2)}</div>
                <div class="stat-label">CGPA</div>
              </div>
              <div class="stat">
                <div class="stat-value">${cgpaData.totalCredits}</div>
                <div class="stat-label">Total Credits</div>
              </div>
              <div class="stat">
                <div class="stat-value">${data.targetCGPA.toFixed(1)}</div>
                <div class="stat-label">Target CGPA</div>
              </div>
            </div>
          </div>

          ${semesterRows}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    toast.success('PDF export opened in print dialog');
  };

  const generateShareLink = async () => {
    try {
      // Create a minimal export of the data
      const shareData = {
        t: data.targetCGPA,
        s: Object.values(data.semesters).map(sem => ({
          i: sem.id,
          n: sem.name,
          sub: sem.subjects.map(sub => ({
            n: sub.name,
            c: sub.credits,
            g: sub.gradePoint,
            a: sub.attended,
            tot: sub.total,
          })),
        })),
        tt: data.timetable,
      };

      const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(shareData));
      const shareUrl = `${window.location.origin}${window.location.pathname}#data=${compressed}`;
      
      // Check if URL is too long
      if (shareUrl.length > 8000) {
        toast.error('Data too large for URL sharing. Use JSON export instead.');
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success(`Share link copied! (${Math.round(shareUrl.length / 1024)}KB)`, {
        description: 'Send this link to sync on another device',
        duration: 5000,
      });
    } catch (error) {
      toast.error('Failed to generate share link');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json"
        className="hidden"
      />

      {/* Header with Import/Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Track your academic progress</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <FileUp className="h-4 w-4 mr-2" />
                Upload JSON File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadTemplate}>
                <FileJson className="h-4 w-4 mr-2" />
                Download Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={generateShareLink}>
                <Link className="h-4 w-4 mr-2" />
                Share via Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportAsJSON}>
                <FileJson className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportAsPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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
