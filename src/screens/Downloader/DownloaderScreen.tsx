import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { QUALITY_OPTIONS } from '../../constants/features';
import HeaderBar from '../../components/HeaderBar';
import SearchBar from '../../components/SearchBar';
import PlatformSelector from '../../components/PlatformSelector';
import ActionButton from '../../components/ActionButton';
import DownloadItemComponent from '../../components/DownloadItem';
import { MOCK_DOWNLOADS } from '../../services/mockData';
import { DownloadItem, Platform } from '../../types';

interface DownloaderScreenProps {
  navigation: { goBack: () => void };
}

const DownloaderScreen: React.FC<DownloaderScreenProps> = ({ navigation }) => {
  const [url, setUrl] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>(MOCK_DOWNLOADS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [activeTab, setActiveTab] = useState<'new' | 'active' | 'completed'>('new');

  const detectPlatform = (inputUrl: string): Platform => {
    if (inputUrl.includes('youtube.com') || inputUrl.includes('youtu.be')) return 'youtube';
    if (inputUrl.includes('facebook.com') || inputUrl.includes('fb.watch')) return 'facebook';
    if (inputUrl.includes('instagram.com')) return 'instagram';
    if (inputUrl.includes('tiktok.com')) return 'tiktok';
    if (inputUrl.includes('linkedin.com')) return 'linkedin';
    return 'unknown';
  };

  const handleAnalyzeUrl = () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }
    setIsAnalyzing(true);
    const platform = detectPlatform(url);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowQuality(true);
      Alert.alert(
        'Media Detected',
        `Platform: ${platform.charAt(0).toUpperCase() + platform.slice(1)}\nType: Video\nDuration: 15:42\n\nSelect quality and tap Download to start.`
      );
    }, 2000);
  };

  const handleDownload = () => {
    if (!url.trim()) return;
    const platform = detectPlatform(url);
    const newDownload: DownloadItem = {
      id: `d${Date.now()}`,
      url,
      title: 'Downloading media...',
      platform,
      mediaType: 'video',
      quality: selectedQuality,
      size: 'Calculating...',
      progress: 0,
      status: 'downloading',
      createdAt: new Date(),
    };
    setDownloads([newDownload, ...downloads]);
    setUrl('');
    setShowQuality(false);
    setActiveTab('active');

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloads(prev =>
          prev.map(d =>
            d.id === newDownload.id
              ? { ...d, progress: 100, status: 'completed' as const, title: 'Downloaded Media', size: '125 MB' }
              : d
          )
        );
      } else {
        setDownloads(prev =>
          prev.map(d =>
            d.id === newDownload.id
              ? { ...d, progress: Math.round(progress) }
              : d
          )
        );
      }
    }, 500);
  };

  const handleTogglePlatform = (platformId: string) => {
    if (platformId === 'all') {
      setSelectedPlatforms([]);
      return;
    }
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const activeDownloads = downloads.filter(d => d.status === 'downloading' || d.status === 'paused' || d.status === 'pending');
  const completedDownloads = downloads.filter(d => d.status === 'completed');

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Media Downloader"
        subtitle="Download from any platform"
        onBack={() => navigation.goBack()}
        rightIcon="folder"
        onRightPress={() => Alert.alert('Downloads', 'Open downloads folder')}
        color={Colors.downloaderColor}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* URL Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Paste URL</Text>
          <SearchBar
            value={url}
            onChangeText={setUrl}
            placeholder="Paste video, audio, or media URL..."
            onSubmit={handleAnalyzeUrl}
            onClear={() => { setUrl(''); setShowQuality(false); }}
            rightIcon="clipboard"
            onRightIconPress={() => {
              // In production, would paste from clipboard
              setUrl('https://youtube.com/watch?v=example');
            }}
          />
        </View>

        {/* Platform Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Platform</Text>
          <PlatformSelector
            selectedPlatforms={selectedPlatforms}
            onTogglePlatform={handleTogglePlatform}
          />
        </View>

        {/* Analyze Button */}
        <ActionButton
          title={isAnalyzing ? 'Analyzing with AI...' : 'Analyze URL'}
          onPress={handleAnalyzeUrl}
          icon="cpu"
          color={Colors.downloaderColor}
          loading={isAnalyzing}
          disabled={!url.trim()}
          style={styles.analyzeButton}
        />

        {/* Quality Selection */}
        {showQuality && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Select Quality</Text>
            <View style={styles.qualityGrid}>
              {QUALITY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.qualityOption,
                    selectedQuality === option.value && styles.qualityOptionActive,
                  ]}
                  onPress={() => setSelectedQuality(option.value)}
                >
                  <Text
                    style={[
                      styles.qualityText,
                      selectedQuality === option.value && styles.qualityTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <ActionButton
              title="Download Now"
              onPress={handleDownload}
              icon="download"
              color={Colors.success}
              size="large"
              style={styles.downloadButton}
            />
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['new', 'active', 'completed'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'new' ? 'New' : tab === 'active' ? `Active (${activeDownloads.length})` : `Done (${completedDownloads.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Download List */}
        <View style={styles.downloadList}>
          {activeTab === 'active' && activeDownloads.map(item => (
            <DownloadItemComponent
              key={item.id}
              item={item}
              onPause={() => setDownloads(prev => prev.map(d => d.id === item.id ? { ...d, status: 'paused' as const } : d))}
              onResume={() => setDownloads(prev => prev.map(d => d.id === item.id ? { ...d, status: 'downloading' as const } : d))}
              onCancel={() => setDownloads(prev => prev.filter(d => d.id !== item.id))}
            />
          ))}
          {activeTab === 'completed' && completedDownloads.map(item => (
            <DownloadItemComponent
              key={item.id}
              item={item}
              onOpen={() => Alert.alert('Open', `Opening ${item.title}`)}
            />
          ))}
          {activeTab === 'new' && (
            <View style={styles.emptyState}>
              <Feather name="download-cloud" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Paste a URL to start</Text>
              <Text style={styles.emptyText}>
                Supports YouTube, Facebook, Instagram, TikTok, and LinkedIn
              </Text>
            </View>
          )}
        </View>

        {/* Supported formats */}
        <View style={styles.formatsSection}>
          <Text style={styles.formatsTitle}>Supported Media Types</Text>
          <View style={styles.formatsRow}>
            {[
              { icon: 'video', label: 'Video' },
              { icon: 'music', label: 'Audio' },
              { icon: 'image', label: 'Image' },
              { icon: 'file-text', label: 'Document' },
            ].map(format => (
              <View key={format.label} style={styles.formatItem}>
                <Feather name={format.icon as keyof typeof Feather.glyphMap} size={20} color={Colors.downloaderColor} />
                <Text style={styles.formatLabel}>{format.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  analyzeButton: {
    marginBottom: Spacing.xl,
  },
  qualityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  qualityOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qualityOptionActive: {
    backgroundColor: Colors.downloaderColor + '20',
    borderColor: Colors.downloaderColor,
  },
  qualityText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  qualityTextActive: {
    color: Colors.downloaderColor,
  },
  downloadButton: {
    marginTop: Spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabActive: {
    backgroundColor: Colors.backgroundCard,
  },
  tabText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  downloadList: {
    marginBottom: Spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.huge,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: Spacing.lg,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xxl,
  },
  formatsSection: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  formatsTitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  formatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  formatItem: {
    alignItems: 'center',
  },
  formatLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
});

export default DownloaderScreen;
