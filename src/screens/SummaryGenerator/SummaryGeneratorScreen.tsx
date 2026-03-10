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
import { MOCK_SUMMARY } from '../../services/mockData';
import { SummaryReport } from '../../types';

interface SummaryGeneratorScreenProps {
  navigation: { goBack: () => void };
}

const SummaryGeneratorScreen: React.FC<SummaryGeneratorScreenProps> = ({ navigation }) => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<SummaryReport | null>(null);
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [includeKeyPoints, setIncludeKeyPoints] = useState(true);
  const [includeSentiment, setIncludeSentiment] = useState(true);
  const [includeTopics, setIncludeTopics] = useState(true);

  const handleGenerate = () => {
    if (!mediaUrl.trim()) {
      Alert.alert('Error', 'Please enter a media URL');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setSummary(MOCK_SUMMARY);
    }, 3000);
  };

  const handleExport = (format: string) => {
    Alert.alert('Export', `Exporting summary report as ${format}...`);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return Colors.success;
      case 'negative': return Colors.error;
      case 'neutral': return Colors.info;
      case 'mixed': return Colors.warning;
      default: return Colors.textMuted;
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="AI Summary Generator"
        subtitle="Generate reports from any media"
        onBack={() => navigation.goBack()}
        rightIcon="file-text"
        onRightPress={() => Alert.alert('History', 'View summary history')}
        color={Colors.summaryColor}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* URL Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Media Source</Text>
          <View style={styles.urlInput}>
            <Feather name="link" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.urlText}
              value={mediaUrl}
              onChangeText={setMediaUrl}
              placeholder="Paste video, audio, or article URL..."
              placeholderTextColor={Colors.textMuted}
            />
            <TouchableOpacity onPress={() => setMediaUrl('https://youtube.com/watch?v=example1')}>
              <Feather name="clipboard" size={18} color={Colors.summaryColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Options */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Summary Options</Text>

          {/* Length */}
          <Text style={styles.optionLabel}>Summary Length</Text>
          <View style={styles.lengthOptions}>
            {(['short', 'medium', 'detailed'] as const).map(length => (
              <TouchableOpacity
                key={length}
                style={[styles.lengthOption, summaryLength === length && styles.lengthOptionActive]}
                onPress={() => setSummaryLength(length)}
              >
                <Text style={[styles.lengthText, summaryLength === length && styles.lengthTextActive]}>
                  {length.charAt(0).toUpperCase() + length.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Include Options */}
          <View style={styles.includeOptions}>
            {[
              { label: 'Key Points', value: includeKeyPoints, setter: setIncludeKeyPoints, icon: 'list' },
              { label: 'Sentiment Analysis', value: includeSentiment, setter: setIncludeSentiment, icon: 'heart' },
              { label: 'Topic Detection', value: includeTopics, setter: setIncludeTopics, icon: 'tag' },
            ].map(option => (
              <TouchableOpacity
                key={option.label}
                style={[styles.includeOption, option.value && styles.includeOptionActive]}
                onPress={() => option.setter(!option.value)}
              >
                <Feather
                  name={option.icon as keyof typeof Feather.glyphMap}
                  size={16}
                  color={option.value ? Colors.summaryColor : Colors.textMuted}
                />
                <Text style={[styles.includeText, option.value && styles.includeTextActive]}>
                  {option.label}
                </Text>
                {option.value && (
                  <Feather name="check" size={14} color={Colors.summaryColor} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <ActionButton
          title={isGenerating ? 'AI is analyzing media...' : 'Generate Summary Report'}
          onPress={handleGenerate}
          icon="cpu"
          color={Colors.summaryColor}
          loading={isGenerating}
          disabled={!mediaUrl.trim()}
          size="large"
          style={styles.generateBtn}
        />

        {/* Generated Summary */}
        {summary && (
          <View style={styles.reportSection}>
            {/* Report Header */}
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>{summary.title}</Text>
              <View style={styles.reportMeta}>
                <View style={styles.metaBadge}>
                  <Feather name="clock" size={12} color={Colors.textMuted} />
                  <Text style={styles.metaText}>{summary.readingTime} read</Text>
                </View>
                <View style={styles.metaBadge}>
                  <Feather name="file-text" size={12} color={Colors.textMuted} />
                  <Text style={styles.metaText}>{summary.wordCount} words</Text>
                </View>
                <View style={[styles.metaBadge, { backgroundColor: getSentimentColor(summary.sentiment) + '20' }]}>
                  <Feather name="heart" size={12} color={getSentimentColor(summary.sentiment)} />
                  <Text style={[styles.metaText, { color: getSentimentColor(summary.sentiment) }]}>
                    {summary.sentiment}
                  </Text>
                </View>
              </View>
            </View>

            {/* Summary Text */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Summary</Text>
              <Text style={styles.summaryText}>{summary.summary}</Text>
            </View>

            {/* Key Points */}
            {includeKeyPoints && (
              <View style={styles.keyPointsCard}>
                <Text style={styles.keyPointsTitle}>Key Points</Text>
                {summary.keyPoints.map((point, index) => (
                  <View key={index} style={styles.keyPointItem}>
                    <View style={styles.keyPointBullet}>
                      <Text style={styles.keyPointNumber}>{index + 1}</Text>
                    </View>
                    <Text style={styles.keyPointText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Topics */}
            {includeTopics && (
              <View style={styles.topicsCard}>
                <Text style={styles.topicsTitle}>Detected Topics</Text>
                <View style={styles.topicsRow}>
                  {summary.topics.map((topic, index) => (
                    <View key={index} style={styles.topicChip}>
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Sentiment Analysis */}
            {includeSentiment && (
              <View style={styles.sentimentCard}>
                <Text style={styles.sentimentTitle}>Sentiment Analysis</Text>
                <View style={styles.sentimentBar}>
                  <View style={[styles.sentimentFill, {
                    width: '75%',
                    backgroundColor: getSentimentColor(summary.sentiment),
                  }]} />
                </View>
                <View style={styles.sentimentLabels}>
                  <Text style={styles.sentimentLabel}>Negative</Text>
                  <Text style={[styles.sentimentLabel, { color: getSentimentColor(summary.sentiment), fontWeight: '700' }]}>
                    {summary.sentiment.toUpperCase()} (75%)
                  </Text>
                  <Text style={styles.sentimentLabel}>Positive</Text>
                </View>
              </View>
            )}

            {/* Export Options */}
            <View style={styles.exportSection}>
              <Text style={styles.exportTitle}>Export Report</Text>
              <View style={styles.exportRow}>
                {[
                  { format: 'PDF', icon: 'file-text' },
                  { format: 'DOCX', icon: 'file' },
                  { format: 'TXT', icon: 'align-left' },
                  { format: 'JSON', icon: 'code' },
                ].map(item => (
                  <TouchableOpacity
                    key={item.format}
                    style={styles.exportBtn}
                    onPress={() => handleExport(item.format)}
                  >
                    <Feather name={item.icon as keyof typeof Feather.glyphMap} size={18} color={Colors.summaryColor} />
                    <Text style={styles.exportBtnText}>{item.format}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* How It Works */}
        {!summary && (
          <View style={styles.howItWorks}>
            <Text style={styles.howTitle}>How It Works</Text>
            {[
              { step: '1', text: 'Paste any media URL (video, audio, article)' },
              { step: '2', text: 'AI analyzes the content using NLP models' },
              { step: '3', text: 'Get a comprehensive summary report' },
              { step: '4', text: 'Export in your preferred format' },
            ].map(item => (
              <View key={item.step} style={styles.howStep}>
                <View style={styles.howStepNumber}>
                  <Text style={styles.howStepText}>{item.step}</Text>
                </View>
                <Text style={styles.howStepDesc}>{item.text}</Text>
              </View>
            ))}
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
  optionLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  lengthOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  lengthOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lengthOptionActive: {
    backgroundColor: Colors.summaryColor + '20',
    borderColor: Colors.summaryColor,
  },
  lengthText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  lengthTextActive: {
    color: Colors.summaryColor,
  },
  includeOptions: {
    gap: Spacing.sm,
  },
  includeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  includeOptionActive: {
    backgroundColor: Colors.summaryColor + '10',
    borderColor: Colors.summaryColor + '40',
  },
  includeText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginLeft: Spacing.md,
    flex: 1,
  },
  includeTextActive: {
    color: Colors.textPrimary,
  },
  generateBtn: {
    marginBottom: Spacing.xxl,
  },
  reportSection: {},
  reportHeader: {
    marginBottom: Spacing.xl,
  },
  reportTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  reportMeta: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
  },
  metaText: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginLeft: 4,
  },
  summaryCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
    color: Colors.summaryColor,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  summaryText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  keyPointsCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  keyPointsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  keyPointBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.summaryColor + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  keyPointNumber: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.summaryColor,
  },
  keyPointText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  topicsCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  topicsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  topicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  topicChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.summaryColor + '20',
  },
  topicText: {
    fontSize: FontSizes.sm,
    color: Colors.summaryColor,
    fontWeight: '500',
  },
  sentimentCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  sentimentTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  sentimentBar: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    marginBottom: Spacing.sm,
  },
  sentimentFill: {
    height: '100%',
    borderRadius: 4,
  },
  sentimentLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sentimentLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  exportSection: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  exportTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  exportRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  exportBtn: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  exportBtnText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
  howItWorks: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  howTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  howStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  howStepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.summaryColor + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  howStepText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.summaryColor,
  },
  howStepDesc: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    flex: 1,
  },
});

export default SummaryGeneratorScreen;
