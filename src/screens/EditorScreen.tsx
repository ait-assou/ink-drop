import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  Animated,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles, Trash2, Send, Bookmark, Info, CheckCircle2, ChevronDown } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/LanguageContext';
import { theme } from '../theme/theme';
import { AIAssistant } from '../components/AIAssistant';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { HighlightText } from '../components/HighlightText';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { getLocalizedPrompt } from '../utils/promptHelpers';
const MOOD_TAG_OPTIONS = [
  'Melancholic', 'Eerie', 'Hopeful', 'Romantic', 'Absurd',
  'Tense', 'Poetic', 'Relatable', 'Cinematic', 'Mysterious',
  'Dark', 'Dystopian'
];

export const EditorScreen = ({ route, navigation }: any) => {
  const { prompt } = route.params;
  const { drafts, saveDraft, publishStory } = useApp();
  const { t } = useTranslation();

  const [content, setContent] = useState('');
  const [isSavedIndicatorVisible, setIsSavedIndicatorVisible] = useState(false);
  const [isAiVisible, setIsAiVisible] = useState(false);
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  // Dialog states
  const [isClearDialogVisible, setIsClearDialogVisible] = useState(false);
  const [isTagLimitDialogVisible, setIsTagLimitDialogVisible] = useState(false);
  const [isLengthDialogVisible, setIsLengthDialogVisible] = useState(false);

  // Track keyboard visibility to show dismiss button
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const showSubscription2 = Keyboard.addListener('keyboardWillShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });
    const hideSubscription2 = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardVisible(false);
    });
    return () => {
      showSubscription.remove();
      showSubscription2.remove();
      hideSubscription.remove();
      hideSubscription2.remove();
    };
  }, []);

  const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
  
  // Animation refs
  const savedOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.3)).current;

  // Load existing draft if any
  useEffect(() => {
    if (drafts[prompt.id]) {
      setContent(drafts[prompt.id]);
    }
  }, [prompt.id, drafts]);

  // Debounced auto-save draft
  useEffect(() => {
    if (content.trim() === '') return;
    
    const delayDebounce = setTimeout(() => {
      saveDraft(prompt.id, content);
      triggerSavedIndicator();
    }, 1500); // auto save after 1.5 seconds of silence

    return () => clearTimeout(delayDebounce);
  }, [content]);

  const triggerSavedIndicator = () => {
    setIsSavedIndicatorVisible(true);
    Animated.sequence([
      Animated.timing(savedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(savedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSavedIndicatorVisible(false);
    });
  };

  const handleClear = () => {
    setIsClearDialogVisible(true);
  };

  const handleApplyAiSuggestion = (suggestion: string) => {
    // Append or insert the text
    if (content.trim() === '') {
      setContent(suggestion);
    } else {
      setContent(prev => prev + '\n' + suggestion);
    }
    setIsAiVisible(false);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length >= 3) {
        setIsTagLimitDialogVisible(true);
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePublish = async () => {
    if (wordCount < 50 || wordCount > 300) {
      setIsLengthDialogVisible(true);
      return;
    }
    
    setIsSubmitModalVisible(false);
    
    // Call publish
    const result = await publishStory(prompt.id, prompt.text, content, selectedTags);
    
    if (result) {
      // Show cinematic success animation
      setIsSuccessModalVisible(true);
      Animated.spring(successScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        setIsSuccessModalVisible(false);
        // Navigate back to the Main tabs and switch to the Explore tab
        navigation.navigate('Main', { screen: 'Explore' });
      }, 2500);
    }
  };

  // Word count validations
  const isWordCountValid = wordCount >= 50 && wordCount <= 300;
  const wordCountProgress = Math.min((wordCount / 50) * 100, 100);
  const wordLimitProgress = Math.min((wordCount / 300) * 100, 100);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Editor Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('editor.title')}</Text>
          <View style={styles.headerActions}>
            <Animated.View style={[styles.savedBadge, { opacity: savedOpacity }]}>
              <Text style={styles.savedText}>{t('editor.saved')}</Text>
            </Animated.View>
          </View>
        </View>

        {/* Floating Prompt Reminder */}
        {(() => {
          const lp = getLocalizedPrompt(prompt, t);
          return (
            <Card variant="secondary" style={styles.promptReminder}>
              <View style={styles.promptReminderHeader}>
                <Text style={styles.promptReminderTag}>{t('genre.' + lp.category).toUpperCase()}</Text>
                <Text style={styles.promptTitle}>{lp.title}</Text>
              </View>
              <Text style={styles.promptText} numberOfLines={2}>
                "{lp.text}"
              </Text>
              {lp.constraint && (
                <View style={styles.editorConstraint}>
                  <HighlightText
                    text={`${t('prompt.challenge')}: ${lp.constraint}`}
                    style={styles.editorConstraintText}
                  />
                </View>
              )}
            </Card>
          );
        })()}

        {/* Text Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder={t('editor.placeholder')}
            placeholderTextColor={theme.colors.textMuted}
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
            keyboardAppearance="dark"
            autoFocus
          />
        </View>

        {/* Word count details bar */}
        <View style={styles.wordCountRow}>
          <View style={styles.wordCountInfo}>
            <Text style={[styles.wordCountNumber, isWordCountValid ? styles.wordCountSuccess : styles.wordCountWarning]}>
              {wordCount} {t('editor.words')}
            </Text>
            <Text style={styles.wordCountRules}>
              {wordCount < 50 ? t('editor.needs50') : wordCount > 300 ? t('editor.trimDown') : t('editor.perfectLength')}
            </Text>
          </View>

          {/* Minimal visual progress bars & keyboard dismiss */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.progressContainer}>
              {wordCount < 50 ? (
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFillWarning, { width: `${wordCountProgress}%` }]} />
                </View>
              ) : (
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFillSuccess, { width: `${wordLimitProgress}%` }]} />
                </View>
              )}
            </View>

            {isKeyboardVisible && (
              <TouchableOpacity
                onPress={Keyboard.dismiss}
                style={styles.dismissBtn}
                activeOpacity={0.7}
              >
                <ChevronDown size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bottom Distraction-free Toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={handleClear} style={styles.toolButton} activeOpacity={0.7}>
            <Trash2 size={20} color={theme.colors.crimson} />
            <Text style={[styles.toolLabel, { color: theme.colors.crimson }]}>{t('editor.clear')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { Keyboard.dismiss(); setIsAiVisible(true); }} style={[styles.toolButton, styles.aiButton]} activeOpacity={0.7}>
            <Sparkles size={20} color={theme.colors.primary} />
            <Text style={[styles.toolLabel, { color: theme.colors.primary }]}>{t('editor.aiAssistant')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsSubmitModalVisible(true)}
            style={[styles.toolButton, !isWordCountValid && styles.toolButtonDisabled]}
            disabled={!isWordCountValid}
            activeOpacity={0.7}
          >
            <Send size={20} color={isWordCountValid ? theme.colors.emerald : theme.colors.textMuted} />
            <Text style={[styles.toolLabel, { color: isWordCountValid ? theme.colors.emerald : theme.colors.textMuted }]}>{t('editor.submit')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* AI Assistant Slider Drawer */}
      <AIAssistant
        visible={isAiVisible}
        onClose={() => setIsAiVisible(false)}
        onApplySuggestion={handleApplyAiSuggestion}
      />

      {/* Submit Details Modal (Mood tags selection) */}
      <Modal
        visible={isSubmitModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSubmitModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('editor.moodTitle')}</Text>
            <Text style={styles.modalSubtitle}>{t('editor.moodSub')}</Text>
            
            <View style={styles.tagsGrid}>
              {MOOD_TAG_OPTIONS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                const translatedTag = t('tag.' + tag.toLowerCase());
                const displayTag = translatedTag !== 'tag.' + tag.toLowerCase() ? translatedTag : tag;
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagChip, isSelected && styles.tagChipSelected]}
                    onPress={() => toggleTag(tag)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tagChipText, isSelected && styles.tagChipTextSelected]}>
                      #{displayTag.toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <Button
                title={t('editor.cancel')}
                variant="outline"
                onPress={() => setIsSubmitModalVisible(false)}
                style={styles.modalButton}
              />
              <Button
                title={t('editor.publishBtn')}
                variant="gradient"
                onPress={handlePublish}
                style={[styles.modalButton, { marginLeft: theme.spacing.md }]}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Cinematic Level Up/Success Screen Overlay */}
      <Modal visible={isSuccessModalVisible} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <Animated.View style={[styles.successCard, { transform: [{ scale: successScale }] }]}>
            <CheckCircle2 size={64} color={theme.colors.emerald} style={styles.successIcon} />
            <Text style={styles.successTitle}>{t('editor.successTitle')}</Text>
            <Text style={styles.successXp}>{t('editor.successXp')}</Text>
            <Text style={styles.successSubtitle}>{t('editor.successSub')}</Text>
          </Animated.View>
        </View>
      </Modal>

      {/* Clear Confirmation Dialog */}
      <ConfirmDialog
        visible={isClearDialogVisible}
        title={t('editor.clearConfirmTitle')}
        message={t('editor.clearConfirmBody')}
        onRequestClose={() => setIsClearDialogVisible(false)}
        buttons={[
          {
            text: t('editor.cancel'),
            style: 'cancel',
            onPress: () => setIsClearDialogVisible(false),
          },
          {
            text: t('editor.clear'),
            style: 'destructive',
            onPress: () => {
              setContent('');
              setIsClearDialogVisible(false);
            },
          },
        ]}
      />

      {/* Tag Limit Dialog */}
      <ConfirmDialog
        visible={isTagLimitDialogVisible}
        title={t('editor.tagLimitTitle')}
        message={t('editor.tagLimitBody')}
        onRequestClose={() => setIsTagLimitDialogVisible(false)}
        buttons={[
          {
            text: 'OK',
            style: 'default',
            onPress: () => setIsTagLimitDialogVisible(false),
          },
        ]}
      />

      {/* Word Count Limit Dialog */}
      <ConfirmDialog
        visible={isLengthDialogVisible}
        title={t('editor.invalidLengthTitle')}
        message={t('editor.invalidLengthBody')}
        onRequestClose={() => setIsLengthDialogVisible(false)}
        buttons={[
          {
            text: 'OK',
            style: 'default',
            onPress: () => setIsLengthDialogVisible(false),
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
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 16,
  },
  headerActions: {
    width: 60,
    alignItems: 'flex-end',
  },
  savedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  savedText: {
    fontFamily: theme.fonts.sansMedium,
    color: theme.colors.emerald,
    fontSize: 10,
  },
  promptReminder: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  promptReminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  promptReminderTag: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.primary,
    fontSize: 9,
    letterSpacing: 0.5,
    marginRight: 8,
  },
  promptTitle: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  promptText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
  },
  editorConstraint: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  editorConstraintText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  textInput: {
    flex: 1,
    fontFamily: theme.fonts.serif,
    fontSize: 18,
    color: theme.colors.text,
    lineHeight: 28,
    textAlignVertical: 'top',
  },
  wordCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  wordCountInfo: {
    flexDirection: 'column',
  },
  wordCountNumber: {
    fontFamily: theme.fonts.sansBold,
    fontSize: 14,
  },
  wordCountSuccess: {
    color: theme.colors.emerald,
  },
  wordCountWarning: {
    color: theme.colors.gold,
  },
  wordCountRules: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  progressContainer: {
    width: 100,
  },
  dismissBtn: {
    marginLeft: theme.spacing.sm,
    padding: 4,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFillWarning: {
    height: '100%',
    backgroundColor: theme.colors.gold,
  },
  progressBarFillSuccess: {
    height: '100%',
    backgroundColor: theme.colors.emerald,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  toolButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  toolButtonDisabled: {
    opacity: 0.4,
  },
  toolLabel: {
    fontFamily: theme.fonts.sansMedium,
    fontSize: 10,
    marginTop: 4,
  },
  aiButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.border,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 18,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginBottom: theme.spacing.lg,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.xl,
  },
  tagChip: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  tagChipSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(109, 95, 253, 0.1)',
  },
  tagChipText: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  tagChipTextSelected: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.sansMedium,
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
  },
  modalButton: {
    flex: 1,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 11, 12, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  successIcon: {
    marginBottom: theme.spacing.md,
  },
  successTitle: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 24,
    marginBottom: 4,
  },
  successXp: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.emerald,
    fontSize: 18,
    marginBottom: theme.spacing.md,
  },
  successSubtitle: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
});
