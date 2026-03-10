import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import HeaderBar from '../../components/HeaderBar';
import ActionButton from '../../components/ActionButton';
import { MOCK_TRANSCRIPTIONS } from '../../services/mockData';
import { TranscriptionResult } from '../../types';

interface TranscriberScreenProps {
  navigation: { goBack: () => void };
}

const TranscriberScreen: React.FC<TranscriberScreenProps> = ({ navigation }) => {
  const [activeMode, setActiveMode] = useState<'live' | 'file' | 'url'>('live');
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptions, setTranscriptions] = useState<TranscriptionResult[]>([]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalDuration, setTotalDuration] = useState('0:00');
  const [wordCount, setWordCount] = useState(0);

  const handleStartLiveTranscription = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate live transcription
      let index = 0;
      const interval = setInterval(() => {
        if (index < MOCK_TRANSCRIPTIONS.length) {
          setTranscriptions(prev => [...prev, MOCK_TRANSCRIPTIONS[index]]);
          setWordCount(prev => prev + MOCK_TRANSCRIPTIONS[index].text.split(' ').length);
          index++;
        } else {
          clearInterval(interval);
          setIsRecording(false);
        }
      }, 2000);
    }
  };

  const handleTranscribeUrl = () => {
    if (!mediaUrl.trim()) {
      Alert.alert('Error', 'Please enter a media URL');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTranscriptions(MOCK_TRANSCRIPTIONS);
      setWordCount(MOCK_TRANSCRIPTIONS.reduce((acc, t) => acc + t.text.split(' ').length, 0));
      setTotalDuration('0:19');
    }, 3000);
  };

  const handleExport = (format: string) => {
    Alert.alert('Export', `Exporting transcription as ${format}...`);
  };

  const handleDownloadTranscribed = () => {
    Alert.alert(
      'Download Options',
      'Choose format to download',
      [
        { text: 'TXT', onPress: () => handleExport('TXT') },
        { text: 'SRT (Subtitles)', onPress: () => handleExport('SRT') },
        { text: 'PDF', onPress: () => handleExport('PDF') },
        { text: 'DOCX', onPress: () => handleExport('DOCX') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Live Transcriber"
        subtitle="Real-time speech to text"
        onBack={() => navigation.goBack()}
        rightIcon="download"
        onRightPress={handleDownloadTranscribed}
        color={Colors.transcriberColor}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          {([
            { id: 'live' as const, icon: 'mic', label: 'Live' },
            { id: 'file' as const, icon: 'file', label: 'File' },
            { id: 'url' as const, icon: 'link', label: 'URL' },
          ]).map(mode => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeButton, activeMode === mode.id && styles.modeButtonActive]}
              onPress={() => setActiveMode(mode.id)}
            >
              <Feather
                name={mode.icon as keyof typeof Feather.glyphMap}
                size={18}
                color={activeMode === mode.id ? Colors.transcriberColor : Colors.textMuted}
              />
              <Text style={[styles.modeText, activeMode === mode.id && styles.modeTextActive]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{wordCount}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{transcriptions.length}</Text>
            <Text style={styles.statLabel}>Segments</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalDuration}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>EN</Text>
            <Text style={styles.statLabel}>Language</Text>
          </View>
        </View>

        {/* Live Mode */}
        {activeMode === 'live' && (
          <View style={styles.liveSection}>
            <View style={styles.visualizer}>
              {isRecording ? (
                <View style={styles.recordingVisualizer}>
                  {[30, 45, 60, 40, 55, 35, 50, 45, 60, 30].map((height, i) => (
                    <View
                      key={i}
                      style={[
                        styles.visualizerBar,
                        { height, backgroundColor: Colors.transcriberColor },
                      ]}
                    />
                  ))}
                </View>
              ) : (
                <Feather name="mic" size={48} color={Colors.textMuted} />
              )}
              <Text style={styles.visualizerText}>
                {isRecording ? 'Listening & Transcribing...' : 'Tap to start live transcription'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordButtonActive]}
              onPress={handleStartLiveTranscription}
            >
              <Feather
                name={isRecording ? 'square' : 'mic'}
                size={32}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* URL Mode */}
        {activeMode === 'url' && (
          <View style={styles.urlSection}>
            <View style={styles.urlInput}>
              <Feather name="link" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.urlText}
                value={mediaUrl}
                onChangeText={setMediaUrl}
                placeholder="Paste audio/video URL..."
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <ActionButton
              title={isProcessing ? 'AI is transcribing...' : 'Transcribe Media'}
              onPress={handleTranscribeUrl}
              icon="cpu"
              color={Colors.transcriberColor}
              loading={isProcessing}
              disabled={!mediaUrl.trim()}
              size="large"
              style={styles.transcribeBtn}
            />
          </View>
        )}

        {/* File Mode */}
        {activeMode === 'file' && (
          <View style={styles.fileSection}>
            <TouchableOpacity
              style={styles.fileUpload}
              onPress={() => Alert.alert('Upload', 'Select audio or video file')}
            >
              <Feather name="upload-cloud" size={48} color={Colors.transcriberColor} />
              <Text style={styles.fileUploadTitle}>Upload Media File</Text>
              <Text style={styles.fileUploadText}>
                Supports MP3, MP4, WAV, M4A, FLAC, OGG, AVI, MKV
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Transcription Output */}
        {transcriptions.length > 0 && (
          <View style={styles.transcriptionSection}>
            <View style={styles.transcriptionHeader}>
              <Text style={styles.transcriptionTitle}>Transcription</Text>
              <View style={styles.transcriptionActions}>
                <TouchableOpacity onPress={() => handleExport('TXT')} style={styles.actionSmallBtn}>
                  <Feather name="copy" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDownloadTranscribed} style={styles.actionSmallBtn}>
                  <Feather name="download" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Share', 'Share transcription')} style={styles.actionSmallBtn}>
                  <Feather name="share-2" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {transcriptions.map((item, index) => (
              <View key={item.id} style={styles.transcriptionItem}>
                <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
                <View style={styles.transcriptionContent}>
                  <Text style={styles.transcriptionText}>{item.text}</Text>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>
                      {(item.confidence * 100).toFixed(0)}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Export Options */}
            <View style={styles.exportSection}>
              <Text style={styles.exportTitle}>Export As</Text>
              <View style={styles.exportButtons}>
                {['TXT', 'SRT', 'PDF', 'DOCX', 'JSON'].map(format => (
                  <TouchableOpacity
                    key={format}
                    style={styles.exportBtn}
                    onPress={() => handleExport(format)}
                  >
                    <Text style={styles.exportBtnText}>{format}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
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
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  modeButtonActive: {
    backgroundColor: Colors.backgroundCard,
  },
  modeText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginLeft: 6,
    fontWeight: '500',
  },
  modeTextActive: {
    color: Colors.transcriberColor,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.transcriberColor,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  liveSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  visualizer: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  recordingVisualizer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
  },
  visualizerBar: {
    width: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  visualizerText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.transcriberColor,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.transcriberColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  recordButtonActive: {
    backgroundColor: Colors.error,
  },
  urlSection: {
    marginBottom: Spacing.xl,
  },
  urlInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  urlText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  transcribeBtn: {
    marginTop: Spacing.lg,
  },
  fileSection: {
    marginBottom: Spacing.xl,
  },
  fileUpload: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.transcriberColor + '30',
    borderStyle: 'dashed',
  },
  fileUploadTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
  },
  fileUploadText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  transcriptionSection: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  transcriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  transcriptionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  transcriptionActions: {
    flexDirection: 'row',
  },
  actionSmallBtn: {
    padding: Spacing.sm,
    marginLeft: 4,
  },
  transcriptionItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timestamp: {
    fontSize: FontSizes.xs,
    color: Colors.transcriberColor,
    fontWeight: '600',
    width: 40,
    marginTop: 2,
  },
  transcriptionContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  transcriptionText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  confidenceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  confidenceText: {
    fontSize: FontSizes.xs,
    color: Colors.success,
    fontWeight: '600',
  },
  exportSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  exportTitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  exportButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  exportBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exportBtnText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});

export default TranscriberScreen;
