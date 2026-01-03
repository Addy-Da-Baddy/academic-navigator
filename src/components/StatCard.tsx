import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30',
        variant === 'primary' && 'border-primary/30 shadow-glow',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn(
            'font-mono text-3xl font-bold tracking-tight',
            variant === 'primary' && 'text-primary',
            variant === 'success' && 'text-success',
            variant === 'warning' && 'text-warning',
            variant === 'default' && 'text-foreground'
          )}>
            {typeof value === 'number' ? value.toFixed(2) : value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            variant === 'primary' && 'bg-primary/10 text-primary',
            variant === 'success' && 'bg-success/10 text-success',
            variant === 'warning' && 'bg-warning/10 text-warning',
            variant === 'default' && 'bg-muted text-muted-foreground'
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
};
