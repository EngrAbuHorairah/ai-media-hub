import { FeatureCard } from '../types';
import { Colors } from './theme';

export const FEATURES: FeatureCard[] = [
  {
    id: 'downloader',
    title: 'Media Downloader',
    subtitle: 'Download from YouTube, Facebook, Instagram, TikTok & LinkedIn',
    icon: 'cloud-download',
    color: Colors.downloaderColor,
    route: 'Downloader',
  },
  {
    id: 'video-player',
    title: 'Smart Video Player',
    subtitle: 'Search & stream from all platforms in one place',
    icon: 'play-circle',
    color: Colors.videoPlayerColor,
    route: 'VideoPlayer',
  },
  {
    id: 'vpn-browser',
    title: 'VPN Browser',
    subtitle: 'Private & secure browsing with built-in VPN',
    icon: 'shield',
    color: Colors.vpnBrowserColor,
    route: 'VPNBrowser',
  },
  {
    id: 'translator',
    title: 'Video Translator',
    subtitle: 'Live voice & video translation in any language',
    icon: 'globe',
    color: Colors.translatorColor,
    route: 'Translator',
  },
  {
    id: 'transcriber',
    title: 'Live Transcriber',
    subtitle: 'Real-time transcription & download',
    icon: 'file-text',
    color: Colors.transcriberColor,
    route: 'Transcriber',
  },
  {
    id: 'summary',
    title: 'AI Summary Generator',
    subtitle: 'Generate reports from any media content',
    icon: 'bar-chart-2',
    color: Colors.summaryColor,
    route: 'SummaryGenerator',
  },
  {
    id: 'voice-recorder',
    title: 'Voice Recorder Pro',
    subtitle: 'Record with bass, echo, reverb & more effects',
    icon: 'mic',
    color: Colors.voiceRecorderColor,
    route: 'VoiceRecorder',
  },
  {
    id: 'call-recorder',
    title: 'Call Recorder',
    subtitle: 'Record phone calls with consent notification',
    icon: 'phone-call',
    color: Colors.callRecorderColor,
    route: 'CallRecorder',
  },
];

export const PLATFORMS = [
  { id: 'youtube', name: 'YouTube', icon: 'youtube', color: '#FF0000' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#E4405F' },
  { id: 'tiktok', name: 'music', icon: 'music', color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: '#0A66C2' },
];

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
];

export const VPN_SERVERS = [
  { id: '1', country: 'United States', city: 'New York', flag: '🇺🇸', latency: 25, isConnected: false, protocol: 'WireGuard' as const },
  { id: '2', country: 'United Kingdom', city: 'London', flag: '🇬🇧', latency: 45, isConnected: false, protocol: 'WireGuard' as const },
  { id: '3', country: 'Germany', city: 'Frankfurt', flag: '🇩🇪', latency: 38, isConnected: false, protocol: 'OpenVPN' as const },
  { id: '4', country: 'Japan', city: 'Tokyo', flag: '🇯🇵', latency: 120, isConnected: false, protocol: 'WireGuard' as const },
  { id: '5', country: 'Singapore', city: 'Singapore', flag: '🇸🇬', latency: 95, isConnected: false, protocol: 'IKEv2' as const },
  { id: '6', country: 'Canada', city: 'Toronto', flag: '🇨🇦', latency: 35, isConnected: false, protocol: 'WireGuard' as const },
  { id: '7', country: 'Australia', city: 'Sydney', flag: '🇦🇺', latency: 150, isConnected: false, protocol: 'OpenVPN' as const },
  { id: '8', country: 'Netherlands', city: 'Amsterdam', flag: '🇳🇱', latency: 42, isConnected: false, protocol: 'WireGuard' as const },
  { id: '9', country: 'Switzerland', city: 'Zurich', flag: '🇨🇭', latency: 40, isConnected: false, protocol: 'IKEv2' as const },
  { id: '10', country: 'India', city: 'Mumbai', flag: '🇮🇳', latency: 85, isConnected: false, protocol: 'OpenVPN' as const },
];

export const QUALITY_OPTIONS = [
  { label: '4K (2160p)', value: '2160p' },
  { label: 'Full HD (1080p)', value: '1080p' },
  { label: 'HD (720p)', value: '720p' },
  { label: 'SD (480p)', value: '480p' },
  { label: 'Low (360p)', value: '360p' },
  { label: 'Audio Only (MP3)', value: 'audio' },
];
