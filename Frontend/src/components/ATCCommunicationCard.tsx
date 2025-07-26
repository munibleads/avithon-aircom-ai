import React, { useRef, useEffect } from 'react';
import { Radio, Volume2, Play, Square, RotateCcw, AlertTriangle, Copy, Rewind, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SignalStrength, ConfidenceScore, VoiceEmptyState } from '@/components';
import { AudioData } from '@/types';

interface ATCCommunicationCardProps {
  currentAudio: AudioData;
  isAudioPlaying: boolean;
  showTranscription: boolean;
  currentInstruction: string;
  currentFrequency: string;
  controllerType: string;
  aircraftCallsign: string;
  signalStrength: number;
  isSimulationRunning: boolean;
  onStartSimulation: () => void;
  onStopSimulation: () => void;
  onReplayAudio: () => void;
  onNextAudio: () => void;
  onCopyTranscription: (text: string) => void;
  formatTranscription: (text: string) => string;
  getConfidenceLevel: (confidence: number) => { level: string; color: string };
  audioRef: React.RefObject<HTMLAudioElement>;
}

const ATCCommunicationCard: React.FC<ATCCommunicationCardProps> = ({
  currentAudio,
  isAudioPlaying,
  showTranscription,
  currentInstruction,
  currentFrequency,
  controllerType,
  aircraftCallsign,
  signalStrength,
  isSimulationRunning,
  onStartSimulation,
  onStopSimulation,
  onReplayAudio,
  onNextAudio,
  onCopyTranscription,
  formatTranscription,
  getConfidenceLevel,
  audioRef
}) => {
  const isForMyCallsign = currentAudio.forMyCallsign && showTranscription;
  const confidenceLevel = getConfidenceLevel(currentAudio.confidence);

  // Enhanced replay with slow option
  const handleSlowReplay = () => {
    if (audioRef.current && currentInstruction) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = 0.75; // 75% speed for clarity
      audioRef.current.play();
    }
  };

  // Render formatted transcription with markdown-style formatting
  const renderFormattedText = (text: string) => {
    const formatted = formatTranscription(text);
    return formatted.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        return (
          <span key={index} className="font-bold text-blue-700 bg-blue-50 px-1 rounded">
            {content}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="h-5 w-5 text-blue-600" />
            <span>ATC Communication</span>
          </div>
        </CardTitle>
        
        {/* Simulation Note and Audio Controls */}
        <div className="space-y-6 py-2">
          <div className="text-xs text-muted-foreground text-center">
            Only for simulation
          </div>
          <div className="flex justify-center space-x-2">
            <Button 
              size="sm"
              variant="outline"
              onClick={onReplayAudio}
              disabled={isAudioPlaying || !showTranscription}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Replay
            </Button>
            <Button 
              size="sm"
              onClick={onStartSimulation}
              disabled={isAudioPlaying}
              className="aviation-gradient text-xs"
            >
              {isAudioPlaying ? <Volume2 className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
              {isAudioPlaying ? 'Playing' : 'Play'}
            </Button>
            <Button 
              size="sm"
              variant="outline"
              onClick={onNextAudio}
              disabled={isAudioPlaying}
              className="text-xs"
            >
              <SkipForward className="h-3 w-3 mr-1" />
              Play Next
            </Button>
            <Button 
              size="sm"
              variant="destructive" 
              onClick={onStopSimulation}
              disabled={!isSimulationRunning}
              className="text-xs"
            >
              <Square className="h-3 w-3 mr-1" />
              Stop
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        {isAudioPlaying ? (
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-6">
              {/* Audio Waveform Animation */}
              <div className="flex justify-center items-center mb-6">
                <div className="flex items-center space-x-2 h-24">
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={`wave-${i}`}
                      className="waveform-bar bg-gradient-to-t from-blue-500 to-blue-400 rounded-full"
                      style={{
                        width: '6px',
                        height: `${20 + (i % 6) * 12}px`,
                        animationDelay: `${i * 0.06}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>RECEIVING TRANSMISSION</span>
              </div>
            </div>
            
            {/* Consistent Radio Status During Transmission */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-lg font-bold">{currentFrequency}</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">{controllerType} CONTROL</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-muted-foreground">Signal:</span>
                  <span className="font-mono font-semibold">{signalStrength}%</span>
                </div>
                <div className="flex items-center justify-end">
                  <SignalStrength strength={signalStrength} />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-muted-foreground">Callsign:</span>
                  <span className="font-mono font-semibold">{aircraftCallsign}</span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  Processing...
                </div>
              </div>
            </div>
          </div>
        ) : showTranscription && currentInstruction ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Restructured Transmission Header - Priority: Frequency > Controller > Status */}
            <div className="space-y-2 mb-3 flex-shrink-0">
              <div className="flex justify-between items-center">
                <span className="font-mono text-lg font-bold">{currentFrequency}</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">{controllerType} CONTROL</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-muted-foreground">Confidence:</span>
                  <ConfidenceScore confidence={currentAudio.confidence} size="sm" />
                </div>
                <div className="flex items-center justify-end">
                  <SignalStrength strength={signalStrength} />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-muted-foreground">Signal:</span>
                  <span className="font-mono font-semibold">{signalStrength}%</span>
                </div>
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={onReplayAudio}
                    className="h-6 px-2 text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    REPLAY
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {/* Transcription */}
              <div className={`p-4 rounded-lg mb-4 ${isForMyCallsign ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                {isForMyCallsign && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-red-600 uppercase">FOR {aircraftCallsign}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCopyTranscription(currentInstruction)}
                        className="h-6 px-2 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        COPY
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleSlowReplay}
                        className="h-6 px-2 text-xs"
                      >
                        <Rewind className="h-3 w-3 mr-1" />
                        SLOW
                      </Button>
                    </div>
                  </div>
                )}
                <div className="font-medium text-xl leading-relaxed">
                  "{renderFormattedText(currentInstruction)}"
                </div>
                {!isForMyCallsign && (
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCopyTranscription(currentInstruction)}
                      className="h-6 px-2 text-xs text-muted-foreground"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Status Footer */}
            <div className="text-center text-sm pt-3 space-y-1 flex-shrink-0 border-t border-gray-100">
              {isForMyCallsign ? (
                <div className="text-red-600 font-medium text-xs">
                  ✓ Clearance received • {currentAudio.suggestions?.length || 0} actions identified
                </div>
              ) : (
                <div className="text-green-600 font-medium text-xs">
                  ✓ Transcription complete • Other traffic
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <VoiceEmptyState 
              onStartTransmission={onStartSimulation}
              currentFreq={currentFrequency}
              controllerType={controllerType}
              lastContact="14:23:45"
              signalStrength={signalStrength}
              aircraftCallsign={aircraftCallsign}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ATCCommunicationCard; 