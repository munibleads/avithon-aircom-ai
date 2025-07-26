import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActionCard } from '@/components';
import { Action } from '@/types';

interface RequiredActionsCardProps {
  suggestions: Action[];
  onApproveSuggestion: (suggestion: Action) => void;
  onRejectSuggestion: (suggestionId: number) => void;
}

const RequiredActionsCard: React.FC<RequiredActionsCardProps> = ({
  suggestions,
  onApproveSuggestion,
  onRejectSuggestion
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Required Actions</span>
          </div>
          {suggestions.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {suggestions.length} pending
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full overflow-y-auto">
        {suggestions.length > 0 ? (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <ActionCard
                key={suggestion.id}
                action={suggestion}
                onApprove={onApproveSuggestion}
                onReject={onRejectSuggestion}
                isFirst={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
            <h3 className="font-semibold text-lg mb-2">All Clear</h3>
            <p className="text-muted-foreground">No pending ATC instructions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequiredActionsCard; 