import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { Card } from './Card';
import { Button } from './Button';
import { Prompt } from '../services/mockData';
import { Sparkles, HelpCircle } from 'lucide-react-native';
import { useTranslation } from '../i18n/LanguageContext';
import { HighlightText } from './HighlightText';
import { getLocalizedPrompt } from '../utils/promptHelpers';

interface PromptCardProps {
  prompt: Prompt;
  onStartWriting: () => void;
  draftExists?: boolean;
  onResumeDraft?: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onStartWriting,
  draftExists = false,
  onResumeDraft,
}) => {
  const { t } = useTranslation();
  const localizedPrompt = getLocalizedPrompt(prompt, t);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mystery':
        return theme.colors.primary;
      case 'horror':
        return theme.colors.crimson;
      case 'romance':
        return theme.colors.accent;
      case 'sci-fi':
        return '#06B6D4'; // cyan
      case 'fantasy':
        return theme.colors.gold;
      case 'emotional':
        return '#3B82F6'; // blue
      case 'absurd':
        return theme.colors.emerald;
      case 'funny':
        return '#F59E0B'; // amber
      default:
        return theme.colors.primary;
    }
  };

  const catColor = getCategoryColor(localizedPrompt.category);

  return (
    <Card borderGradient glow style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: `${catColor}15`, borderColor: `${catColor}40` }]}>
          <Text style={[styles.badgeText, { color: catColor }]}>
            {t('genre.' + localizedPrompt.category).toUpperCase()}
          </Text>
        </View>
        <Sparkles size={16} color={catColor} />
      </View>

      <Text style={styles.title}>{localizedPrompt.title}</Text>
      <Text style={styles.promptText}>“{localizedPrompt.text}”</Text>

      {localizedPrompt.constraint && (
        <View style={styles.constraintContainer}>
          <HelpCircle size={14} color={theme.colors.primary} />
          <HighlightText text={`${t('prompt.challenge')}: ${localizedPrompt.constraint}`} style={styles.constraintText} />
        </View>
      )}

      <View style={styles.buttonContainer}>
        {draftExists && onResumeDraft ? (
          <>
            <Button
              title={t('promptCard.resumeDraft')}
              variant="gradient"
              onPress={onResumeDraft}
              style={styles.flexButton}
            />
            <Button
              title={t('promptCard.startNew')}
              variant="outline"
              onPress={onStartWriting}
              style={[styles.flexButton, { marginLeft: theme.spacing.sm }]}
            />
          </>
        ) : (
          <Button
            title={t('promptCard.startWriting')}
            variant="gradient"
            onPress={onStartWriting}
            style={styles.fullButton}
          />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
  },
  badgeText: {
    fontFamily: theme.fonts.sansBold,
    fontSize: 10,
    letterSpacing: 1,
  },
  title: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 22,
    marginBottom: theme.spacing.sm,
  },
  promptText: {
    fontFamily: theme.fonts.serifItalic,
    color: theme.colors.text,
    fontSize: 18,
    lineHeight: 26,
    marginBottom: theme.spacing.lg,
  },
  constraintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  constraintText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginLeft: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  flexButton: {
    flex: 1,
  },
  fullButton: {
    width: '100%',
  },
});
