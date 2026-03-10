import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FeatureCard } from '../types';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xxxl * 3) / 2;

interface FeatureCardComponentProps {
  feature: FeatureCard;
  onPress: (route: string) => void;
  index: number;
}

const FeatureCardComponent: React.FC<FeatureCardComponentProps> = ({
  feature,
  onPress,
  index,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: feature.color + '30' },
        index % 2 === 0 ? styles.cardLeft : styles.cardRight,
      ]}
      onPress={() => onPress(feature.route)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: feature.color + '20' }]}>
        <Feather name={feature.icon as keyof typeof Feather.glyphMap} size={28} color={feature.color} />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {feature.title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={2}>
        {feature.subtitle}
      </Text>
      <View style={[styles.indicator, { backgroundColor: feature.color }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardLeft: {
    marginRight: Spacing.sm,
  },
  cardRight: {
    marginLeft: Spacing.sm,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  indicator: {
    width: 30,
    height: 3,
    borderRadius: 2,
    marginTop: Spacing.md,
  },
});

export default FeatureCardComponent;
