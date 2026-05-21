import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}

          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={[styles.btnRow, buttons.length > 2 && styles.btnCol]}>
            {buttons.map((btn, i) => {
              const isDestructive = btn.style === 'destructive';
              const isCancel = btn.style === 'cancel';

              return (
                <TouchableOpacity
                  key={i}
                  onPress={btn.onPress}
                  activeOpacity={0.8}
                  style={[
                    styles.btn,
                    buttons.length === 2 && i === 0 && styles.btnLeft,
                    isDestructive && styles.btnDestructive,
                    isCancel && styles.btnCancel,
                    !isDestructive && !isCancel && styles.btnPrimary,
                  ]}
                >
                  <Text
                    style={[
                      styles.btnText,
                      isDestructive && styles.btnTextDestructive,
                      isCancel && styles.btnTextCancel,
                      !isDestructive && !isCancel && styles.btnTextPrimary,
                    ]}
                  >
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    alignItems: 'center',
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  iconWrap: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 6,
  },
  message: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  btnCol: {
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLeft: {
    // no extra style needed; gap handles spacing
  },
  btnCancel: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnDestructive: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  btnPrimary: {
    backgroundColor: theme.colors.primary,
  },
  btnText: {
    fontFamily: theme.fonts.sansBold,
    fontSize: 14,
  },
  btnTextCancel: {
    color: theme.colors.textSecondary,
  },
  btnTextDestructive: {
    color: theme.colors.crimson,
  },
  btnTextPrimary: {
    color: '#FFFFFF',
  },
});
