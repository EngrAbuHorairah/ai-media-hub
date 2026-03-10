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
import LanguageSelector from '../../components/LanguageSelector';
import ActionButton from '../../components/ActionButton';

interface TranslatorScreenProps {
  navigation: { goBack: () => void };
}

const TranslatorScreen: React.FC<TranslatorScreenProps> = ({ navigation }) => {
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeMode, setActiveMode] = useState<'text' | 'voice' | 'video' | 'live'>('text');
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('');

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    // Simulate AI translation
    setTimeout(() => {
      setIsTranslating(false);
      setDetectedLanguage('English');
      setTranslatedText(
        `[AI Translated to ${targetLanguage}]\n\n${inputText}\n\n---\nTranslation confidence: 97.5%\nDetected language: English`
      );
    }, 1500);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setInputText('Hello, how are you today? I would like to translate this message.');
        setDetectedLanguage('English');
      }, 3000);
    }
  };

  const handleVideoTranslate = () => {
    if (!videoUrl.trim()) {
      Alert.alert('Error', 'Please enter a video URL');
      return;
    }
    setIsProcessingVideo(true);
    setTimeout(() => {
      setIsProcessingVideo(false);
      Alert.alert(
        'Video Translation Complete',
        `The video has been translated to ${targetLanguage}.\n\nOptions:\n1. Stream with translated audio\n2. Download translated version\n3. Download with subtitles`,
        [
          { text: 'Stream', onPress: () => {} },
          { text: 'Download Dubbed', onPress: () => Alert.alert('Downloading', 'Starting dubbed video download...') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }, 3000);
  };

  const swapLanguages = () => {
    if (sourceLanguage === 'auto') return;
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    setInputText(translatedText.split('\n')[0] || '');
    setTranslatedText('');
  };

  const modes = [
    { id: 'text' as const, icon: 'type', label: 'Text' },
    { id: 'voice' as const, icon: 'mic', label: 'Voice' },
    { id: 'video' as const, icon: 'video', label: 'Video' },
    { id: 'live' as const, icon: 'radio', label: 'Live' },
  ];

  return (
    <View style={styles.container}>
      <HeaderBar
        title="AI Translator"
        subtitle="Real-time voice & video translation"
        onBack={() => navigation.goBack()}
        rightIcon="settings"
        onRightPress={() => Alert.alert('Settings', 'Translation settings')}
        color={Colors.translatorColor}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          {modes.map(mode => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeButton, activeMode === mode.id && styles.modeButtonActive]}
              onPress={() => setActiveMode(mode.id)}
            >
              <Feather
                name={mode.icon as keyof typeof Feather.glyphMap}
                size={18}
                color={activeMode === mode.id ? Colors.translatorColor : Colors.textMuted}
              />
              <Text style={[styles.modeText, activeMode === mode.id && styles.modeTextActive]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Language Selection */}
        <View style={styles.languageRow}>
          <View style={styles.languageCol}>
            <LanguageSelector
              selectedLanguage={sourceLanguage === 'auto' ? 'en' : sourceLanguage}
              onSelectLanguage={setSourceLanguage}
              label="From"
            />
            {sourceLanguage === 'auto' && detectedLanguage && (
              <Text style={styles.detectedLang}>Detected: {detectedLanguage}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
            <Feather name="repeat" size={20} color={Colors.translatorColor} />
          </TouchableOpacity>
          <View style={styles.languageCol}>
            <LanguageSelector
              selectedLanguage={targetLanguage}
              onSelectLanguage={setTargetLanguage}
              label="To"
            />
          </View>
        </View>

        {/* Auto Detect Badge */}
        <TouchableOpacity
          style={styles.autoDetectBadge}
          onPress={() => setSourceLanguage('auto')}
        >
          <Feather name="cpu" size={14} color={Colors.translatorColor} />
          <Text style={styles.autoDetectText}>Auto-detect language</Text>
        </TouchableOpacity>

        {/* Text Translation Mode */}
        {activeMode === 'text' && (
          <View style={styles.translationSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Enter text to translate..."
                placeholderTextColor={Colors.textMuted}
                multiline
                textAlignVertical="top"
              />
              <View style={styles.inputActions}>
                <TouchableOpacity onPress={handleVoiceInput} style={styles.inputActionBtn}>
                  <Feather name="mic" size={18} color={isListening ? Colors.error : Colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setInputText(''); setTranslatedText(''); }}
                  style={styles.inputActionBtn}
                >
                  <Feather name="x" size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <ActionButton
              title={isTranslating ? 'Translating...' : 'Translate'}
              onPress={handleTranslate}
              icon="globe"
              color={Colors.translatorColor}
              loading={isTranslating}
              disabled={!inputText.trim()}
              style={styles.translateBtn}
            />

            {translatedText !== '' && (
              <View style={styles.outputContainer}>
                <Text style={styles.outputText}>{translatedText}</Text>
                <View style={styles.outputActions}>
                  <TouchableOpacity style={styles.outputActionBtn}>
                    <Feather name="copy" size={16} color={Colors.textSecondary} />
                    <Text style={styles.outputActionText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.outputActionBtn}>
                    <Feather name="volume-2" size={16} color={Colors.textSecondary} />
                    <Text style={styles.outputActionText}>Listen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.outputActionBtn}>
                    <Feather name="share-2" size={16} color={Colors.textSecondary} />
                    <Text style={styles.outputActionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Voice Translation Mode */}
        {activeMode === 'voice' && (
          <View style={styles.voiceSection}>
            <View style={styles.voiceVisualizer}>
              {isListening ? (
                <>
                  <View style={styles.listeningIndicator}>
                    <View style={[styles.waveBar, { height: 20 }]} />
                    <View style={[styles.waveBar, { height: 35 }]} />
                    <View style={[styles.waveBar, { height: 50 }]} />
                    <View style={[styles.waveBar, { height: 30 }]} />
                    <View style={[styles.waveBar, { height: 45 }]} />
                    <View style={[styles.waveBar, { height: 25 }]} />
                    <View style={[styles.waveBar, { height: 40 }]} />
                  </View>
                  <Text style={styles.listeningText}>Listening... Speak now</Text>
                </>
              ) : (
                <>
                  <Feather name="mic" size={48} color={Colors.translatorColor} />
                  <Text style={styles.voicePrompt}>Tap to start voice translation</Text>
                </>
              )}
            </View>
            <TouchableOpacity
              style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
              onPress={handleVoiceInput}
            >
              <Feather name={isListening ? 'mic-off' : 'mic'} size={32} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.voiceHint}>
              Speaks in real-time with auto language detection
            </Text>

            {inputText !== '' && (
              <View style={styles.voiceResult}>
                <Text style={styles.voiceResultLabel}>Detected Speech:</Text>
                <Text style={styles.voiceResultText}>{inputText}</Text>
                <ActionButton
                  title="Translate"
                  onPress={handleTranslate}
                  icon="globe"
                  color={Colors.translatorColor}
                  style={{ marginTop: Spacing.md }}
                />
              </View>
            )}
          </View>
        )}

        {/* Video Translation Mode */}
        {activeMode === 'video' && (
          <View style={styles.videoSection}>
            <View style={styles.videoUrlInput}>
              <Feather name="link" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.videoUrlText}
                value={videoUrl}
                onChangeText={setVideoUrl}
                placeholder="Paste video URL to translate..."
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <ActionButton
              title={isProcessingVideo ? 'Processing Video with AI...' : 'Translate & Dub Video'}
              onPress={handleVideoTranslate}
              icon="video"
              color={Colors.translatorColor}
              loading={isProcessingVideo}
              disabled={!videoUrl.trim()}
              size="large"
              style={styles.videoBtn}
            />

            <View style={styles.videoFeatures}>
              <Text style={styles.videoFeaturesTitle}>Video Translation Features</Text>
              {[
                { icon: 'volume-2', text: 'AI voice dubbing in target language' },
                { icon: 'type', text: 'Auto-generated translated subtitles' },
                { icon: 'download', text: 'Download translated video' },
                { icon: 'radio', text: 'Real-time streaming translation' },
                { icon: 'users', text: 'Multi-speaker voice detection' },
              ].map((feature, index) => (
                <View key={index} style={styles.videoFeatureItem}>
                  <Feather name={feature.icon as keyof typeof Feather.glyphMap} size={16} color={Colors.translatorColor} />
                  <Text style={styles.videoFeatureText}>{feature.text}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Live Translation Mode */}
        {activeMode === 'live' && (
          <View style={styles.liveSection}>
            <View style={styles.liveCard}>
              <Feather name="radio" size={48} color={Colors.translatorColor} />
              <Text style={styles.liveTitle}>Live Translation Mode</Text>
              <Text style={styles.liveSubtitle}>
                Real-time translation of live audio and video streams with auto language detection
              </Text>
              <ActionButton
                title="Start Live Translation"
                onPress={() => Alert.alert('Live Mode', 'Starting live translation stream...')}
                icon="play"
                color={Colors.translatorColor}
                size="large"
                style={{ marginTop: Spacing.xl }}
              />
            </View>

            <View style={styles.liveFeatures}>
              {[
                'Auto-detect source language',
                'Translate to any of 20+ languages',
                'Real-time voice dubbing',
                'Live subtitle generation',
                'Multi-participant support',
              ].map((feature, index) => (
                <View key={index} style={styles.liveFeatureItem}>
                  <Feather name="check-circle" size={16} color={Colors.success} />
                  <Text style={styles.liveFeatureText}>{feature}</Text>
                </View>
              ))}
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
    marginLeft: 4,
    fontWeight: '500',
  },
  modeTextActive: {
    color: Colors.translatorColor,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  languageCol: {
    flex: 1,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  detectedLang: {
    fontSize: FontSizes.xs,
    color: Colors.translatorColor,
    marginTop: 4,
    marginLeft: Spacing.md,
  },
  autoDetectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.translatorColor + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    marginBottom: Spacing.xl,
  },
  autoDetectText: {
    fontSize: FontSizes.xs,
    color: Colors.translatorColor,
    marginLeft: 6,
    fontWeight: '500',
  },
  translationSection: {},
  inputContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 120,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    padding: Spacing.lg,
    minHeight: 100,
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputActionBtn: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  translateBtn: {
    marginVertical: Spacing.lg,
  },
  outputContainer: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.translatorColor + '30',
  },
  outputText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  outputActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  outputActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outputActionText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  voiceSection: {
    alignItems: 'center',
  },
  voiceVisualizer: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  waveBar: {
    width: 6,
    backgroundColor: Colors.translatorColor,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  listeningText: {
    fontSize: FontSizes.md,
    color: Colors.translatorColor,
    marginTop: Spacing.lg,
    fontWeight: '600',
  },
  voicePrompt: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.translatorColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.translatorColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  voiceButtonActive: {
    backgroundColor: Colors.error,
  },
  voiceHint: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  voiceResult: {
    width: '100%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
  },
  voiceResultLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  voiceResultText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  videoSection: {},
  videoUrlInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  videoUrlText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  videoBtn: {
    marginBottom: Spacing.xl,
  },
  videoFeatures: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  videoFeaturesTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  videoFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  videoFeatureText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginLeft: Spacing.md,
  },
  liveSection: {},
  liveCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.translatorColor + '30',
  },
  liveTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
  },
  liveSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  liveFeatures: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  liveFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  liveFeatureText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginLeft: Spacing.md,
  },
});

export default TranslatorScreen;
