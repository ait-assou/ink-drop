import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gradient?: boolean;
  borderGradient?: boolean;
  glow?: boolean;
  variant?: 'surface' | 'secondary' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  gradient = false,
  borderGradient = false,
  glow = false,
  variant = 'surface',
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return theme.colors.surfaceSecondary;
      case 'glass':
        return theme.colors.glass;
      case 'surface':
      default:
        return theme.colors.surface;
    }
  };

  const cardStyle = [
    styles.card,
    { backgroundColor: getBackgroundColor() },
    variant === 'glass' && styles.glassCard,
    glow && theme.shadows.glow,
    style,
  ];

  if (borderGradient) {
    return (
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientBorderContainer, glow && theme.shadows.glow]}
      >
        <View style={[styles.card, { backgroundColor: getBackgroundColor(), margin: 1 }, style]}>
          {children}
        </View>
      </LinearGradient>
    );
  }

  if (gradient) {
    return (
      <LinearGradient
        colors={[theme.colors.cardGradStart, theme.colors.cardGradEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[cardStyle, styles.borderedCard]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[cardStyle, styles.borderedCard]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    overflow: 'hidden',
  },
  gradientBorderContainer: {
    borderRadius: theme.borderRadius.lg,
    padding: 0, // tight padding for border effect
  },
  glassCard: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  borderedCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
