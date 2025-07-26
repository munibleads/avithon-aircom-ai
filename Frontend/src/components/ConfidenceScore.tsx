import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfidenceScoreProps {
  confidence?: number;
  size?: 'sm' | 'lg';
}

export const ConfidenceScore = ({ confidence = 0, size = 'sm' }: ConfidenceScoreProps) => {
  const getConfidenceLevel = (score: number) => {
    if (score >= 0.95) return { level: 'HIGH', color: 'bg-green-500', textColor: 'text-green-600', bgColor: 'bg-green-50' };
    if (score >= 0.85) return { level: 'MEDIUM', color: 'bg-amber-500', textColor: 'text-amber-600', bgColor: 'bg-amber-50' };
    return { level: 'LOW', color: 'bg-red-500', textColor: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const confidenceInfo = getConfidenceLevel(confidence);
  const percentage = Math.round(confidence * 100);
  const isLarge = size === 'lg';

  return (
    <div className={`flex items-center space-x-2 ${isLarge ? 'p-2' : 'py-1 px-2'} rounded-lg ${confidenceInfo.bgColor} border border-current/20`}>
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${confidenceInfo.color}`}></div>
        <span className={`font-mono font-bold ${isLarge ? 'text-sm' : 'text-xs'} ${confidenceInfo.textColor}`}>
          {percentage}%
        </span>
      </div>
      <span className={`font-semibold ${isLarge ? 'text-xs' : 'text-[10px]'} ${confidenceInfo.textColor} uppercase tracking-wider`}>
        AI {confidenceInfo.level}
      </span>
      {confidenceInfo.level === 'LOW' && (
        <AlertTriangle className={`${isLarge ? 'h-4 w-4' : 'h-3 w-3'} ${confidenceInfo.textColor}`} />
      )}
    </div>
  );
}; 