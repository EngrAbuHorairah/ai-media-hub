import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import { PLATFORMS } from '../constants/features';

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onTogglePlatform: (platformId: string) => void;
  multiSelect?: boolean;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onTogglePlatform,
  multiSelect = true,
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {multiSelect && (
        <TouchableOpacity
          style={[
            styles.chip,
            selectedPlatforms.length === 0 && styles.chipActive,
          ]}
          onPress={() => onTogglePlatform('all')}
        >
          <Feather name="globe" size={16} color={selectedPlatforms.length === 0 ? Colors.textPrimary : Colors.textSecondary} />
          <Text style={[styles.chipText, selectedPlatforms.length === 0 && styles.chipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
      )}
      {PLATFORMS.map((platform) => {
        const isSelected = selectedPlatforms.includes(platform.id);
        return (
          <TouchableOpacity
            key={platform.id}
            style={[
              styles.chip,
              isSelected && { backgroundColor: platform.color + '30', borderColor: platform.color },
            ]}
            onPress={() => onTogglePlatform(platform.id)}
          >
            <Feather
              name={platform.icon as keyof typeof Feather.glyphMap}
              size={16}
              color={isSelected ? platform.color : Colors.textSecondary}
            />
            <Text style={[styles.chipText, isSelected && { color: platform.color }]}>
              {platform.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  chipActive: {
    backgroundColor: Colors.primary + '30',
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.textPrimary,
  },
});

export default PlatformSelector;
