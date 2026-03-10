import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import HeaderBar from '../../components/HeaderBar';
import SliderControl from '../../components/SliderControl';
import { MOCK_RECORDINGS, formatDuration, formatDate } from '../../services/mockData';
import { RecordingItem, AudioEffects } from '../../types';

const { width } = Dimensions.get('window');

interface VoiceRecorderScreenProps {
  navigation: { goBack: () => void };
}

const VoiceRecorderScreen: React.FC<VoiceRecorderScreenProps> = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<RecordingItem[]>(MOCK_RECORDINGS);
  const [showEffects, setShowEffects] = useState(false);
  const [activeTab, setActiveTab] = useState<'record' | 'library'>('record');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [effects, setEffects] = useState<AudioEffects>({
    bass: 50,
    treble: 50,
    echo: 0,
    volume: 100,
    reverb: 0,
    noiseCancellation: true,
    equalizer: [50, 50, 50, 50, 50, 50, 50, 50],
  });

  const eqBands = ['32Hz', '64Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz'];

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const handlePauseRecording = () => {
    setIsPaused(!isPaused);
    if (!isPaused && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    } else {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const newRecording: RecordingItem = {
      id: `r${Date.now()}`,
      title: `Recording ${recordings.length + 1}`,
      filePath: `/recordings/recording_${Date.now()}.m4a`,
      duration: recordingTime,
      size: `${(recordingTime * 0.08).toFixed(1)} MB`,
      format: 'M4A',
      createdAt: new Date(),
      effects: { ...effects },
    };

    setRecordings([newRecording, ...recordings]);
    setRecordingTime(0);
    Alert.alert('Recording Saved', `Duration: ${formatDuration(recordingTime)}`);
  };

  const handlePlayRecording = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  const handleDeleteRecording = (id: string) => {
    Alert.alert('Delete Recording', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setRecordings(prev => prev.filter(r => r.id !== id)) },
    ]);
  };

  const updateEffect = (key: keyof AudioEffects, value: number | boolean) => {
    setEffects(prev => ({ ...prev, [key]: value }));
  };

  const updateEqualizer = (index: number, value: number) => {
    setEffects(prev => {
      const newEq = [...prev.equalizer];
      newEq[index] = value;
      return { ...prev, equalizer: newEq };
    });
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Voice Recorder Pro"
        subtitle="Record with professional effects"
        onBack={() => navigation.goBack()}
        rightIcon="sliders"
        onRightPress={() => setShowEffects(!showEffects)}
        color={Colors.voiceRecorderColor}
      />

      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'record' && styles.tabActive]}
          onPress={() => setActiveTab('record')}
        >
          <Feather name="mic" size={16} color={activeTab === 'record' ? Colors.voiceRecorderColor : Colors.textMuted} />
          <Text style={[styles.tabText, activeTab === 'record' && styles.tabTextActive]}>Record</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'library' && styles.tabActive]}
          onPress={() => setActiveTab('library')}
        >
          <Feather name="folder" size={16} color={activeTab === 'library' ? Colors.voiceRecorderColor : Colors.textMuted} />
          <Text style={[styles.tabText, activeTab === 'library' && styles.tabTextActive]}>
            Library ({recordings.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'record' && (
          <>
            {/* Waveform Visualizer */}
            <View style={styles.visualizerContainer}>
              <View style={styles.visualizer}>
                {isRecording ? (
                  <View style={styles.waveformContainer}>
                    {Array.from({ length: 30 }, (_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.waveformBar,
                          {
                            height: Math.random() * 60 + 10,
                            backgroundColor: isPaused
                              ? Colors.textMuted
                              : Colors.voiceRecorderColor,
                          },
                        ]}
                      />
                    ))}
                  </View>
                ) : (
                  <View style={styles.idleVisualizer}>
                    <Feather name="mic" size={48} color={Colors.textMuted} />
                    <Text style={styles.idleText}>Ready to record</Text>
                  </View>
                )}
              </View>

              {/* Timer */}
              <Text style={[styles.timer, isRecording && styles.timerActive]}>
                {formatDuration(recordingTime)}
              </Text>

              {/* Status */}
              {isRecording && (
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: isPaused ? Colors.warning : Colors.error }]} />
                  <Text style={styles.statusText}>{isPaused ? 'Paused' : 'Recording'}</Text>
                </View>
              )}
            </View>

            {/* Recording Controls */}
            <View style={styles.controlsRow}>
              {isRecording && (
                <TouchableOpacity
                  style={[styles.controlBtn, styles.controlBtnSecondary]}
                  onPress={handlePauseRecording}
                >
                  <Feather name={isPaused ? 'play' : 'pause'} size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.recordBtn,
                  isRecording && styles.recordBtnActive,
                ]}
                onPress={isRecording ? handleStopRecording : handleStartRecording}
              >
                {isRecording ? (
                  <View style={styles.stopIcon} />
                ) : (
                  <View style={styles.recordIcon} />
                )}
              </TouchableOpacity>

              {isRecording && (
                <TouchableOpacity
                  style={[styles.controlBtn, styles.controlBtnSecondary]}
                  onPress={() => Alert.alert('Bookmark', 'Bookmark added at ' + formatDuration(recordingTime))}
                >
                  <Feather name="bookmark" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Effects Panel */}
            {showEffects && (
              <View style={styles.effectsPanel}>
                <Text style={styles.effectsTitle}>Audio Effects & Amplifier</Text>

                {/* Main Controls */}
                <SliderControl
                  label="Volume"
                  value={effects.volume}
                  min={0}
                  max={200}
                  unit="%"
                  color={Colors.voiceRecorderColor}
                  onValueChange={(v) => updateEffect('volume', v)}
                />
                <SliderControl
                  label="Bass Boost"
                  value={effects.bass}
                  min={0}
                  max={100}
                  unit="%"
                  color="#E74C3C"
                  onValueChange={(v) => updateEffect('bass', v)}
                />
                <SliderControl
                  label="Treble"
                  value={effects.treble}
                  min={0}
                  max={100}
                  unit="%"
                  color="#3498DB"
                  onValueChange={(v) => updateEffect('treble', v)}
                />
                <SliderControl
                  label="Echo"
                  value={effects.echo}
                  min={0}
                  max={100}
                  unit="%"
                  color="#9B59B6"
                  onValueChange={(v) => updateEffect('echo', v)}
                />
                <SliderControl
                  label="Reverb"
                  value={effects.reverb}
                  min={0}
                  max={100}
                  unit="%"
                  color="#27AE60"
                  onValueChange={(v) => updateEffect('reverb', v)}
                />

                {/* Noise Cancellation Toggle */}
                <TouchableOpacity
                  style={[
                    styles.noiseCancelBtn,
                    effects.noiseCancellation && styles.noiseCancelBtnActive,
                  ]}
                  onPress={() => updateEffect('noiseCancellation', !effects.noiseCancellation)}
                >
                  <Feather
                    name="volume-x"
                    size={20}
                    color={effects.noiseCancellation ? Colors.success : Colors.textMuted}
                  />
                  <Text style={[
                    styles.noiseCancelText,
                    effects.noiseCancellation && styles.noiseCancelTextActive,
                  ]}>
                    AI Noise Cancellation
                  </Text>
                  <View style={[
                    styles.toggleDot,
                    { backgroundColor: effects.noiseCancellation ? Colors.success : Colors.textMuted },
                  ]} />
                </TouchableOpacity>

                {/* Equalizer */}
                <Text style={styles.eqTitle}>Graphic Equalizer</Text>
                <View style={styles.eqContainer}>
                  {eqBands.map((band, index) => (
                    <View key={band} style={styles.eqBand}>
                      <View style={styles.eqBarContainer}>
                        <View
                          style={[
                            styles.eqBar,
                            {
                              height: `${effects.equalizer[index]}%`,
                              backgroundColor: Colors.voiceRecorderColor,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.eqLabel}>{band}</Text>
                      <TouchableOpacity
                        onPress={() => updateEqualizer(index, Math.min(100, effects.equalizer[index] + 10))}
                      >
                        <Feather name="plus" size={14} color={Colors.textMuted} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => updateEqualizer(index, Math.max(0, effects.equalizer[index] - 10))}
                      >
                        <Feather name="minus" size={14} color={Colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                {/* Presets */}
                <Text style={styles.presetsTitle}>Effect Presets</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {[
                    { name: 'Default', icon: 'circle' },
                    { name: 'Bass Heavy', icon: 'speaker' },
                    { name: 'Studio', icon: 'headphones' },
                    { name: 'Outdoor', icon: 'wind' },
                    { name: 'Echo Room', icon: 'home' },
                    { name: 'Podcast', icon: 'radio' },
                  ].map(preset => (
                    <TouchableOpacity key={preset.name} style={styles.presetChip}>
                      <Feather name={preset.icon as keyof typeof Feather.glyphMap} size={14} color={Colors.voiceRecorderColor} />
                      <Text style={styles.presetText}>{preset.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        )}

        {/* Library Tab */}
        {activeTab === 'library' && (
          <View style={styles.librarySection}>
            {recordings.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="mic-off" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No recordings yet</Text>
                <Text style={styles.emptyText}>Start recording to see your files here</Text>
              </View>
            ) : (
              recordings.map(recording => (
                <View key={recording.id} style={styles.recordingItem}>
                  <TouchableOpacity
                    style={styles.playBtn}
                    onPress={() => handlePlayRecording(recording.id)}
                  >
                    <Feather
                      name={playingId === recording.id ? 'pause' : 'play'}
                      size={20}
                      color={Colors.voiceRecorderColor}
                    />
                  </TouchableOpacity>
                  <View style={styles.recordingInfo}>
                    <Text style={styles.recordingTitle}>{recording.title}</Text>
                    <Text style={styles.recordingMeta}>
                      {formatDuration(recording.duration)} - {recording.size} - {recording.format}
                    </Text>
                    <Text style={styles.recordingDate}>{formatDate(recording.createdAt)}</Text>
                  </View>
                  <View style={styles.recordingActions}>
                    <TouchableOpacity
                      style={styles.recordingActionBtn}
                      onPress={() => Alert.alert('Share', `Share ${recording.title}`)}
                    >
                      <Feather name="share-2" size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.recordingActionBtn}
                      onPress={() => handleDeleteRecording(recording.id)}
                    >
                      <Feather name="trash-2" size={16} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
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
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  tabActive: {
    backgroundColor: Colors.backgroundCard,
  },
  tabText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginLeft: 6,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.voiceRecorderColor,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  visualizerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  visualizer: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: Spacing.sm,
  },
  waveformBar: {
    width: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  idleVisualizer: {
    alignItems: 'center',
  },
  idleText: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  timer: {
    fontSize: FontSizes.giant,
    fontWeight: '300',
    color: Colors.textMuted,
    marginTop: Spacing.lg,
    fontVariant: ['tabular-nums'],
  },
  timerActive: {
    color: Colors.voiceRecorderColor,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    gap: Spacing.xxl,
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtnSecondary: {
    backgroundColor: Colors.backgroundCard,
  },
  recordBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.voiceRecorderColor,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.voiceRecorderColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  recordBtnActive: {
    backgroundColor: Colors.error,
  },
  recordIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.textPrimary,
  },
  stopIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: Colors.textPrimary,
  },
  effectsPanel: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  effectsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  noiseCancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noiseCancelBtnActive: {
    backgroundColor: Colors.success + '10',
    borderColor: Colors.success + '40',
  },
  noiseCancelText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    flex: 1,
    marginLeft: Spacing.md,
  },
  noiseCancelTextActive: {
    color: Colors.textPrimary,
  },
  toggleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  eqTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  eqContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  eqBand: {
    alignItems: 'center',
    flex: 1,
  },
  eqBarContainer: {
    height: 80,
    width: 12,
    backgroundColor: Colors.surface,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 4,
  },
  eqBar: {
    width: '100%',
    borderRadius: 6,
  },
  eqLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    marginVertical: 4,
  },
  presetsTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  librarySection: {},
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.huge,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.voiceRecorderColor + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  recordingMeta: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  recordingDate: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  recordingActions: {
    flexDirection: 'row',
  },
  recordingActionBtn: {
    padding: Spacing.sm,
    marginLeft: 4,
  },
});

export default VoiceRecorderScreen;
