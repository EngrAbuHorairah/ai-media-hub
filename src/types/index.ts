export interface FeatureCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;
}

export interface DownloadItem {
  id: string;
  url: string;
  title: string;
  thumbnail?: string;
  platform: Platform;
  mediaType: MediaType;
  quality?: string;
  size?: string;
  progress: number;
  status: DownloadStatus;
  filePath?: string;
  createdAt: Date;
}

export type Platform = 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'unknown';

export type MediaType = 'video' | 'audio' | 'image' | 'document' | 'other';

export type DownloadStatus = 'pending' | 'downloading' | 'completed' | 'failed' | 'paused';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  platform: Platform;
  channelName: string;
  channelAvatar?: string;
  publishedAt: string;
  url: string;
  isLive?: boolean;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

export interface TranscriptionResult {
  id: string;
  text: string;
  timestamp: number;
  duration: number;
  language: string;
  confidence: number;
}

export interface SummaryReport {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: MediaType;
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  topics: string[];
  wordCount: number;
  readingTime: string;
  generatedAt: Date;
}

export interface RecordingItem {
  id: string;
  title: string;
  filePath: string;
  duration: number;
  size: string;
  format: string;
  createdAt: Date;
  effects: AudioEffects;
}

export interface AudioEffects {
  bass: number;
  treble: number;
  echo: number;
  volume: number;
  reverb: number;
  noiseCancellation: boolean;
  equalizer: number[];
}

export interface CallRecordingItem {
  id: string;
  contactName: string;
  phoneNumber: string;
  callType: 'incoming' | 'outgoing';
  duration: number;
  filePath: string;
  createdAt: Date;
  isConsentGiven: boolean;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isPrivate: boolean;
  isLoading: boolean;
}

export interface VPNServer {
  id: string;
  country: string;
  city: string;
  flag: string;
  latency: number;
  isConnected: boolean;
  protocol: 'OpenVPN' | 'WireGuard' | 'IKEv2';
}
