import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { Heart, MessageSquare, Award, Swords, Bell, BellOff } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTranslation } from '../i18n/LanguageContext';

interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'badge' | 'battle';
  title: string;
  body: string;
  time: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'battle',
    title: 'Story Battle Victory!',
    body: 'Your story for "The Last Tree" won the battle against @dust_scribe with 52% of votes. (+200 XP awarded)',
    time: '2 hours ago',
    isRead: false,
  },
  {
    id: 'n-2',
    type: 'comment',
    title: 'New Critique Received',
    body: '@elara_scribe left a comment: "This is hauntingly beautiful... The ending detail adds so much atmosphere."',
    time: '4 hours ago',
    isRead: false,
  },
  {
    id: 'n-3',
    type: 'like',
    title: 'Story Liked',
    body: '@cosmic_ink and 5 others liked your story "Out of Sync".',
    time: '1 day ago',
    isRead: true,
  },
  {
    id: 'n-4',
    type: 'badge',
    title: 'Badge Unlocked: Ink Spiller',
    body: 'Congratulations! You unlocked the "Ink Spiller" badge for publishing your first story.',
    time: '2 days ago',
    isRead: true,
  },
];

export const NotificationsScreen = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={16} color={theme.colors.accent} fill={theme.colors.accent} />;
      case 'comment':
        return <MessageSquare size={16} color={theme.colors.primary} />;
      case 'badge':
        return <Award size={16} color={theme.colors.gold} />;
      case 'battle':
        return <Swords size={16} color={theme.colors.accent} />;
      default:
        return <Bell size={16} color={theme.colors.textSecondary} />;
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
        onPress={() => deleteNotification(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.iconColumn}>
          <View style={[styles.iconWrapper, { backgroundColor: `${theme.colors.border}80` }]}>
            {getIcon(item.type)}
          </View>
          {!item.isRead && <View style={styles.unreadIndicator} />}
        </View>

        <View style={styles.contentColumn}>
          <View style={styles.metaRow}>
            <Text style={styles.notiTitle}>{item.title}</Text>
            <Text style={styles.notiTime}>{item.time}</Text>
          </View>
          <Text style={styles.notiBody}>{item.body}</Text>
          <Text style={styles.tapToDismiss}>{t('notif.tapClear')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('notif.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('notif.subtitle')}</Text>
        </View>
        
        {notifications.some(n => !n.isRead) && (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>{t('notif.markAll')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <BellOff size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>{t('notif.emptyTitle')}</Text>
            <Text style={styles.emptySub}>{t('notif.emptySub')}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    maxWidth: '80%',
  },
  markAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  markAllText: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.primary,
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  unreadCard: {
    borderColor: 'rgba(109, 95, 253, 0.25)',
    backgroundColor: 'rgba(109, 95, 253, 0.02)',
  },
  iconColumn: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: theme.spacing.md,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginTop: 8,
  },
  contentColumn: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notiTitle: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 14,
    flex: 1,
    marginRight: 6,
  },
  notiTime: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 10,
  },
  notiBody: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  tapToDismiss: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 9,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
