import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  icon: LucideIcon;
  label: string;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral';
  pulse?: boolean;
}

export const StatusBadge = ({ icon: Icon, label, variant = 'neutral', pulse = false }: StatusBadgeProps) => {
  const variants = {
    primary: 'border-primary/30 text-primary bg-primary/10',
    success: 'border-green-500/30 text-green-600 bg-green-500/10',
    danger: 'border-red-500/30 text-red-600 bg-red-500/10',
    warning: 'border-amber-500/30 text-amber-600 bg-amber-500/10',
    neutral: 'border-muted-foreground/30 text-muted-foreground bg-muted/50'
  };

  return (
    <Badge className={`glass-card px-3 py-1.5 text-xs font-semibold uppercase tracking-wide status-indicator ${variants[variant]} ${pulse ? 'listening-pulse' : ''}`}>
      <Icon className="w-3 h-3 mr-1.5" />
      {label}
    </Badge>
  );
}; 