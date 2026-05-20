import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Sparkles, BookOpen, Target } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/LanguageContext';
import { theme } from '../theme/theme';
import { Button } from '../components/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const OnboardingScreen = () => {
  const { completeOnboarding } = useApp();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState('daily');

  const GENRES = [
    { id: 'mystery', label: t('genre.mystery'), emoji: '🕵️‍♂️' },
    { id: 'sci-fi', label: t('genre.sci-fi'), emoji: '🚀' },
    { id: 'fantasy', label: t('genre.fantasy'), emoji: '🧝‍♀️' },
    { id: 'horror', label: t('genre.horror'), emoji: '👻' },
    { id: 'emotional', label: t('genre.emotional'), emoji: '😢' },
    { id: 'absurd', label: t('genre.absurd'), emoji: '🌀' },
    { id: 'funny', label: t('genre.funny'), emoji: '😂' },
    { id: 'romance', label: t('genre.romance'), emoji: '💖' },
  ];

  const GOALS = [
    { id: 'daily', label: t('goal.daily.label'), sub: t('goal.daily.sub') },
    { id: 'weekly', label: t('goal.weekly.label'), sub: t('goal.weekly.sub') },
    { id: 'casual', label: t('goal.casual.label'), sub: t('goal.casual.sub') },
  ];

  const toggleGenre = (genreId: string) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const handleNext = () => {
    if (step === 0 && !username.trim()) return;
    if (step < 2) {
      setStep(step + 1);
    } else {
      completeOnboarding(username.trim(), selectedGenres, selectedGoal);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const progress = ((step + 1) / 3) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {step === 0 && (
            <View style={styles.stepContainer}>
              <View style={styles.iconContainer}>
                <Sparkles size={40} color={theme.colors.primary} />
              </View>
              <Text style={styles.tagline}>{t('onboarding.tagline')}</Text>
              <Text style={styles.heading}>{t('onboarding.step1.heading')}</Text>
              <Text style={styles.subheading}>{t('onboarding.step1.sub')}</Text>

              <TextInput
                style={styles.input}
                placeholder={t('onboarding.step1.placeholder')}
                placeholderTextColor={theme.colors.textMuted}
                value={username}
                onChangeText={setUsername}
                maxLength={20}
                autoFocus
                autoCorrect={false}
              />
            </View>
          )}

          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.iconContainer}>
                <BookOpen size={40} color={theme.colors.accent} />
              </View>
              <Text style={styles.heading}>{t('onboarding.step2.heading')}</Text>
              <Text style={styles.subheading}>{t('onboarding.step2.sub')}</Text>

              <View style={styles.genresGrid}>
                {GENRES.map(genre => {
                  const isSelected = selectedGenres.includes(genre.id);
                  return (
                    <TouchableOpacity
                      key={genre.id}
                      style={[
                        styles.genreCard,
                        isSelected && styles.genreCardSelected,
                        isSelected && { borderColor: theme.colors.accent }
                      ]}
                      onPress={() => toggleGenre(genre.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.genreEmoji}>{genre.emoji}</Text>
                      <Text style={[styles.genreLabel, isSelected && styles.genreLabelSelected]}>
                        {genre.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.iconContainer}>
                <Target size={40} color={theme.colors.gold} />
              </View>
              <Text style={styles.heading}>{t('onboarding.step3.heading')}</Text>
              <Text style={styles.subheading}>{t('onboarding.step3.sub')}</Text>

              <View style={styles.goalsList}>
                {GOALS.map(goal => {
                  const isSelected = selectedGoal === goal.id;
                  return (
                    <TouchableOpacity
                      key={goal.id}
                      style={[
                        styles.goalCard,
                        isSelected && styles.goalCardSelected,
                        isSelected && { borderColor: theme.colors.gold }
                      ]}
                      onPress={() => setSelectedGoal(goal.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.goalInfo}>
                        <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>
                          {goal.label}
                        </Text>
                        <Text style={styles.goalSub}>{goal.sub}</Text>
                      </View>
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Actions Navigation */}
        <View style={styles.navigationRow}>
          {step > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>{t('onboarding.back')}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.spacer} />
          )}

          <Button
            title={step === 2 ? t('onboarding.enter') : t('onboarding.next')}
            onPress={handleNext}
            variant="gradient"
            disabled={step === 0 && !username.trim()}
            style={styles.nextButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: theme.colors.border,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  stepContainer: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  tagline: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  heading: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subheading: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  input: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1.5,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: theme.fonts.sans,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: theme.spacing.md,
  },
  genreCard: {
    width: (SCREEN_WIDTH - 54) / 2, // 2 column layout with spacing
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  genreCardSelected: {
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
    borderWidth: 1.5,
  },
  genreEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  genreLabel: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  genreLabelSelected: {
    color: theme.colors.text,
  },
  goalsList: {
    width: '100%',
    marginTop: theme.spacing.md,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  goalCardSelected: {
    backgroundColor: 'rgba(255, 176, 32, 0.06)',
    borderWidth: 1.5,
  },
  goalInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  goalLabel: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginBottom: 4,
  },
  goalLabelSelected: {
    color: theme.colors.text,
  },
  goalSub: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: theme.colors.gold,
    backgroundColor: theme.colors.gold,
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  backButtonText: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.textSecondary,
    fontSize: 15,
  },
  nextButton: {
    minWidth: 120,
  },
  spacer: {
    width: 60,
  },
});
