import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import {
  Flame,
  Award,
  BookOpen,
  Calendar,
  Settings,
  PenTool,
  Moon,
  Sparkles,
  Swords,
  MessageSquareText,
  Trash2,
  Edit2,
  Layers,
  RotateCcw
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/LanguageContext';
import { theme } from '../theme/theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Badge, MOCK_PROMPTS } from '../services/mockData';
import { getLocalizedPrompt } from '../utils/promptHelpers';
export const ProfileScreen = ({ navigation }: any) => {
  const { userStats, stories, drafts, deleteDraft, resetApp } = useApp();
  const { updateUserProfile } = useApp();
  const { t, language, setLanguage } = useTranslation();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  
  // Dialog states
  const [isDeleteDraftDialogVisible, setIsDeleteDraftDialogVisible] = useState(false);
  const [isResetDialogVisible, setIsResetDialogVisible] = useState(false);
  const [isResetSuccessDialogVisible, setIsResetSuccessDialogVisible] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');

  // Filter user stories
  const userStories = stories.filter(s => s.userId === 'u-current');
  const userDraftKeys = Object.keys(drafts).filter(k => drafts[k].trim() !== '');

  const getRank = (level: number) => {
    return t(`rank.${level}`);
  };

  const getBadgeIcon = (iconName: string, color: string) => {
    const props = { size: 24, color };
    switch (iconName) {
      case 'PenTool':
        return <PenTool {...props} />;
      case 'Moon':
        return <Moon {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'Swords':
        return <Swords {...props} />;
      case 'MessageSquareText':
        return <MessageSquareText {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  const handleEditDraft = (promptId: string) => {
    const matchedPrompt = MOCK_PROMPTS.find(p => p.id === promptId);
    if (matchedPrompt) {
      navigation.navigate('Editor', { prompt: matchedPrompt });
    }
  };

  const handleDeleteDraft = (promptId: string) => {
    setDraftToDelete(promptId);
    setIsDeleteDraftDialogVisible(true);
  };

  const handleReset = () => {
    setIsResetDialogVisible(true);
  };

  const confirmDeleteDraft = async () => {
    if (draftToDelete) {
      deleteDraft(draftToDelete);
      setIsDeleteDraftDialogVisible(false);
      setDraftToDelete(null);
    }
  };

  const confirmReset = async () => {
    setIsResetDialogVisible(false);
    await resetApp();
    setIsResetSuccessDialogVisible(true);
  };

  const xpPercent = userStats ? (userStats.xp / userStats.nextLevelXp) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Settings/Reset Top bar */}
        <View style={styles.topActionsRow}>
          <TouchableOpacity onPress={handleReset} style={styles.settingsIcon} activeOpacity={0.7}>
            <RotateCcw size={18} color={theme.colors.textSecondary} />
            <Text style={styles.actionText}>{t('profile.resetDemo')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setEditUsername(userStats?.username || '');
            setEditAvatarUrl(userStats?.avatarUrl || '');
            setIsEditProfileVisible(true);
          }} style={[styles.settingsIcon, { marginLeft: 12 }]} activeOpacity={0.7}>
            <Edit2 size={16} color={theme.colors.textSecondary} />
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Language Switcher */}
        <View style={styles.languageSwitcher}>
          <Text style={styles.languageLabel}>{t('language.label')}</Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
              onPress={() => setLanguage('en')}
              activeOpacity={0.7}
            >
              <Text style={[styles.langBtnText, language === 'en' && styles.langBtnTextActive]}>
                {t('language.en')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, language === 'fr' && styles.langBtnActive]}
              onPress={() => setLanguage('fr')}
              activeOpacity={0.7}
            >
              <Text style={[styles.langBtnText, language === 'fr' && styles.langBtnTextActive]}>
                {t('language.fr')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Card */}
        <View style={styles.userHeader}>
          {userStats && userStats.avatarUrl && userStats.avatarUrl.length > 0 ? (
            <Image
              source={{ uri: userStats.avatarUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.initialAvatar}>
              <Text style={styles.initialText}>{(userStats?.username || 'S').charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <Text style={styles.userName}>{userStats?.username || 'Scribe'}</Text>
          <Text style={styles.userRank}>{getRank(userStats?.level || 1)}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card variant="surface" style={styles.statBox}>
            <Flame size={20} color={theme.colors.gold} fill={theme.colors.gold} />
            <Text style={styles.statVal}>{userStats?.streak || 0}</Text>
            <Text style={styles.statLbl}>{t('profile.streakDays')}</Text>
          </Card>

          <Card variant="surface" style={styles.statBox}>
            <BookOpen size={20} color={theme.colors.primary} />
            <Text style={styles.statVal}>{userStats?.totalStories || 0}</Text>
            <Text style={styles.statLbl}>{t('profile.storiesSpilled')}</Text>
          </Card>

          <Card variant="surface" style={styles.statBox}>
            <Layers size={20} color={theme.colors.accent} />
            <Text style={styles.statVal}>{userStats?.level || 1}</Text>
            <Text style={styles.statLbl}>{t('profile.writingLevel')}</Text>
          </Card>
        </View>

        {/* XP Level Bar */}
        <Card variant="surface" style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>{t('profile.levelProgress')}</Text>
            <Text style={styles.xpFraction}>
              {userStats?.xp}/{userStats?.nextLevelXp} XP
            </Text>
          </View>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${xpPercent}%` }]} />
          </View>
        </Card>

        {/* Badges Grid */}
        <Text style={styles.sectionTitle}>{t('profile.badgesTitle')}</Text>
        <Card variant="secondary" style={styles.badgesCard}>
          <View style={styles.badgesGrid}>
            {userStats?.badges.map(badge => {
              const isUnlocked = !!badge.unlockedAt;
              const badgeColor = isUnlocked ? theme.colors.gold : theme.colors.textMuted;
              return (
                <TouchableOpacity
                  key={badge.id}
                  style={[styles.badgeItem, !isUnlocked && styles.badgeItemLocked]}
                  onPress={() => setSelectedBadge(badge)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.badgeIconBg, { backgroundColor: isUnlocked ? 'rgba(255,176,32,0.06)' : 'rgba(255,255,255,0.02)' }]}>
                    {getBadgeIcon(badge.icon, badgeColor)}
                  </View>
                  <Text style={[styles.badgeName, !isUnlocked && styles.badgeNameLocked]} numberOfLines={1}>
                    {t('badge.' + badge.id + '.name')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Saved Drafts */}
        <Text style={styles.sectionTitle}>{t('profile.draftsTitle')} ({userDraftKeys.length})</Text>
        {userDraftKeys.length === 0 ? (
          <Card variant="surface" style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>{t('profile.noDrafts')}</Text>
          </Card>
        ) : (
          userDraftKeys.map(key => {
            const matchedPrompt = MOCK_PROMPTS.find(p => p.id === key);
            const localizedMatchedPrompt = matchedPrompt ? getLocalizedPrompt(matchedPrompt, t) : undefined;
            return (
              <Card key={key} variant="surface" style={styles.draftCard}>
                <View style={styles.draftInfo}>
                  <Text style={styles.draftPromptCategory}>
                    {localizedMatchedPrompt ? t('genre.' + localizedMatchedPrompt.category).toUpperCase() : 'PROMPT'}
                  </Text>
                  <Text style={styles.draftSnippet} numberOfLines={1}>
                    {drafts[key]}
                  </Text>
                </View>

                <View style={styles.draftActions}>
                  <TouchableOpacity
                    onPress={() => handleEditDraft(key)}
                    style={styles.draftActionBtn}
                    activeOpacity={0.7}
                  >
                    <Edit2 size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteDraft(key)}
                    style={[styles.draftActionBtn, { marginLeft: theme.spacing.sm }]}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color={theme.colors.crimson} />
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })
        )}

        {/* User Stories */}
        <Text style={styles.sectionTitle}>{t('profile.storiesTitle')} ({userStories.length})</Text>
        {userStories.length === 0 ? (
          <Card variant="surface" style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>{t('profile.noStories')}</Text>
          </Card>
        ) : (
          userStories.map(story => (
            <Card key={story.id} variant="surface" style={styles.userStoryCard}>
              <Text style={styles.userStoryPrompt}>{t('profile.inspiredBy')} "{t(`prompt.${story.promptId}.text`) !== `prompt.${story.promptId}.text` ? t(`prompt.${story.promptId}.text`) : story.promptText}"</Text>
              <Text style={styles.userStoryBody} numberOfLines={3}>
                {story.content}
              </Text>
              <View style={styles.userStoryFooter}>
                <Text style={styles.userStoryLikes}>{story.likes} {t('profile.likes')}</Text>
                <Text style={styles.userStoryComments}>{story.commentsCount} {t('profile.comments')}</Text>
              </View>
            </Card>
          ))
        )}

      </ScrollView>

      {/* Badge Details Modal */}
      {selectedBadge && (
        <Modal
          visible={selectedBadge !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedBadge(null)}
        >
          <View style={styles.badgeModalBackdrop}>
            <View style={styles.badgeModalContent}>
              <View style={[styles.badgeModalIconBg, { backgroundColor: selectedBadge.unlockedAt ? 'rgba(255,176,32,0.1)' : 'rgba(255,255,255,0.03)' }]}>
                {getBadgeIcon(selectedBadge.icon, selectedBadge.unlockedAt ? theme.colors.gold : theme.colors.textMuted)}
              </View>
              <Text style={styles.badgeModalName}>{t('badge.' + selectedBadge.id + '.name')}</Text>
              <Text style={styles.badgeModalStatus}>
                {selectedBadge.unlockedAt ? t('profile.badgeUnlocked', { date: new Date(selectedBadge.unlockedAt).toLocaleDateString() }) : t('profile.badgeLocked')}
              </Text>
              <Text style={styles.badgeModalDesc}>{t('badge.' + selectedBadge.id + '.desc')}</Text>
              <Text style={styles.badgeModalXp}>{t('profile.badgeXp', { xp: selectedBadge.xpValue })}</Text>
              
              <Button
                title={t('profile.dismiss')}
                variant="filled"
                onPress={() => setSelectedBadge(null)}
                style={styles.badgeModalBtn}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditProfileVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditProfileVisible(false)}
      >
        <View style={styles.editModalBackdrop}>
          <View style={styles.editModalContent}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>
            <TextInput
              value={editUsername}
              onChangeText={setEditUsername}
              placeholder="Username"
              style={styles.input}
              placeholderTextColor={theme.colors.textMuted}
            />
            <TextInput
              value={editAvatarUrl}
              onChangeText={setEditAvatarUrl}
              placeholder="Avatar URL (leave blank for initials)"
              style={styles.input}
              placeholderTextColor={theme.colors.textMuted}
            />
            <View style={{ flexDirection: 'row', marginTop: theme.spacing.md }}>
              <Button title="Cancel" variant="ghost" onPress={() => setIsEditProfileVisible(false)} style={{ flex: 1, marginRight: theme.spacing.sm }} />
              <Button
                title="Save"
                variant="filled"
                onPress={async () => {
                  await updateUserProfile(editUsername, editAvatarUrl);
                  setIsEditProfileVisible(false);
                }}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Draft Confirmation Dialog */}
      <ConfirmDialog
        visible={isDeleteDraftDialogVisible}
        title={t('profile.deleteDraftTitle')}
        message={t('profile.deleteDraftBody')}
        onRequestClose={() => setIsDeleteDraftDialogVisible(false)}
        buttons={[
          {
            text: t('profile.cancel'),
            style: 'cancel',
            onPress: () => setIsDeleteDraftDialogVisible(false),
          },
          {
            text: t('profile.delete'),
            style: 'destructive',
            onPress: confirmDeleteDraft,
          },
        ]}
      />

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        visible={isResetDialogVisible}
        title={t('profile.resetTitle')}
        message={t('profile.resetBody')}
        onRequestClose={() => setIsResetDialogVisible(false)}
        buttons={[
          {
            text: t('profile.cancel'),
            style: 'cancel',
            onPress: () => setIsResetDialogVisible(false),
          },
          {
            text: t('profile.resetConfirm'),
            style: 'destructive',
            onPress: confirmReset,
          },
        ]}
      />

      {/* Reset Success Dialog */}
      <ConfirmDialog
        visible={isResetSuccessDialogVisible}
        title={t('profile.resetSuccess')}
        message={t('profile.resetSuccessBody')}
        onRequestClose={() => setIsResetSuccessDialogVisible(false)}
        buttons={[
          {
            text: 'OK',
            style: 'default',
            onPress: () => setIsResetSuccessDialogVisible(false),
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xxl,
  },
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  settingsIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  actionText: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginLeft: 6,
  },
  userHeader: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.border,
  },
  initialAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.primary,
    fontSize: 32,
  },
  userName: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 22,
    marginTop: theme.spacing.sm,
  },
  userRank: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.primary,
    fontSize: 12,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    paddingVertical: theme.spacing.md,
  },
  statVal: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 18,
    marginVertical: 4,
  },
  statLbl: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
  xpCard: {
    marginBottom: theme.spacing.xl,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  xpLabel: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  xpFraction: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 13,
  },
  xpBarBg: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  sectionTitle: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  badgesCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  badgeItemLocked: {
    opacity: 0.4,
  },
  badgeIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeName: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: theme.colors.textMuted,
  },
  emptyCard: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  emptyCardText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  draftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  draftInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  draftPromptCategory: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.primary,
    fontSize: 10,
    marginBottom: 2,
  },
  draftSnippet: {
    fontFamily: theme.fonts.serif,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  draftActions: {
    flexDirection: 'row',
  },
  draftActionBtn: {
    padding: 6,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  userStoryCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  userStoryPrompt: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.primary,
    fontSize: 11,
    marginBottom: 6,
  },
  userStoryBody: {
    fontFamily: theme.fonts.serif,
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
  },
  userStoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userStoryLikes: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 11,
    marginRight: theme.spacing.md,
  },
  userStoryComments: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  badgeModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  badgeModalContent: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  badgeModalIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  badgeModalName: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 20,
    marginBottom: 4,
  },
  badgeModalStatus: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.gold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  badgeModalDesc: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  badgeModalXp: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.primary,
    fontSize: 12,
    marginBottom: theme.spacing.lg,
  },
  badgeModalBtn: {
    width: '100%',
  },
  languageSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  languageLabel: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginRight: theme.spacing.md,
  },
  languageButtons: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  langBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  langBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  langBtnText: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  langBtnTextActive: {
    color: '#FFFFFF',
  },
  editModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  editModalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
});
