import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView
} from 'react-native';
import { ArrowLeft, MessageSquare, Heart, X, Send, Award } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/LanguageContext';
import { theme } from '../theme/theme';
import { StoryCard } from '../components/StoryCard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Story } from '../services/mockData';
export const FeedScreen = ({ navigation }: any) => {
  const { stories, toggleLikeStory, addCommentToStory } = useApp();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('All');

  const CATEGORY_TABS = [
    { key: 'All', label: t('feed.category.all') },
    { key: 'Sci-Fi', label: t('feed.category.scifi') },
    { key: 'Fantasy', label: t('feed.category.fantasy') },
    { key: 'Mystery', label: t('feed.category.mystery') },
    { key: 'Horror', label: t('feed.category.horror') },
    { key: 'Emotional', label: t('feed.category.emotional') },
    { key: 'Absurd', label: t('feed.category.absurd') },
    { key: 'Funny', label: t('feed.category.funny') },
  ];
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [commentText, setCommentText] = useState('');

  // Filter stories based on selected category tab
  const filteredStories = stories.filter(story => {
    if (selectedTab === 'All') return true;
    return story.moodTags.some(tag => tag.toLowerCase() === selectedTab.toLowerCase()) ||
           (story.promptText.toLowerCase().includes(selectedTab.toLowerCase()));
  });

  const handleOpenStory = (story: Story) => {
    setActiveStory(story);
  };

  const handleCloseStory = () => {
    setActiveStory(null);
    setCommentText('');
  };

  const handleSendComment = () => {
    if (!activeStory || !commentText.trim()) return;
    addCommentToStory(activeStory.id, commentText.trim());
    
    // Find updated story in local stories state to refresh activeStory modal state
    const updated = stories.find(s => s.id === activeStory.id);
    if (updated) {
      // Manually add the comment locally for instant UI response in the modal
      const newComment = {
        id: `c-temp-${Date.now()}`,
        username: 'You',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop&q=80',
        content: commentText.trim(),
        createdAt: 'Just now'
      };
      setActiveStory({
        ...activeStory,
        comments: [...activeStory.comments, newComment],
        commentsCount: activeStory.commentsCount + 1
      });
    }

    setCommentText('');
  };

  const renderStoryItem = ({ item }: { item: Story }) => {
    return (
      <StoryCard
        story={item}
        onPress={() => handleOpenStory(item)}
        onLikePress={() => toggleLikeStory(item.id)}
        onCommentPress={() => handleOpenStory(item)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search/Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('feed.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('feed.subtitle')}</Text>
      </View>

      {/* Categories Row */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {CATEGORY_TABS.map(tab => {
            const isActive = selectedTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setSelectedTab(tab.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Stories list */}
      <FlatList
        data={filteredStories}
        keyExtractor={item => item.id}
        renderItem={renderStoryItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('feed.empty')}</Text>
            <Text style={styles.emptySubtext}>{t('feed.emptySub')}</Text>
            <Button
              title={t('feed.writeNow')}
              variant="outline"
              onPress={() => navigation.navigate('Home')}
              style={styles.emptyButton}
            />
          </View>
        }
      />

      {/* Detailed Story Modal */}
      {activeStory && (
        <Modal
          visible={activeStory !== null}
          animationType="slide"
          onRequestClose={handleCloseStory}
        >
          <SafeAreaView style={styles.modalContainer}>
            {/* Modal Header — tap to dismiss keyboard */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCloseStory} style={styles.closeButton}>
                  <ArrowLeft size={22} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.modalHeaderTitle}>{t('feed.story')}</Text>
                <View style={{ width: 40 }} />
              </View>
            </TouchableWithoutFeedback>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
              <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
                {/* Main Story Info Card */}
                <StoryCard
                  story={activeStory}
                  isDetailedView
                  onLikePress={() => {
                    toggleLikeStory(activeStory.id);
                    // update local modal state
                    setActiveStory(prev => prev ? {
                      ...prev,
                      likes: prev.isLikedByCurrentUser ? prev.likes - 1 : prev.likes + 1,
                      isLikedByCurrentUser: !prev.isLikedByCurrentUser
                    } : null);
                  }}
                />

                {/* Comments Header */}
                <Text style={styles.commentsTitle}>{t('feed.comments')} ({activeStory.comments.length})</Text>

                {/* Comments list */}
                {activeStory.comments.length === 0 ? (
                  <Card variant="secondary" style={styles.noCommentsCard}>
                    <Text style={styles.noCommentsText}>{t('feed.noComments')}</Text>
                    <Text style={styles.noCommentsSub}>{t('feed.noCommentsSub')}</Text>
                  </Card>
                ) : (
                  activeStory.comments.map((comment, index) => (
                    <View key={comment.id || index} style={styles.commentItem}>
                      <Image source={{ uri: comment.avatarUrl }} style={styles.commentAvatar} />
                      <View style={styles.commentDetails}>
                        <View style={styles.commentMeta}>
                          <Text style={styles.commentUser}>{comment.username}</Text>
                          <Text style={styles.commentTime}>{comment.createdAt}</Text>
                        </View>
                        <Text style={styles.commentBody}>{comment.content}</Text>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>

              {/* Comment Input Bar */}
              <View style={styles.commentInputRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder={t('feed.commentPlaceholder')}
                  placeholderTextColor={theme.colors.textMuted}
                  value={commentText}
                  onChangeText={setCommentText}
                  maxLength={150}
                  keyboardAppearance="dark"
                />
                <TouchableOpacity
                  style={[styles.sendBtn, !commentText.trim() && styles.sendBtnDisabled]}
                  onPress={handleSendComment}
                  disabled={!commentText.trim()}
                  activeOpacity={0.7}
                >
                  <Send size={16} color={commentText.trim() ? '#FFFFFF' : theme.colors.textMuted} />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 24,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  tabsContainer: {
    marginBottom: theme.spacing.sm,
  },
  tabsScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  tab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.round,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: 6,
  },
  emptySubtext: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  emptyButton: {
    minWidth: 140,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  closeButton: {
    padding: 6,
  },
  modalHeaderTitle: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 16,
  },
  modalScroll: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  commentsTitle: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 16,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  noCommentsCard: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  noCommentsText: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: 2,
  },
  noCommentsSub: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.01)',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.border,
  },
  commentDetails: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  commentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  commentUser: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.text,
    fontSize: 12,
  },
  commentTime: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 10,
  },
  commentBody: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  commentInput: {
    flex: 1,
    height: 40,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 14,
    fontFamily: theme.fonts.sans,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  sendBtnDisabled: {
    backgroundColor: theme.colors.border,
  },
});
