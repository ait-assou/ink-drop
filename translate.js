const fs = require('fs');
const path = require('path');

const srcPath = path.join('/Users/aitassou/Desktop/_prj/ink-drop/src');

function updateFile(relativePath, replacer) {
  const fullPath = path.join(srcPath, relativePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = replacer(content);
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${relativePath}`);
  }
}

// FEED SCREEN
updateFile('screens/FeedScreen.tsx', (content) => {
  content = content.replace("import { Story } from '../services/mockData';", "import { Story } from '../services/mockData';\nimport { useTranslation } from '../i18n/LanguageContext';");
  content = content.replace("const CATEGORY_TABS = ['All', 'Sci-Fi', 'Fantasy', 'Mystery', 'Horror', 'Emotional', 'Absurd', 'Funny'];", "");
  
  content = content.replace("  const [selectedTab, setSelectedTab] = useState('All');", `  const { t } = useTranslation();
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
  ];`);

  content = content.replace(/CATEGORY_TABS\.map\(tab => \{/g, "CATEGORY_TABS.map(tab => {");
  content = content.replace(/const isActive = selectedTab === tab;/g, "const isActive = selectedTab === tab.key;");
  content = content.replace(/key=\{tab\}/g, "key={tab.key}");
  content = content.replace(/onPress=\{\(\) => setSelectedTab\(tab\)\}/g, "onPress={() => setSelectedTab(tab.key)}");
  content = content.replace(/\{tab\}/g, "{tab.label}");

  content = content.replace("<Text style={styles.headerTitle}>Explore Drops</Text>", "<Text style={styles.headerTitle}>{t('feed.title')}</Text>");
  content = content.replace("<Text style={styles.headerSubtitle}>Discover micro-stories from the collective consciousness.</Text>", "<Text style={styles.headerSubtitle}>{t('feed.subtitle')}</Text>");
  content = content.replace("<Text style={styles.emptyText}>No stories found in this category.</Text>", "<Text style={styles.emptyText}>{t('feed.empty')}</Text>");
  content = content.replace("<Text style={styles.emptySubtext}>Be the first to write a story inspired by today's prompt!</Text>", "<Text style={styles.emptySubtext}>{t('feed.emptySub')}</Text>");
  content = content.replace(/title="Write Now"/g, "title={t('feed.writeNow')}");
  content = content.replace("<Text style={styles.modalHeaderTitle}>Story</Text>", "<Text style={styles.modalHeaderTitle}>{t('feed.story')}</Text>");
  content = content.replace("<Text style={styles.commentsTitle}>Comments ({activeStory.comments.length})</Text>", "<Text style={styles.commentsTitle}>{t('feed.comments')} ({activeStory.comments.length})</Text>");
  content = content.replace("<Text style={styles.noCommentsText}>No thoughts shared yet.</Text>", "<Text style={styles.noCommentsText}>{t('feed.noComments')}</Text>");
  content = content.replace("<Text style={styles.noCommentsSub}>Start the conversation below.</Text>", "<Text style={styles.noCommentsSub}>{t('feed.noCommentsSub')}</Text>");
  content = content.replace('placeholder="Share a constructive critique..."', "placeholder={t('feed.commentPlaceholder')}");

  return content;
});

// BATTLE SCREEN
updateFile('screens/BattleScreen.tsx', (content) => {
  content = content.replace("import { Button } from '../components/Button';", "import { Button } from '../components/Button';\nimport { useTranslation } from '../i18n/LanguageContext';");
  content = content.replace("const currentBattle = battles[0] || null;", "const { t } = useTranslation();\n  const currentBattle = battles[0] || null;");
  
  content = content.replace("<Text style={styles.emptyText}>No battles active right now.</Text>", "<Text style={styles.emptyText}>{t('battle.emptyTitle')}</Text>");
  content = content.replace("<Text style={styles.emptySub}>Check back soon for the next matchup!</Text>", "<Text style={styles.emptySub}>{t('battle.emptySub')}</Text>");
  content = content.replace("<Text style={styles.headerTitle}>Story Battle Arena</Text>", "<Text style={styles.headerTitle}>{t('battle.title')}</Text>");
  content = content.replace("<Text style={styles.headerSubtitle}>Two writers. One prompt. The community decides.</Text>", "<Text style={styles.headerSubtitle}>{t('battle.subtitle')}</Text>");
  content = content.replace("<Text style={styles.battleBadgeText}>BATTLE PROMPT</Text>", "<Text style={styles.battleBadgeText}>{t('battle.promptBadge')}</Text>");
  content = content.replace("Ends in: {currentBattle.endsAt}", "{t('battle.endsIn')} {currentBattle.endsAt}");
  
  content = content.replace(/>\s*Story A\s*<\/Text>/g, ">{t('battle.storyA')}</Text>");
  content = content.replace(/>\s*Story B\s*<\/Text>/g, ">{t('battle.storyB')}</Text>");
  content = content.replace("<Text style={styles.vsText}>VS</Text>", "<Text style={styles.vsText}>{t('battle.vs')}</Text>");
  
  content = content.replace("<Text style={styles.arrowText}>View Story A</Text>", "<Text style={styles.arrowText}>{t('battle.viewStoryA')}</Text>");
  content = content.replace("<Text style={styles.arrowText}>View Story B</Text>", "<Text style={styles.arrowText}>{t('battle.viewStoryB')}</Text>");
  
  content = content.replace("<Text style={styles.votingTip}>Have you decided? Cast your vote below.</Text>", "<Text style={styles.votingTip}>{t('battle.votingTip')}</Text>");
  content = content.replace(/title=\{\`VOTE FOR STORY \$\{activeStory\}\`\}/g, "title={`${t('battle.voteFor')} ${activeStory}`}");
  
  content = content.replace("<Text style={styles.resultsTitle}>Real-time Standing</Text>", "<Text style={styles.resultsTitle}>{t('battle.standingTitle')}</Text>");
  content = content.replace("Story A ({currentBattle.storyA.username})", "{t('battle.storyA')} ({currentBattle.storyA.username})");
  content = content.replace("Story B ({currentBattle.storyB.username})", "{t('battle.storyB')} ({currentBattle.storyB.username})");
  
  content = content.replace("Your vote for Story {currentBattle.userVotedFor} is logged. (+25 XP awarded)", "{t('battle.votedConfirm', { side: currentBattle.userVotedFor || '' })}");
  
  return content;
});

// PROFILE SCREEN
updateFile('screens/ProfileScreen.tsx', (content) => {
  content = content.replace("import { Badge, MOCK_PROMPTS } from '../services/mockData';", "import { Badge, MOCK_PROMPTS } from '../services/mockData';\nimport { useTranslation } from '../i18n/LanguageContext';");
  
  content = content.replace("  const userStories = stories.filter(s => s.userId === 'u-current');", "  const { t, language, setLanguage } = useTranslation();\n  const userStories = stories.filter(s => s.userId === 'u-current');");
  
  content = content.replace(/const getRank = \(level: number\) => \{[\s\S]*?return 'Master Wordsmith';\n  \};/, "const getRank = (level: number) => t(`rank.${level}`);");

  content = content.replace(/'Delete Draft\?'/g, "t('profile.deleteDraftTitle')");
  content = content.replace(/'Are you sure you want to delete this draft\?'/g, "t('profile.deleteDraftBody')");
  content = content.replace(/'Reset application\?'/g, "t('profile.resetTitle')");
  content = content.replace(/'This will clear all streaks, badges, stories, drafts, and restart onboarding\.'/g, "t('profile.resetBody')");
  
  content = content.replace(/\{ text: 'Cancel', style: 'cancel' \}/g, "{ text: t('profile.cancel'), style: 'cancel' }");
  content = content.replace(/text: 'Delete',/g, "text: t('profile.delete'),");
  content = content.replace(/text: 'Reset Everything',/g, "text: t('profile.resetConfirm'),");
  
  content = content.replace(/'Reset successful'/g, "t('profile.resetSuccess')");
  content = content.replace(/'App state restored to default\.'/g, "t('profile.resetSuccessBody')");
  
  content = content.replace("<Text style={styles.actionText}>Reset Demo</Text>", "<Text style={styles.actionText}>{t('profile.resetDemo')}</Text>");
  content = content.replace("<Text style={styles.statLbl}>Streak Days</Text>", "<Text style={styles.statLbl}>{t('profile.streakDays')}</Text>");
  content = content.replace("<Text style={styles.statLbl}>Stories Spilled</Text>", "<Text style={styles.statLbl}>{t('profile.storiesSpilled')}</Text>");
  content = content.replace("<Text style={styles.statLbl}>Writing Level</Text>", "<Text style={styles.statLbl}>{t('profile.writingLevel')}</Text>");
  content = content.replace("<Text style={styles.xpLabel}>Level Progress</Text>", "<Text style={styles.xpLabel}>{t('profile.levelProgress')}</Text>");
  content = content.replace("<Text style={styles.sectionTitle}>Writing Badges</Text>", "<Text style={styles.sectionTitle}>{t('profile.badgesTitle')}</Text>");
  
  content = content.replace("<Text style={styles.sectionTitle}>Saved Drafts ({userDraftKeys.length})</Text>", "<Text style={styles.sectionTitle}>{t('profile.draftsTitle')} ({userDraftKeys.length})</Text>");
  content = content.replace("<Text style={styles.emptyCardText}>No active drafts. Start writing from the home screen.</Text>", "<Text style={styles.emptyCardText}>{t('profile.noDrafts')}</Text>");
  content = content.replace("<Text style={styles.sectionTitle}>Your Stories ({userStories.length})</Text>", "<Text style={styles.sectionTitle}>{t('profile.storiesTitle')} ({userStories.length})</Text>");
  content = content.replace("<Text style={styles.emptyCardText}>You haven’t published any stories yet.</Text>", "<Text style={styles.emptyCardText}>{t('profile.noStories')}</Text>");
  
  content = content.replace("Inspired by: “{story.promptText}”", "{t('profile.inspiredBy')} “{story.promptText}”");
  content = content.replace("{story.likes} likes", "{story.likes} {t('profile.likes')}");
  content = content.replace("{story.commentsCount} comments", "{story.commentsCount} {t('profile.comments')}");
  
  content = content.replace(/\{selectedBadge\.unlockedAt \? \`Unlocked on \$\{new Date\(selectedBadge\.unlockedAt\)\.toLocaleDateString\(\)\}\` : 'LOCKED'\}/g, "{selectedBadge.unlockedAt ? `${t('profile.badgeUnlocked')} ${new Date(selectedBadge.unlockedAt).toLocaleDateString()}` : t('profile.badgeLocked')}");
  content = content.replace(/Unlocks \{selectedBadge\.xpValue\} Bonus XP/g, "{t('profile.badgeXp', { xp: selectedBadge.xpValue })}");
  content = content.replace(/title="Dismiss"/g, "title={t('profile.dismiss')}");

  // Add Language Switcher
  const langSwitcher = `
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

        {/* User Card */}`;
  
  content = content.replace("{/* User Card */}", langSwitcher);

  // Add styles
  const langStyles = `  languageSwitcher: {
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
});`;
  
  content = content.replace("});", langStyles);

  return content;
});

