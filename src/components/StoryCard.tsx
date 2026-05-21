import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Heart, MessageSquare, Share2 } from 'lucide-react-native';
import { Story } from '../services/mockData';
import { theme } from '../theme/theme';
import { Card } from './Card';
import { useTranslation } from '../i18n/LanguageContext';

interface StoryCardProps {
  story: Story;
  onPress?: () => void;
  onLikePress?: () => void;
  onCommentPress?: () => void;
  isDetailedView?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onPress,
  onLikePress,
  onCommentPress,
  isDetailedView = false,
}) => {
  const { t } = useTranslation();
  const isLiked = !!story.isLikedByCurrentUser;

  return (
    <Card variant="surface" style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.9 : 1}>
        {/* User Info Header */}
        <View style={styles.header}>
          <Image source={{ uri: story.avatarUrl }} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.username}>{story.username}</Text>
            <Text style={styles.timestamp}>{story.createdAt}</Text>
          </View>
        </View>

        {/* Prompt Citation */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptPrefix}>{t('profile.inspiredBy')}</Text>
          <Text style={styles.promptText} numberOfLines={isDetailedView ? undefined : 2}>
            “{t(`prompt.${story.promptId}.text`) !== `prompt.${story.promptId}.text` ? t(`prompt.${story.promptId}.text`) : story.promptText}”
          </Text>
        </View>

        {/* Story Body */}
        <Text
          style={[styles.storyContent, isDetailedView ? styles.storyContentFull : styles.storyContentPreview]}
          numberOfLines={isDetailedView ? undefined : 5}
        >
          {story.content}
        </Text>

        {/* Mood Tags */}
        <View style={styles.tagsContainer}>
          {story.moodTags.map((tag, idx) => {
            const translatedTag = t('tag.' + tag.toLowerCase());
            const displayTag = translatedTag !== 'tag.' + tag.toLowerCase() ? translatedTag : tag;
            return (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>#{displayTag.toLowerCase()}</Text>
              </View>
            );
          })}
        </View>
      </TouchableOpacity>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={onLikePress}
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <Heart
            size={18}
            color={isLiked ? theme.colors.accent : theme.colors.textSecondary}
            fill={isLiked ? theme.colors.accent : 'transparent'}
          />
          <Text style={[styles.actionText, isLiked && styles.actionTextLiked]}>
            {story.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCommentPress}
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <MessageSquare size={18} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>{story.commentsCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Share2 size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.border,
  },
  headerText: {
    marginLeft: theme.spacing.sm,
  },
  username: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.text,
    fontSize: 14,
  },
  timestamp: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  promptContainer: {
    backgroundColor: theme.colors.surfaceSecondary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  promptPrefix: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.primary,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  promptText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  storyContent: {
    fontFamily: theme.fonts.serif,
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 25,
    letterSpacing: 0.1,
  },
  storyContentPreview: {
    marginBottom: theme.spacing.sm,
  },
  storyContentFull: {
    marginBottom: theme.spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 11,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.xl,
    paddingVertical: 4,
  },
  actionText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginLeft: 6,
  },
  actionTextLiked: {
    color: theme.colors.accent,
    fontFamily: theme.fonts.sansMedium,
  },
});
