import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';

export interface DialogButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons: DialogButton[];
  onRequestClose?: () => void;
  /** Icon node rendered above the title */
  icon?: React.ReactNode;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  buttons,
  onRequestClose,
  icon,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.cardWrapper,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.card}>
            {icon && <View style={styles.iconWrap}>{icon}</View>}

            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}

            <View style={[styles.btnRow, buttons.length > 2 && styles.btnCol]}>
              {buttons.map((btn, i) => {
                const isDestructive = btn.style === 'destructive';
                const isCancel = btn.style === 'cancel';
                const isPrimary = !isDestructive && !isCancel;

                return (
                  <TouchableOpacity
                    key={i}
                    onPress={btn.onPress}
                    activeOpacity={0.7}
                    style={[
                      styles.btn,
                      buttons.length === 2 && i === 0 && styles.btnLeft,
                      isDestructive && styles.btnDestructive,
                      isCancel && styles.btnCancel,
                      isPrimary && styles.btnPrimary,
                    ]}
                  >
                    {isPrimary ? (
                      <LinearGradient
                        colors={[theme.colors.primary, theme.colors.primaryDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.btnGradient}
                      >
                        <Text style={styles.btnTextPrimary}>{btn.text}</Text>
                      </LinearGradient>
                    ) : (
                      <Text
                        style={[
                          styles.btnText,
                          isDestructive && styles.btnTextDestructive,
                          isCancel && styles.btnTextCancel,
                        ]}
                      >
                        {btn.text}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 320,
  },
  card: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
  },
  iconWrap: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  message: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  btnCol: {
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },
  btn: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLeft: {
    // gap handles spacing in row layout
  },
  btnGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  btnCancel: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnDestructive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  btnPrimary: {
    // gradient handled in component
  },
  btnText: {
    fontFamily: theme.fonts.sansBold,
    fontSize: 15,
    letterSpacing: -0.3,
  },
  btnTextCancel: {
    color: theme.colors.textSecondary,
  },
  btnTextDestructive: {
    color: theme.colors.crimson,
  },
  btnTextPrimary: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.sansBold,
    fontSize: 15,
    letterSpacing: -0.3,
  },
});
