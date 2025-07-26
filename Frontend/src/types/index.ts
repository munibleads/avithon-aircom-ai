import { LucideIcon } from 'lucide-react';

export interface Action {
  id: number;
  type: string;
  action: string;
  details: string;
  icon: LucideIcon;
  priority: 'high' | 'medium' | 'low';
}

export interface AudioData {
  audioFile: string;
  transcription: string;
  frequency: string;
  controller: string;
  forMyCallsign: boolean;
  signalStrength: number;
  confidence: number;
  suggestions: Action[];
}

export interface ApprovedAction extends Action {
  timestamp: string;
} 