import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Sparkles, BookOpen, Quote, Info } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/LanguageContext';
import { theme } from '../theme/theme';
import { PromptCard } from '../components/PromptCard';
import { Timer } from '../components/Timer';
import { Card } from '../components/Card';
import { MOCK_PROMPTS } from '../services/mockData';

export const HomeScreen = ({ navigation }: any) => {
  const { userStats, drafts } = useApp();
  const { t } = useTranslation();

  const dailyPrompt = MOCK_PROMPTS.find(p => p.id === 'p-daily') || MOCK_PROMPTS[0];
  const dailyDraft = drafts[dailyPrompt.id] || '';

  const handleStartWriting = () => {
    navigation.navigate('Editor', { prompt: dailyPrompt });
  };

  const handleResumeDraft = () => {
    navigation.navigate('Editor', { prompt: dailyPrompt });
  };

  // Immersive writing prompts tips
  const INSPIRATIONS = [
    { text: t('home.inspiration.1.text'), author: t('home.inspiration.1.author') },
    { text: t('home.inspiration.2.text'), author: t('home.inspiration.2.author') },
    { text: t('home.inspiration.3.text'), author: t('home.inspiration.3.author') }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>{t('home.welcome')}</Text>
            <Text style={styles.usernameText}>{userStats?.username || 'Scribe'}</Text>
          </View>

          {/* Streak Badge */}
          <TouchableOpacity
            style={styles.streakBadge}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <Flame size={18} color={theme.colors.gold} fill={theme.colors.gold} />
            <Text style={styles.streakText}>{userStats?.streak || 0} {t('home.dayStreak')}</Text>
          </TouchableOpacity>
        </View>

        {/* Prompt Section Title & Timer */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>{t('home.promptOfDay')}</Text>
          <Timer />
        </View>

        {/* Daily Prompt Card */}
        <PromptCard
          prompt={dailyPrompt}
          onStartWriting={handleStartWriting}
          draftExists={dailyDraft.length > 0}
          onResumeDraft={handleResumeDraft}
        />

        {/* App Tagline Banner */}
        <Card variant="secondary" style={styles.taglineCard}>
          <Quote size={20} color={theme.colors.primary} style={styles.quoteIcon} />
          <Text style={styles.taglineText}>
            {t('home.taglineQuote')}
          </Text>
          <Text style={styles.taglineSubText}>
            {t('home.taglineSub')}
          </Text>
        </Card>

        {/* Inspiration Section */}
        <Text style={styles.sectionTitle}>{t('home.inspirationTitle')}</Text>
        
        {INSPIRATIONS.map((tip, idx) => (
          <Card key={idx} variant="surface" style={styles.inspirationCard}>
            <View style={styles.tipHeader}>
              <View style={styles.bulletDot} />
              <Text style={styles.tipAuthor}>{tip.author}</Text>
            </View>
            <Text style={styles.tipText}>{tip.text}</Text>
          </Card>
        ))}

        <View style={styles.levelTipContainer}>
          <Info size={14} color={theme.colors.textMuted} />
          <Text style={styles.levelTipText}>
            {t('home.xpTip')}
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  welcomeText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  usernameText: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 22,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 176, 32, 0.08)',
    borderColor: 'rgba(255, 176, 32, 0.2)',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.round,
  },
  streakText: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.gold,
    fontSize: 12,
    marginLeft: 6,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 18,
  },
  taglineCard: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quoteIcon: {
    marginBottom: theme.spacing.sm,
    opacity: 0.6,
  },
  taglineText: {
    fontFamily: theme.fonts.serifItalic,
    color: theme.colors.text,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: theme.spacing.md,
  },
  taglineSubText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  inspirationCard: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: 6,
  },
  tipAuthor: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  levelTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  levelTipText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 11,
    marginLeft: 6,
    textAlign: 'center',
  },
});
