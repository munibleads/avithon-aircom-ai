
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, Mic, Signal, ArrowUp, RotateCw, Volume2, MapPin, TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { StatusBadge, ATCCommunicationCard, RequiredActionsCard, RecentActionsCard } from '@/components';
import { AudioData, Action, ApprovedAction } from '@/types';

const Index = () => {
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);
  const [suggestions, setSuggestions] = useState<Action[]>([]);
  const [approvedSuggestions, setApprovedSuggestions] = useState<ApprovedAction[]>([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const [currentFrequency, setCurrentFrequency] = useState('121.750');
  const [controllerType, setControllerType] = useState('TOWER');
  const [aircraftCallsign] = useState('UAL245');
  const [signalStrength, setSignalStrength] = useState(85);
  const [copiedTranscriptions, setCopiedTranscriptions] = useState<string[]>([]);
  const audioRef = useRef(null);
  const currentIndexRef = useRef(0);
  const { toast } = useToast();

  // Audio data with pre-loaded transcriptions and instructions
  const audioData: AudioData[] = [
    {
      audioFile: '/audio/atc-audio-1.wav',
      transcription: "csa nine two six roger line up runway three one cleared for takeoff wind two zero zero degrees four knots",
      frequency: "118.700",
      controller: "TOWER",
      forMyCallsign: false,
      signalStrength: 94,
      confidence: 0.96,
      suggestions: [
        { id: 1, type: 'takeoff', action: 'Line up runway 31', details: 'CSA926 cleared to line up runway 31', icon: Plane, priority: 'high' },
        { id: 2, type: 'takeoff', action: 'Takeoff clearance', details: 'Cleared for takeoff runway 31', icon: ArrowUp, priority: 'high' },
        { id: 3, type: 'weather', action: 'Note wind conditions', details: 'Wind 200° at 4 knots', icon: Signal, priority: 'medium' }
      ]
    },
    {
      audioFile: '/audio/atc-audio-2.wav',
      transcription: "radar good aftenoon eight delta inbound to tusin maintaining three four zero",
      frequency: "124.200",
      controller: "APPROACH",
      forMyCallsign: false,
      signalStrength: 87,
      confidence: 0.96,
      suggestions: [
        { id: 4, type: 'altitude', action: 'Maintain FL340', details: 'Continue maintaining flight level 340', icon: ArrowUp, priority: 'high' },
        { id: 5, type: 'navigation', action: 'Proceed to TUSIN', details: 'Continue inbound to TUSIN waypoint', icon: MapPin, priority: 'medium' },
        { id: 6, type: 'communication', action: 'Radar contact', details: 'Aircraft under radar control', icon: Signal, priority: 'low' }
      ]
    },
    {
      audioFile: '/audio/atc-audio-3.wav',
      transcription: "easy two five eight quebec resume own navigation to the left proceed direct to cerno left to cerno easy two five eight quebec",
      frequency: "132.450",
      controller: "CENTER",
      forMyCallsign: false,
      signalStrength: 91,
      confidence: 0.97,
      suggestions: [
        { id: 7, type: 'navigation', action: 'Resume own navigation', details: 'Resume own navigation procedures', icon: RotateCw, priority: 'high' },
        { id: 8, type: 'navigation', action: 'Direct to CERNO', details: 'Proceed direct to CERNO waypoint', icon: MapPin, priority: 'high' },
        { id: 9, type: 'direction', action: 'Turn left', details: 'Turn left to CERNO waypoint', icon: ArrowUp, priority: 'medium' }
      ]
    }
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnded);
      audioRef.current.addEventListener('loadeddata', () => {
        console.log('Audio loaded successfully');
      });
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, []);

  // Keep ref in sync with state
  useEffect(() => {
    currentIndexRef.current = currentAudioIndex;
  }, [currentAudioIndex]);

  const handleAudioEnded = () => {
    setIsAudioPlaying(false);
    // Show transcription immediately when audio ends - no delay for pilot safety
    const currentAudio = audioData[currentIndexRef.current];
    setCurrentInstruction(currentAudio.transcription);
    setCurrentFrequency(currentAudio.frequency);
    setControllerType(currentAudio.controller);
    setSignalStrength(currentAudio.signalStrength);
    setShowTranscription(true);
    setSuggestions(currentAudio.suggestions.slice(0, 2));
  };

  const startSimulation = () => {
    if (currentIndexRef.current < audioData.length) {
      setIsSimulationRunning(true);
      setShowTranscription(false);
      setCurrentInstruction('');
      setSuggestions([]);
      
      const currentAudio = audioData[currentIndexRef.current];
      if (audioRef.current) {
        audioRef.current.src = currentAudio.audioFile;
        audioRef.current.load();
        
        audioRef.current.play().then(() => {
          setIsAudioPlaying(true);
        }).catch((error) => {
          console.error('Error playing audio:', error);
          // If audio fails to play, show transcription immediately - pilot safety critical
          setCurrentInstruction(currentAudio.transcription);
          setCurrentFrequency(currentAudio.frequency);
          setControllerType(currentAudio.controller);
          setSignalStrength(currentAudio.signalStrength);
          setShowTranscription(true);
          setSuggestions(currentAudio.suggestions);
        });
      }
    }
  };

  const stopSimulation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAudioPlaying(false);
    setIsSimulationRunning(false);
    setShowTranscription(false);
    setCurrentInstruction('');
    setSuggestions([]);
  };

  const replayAudio = () => {
    if (audioRef.current && currentInstruction) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true);
        setTimeout(() => {
          setIsAudioPlaying(false);
        }, audioRef.current.duration * 1000);
      });
    }
  };

  const nextAudio = () => {
    let nextIndex;
    if (currentIndexRef.current < audioData.length - 1) {
      nextIndex = currentIndexRef.current + 1;
    } else {
      nextIndex = 0;
    }
    
    // Update both ref and state immediately
    currentIndexRef.current = nextIndex;
    setCurrentAudioIndex(nextIndex);
    setShowTranscription(false);
    setCurrentInstruction('');
    setSuggestions([]);
    setIsSimulationRunning(true);
    
    // Use the nextIndex directly to ensure we play the correct audio
    const nextAudio = audioData[nextIndex];
    if (audioRef.current && nextAudio) {
      audioRef.current.src = nextAudio.audioFile;
      audioRef.current.load();
      
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true);
      }).catch((error) => {
        console.error('Error playing audio:', error);
        // If audio fails to play, show transcription immediately - pilot safety critical
        setCurrentInstruction(nextAudio.transcription);
        setCurrentFrequency(nextAudio.frequency);
        setControllerType(nextAudio.controller);
        setSignalStrength(nextAudio.signalStrength);
        setShowTranscription(true);
        setSuggestions(nextAudio.suggestions.slice(0, 2));
      });
    }
  };



  const handleApproveSuggestion = (suggestion) => {
    const newApprovedAction = { ...suggestion, timestamp: new Date().toISOString() };
    setApprovedSuggestions(prev => [...prev, newApprovedAction]);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    toast({
      title: "Action Executed",
      description: `${suggestion.action} has been completed successfully.`,
      duration: 3000,
    });
    
    setTimeout(() => {
      nextAudio();
    }, 1000);
  };

  const handleRejectSuggestion = (suggestionId) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    toast({
      title: "Action Dismissed",
      description: "The instruction has been dismissed.",
      duration: 2000,
    });
  };

  // Aviation text formatting for pilot readability
  const formatTranscription = (text: string): string => {
    return text
      // Highlight callsigns (both formats)
      .replace(/(UAL245|United 245)/gi, '**$1**')
      // Highlight altitudes and flight levels
      .replace(/(flight level \d+|FL\d+)/gi, '**$1**')
      .replace(/(\d+,?\d*\s*feet?)/gi, '**$1**')
      // Highlight headings
      .replace(/(heading \d+)/gi, '**$1**')
      .replace(/(\d+\s*degrees?)/gi, '**$1**')
      // Highlight frequencies
      .replace(/(\d{3}\.\d{2,3})/g, '**$1**')
      // Highlight speed instructions
      .replace(/(\d+\s*knots?)/gi, '**$1**')
      // Highlight important commands
      .replace(/(climb|descend|turn|contact|cleared|reduce|maintain)/gi, '**$1**');
  };

  // Copy transcription to clipboard
  const copyTranscription = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTranscriptions(prev => [text, ...prev.slice(0, 9)]); // Keep last 10
      toast({
        title: "Transcription Copied",
        description: "ATC instruction copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        duration: 2000,
      });
    }
  };

  // Enhanced confidence evaluation for aviation safety
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.95) return { level: 'high', color: 'green' };
    if (confidence >= 0.90) return { level: 'medium', color: 'yellow' };
    return { level: 'low', color: 'red' };
  };

  const currentAudio = audioData[currentIndexRef.current] || {
    audioFile: '',
    frequency: '121.750',
    controller: 'TOWER',
    forMyCallsign: false,
    signalStrength: 85,
    confidence: 0,
    transcription: '',
    suggestions: []
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <audio ref={audioRef} preload="auto" />
      
      {/* Compact EFB Header */}
      <header className="sticky top-0 z-50 glass-header border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="aviation-gradient p-2 rounded-lg shadow-sm">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">AirCom AI</h1>
                <p className="text-xs text-muted-foreground">ATC Communication Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <StatusBadge 
                icon={Signal} 
                label={isAudioPlaying ? 'RECEIVING' : 'MONITORING'} 
                variant={isAudioPlaying ? 'danger' : 'success'}
                pulse={isAudioPlaying}
              />
              <Badge variant="outline" className="text-xs">
                {currentAudioIndex + 1}/{audioData.length}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* 4-Grid EFB Layout */}
      <div className="flex-1 container mx-auto px-6 py-4">
        <div className="grid grid-cols-2 gap-4 h-[calc(100vh-140px)]">
          
          {/* LEFT COLUMN: Voice Component (spans 2 rows) */}
          <div className="col-span-1 row-span-2">
            <ATCCommunicationCard
              currentAudio={currentAudio}
              isAudioPlaying={isAudioPlaying}
              showTranscription={showTranscription}
              currentInstruction={currentInstruction}
              currentFrequency={currentFrequency}
              controllerType={controllerType}
              aircraftCallsign={aircraftCallsign}
              signalStrength={signalStrength}
              isSimulationRunning={isSimulationRunning}
              onStartSimulation={startSimulation}
              onStopSimulation={stopSimulation}
              onReplayAudio={replayAudio}
              onNextAudio={nextAudio}
              onCopyTranscription={copyTranscription}
              formatTranscription={formatTranscription}
              getConfidenceLevel={getConfidenceLevel}
              audioRef={audioRef}
            />
          </div>

          {/* TOP RIGHT: ATC Actions */}
          <div className="col-span-1">
            <RequiredActionsCard
              suggestions={suggestions}
              onApproveSuggestion={handleApproveSuggestion}
              onRejectSuggestion={handleRejectSuggestion}
            />
          </div>

          {/* BOTTOM RIGHT: Recent Actions */}
          <div className="col-span-1">
            <RecentActionsCard
              approvedSuggestions={approvedSuggestions}
            />
          </div>

        </div>
      </div>

    </div>
  );
};

export default Index;
