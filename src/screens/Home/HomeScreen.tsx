import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { FEATURES } from '../../constants/features';
import FeatureCardComponent from '../../components/FeatureCardComponent';
import GradientBackground from '../../components/GradientBackground';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: {
    navigate: (route: string) => void;
  };
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleFeaturePress = (route: string) => {
    navigation.navigate(route);
  };

  const renderQuickAction = (icon: string, label: string, color: string, route: string) => (
    <TouchableOpacity
      key={label}
      style={styles.quickAction}
      onPress={() => handleFeaturePress(route)}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        <Feather name={icon as keyof typeof Feather.glyphMap} size={22} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.appName}>AI Media Hub</Text>
            <Text style={styles.tagline}>Your all-in-one AI-powered media toolkit</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Feather name="settings" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* AI Status Banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiBannerContent}>
            <View style={styles.aiDot} />
            <Text style={styles.aiBannerText}>AI Engine Active</Text>
          </View>
          <Text style={styles.aiBannerSub}>All systems operational</Text>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          {renderQuickAction('download-cloud', 'Download', Colors.downloaderColor, 'Downloader')}
          {renderQuickAction('play-circle', 'Watch', Colors.videoPlayerColor, 'VideoPlayer')}
          {renderQuickAction('mic', 'Record', Colors.voiceRecorderColor, 'VoiceRecorder')}
          {renderQuickAction('globe', 'Translate', Colors.translatorColor, 'Translator')}
        </View>

        {/* Features Grid */}
        <Text style={styles.sectionTitle}>All Features</Text>
        <View style={styles.featuresGrid}>
          {FEATURES.map((feature, index) => (
            <FeatureCardComponent
              key={feature.id}
              feature={feature}
              onPress={handleFeaturePress}
              index={index}
            />
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Downloads</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Translations</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Recordings</Text>
            </View>
          </View>
        </View>

        {/* Powered By */}
        <View style={styles.poweredBy}>
          <Feather name="cpu" size={16} color={Colors.textMuted} />
          <Text style={styles.poweredByText}>Powered by Advanced AI</Text>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 60,
    marginBottom: Spacing.xxl,
  },
  greeting: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  appName: {
    fontSize: FontSizes.huge,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 4,
  },
  tagline: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  aiBanner: {
    backgroundColor: Colors.primary + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  aiBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: Spacing.sm,
  },
  aiBannerText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  aiBannerSub: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 4,
    marginLeft: Spacing.lg + Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxxl,
  },
  quickAction: {
    alignItems: 'center',
    width: (width - Spacing.xl * 2 - Spacing.md * 3) / 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  statsContainer: {
    marginBottom: Spacing.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSizes.xxxl,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
  poweredBy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  poweredByText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
});

export default HomeScreen;
