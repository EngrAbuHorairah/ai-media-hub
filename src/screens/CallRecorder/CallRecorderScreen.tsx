import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import HeaderBar from '../../components/HeaderBar';
import ActionButton from '../../components/ActionButton';
import { MOCK_CALL_RECORDINGS, formatDuration, formatDate } from '../../services/mockData';
import { CallRecordingItem } from '../../types';

interface CallRecorderScreenProps {
  navigation: { goBack: () => void };
}

const CallRecorderScreen: React.FC<CallRecorderScreenProps> = ({ navigation }) => {
  const [isAutoRecord, setIsAutoRecord] = useState(false);
  const [consentNotification, setConsentNotification] = useState(true);
  const [recordings, setRecordings] = useState<CallRecordingItem[]>(MOCK_CALL_RECORDINGS);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'recorder' | 'history'>('recorder');
  const [highQualityAudio, setHighQualityAudio] = useState(true);
  const [saveToCloud, setSaveToCloud] = useState(false);

  const handleStartRecording = () => {
    if (!consentNotification) {
      Alert.alert(
        'Consent Required',
        'Call recording requires consent notification to be enabled. This ensures all parties are informed about the recording.',
        [
          { text: 'Enable Consent', onPress: () => setConsentNotification(true) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    Alert.alert(
      'Consent Notification',
      'A notification will be sent to all call participants that this call is being recorded. Do you want to proceed?',
      [
        {
          text: 'Start Recording',
          onPress: () => {
            setIsRecording(true);
            const interval = setInterval(() => {
              setRecordingDuration(prev => prev + 1);
            }, 1000);

            // Auto stop after demo
            setTimeout(() => {
              clearInterval(interval);
              setIsRecording(false);
              const newRecording: CallRecordingItem = {
                id: `cr${Date.now()}`,
                contactName: 'Demo Contact',
                phoneNumber: '+1 (555) 000-0000',
                callType: 'outgoing',
                duration: recordingDuration || 15,
                filePath: `/call_recordings/demo_${Date.now()}.m4a`,
                createdAt: new Date(),
                isConsentGiven: true,
              };
              setRecordings([newRecording, ...recordings]);
              setRecordingDuration(0);
              Alert.alert('Recording Saved', 'Call recording has been saved successfully.');
            }, 5000);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const handlePlayRecording = (id: string) => {
    setPlayingId(playingId === id ? null : id);
    if (playingId !== id) {
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  const handleDeleteRecording = (id: string) => {
    Alert.alert('Delete Recording', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setRecordings(prev => prev.filter(r => r.id !== id)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Call Recorder"
        subtitle="Consent-based call recording"
        onBack={() => navigation.goBack()}
        rightIcon="settings"
        onRightPress={() => Alert.alert('Settings', 'Call recorder settings')}
        color={Colors.callRecorderColor}
      />

      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recorder' && styles.tabActive]}
          onPress={() => setActiveTab('recorder')}
        >
          <Feather name="phone" size={16} color={activeTab === 'recorder' ? Colors.callRecorderColor : Colors.textMuted} />
          <Text style={[styles.tabText, activeTab === 'recorder' && styles.tabTextActive]}>Recorder</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Feather name="list" size={16} color={activeTab === 'history' ? Colors.callRecorderColor : Colors.textMuted} />
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            History ({recordings.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'recorder' && (
          <>
            {/* Consent Notice */}
            <View style={styles.consentBanner}>
              <Feather name="alert-circle" size={20} color={Colors.warning} />
              <View style={styles.consentContent}>
                <Text style={styles.consentTitle}>Consent-Based Recording</Text>
                <Text style={styles.consentText}>
                  All call participants will be notified when recording starts. Recording without consent is illegal in many jurisdictions.
                </Text>
              </View>
            </View>

            {/* Recording Status */}
            <View style={styles.recorderCard}>
              {isRecording ? (
                <View style={styles.recordingActive}>
                  <View style={styles.recordingPulse}>
                    <View style={styles.pulseInner} />
                  </View>
                  <Text style={styles.recordingLabel}>Recording in Progress</Text>
                  <Text style={styles.recordingTimer}>{formatDuration(recordingDuration)}</Text>
                  <Text style={styles.recordingInfo}>All parties have been notified</Text>
                  <ActionButton
                    title="Stop Recording"
                    onPress={handleStopRecording}
                    icon="square"
                    color={Colors.error}
                    size="large"
                    style={{ marginTop: Spacing.xl }}
                  />
                </View>
              ) : (
                <View style={styles.recorderIdle}>
                  <View style={styles.phoneIconContainer}>
                    <Feather name="phone-call" size={48} color={Colors.callRecorderColor} />
                  </View>
                  <Text style={styles.idleTitle}>Ready to Record</Text>
                  <Text style={styles.idleText}>
                    Start a call and tap record to begin. All participants will be notified.
                  </Text>
                  <ActionButton
                    title="Start Call Recording"
                    onPress={handleStartRecording}
                    icon="phone"
                    color={Colors.callRecorderColor}
                    size="large"
                    style={{ marginTop: Spacing.xl }}
                  />
                </View>
              )}
            </View>

            {/* Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsTitle}>Recording Settings</Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Feather name="bell" size={18} color={Colors.callRecorderColor} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingLabel}>Consent Notification</Text>
                    <Text style={styles.settingDesc}>Notify all parties when recording</Text>
                  </View>
                </View>
                <Switch
                  value={consentNotification}
                  onValueChange={setConsentNotification}
                  trackColor={{ false: Colors.surface, true: Colors.callRecorderColor + '50' }}
                  thumbColor={consentNotification ? Colors.callRecorderColor : Colors.textMuted}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Feather name="play-circle" size={18} color={Colors.callRecorderColor} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingLabel}>Auto-Record</Text>
                    <Text style={styles.settingDesc}>Automatically record all calls</Text>
                  </View>
                </View>
                <Switch
                  value={isAutoRecord}
                  onValueChange={(val) => {
                    if (val && !consentNotification) {
                      Alert.alert('Enable Consent First', 'Consent notification must be enabled for auto-recording.');
                      return;
                    }
                    setIsAutoRecord(val);
                  }}
                  trackColor={{ false: Colors.surface, true: Colors.callRecorderColor + '50' }}
                  thumbColor={isAutoRecord ? Colors.callRecorderColor : Colors.textMuted}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Feather name="headphones" size={18} color={Colors.callRecorderColor} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingLabel}>High Quality Audio</Text>
                    <Text style={styles.settingDesc}>Record in high bitrate (larger files)</Text>
                  </View>
                </View>
                <Switch
                  value={highQualityAudio}
                  onValueChange={setHighQualityAudio}
                  trackColor={{ false: Colors.surface, true: Colors.callRecorderColor + '50' }}
                  thumbColor={highQualityAudio ? Colors.callRecorderColor : Colors.textMuted}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Feather name="cloud" size={18} color={Colors.callRecorderColor} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingLabel}>Cloud Backup</Text>
                    <Text style={styles.settingDesc}>Auto-backup recordings to cloud</Text>
                  </View>
                </View>
                <Switch
                  value={saveToCloud}
                  onValueChange={setSaveToCloud}
                  trackColor={{ false: Colors.surface, true: Colors.callRecorderColor + '50' }}
                  thumbColor={saveToCloud ? Colors.callRecorderColor : Colors.textMuted}
                />
              </View>
            </View>

            {/* Supported Call Types */}
            <View style={styles.supportedSection}>
              <Text style={styles.supportedTitle}>Supported Call Types</Text>
              <View style={styles.callTypesGrid}>
                {[
                  { icon: 'phone', label: 'Phone Calls', color: Colors.success },
                  { icon: 'video', label: 'Video Calls', color: Colors.info },
                  { icon: 'phone-incoming', label: 'Incoming', color: Colors.callRecorderColor },
                  { icon: 'phone-outgoing', label: 'Outgoing', color: Colors.warning },
                ].map(type => (
                  <View key={type.label} style={styles.callTypeItem}>
                    <View style={[styles.callTypeIcon, { backgroundColor: type.color + '20' }]}>
                      <Feather name={type.icon as keyof typeof Feather.glyphMap} size={20} color={type.color} />
                    </View>
                    <Text style={styles.callTypeLabel}>{type.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <View style={styles.historySection}>
            {recordings.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="phone-off" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No recordings yet</Text>
                <Text style={styles.emptyText}>Your call recordings will appear here</Text>
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
                      color={Colors.callRecorderColor}
                    />
                  </TouchableOpacity>
                  <View style={styles.recordingInfo}>
                    <View style={styles.recordingNameRow}>
                      <Text style={styles.recordingName}>{recording.contactName}</Text>
                      <Feather
                        name={recording.callType === 'incoming' ? 'phone-incoming' : 'phone-outgoing'}
                        size={14}
                        color={recording.callType === 'incoming' ? Colors.success : Colors.info}
                      />
                    </View>
                    <Text style={styles.recordingPhone}>{recording.phoneNumber}</Text>
                    <Text style={styles.recordingMeta}>
                      {formatDuration(recording.duration)} - {formatDate(recording.createdAt)}
                    </Text>
                    {recording.isConsentGiven && (
                      <View style={styles.consentBadge}>
                        <Feather name="check-circle" size={10} color={Colors.success} />
                        <Text style={styles.consentBadgeText}>Consent Given</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.recordingActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => Alert.alert('Share', `Share recording of ${recording.contactName}`)}
                    >
                      <Feather name="share-2" size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => Alert.alert('Transcribe', 'Transcribe this call recording?')}
                    >
                      <Feather name="file-text" size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
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
    color: Colors.callRecorderColor,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  consentBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.warning + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  consentContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  consentTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.warning,
    marginBottom: 4,
  },
  consentText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  recorderCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  recordingActive: {
    alignItems: 'center',
  },
  recordingPulse: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  pulseInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.error,
  },
  recordingLabel: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.error,
  },
  recordingTimer: {
    fontSize: FontSizes.huge,
    fontWeight: '300',
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    fontVariant: ['tabular-nums'],
  },
  recordingInfo: {
    flex: 1,
  },
  recorderIdle: {
    alignItems: 'center',
  },
  phoneIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.callRecorderColor + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  idleTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  idleText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  settingsSection: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  settingsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  settingLabel: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  settingDesc: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  supportedSection: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  supportedTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  callTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  callTypeItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  callTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  callTypeLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  historySection: {},
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
    backgroundColor: Colors.callRecorderColor + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  recordingNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordingName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  recordingPhone: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  recordingMeta: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  consentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  consentBadgeText: {
    fontSize: FontSizes.xs,
    color: Colors.success,
    marginLeft: 4,
    fontWeight: '500',
  },
  recordingActions: {
    flexDirection: 'column',
  },
  actionBtn: {
    padding: 6,
  },
});

export default CallRecorderScreen;
