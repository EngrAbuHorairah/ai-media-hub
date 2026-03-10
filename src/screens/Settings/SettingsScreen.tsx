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

interface SettingsScreenProps {
  navigation: { goBack: () => void };
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [saveToGallery, setSaveToGallery] = useState(true);
  const [aiEnhancement, setAiEnhancement] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);

  const settingsGroups = [
    {
      title: 'General',
      items: [
        {
          icon: 'moon',
          label: 'Dark Mode',
          description: 'Use dark theme throughout the app',
          type: 'toggle' as const,
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          icon: 'bell',
          label: 'Notifications',
          description: 'Receive push notifications',
          type: 'toggle' as const,
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: 'globe',
          label: 'Language',
          description: 'English',
          type: 'navigate' as const,
          onPress: () => Alert.alert('Language', 'Select app language'),
        },
      ],
    },
    {
      title: 'Downloads',
      items: [
        {
          icon: 'download',
          label: 'Auto Download',
          description: 'Automatically start downloads',
          type: 'toggle' as const,
          value: autoDownload,
          onToggle: setAutoDownload,
        },
        {
          icon: 'image',
          label: 'Save to Gallery',
          description: 'Auto-save downloads to photo gallery',
          type: 'toggle' as const,
          value: saveToGallery,
          onToggle: setSaveToGallery,
        },
        {
          icon: 'hard-drive',
          label: 'Download Location',
          description: 'Internal Storage/AI Media Hub',
          type: 'navigate' as const,
          onPress: () => Alert.alert('Storage', 'Select download location'),
        },
        {
          icon: 'wifi',
          label: 'Download Quality',
          description: 'Default: 1080p',
          type: 'navigate' as const,
          onPress: () => Alert.alert('Quality', 'Select default download quality'),
        },
      ],
    },
    {
      title: 'AI Settings',
      items: [
        {
          icon: 'cpu',
          label: 'AI Enhancement',
          description: 'Use AI for better translations and summaries',
          type: 'toggle' as const,
          value: aiEnhancement,
          onToggle: setAiEnhancement,
        },
        {
          icon: 'server',
          label: 'AI Model',
          description: 'GPT-4 Turbo',
          type: 'navigate' as const,
          onPress: () => Alert.alert('AI Model', 'Select AI processing model'),
        },
        {
          icon: 'zap',
          label: 'Processing Mode',
          description: 'Cloud (faster) / On-device (private)',
          type: 'navigate' as const,
          onPress: () => Alert.alert('Processing', 'Select processing mode'),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: 'shield',
          label: 'VPN Settings',
          description: 'Configure VPN and proxy settings',
          type: 'navigate' as const,
          onPress: () => Alert.alert('VPN', 'VPN configuration'),
        },
        {
          icon: 'lock',
          label: 'App Lock',
          description: 'Require authentication to open app',
          type: 'navigate' as const,
          onPress: () => Alert.alert('App Lock', 'Set up app lock'),
        },
        {
          icon: 'eye-off',
          label: 'Data Collection',
          description: 'Allow anonymous usage analytics',
          type: 'toggle' as const,
          value: dataCollection,
          onToggle: setDataCollection,
        },
        {
          icon: 'trash-2',
          label: 'Clear Cache',
          description: 'Free up storage space',
          type: 'navigate' as const,
          onPress: () => Alert.alert('Clear Cache', 'Cache cleared successfully!'),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'info',
          label: 'App Version',
          description: '1.0.0 (Build 1)',
          type: 'navigate' as const,
          onPress: () => {},
        },
        {
          icon: 'file-text',
          label: 'Terms of Service',
          description: '',
          type: 'navigate' as const,
          onPress: () => Alert.alert('Terms', 'View Terms of Service'),
        },
        {
          icon: 'shield',
          label: 'Privacy Policy',
          description: '',
          type: 'navigate' as const,
          onPress: () => Alert.alert('Privacy', 'View Privacy Policy'),
        },
        {
          icon: 'heart',
          label: 'Rate App',
          description: '',
          type: 'navigate' as const,
          onPress: () => Alert.alert('Rate', 'Rate AI Media Hub on the App Store'),
        },
        {
          icon: 'mail',
          label: 'Contact Support',
          description: 'support@aimediahub.com',
          type: 'navigate' as const,
          onPress: () => Alert.alert('Support', 'Contact support team'),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Settings"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Feather name="user" size={32} color={Colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>AI Media Hub User</Text>
            <Text style={styles.profilePlan}>Pro Plan - Active</Text>
          </View>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Feather name="edit-2" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Storage Usage */}
        <View style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <Text style={styles.storageTitle}>Storage Usage</Text>
            <Text style={styles.storageValue}>2.4 GB / 10 GB</Text>
          </View>
          <View style={styles.storageBar}>
            <View style={[styles.storageFill, { width: '24%' }]} />
          </View>
          <View style={styles.storageBreakdown}>
            <View style={styles.storageItem}>
              <View style={[styles.storageDot, { backgroundColor: Colors.downloaderColor }]} />
              <Text style={styles.storageLabel}>Downloads: 1.8 GB</Text>
            </View>
            <View style={styles.storageItem}>
              <View style={[styles.storageDot, { backgroundColor: Colors.voiceRecorderColor }]} />
              <Text style={styles.storageLabel}>Recordings: 0.4 GB</Text>
            </View>
            <View style={styles.storageItem}>
              <View style={[styles.storageDot, { backgroundColor: Colors.transcriberColor }]} />
              <Text style={styles.storageLabel}>Cache: 0.2 GB</Text>
            </View>
          </View>
        </View>

        {/* Settings Groups */}
        {settingsGroups.map(group => (
          <View key={group.title} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.items.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.settingRow,
                  index === group.items.length - 1 && styles.settingRowLast,
                ]}
                onPress={item.type === 'navigate' ? item.onPress : undefined}
                activeOpacity={item.type === 'navigate' ? 0.7 : 1}
              >
                <View style={styles.settingIcon}>
                  <Feather name={item.icon as keyof typeof Feather.glyphMap} size={18} color={Colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  {item.description ? (
                    <Text style={styles.settingDesc}>{item.description}</Text>
                  ) : null}
                </View>
                {item.type === 'toggle' && (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: Colors.surface, true: Colors.primary + '50' }}
                    thumbColor={item.value ? Colors.primary : Colors.textMuted}
                  />
                )}
                {item.type === 'navigate' && (
                  <Feather name="chevron-right" size={18} color={Colors.textMuted} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?')}
        >
          <Feather name="log-out" size={18} color={Colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  profilePlan: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    marginTop: 2,
  },
  editProfileBtn: {
    padding: Spacing.sm,
  },
  storageCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  storageTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  storageValue: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  storageBar: {
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    marginBottom: Spacing.md,
  },
  storageFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  storageBreakdown: {
    gap: 6,
  },
  storageItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  storageLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  settingsGroup: {
    marginBottom: Spacing.xl,
  },
  groupTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingRowLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingContent: {
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
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error + '10',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  signOutText: {
    fontSize: FontSizes.md,
    color: Colors.error,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
});

export default SettingsScreen;
