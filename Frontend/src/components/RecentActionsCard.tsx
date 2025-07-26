import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApprovedAction } from '@/types';

interface RecentActionsCardProps {
  approvedSuggestions: ApprovedAction[];
}

const RecentActionsCard: React.FC<RecentActionsCardProps> = ({
  approvedSuggestions
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Recent Actions</span>
          </div>
          {approvedSuggestions.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {approvedSuggestions.length} completed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full overflow-y-auto">
        {approvedSuggestions.length > 0 ? (
          <div className="space-y-2">
            {approvedSuggestions.slice(-10).reverse().map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg border border-green-100">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium text-sm">{action.action}</div>
                    <div className="text-xs text-muted-foreground">{action.details}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {new Date(action.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="font-semibold text-lg mb-2">No Recent Activity</h3>
            <p className="text-muted-foreground">Completed actions will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActionsCard; 