import React from 'react';
import { Signal } from 'lucide-react';

interface SignalStrengthProps {
  strength?: number;
}

export const SignalStrength = ({ strength = 85 }: SignalStrengthProps) => (
  <div className="flex items-center space-x-1">
    <Signal className="h-3 w-3 text-muted-foreground" />
    <div className="flex space-x-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-0.5 h-3 rounded-full ${
            i < Math.floor(strength / 20) ? 'bg-green-500' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
    <span className="text-xs text-muted-foreground font-mono">{strength}%</span>
  </div>
); 