import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable
} from 'react-native';
import { Sparkles, X, ChevronRight, Copy, Check } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { AI_SUGGESTIONS } from '../services/mockData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
  onApplySuggestion: (text: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  visible,
  onClose,
  onApplySuggestion,
}) => {
  const [activeTab, setActiveTab] = useState<'twists' | 'titles' | 'moods' | 'grammar'>('twists');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Animated values
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      // Slide up and fade in backdrop
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide down and fade out backdrop
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleApply = (text: string, index: number) => {
    onApplySuggestion(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
  };

  const renderContentList = () => {
    let items: { text: string; subText?: string }[] = [];

    switch (activeTab) {
      case 'twists':
        items = AI_SUGGESTIONS.plotTwists.map(t => ({ text: t }));
        break;
      case 'titles':
        items = AI_SUGGESTIONS.titles.map(t => ({ text: t }));
        break;
      case 'moods':
        items = AI_SUGGESTIONS.moodWords.map(m => ({ text: m, subText: 'Mood tag suggestion' }));
        break;
      case 'grammar':
        items = AI_SUGGESTIONS.grammarCorrections.map(c => ({
          text: c.suggestion,
          subText: `Original: "${c.original}"`,
        }));
        break;
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {items.map((item, idx) => {
          const isCopied = copiedIndex === idx;
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.suggestionItem, isCopied && styles.suggestionItemCopied]}
              onPress={() => handleApply(item.text, idx)}
              activeOpacity={0.7}
            >
              <View style={styles.suggestionTextContainer}>
                <Text style={styles.suggestionText}>{item.text}</Text>
                {item.subText && <Text style={styles.suggestionSubText}>{item.subText}</Text>}
              </View>
              <View style={styles.actionIconContainer}>
                {isCopied ? (
                  <Check size={16} color={theme.colors.emerald} />
                ) : (
                  <ChevronRight size={16} color={theme.colors.textMuted} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  if (!visible) return null;

  return (
    <View style={styles.absoluteWrapper}>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000', opacity: opacityAnim }]} />
      </Pressable>

      {/* Drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.dragBar} />

        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Sparkles size={20} color={theme.colors.primary} />
            <Text style={styles.titleText}>AI Writer Assistance</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
            <X size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Tab Row */}
        <View style={styles.tabRow}>
          {(['twists', 'titles', 'moods', 'grammar'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content Area */}
        <View style={styles.contentContainer}>
          <Text style={styles.helpText}>
            Tap any suggestion below to insert it into your story.
          </Text>
          {renderContentList()}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.65,
    backgroundColor: theme.colors.surfaceSecondary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dragBar: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 18,
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  activeTabText: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.primary,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  helpText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 12,
    marginBottom: theme.spacing.md,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  suggestionItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestionItemCopied: {
    borderColor: theme.colors.emerald,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  suggestionTextContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  suggestionText: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  suggestionSubText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
