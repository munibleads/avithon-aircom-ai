import React from 'react';
import { Headphones, Radio, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SignalStrength } from './SignalStrength';

interface VoiceEmptyStateProps {
  onStartTransmission: () => void;
  currentFreq?: string;
  controllerType?: string;
  lastContact?: string;
  signalStrength?: number;
  aircraftCallsign?: string;
}

export const VoiceEmptyState = ({ 
  onStartTransmission, 
  currentFreq = "121.750", 
  controllerType = "TOWER",
  lastContact = "14:23:45",
  signalStrength = 85,
  aircraftCallsign = "UAL245"
}: VoiceEmptyStateProps) => (
  <div className="flex flex-col h-full">
    {/* Consistent Radio Status Header */}
    <div className="space-y-2 mb-4 flex-shrink-0">
      <div className="flex justify-between items-center">
        <span className="font-mono text-lg font-bold">{currentFreq}</span>
        <Badge className="bg-green-100 text-green-800 text-xs">{controllerType} CONTROL</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center space-x-1">
          <span className="text-muted-foreground">Status:</span>
          <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">MONITORING</Badge>
        </div>
        <div className="flex items-center justify-end">
          <SignalStrength strength={signalStrength} />
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-muted-foreground">Callsign:</span>
          <span className="font-mono font-semibold">{aircraftCallsign}</span>
        </div>
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>

    {/* Center Status */}
    <div className="flex flex-col items-center justify-center text-center">
      <div className="p-4 bg-blue-50 rounded-full mb-4">
        <Headphones className="h-8 w-8 text-blue-600" />
      </div>
      
      <h3 className="font-semibold text-lg mb-2 text-blue-600">LISTENING WATCH</h3>
      <p className="text-sm text-muted-foreground mb-4">Monitoring {controllerType} frequency</p>
      
      <Button 
        onClick={onStartTransmission}
        className="mb-4 aviation-gradient"
        size="lg"
      >
        <Radio className="h-4 w-4 mr-2" />
        Begin Communications
      </Button>
    </div>
  </div>
); 