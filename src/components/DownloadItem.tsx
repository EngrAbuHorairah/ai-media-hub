import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DownloadItem as DownloadItemType } from '../types';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';

interface DownloadItemProps {
  item: DownloadItemType;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
  onOpen?: () => void;
}

const platformIcons: Record<string, string> = {
  youtube: 'youtube',
  facebook: 'facebook',
  instagram: 'instagram',
  tiktok: 'music',
  linkedin: 'linkedin',
  unknown: 'link',
};

const mediaIcons: Record<string, string> = {
  video: 'video',
  audio: 'music',
  image: 'image',
  document: 'file-text',
  other: 'file',
};

const statusColors: Record<string, string> = {
  pending: Colors.warning,
  downloading: Colors.info,
  completed: Colors.success,
  failed: Colors.error,
  paused: Colors.textMuted,
};

const DownloadItemComponent: React.FC<DownloadItemProps> = ({
  item,
  onPause,
  onResume,
  onCancel,
  onOpen,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather
          name={mediaIcons[item.mediaType] as keyof typeof Feather.glyphMap}
          size={24}
          color={statusColors[item.status]}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <View style={styles.metaRow}>
          <Feather
            name={platformIcons[item.platform] as keyof typeof Feather.glyphMap}
            size={12}
            color={Colors.textMuted}
          />
          <Text style={styles.metaText}>
            {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
          </Text>
          {item.quality && <Text style={styles.metaText}> - {item.quality}</Text>}
          {item.size && <Text style={styles.metaText}> - {item.size}</Text>}
        </View>
        {item.status === 'downloading' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${item.progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        )}
        {item.status === 'completed' && (
          <Text style={[styles.statusText, { color: Colors.success }]}>Download Complete</Text>
        )}
        {item.status === 'failed' && (
          <Text style={[styles.statusText, { color: Colors.error }]}>Download Failed</Text>
        )}
      </View>
      <View style={styles.actions}>
        {item.status === 'downloading' && onPause && (
          <TouchableOpacity onPress={onPause} style={styles.actionBtn}>
            <Feather name="pause" size={18} color={Colors.warning} />
          </TouchableOpacity>
        )}
        {item.status === 'paused' && onResume && (
          <TouchableOpacity onPress={onResume} style={styles.actionBtn}>
            <Feather name="play" size={18} color={Colors.info} />
          </TouchableOpacity>
        )}
        {item.status === 'completed' && onOpen && (
          <TouchableOpacity onPress={onOpen} style={styles.actionBtn}>
            <Feather name="folder" size={18} color={Colors.success} />
          </TouchableOpacity>
        )}
        {(item.status === 'downloading' || item.status === 'paused') && onCancel && (
          <TouchableOpacity onPress={onCancel} style={styles.actionBtn}>
            <Feather name="x" size={18} color={Colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.surface,
    borderRadius: 2,
    marginRight: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.info,
    borderRadius: 2,
  },
  progressText: {
    fontSize: FontSizes.xs,
    color: Colors.info,
    fontWeight: '600',
    width: 35,
    textAlign: 'right',
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: Spacing.sm,
  },
  actionBtn: {
    padding: Spacing.xs,
    marginLeft: 4,
  },
});

export default DownloadItemComponent;
