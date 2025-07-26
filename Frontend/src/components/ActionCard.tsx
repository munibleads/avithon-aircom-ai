import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Action } from '@/types';

interface ActionCardProps {
  action: Action;
  onApprove: (action: Action) => void;
  onReject: (actionId: number) => void;
  isFirst?: boolean;
}

export const ActionCard = ({ action, onApprove, onReject, isFirst = false }: ActionCardProps) => {
  const priorityConfig = {
    high: { 
      badge: 'bg-red-500 text-white',
      text: 'text-red-700',
      border: 'border-red-200'
    },
    medium: { 
      badge: 'bg-amber-500 text-white',
      text: 'text-amber-700',
      border: 'border-amber-200'
    },
    low: { 
      badge: 'bg-blue-500 text-white',
      text: 'text-blue-700',
      border: 'border-blue-200'
    }
  };

  const config = priorityConfig[action.priority];
  const Icon = action.icon;

  return (
    <div className={`
      bg-white hover:bg-gray-50/50 border ${config.border}
      rounded-xl p-3 transition-all duration-200 hover:shadow-sm
      ${isFirst ? 'ring-1 ring-blue-400/50 shadow-sm' : ''}
      backdrop-blur-sm flex items-center gap-3
    `}>
      {/* Left Side - Content */}
      <div className="flex-1 min-w-0">
        {/* Header with Priority & Icon */}
        <div className="flex items-center gap-2 mb-1.5">
          <Badge className={`${config.badge} text-xs font-medium px-2 py-0.5`}>
            {action.priority.toUpperCase()}
          </Badge>
          <Icon className={`h-4 w-4 ${config.text}`} />
        </div>

        {/* Action Content */}
        <div>
          <div className={`font-semibold text-sm ${config.text} leading-snug`}>
            {action.action}
          </div>
          <div className={`text-xs ${config.text} opacity-75 mt-0.5`}>
            {action.details}
          </div>
        </div>
      </div>

      {/* Right Side - Action Buttons */}
      <div className="flex gap-2 flex-shrink-0">
        <Button 
          onClick={() => onApprove(action)}
          className="h-7 px-3 text-xs font-medium bg-green-600 hover:bg-green-700 text-white border-0"
          size="sm"
        >
          Approve
        </Button>
        <Button 
          onClick={() => onReject(action.id)}
          variant="outline"
          size="sm"
          className="h-7 px-3 text-xs border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
        >
          Reject
        </Button>
      </div>
    </div>
  );
}; 