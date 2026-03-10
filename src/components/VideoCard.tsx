import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { VideoItem } from '../types';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';

interface VideoCardProps {
  video: VideoItem;
  onPress: (video: VideoItem) => void;
  layout?: 'grid' | 'list';
}

const platformColors: Record<string, string> = {
  youtube: '#FF0000',
  facebook: '#1877F2',
  instagram: '#E4405F',
  tiktok: '#69C9D0',
  linkedin: '#0A66C2',
  unknown: Colors.textMuted,
};

const VideoCard: React.FC<VideoCardProps> = ({ video, onPress, layout = 'list' }) => {
  if (layout === 'grid') {
    return (
      <TouchableOpacity style={styles.gridCard} onPress={() => onPress(video)} activeOpacity={0.7}>
        <View style={styles.gridThumbnailContainer}>
          <Image source={{ uri: video.thumbnail }} style={styles.gridThumbnail} />
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{video.duration}</Text>
          </View>
          <View style={[styles.platformBadge, { backgroundColor: platformColors[video.platform] }]}>
            <Text style={styles.platformBadgeText}>{video.platform.charAt(0).toUpperCase()}</Text>
          </View>
          {video.isLive && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
        <View style={styles.gridInfo}>
          <Text style={styles.gridTitle} numberOfLines={2}>{video.title}</Text>
          <Text style={styles.gridMeta}>{video.channelName} - {video.views} views</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.listCard} onPress={() => onPress(video)} activeOpacity={0.7}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
        {video.isLive && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>
      <View style={styles.listInfo}>
        <View style={[styles.platformDot, { backgroundColor: platformColors[video.platform] }]} />
        <View style={styles.textContainer}>
          <Text style={styles.listTitle} numberOfLines={2}>{video.title}</Text>
          <Text style={styles.listChannel}>{video.channelName}</Text>
          <Text style={styles.listMeta}>{video.views} views - {video.publishedAt}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Feather name="more-vertical" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surface,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  platformBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  liveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  liveText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  listInfo: {
    flexDirection: 'row',
    padding: Spacing.md,
    alignItems: 'flex-start',
  },
  platformDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: Spacing.md,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  listChannel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  listMeta: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  moreButton: {
    padding: Spacing.xs,
  },
  gridCard: {
    width: '48%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  gridThumbnailContainer: {
    width: '100%',
    height: 100,
    position: 'relative',
  },
  gridThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surface,
  },
  gridInfo: {
    padding: Spacing.sm,
  },
  gridTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  gridMeta: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
});

export default VideoCard;
