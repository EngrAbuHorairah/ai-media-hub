import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import HeaderBar from '../../components/HeaderBar';
import SearchBar from '../../components/SearchBar';
import PlatformSelector from '../../components/PlatformSelector';
import VideoCard from '../../components/VideoCard';
import { MOCK_VIDEOS } from '../../services/mockData';
import { VideoItem } from '../../types';

const { width } = Dimensions.get('window');

interface VideoPlayerScreenProps {
  navigation: { goBack: () => void };
}

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [layout, setLayout] = useState<'list' | 'grid'>('list');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [videos, setVideos] = useState<VideoItem[]>(MOCK_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'trending', label: 'Trending' },
    { id: 'music', label: 'Music' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'news', label: 'News' },
    { id: 'sports', label: 'Sports' },
    { id: 'education', label: 'Education' },
    { id: 'comedy', label: 'Comedy' },
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Simulate AI-powered multi-platform search
    setTimeout(() => {
      setIsSearching(false);
      setVideos(MOCK_VIDEOS.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.channelName.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }, 1500);
  };

  const handleVideoPress = (video: VideoItem) => {
    setSelectedVideo(video);
  };

  const handleTogglePlatform = (platformId: string) => {
    if (platformId === 'all') {
      setSelectedPlatforms([]);
      setVideos(MOCK_VIDEOS);
      return;
    }
    const newPlatforms = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(p => p !== platformId)
      : [...selectedPlatforms, platformId];
    setSelectedPlatforms(newPlatforms);
    if (newPlatforms.length === 0) {
      setVideos(MOCK_VIDEOS);
    } else {
      setVideos(MOCK_VIDEOS.filter(v => newPlatforms.includes(v.platform)));
    }
  };

  const filteredVideos = videos;

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Smart Video Player"
        subtitle="Search across all platforms"
        onBack={() => navigation.goBack()}
        rightIcon={layout === 'list' ? 'grid' : 'list'}
        onRightPress={() => setLayout(layout === 'list' ? 'grid' : 'list')}
        color={Colors.videoPlayerColor}
      />

      {/* Video Player Area */}
      {selectedVideo ? (
        <View style={styles.playerContainer}>
          <View style={styles.playerPlaceholder}>
            <Feather name="play-circle" size={64} color={Colors.textPrimary} />
            <Text style={styles.playerTitle}>{selectedVideo.title}</Text>
            <Text style={styles.playerMeta}>
              {selectedVideo.channelName} - {selectedVideo.views} views
            </Text>
          </View>
          <View style={styles.playerControls}>
            <TouchableOpacity style={styles.playerBtn}>
              <Feather name="skip-back" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton}>
              <Feather name="play" size={28} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playerBtn}>
              <Feather name="skip-forward" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.playerSpacer} />
            <TouchableOpacity style={styles.playerBtn} onPress={() => Alert.alert('Download', 'Download this video?')}>
              <Feather name="download" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playerBtn} onPress={() => Alert.alert('Translate', 'Translate this video?')}>
              <Feather name="globe" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playerBtn} onPress={() => Alert.alert('Transcribe', 'Transcribe this video?')}>
              <Feather name="file-text" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playerBtn} onPress={() => setSelectedVideo(null)}>
              <Feather name="x" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {/* Video Info */}
          <View style={styles.videoInfo}>
            <View style={styles.videoInfoRow}>
              <View style={styles.channelInfo}>
                <View style={styles.channelAvatar}>
                  <Text style={styles.channelInitial}>
                    {selectedVideo.channelName.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.channelName}>{selectedVideo.channelName}</Text>
                  <Text style={styles.publishDate}>{selectedVideo.publishedAt}</Text>
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Feather name="thumbs-up" size={18} color={Colors.textSecondary} />
                  <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Feather name="share-2" size={18} color={Colors.textSecondary} />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Feather name="bookmark" size={18} color={Colors.textSecondary} />
                  <Text style={styles.actionText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ) : null}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search videos across all platforms..."
            onSubmit={handleSearch}
            onClear={() => { setSearchQuery(''); setVideos(MOCK_VIDEOS); }}
            rightIcon="mic"
            onRightIconPress={() => Alert.alert('Voice Search', 'Voice search activated')}
          />
        </View>

        {/* Platform Filter */}
        <PlatformSelector
          selectedPlatforms={selectedPlatforms}
          onTogglePlatform={handleTogglePlatform}
        />

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, activeCategory === cat.id && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text style={[styles.categoryText, activeCategory === cat.id && styles.categoryTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Loading State */}
        {isSearching && (
          <View style={styles.loadingState}>
            <Feather name="cpu" size={32} color={Colors.primary} />
            <Text style={styles.loadingText}>AI is searching across all platforms...</Text>
          </View>
        )}

        {/* Video List */}
        {!isSearching && (
          <View style={layout === 'grid' ? styles.gridContainer : undefined}>
            {filteredVideos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onPress={handleVideoPress}
                layout={layout}
              />
            ))}
          </View>
        )}

        {!isSearching && filteredVideos.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="video-off" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No videos found</Text>
            <Text style={styles.emptySubtext}>Try a different search or platform</Text>
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
    padding: Spacing.lg,
  },
  searchSection: {
    marginBottom: Spacing.md,
  },
  categoriesScroll: {
    marginVertical: Spacing.md,
  },
  categoryChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: Colors.videoPlayerColor,
  },
  categoryText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  playerContainer: {
    backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  playerPlaceholder: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerTitle: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: Spacing.md,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  playerMeta: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  playerBtn: {
    padding: Spacing.sm,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.videoPlayerColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  playerSpacer: {
    flex: 1,
  },
  videoInfo: {
    padding: Spacing.lg,
  },
  videoInfoRow: {
    flexDirection: 'column',
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  channelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  channelInitial: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  channelName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  publishDate: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  actionText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: Spacing.huge,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.huge,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});

export default VideoPlayerScreen;
