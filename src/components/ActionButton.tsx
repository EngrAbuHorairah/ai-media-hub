import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  color?: string;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  icon,
  color = Colors.primary,
  variant = 'filled',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
}) => {
  const getButtonStyle = () => {
    const base: ViewStyle = {
      backgroundColor: variant === 'filled' ? color : 'transparent',
      borderWidth: variant === 'outlined' ? 1.5 : 0,
      borderColor: color,
      opacity: disabled ? 0.5 : 1,
    };

    switch (size) {
      case 'small':
        return { ...base, paddingVertical: 8, paddingHorizontal: 14 };
      case 'large':
        return { ...base, paddingVertical: 16, paddingHorizontal: 28 };
      default:
        return { ...base, paddingVertical: 12, paddingHorizontal: 20 };
    }
  };

  const getTextColor = () => {
    if (variant === 'filled') return Colors.textPrimary;
    return color;
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return FontSizes.sm;
      case 'large': return FontSizes.lg;
      default: return FontSizes.md;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && (
            <Feather
              name={icon as keyof typeof Feather.glyphMap}
              size={size === 'small' ? 14 : 18}
              color={getTextColor()}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, { color: getTextColor(), fontSize: getTextSize() }]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  text: {
    fontWeight: '600',
  },
});

export default ActionButton;
