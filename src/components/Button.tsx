import React, { useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
  Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'filled',
  size = 'md',
  style,
  textStyle,
  disabled = false,
  loading = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const flattenedStyle = (StyleSheet.flatten(style) || {}) as any;
  const containerStyle: any = { opacity: disabled ? 0.6 : 1 };
  const innerStyle: any = {};

  const containerStyleKeys = [
    'flex',
    'flexGrow',
    'flexShrink',
    'flexBasis',
    'margin',
    'marginHorizontal',
    'marginVertical',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'alignSelf',
    'position',
    'top',
    'bottom',
    'left',
    'right',
    'zIndex',
    'display',
  ];

  Object.keys(flattenedStyle).forEach((key) => {
    if (containerStyleKeys.includes(key)) {
      containerStyle[key] = flattenedStyle[key];
    } else {
      innerStyle[key] = flattenedStyle[key];
    }
  });

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#FFFFFF'} />;
    }
    return (
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        style={[
          styles.text,
          styles[`text_${size}`],
          styles[`text_${variant}`],
          disabled && styles.textDisabled,
          textStyle,
        ]}
      >
        {title}
      </Text>
    );
  };

  const buttonStyle = [
    styles.button,
    styles[`button_${size}`],
    variant !== 'gradient' && styles[`button_${variant}`],
    disabled && styles.buttonDisabled,
    innerStyle,
  ];

  const needsStretch = containerStyle.flex !== undefined || containerStyle.width !== undefined;

  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={disabled || loading ? undefined : handlePressIn}
      onPressOut={disabled || loading ? undefined : handlePressOut}
      style={containerStyle}
    >
      <Animated.View style={[
        { transform: [{ scale: scaleAnim }] },
        needsStretch && { width: '100%', height: containerStyle.height ? '100%' : undefined }
      ]}>
        {variant === 'gradient' ? (
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[buttonStyle, needsStretch && { width: '100%', height: containerStyle.height ? '100%' : undefined }]}
          >
            {renderContent()}
          </LinearGradient>
        ) : (
          <View style={[buttonStyle, needsStretch && { width: '100%', height: containerStyle.height ? '100%' : undefined }]}>
            {renderContent()}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button_sm: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  button_md: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  button_lg: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  // Variant styles
  button_filled: {
    backgroundColor: theme.colors.primary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.border,
    borderColor: 'transparent',
  },
  // Text styles
  text: {
    fontFamily: theme.fonts.sansMedium,
    textAlign: 'center',
  },
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  },
  text_filled: {
    color: '#FFFFFF',
  },
  text_gradient: {
    color: '#FFFFFF',
  },
  text_outline: {
    color: theme.colors.text,
  },
  text_ghost: {
    color: theme.colors.textSecondary,
  },
  textDisabled: {
    color: theme.colors.textMuted,
  },
});
