import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Swords, Vote, Trophy, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/LanguageContext';
import { theme } from '../theme/theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { getLocalizedPrompt } from '../utils/promptHelpers';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const BattleScreen = () => {
  const { battles, voteInBattle } = useApp();
  const { t } = useTranslation();
  const [activeStory, setActiveStory] = useState<'A' | 'B'>('A');

  // Slide animation between Story A and Story B
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Winner reveal animation
  const scaleWinner = useRef(new Animated.Value(0)).current;

  const currentBattle = battles[0] || null;

  const switchStory = (story: 'A' | 'B') => {
    setActiveStory(story);
    Animated.spring(slideAnim, {
      toValue: story === 'A' ? 0 : -SCREEN_WIDTH + 48, // Slide amount
      friction: 8,
      tension: 30,
      useNativeDriver: true,
    }).start();
  };

  const handleVote = (selection: 'A' | 'B') => {
    if (!currentBattle) return;
    voteInBattle(currentBattle.id, selection);

    // Trigger victory reveal animations
    Animated.spring(scaleWinner, {
      toValue: 1,
      friction: 5,
      tension: 30,
      useNativeDriver: true,
    }).start();
  };

  if (!currentBattle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Swords size={48} color={theme.colors.textMuted} />
          <Text style={styles.emptyText}>{t('battle.emptyTitle')}</Text>
          <Text style={styles.emptySub}>{t('battle.emptySub')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const voted = !!currentBattle.userVotedFor;
  const votePercentageA = Math.round((currentBattle.votesA / (currentBattle.votesA + currentBattle.votesB)) * 100);
  const votePercentageB = 100 - votePercentageA;
  const isWinnerA = currentBattle.votesA > currentBattle.votesB;
  const isWinnerB = currentBattle.votesB > currentBattle.votesA;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Battle Header */}
        <View style={styles.header}>
          <View style={styles.battleTitleContainer}>
            <Swords size={22} color={theme.colors.accent} style={styles.swordsIcon} />
            <Text style={styles.headerTitle}>{t('battle.title')}</Text>
          </View>
          <Text style={styles.headerSubtitle}>{t('battle.subtitle')}</Text>
        </View>

        {/* The Prompt Card */}
        {(() => {
          const lp = getLocalizedPrompt(currentBattle.prompt, t);
          return (
            <Card variant="secondary" style={styles.promptContainer}>
              <View style={styles.promptHeader}>
                <View style={styles.battleBadge}>
                  <Text style={styles.battleBadgeText}>{t('battle.promptBadge')}</Text>
                </View>
                <Text style={styles.timerText}>{t('battle.endsIn')} {currentBattle.endsAt}</Text>
              </View>
              <Text style={styles.promptTitle}>{lp.title}</Text>
              <Text style={styles.promptText}>"{lp.text}"</Text>
              {lp.constraint && (
                <Text style={styles.constraintText}>{t('prompt.constraint')}: {lp.constraint}</Text>
              )}
            </Card>
          );
        })()}

        {/* Versus Swiper Nav */}
        <View style={styles.switcherContainer}>
          <TouchableOpacity
            style={[styles.switcherBtn, activeStory === 'A' && styles.switcherBtnActive]}
            onPress={() => switchStory('A')}
            activeOpacity={0.7}
          >
            <Text style={[styles.switcherText, activeStory === 'A' && styles.switcherTextActive]}>
              {t('battle.storyA')}
            </Text>
            <Text style={styles.authorSub}>by @{currentBattle.storyA.username}</Text>
          </TouchableOpacity>

          <View style={styles.vsDivider}>
            <Text style={styles.vsText}>{t('battle.vs')}</Text>
          </View>

          <TouchableOpacity
            style={[styles.switcherBtn, activeStory === 'B' && styles.switcherBtnActive]}
            onPress={() => switchStory('B')}
            activeOpacity={0.7}
          >
            <Text style={[styles.switcherText, activeStory === 'B' && styles.switcherTextActive]}>
              {t('battle.storyB')}
            </Text>
            <Text style={styles.authorSub}>by @{currentBattle.storyB.username}</Text>
          </TouchableOpacity>
        </View>

        {/* Story Slider Container */}
        <View style={styles.sliderWrapper}>
          <Animated.View
            style={[
              styles.sliderTrack,
              {
                transform: [{ translateX: slideAnim }],
                width: (SCREEN_WIDTH - 32) * 2, // Double width for side by side
              },
            ]}
          >
            {/* Story A Card */}
            <View style={[styles.storySlideCardContainer, { width: SCREEN_WIDTH - 32 }]}>
              <Card borderGradient={activeStory === 'A' && !voted} style={styles.storySlideCard}>
                <View style={styles.authorHeader}>
                  <Image source={{ uri: currentBattle.storyA.avatarUrl }} style={styles.avatar} />
                  <Text style={styles.authorName}>@{currentBattle.storyA.username}</Text>
                </View>
                <ScrollView style={styles.storyScroll} showsVerticalScrollIndicator={false}>
                  <Text style={styles.storyContent}>{currentBattle.storyA.content}</Text>
                </ScrollView>
              </Card>
            </View>

            {/* Story B Card */}
            <View style={[styles.storySlideCardContainer, { width: SCREEN_WIDTH - 32 }]}>
              <Card borderGradient={activeStory === 'B' && !voted} style={styles.storySlideCard}>
                <View style={styles.authorHeader}>
                  <Image source={{ uri: currentBattle.storyB.avatarUrl }} style={styles.avatar} />
                  <Text style={styles.authorName}>@{currentBattle.storyB.username}</Text>
                </View>
                <ScrollView style={styles.storyScroll} showsVerticalScrollIndicator={false}>
                  <Text style={styles.storyContent}>{currentBattle.storyB.content}</Text>
                </ScrollView>
              </Card>
            </View>
          </Animated.View>
        </View>

        {/* Swiper Arrow Indicators */}
        <View style={styles.arrowsRow}>
          {activeStory === 'B' ? (
            <TouchableOpacity onPress={() => switchStory('A')} style={styles.arrowIndicatorBtn}>
              <ArrowLeft size={16} color={theme.colors.textSecondary} />
              <Text style={styles.arrowText}>{t('battle.viewStoryA')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => switchStory('B')} style={styles.arrowIndicatorBtn}>
              <Text style={styles.arrowText}>{t('battle.viewStoryB')}</Text>
              <ArrowRight size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Voting / Winner Reveal Section */}
        {!voted ? (
          <View style={styles.votingActionContainer}>
            <Text style={styles.votingTip}>{t('battle.votingTip')}</Text>
            <Button
              title={t('battle.voteFor') + ' ' + activeStory}
              variant="gradient"
              onPress={() => handleVote(activeStory)}
              style={styles.voteBtn}
            />
          </View>
        ) : (
          <Animated.View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Trophy size={20} color={theme.colors.gold} />
              <Text style={styles.resultsTitle}>{t('battle.standingTitle')}</Text>
            </View>

            {/* Result Bar A */}
            <View style={styles.resultBarRow}>
              <View style={styles.resultLabelRow}>
                <Text style={styles.resultLabel}>{t('battle.storyA')} ({currentBattle.storyA.username})</Text>
                <Text style={[styles.resultPercentage, isWinnerA && styles.resultWinnerColor]}>
                  {votePercentageA}% {isWinnerA && '🏆'}
                </Text>
              </View>
              <View style={styles.resultBarBg}>
                <LinearGradient
                  colors={isWinnerA ? [theme.colors.primary, theme.colors.accent] : [theme.colors.border, theme.colors.borderLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.resultBarFill, { width: `${votePercentageA}%` }]}
                />
              </View>
            </View>

            {/* Result Bar B */}
            <View style={styles.resultBarRow}>
              <View style={styles.resultLabelRow}>
                <Text style={styles.resultLabel}>{t('battle.storyB')} ({currentBattle.storyB.username})</Text>
                <Text style={[styles.resultPercentage, isWinnerB && styles.resultWinnerColor]}>
                  {votePercentageB}% {isWinnerB && '🏆'}
                </Text>
              </View>
              <View style={styles.resultBarBg}>
                <LinearGradient
                  colors={isWinnerB ? [theme.colors.primary, theme.colors.accent] : [theme.colors.border, theme.colors.borderLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.resultBarFill, { width: `${votePercentageB}%` }]}
                />
              </View>
            </View>

            {/* Voter Confirmed Alert */}
            <View style={styles.votedBadge}>
              <CheckCircle2 size={16} color={theme.colors.emerald} />
              <Text style={styles.votedBadgeText}>
                {t('battle.votedConfirm', { side: currentBattle.userVotedFor || '' })}
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xs,
  },
  battleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  swordsIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 22,
  },
  headerSubtitle: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  promptContainer: {
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(236, 72, 153, 0.15)', // light glowing tint for battle
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  battleBadge: {
    backgroundColor: 'rgba(236, 72, 153, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  battleBadgeText: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.accent,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  timerText: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.textSecondary,
    fontSize: 11,
  },
  promptTitle: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: 4,
  },
  promptText: {
    fontFamily: theme.fonts.serifItalic,
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  constraintText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  switcherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSecondary,
    padding: 6,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  switcherBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  switcherBtnActive: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  switcherText: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  switcherTextActive: {
    color: theme.colors.primary,
  },
  authorSub: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  vsDivider: {
    paddingHorizontal: theme.spacing.md,
  },
  vsText: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  sliderWrapper: {
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  sliderTrack: {
    flexDirection: 'row',
  },
  storySlideCardContainer: {
    paddingHorizontal: 4,
  },
  storySlideCard: {
    height: 320,
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.surface,
  },
  authorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.border,
  },
  authorName: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.text,
    fontSize: 13,
    marginLeft: 8,
  },
  storyScroll: {
    flex: 1,
  },
  storyContent: {
    fontFamily: theme.fonts.serif,
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 25,
  },
  arrowsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  arrowIndicatorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  arrowText: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginHorizontal: 6,
  },
  votingActionContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  votingTip: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginBottom: theme.spacing.md,
  },
  voteBtn: {
    width: '100%',
  },
  resultsContainer: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  resultsTitle: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 16,
    marginLeft: 8,
  },
  resultBarRow: {
    marginBottom: theme.spacing.md,
  },
  resultLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  resultLabel: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  resultPercentage: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  resultWinnerColor: {
    color: theme.colors.gold,
  },
  resultBarBg: {
    height: 10,
    backgroundColor: theme.colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  resultBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  votedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  votedBadgeText: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.emerald,
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 120,
  },
  emptyText: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 18,
    marginTop: theme.spacing.md,
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
});
