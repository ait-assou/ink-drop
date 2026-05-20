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

// EDITOR SCREEN
updateFile('screens/EditorScreen.tsx', (content) => {
  content = content.replace("import { Card } from '../components/Card';", "import { Card } from '../components/Card';\nimport { useTranslation } from '../i18n/LanguageContext';");
  
  content = content.replace("  const { drafts, saveDraft, publishStory } = useApp();", "  const { drafts, saveDraft, publishStory } = useApp();\n  const { t } = useTranslation();");

  content = content.replace(/'Clear story\?'/g, "t('editor.clearConfirmTitle')");
  content = content.replace(/'This will delete your current draft\. This action cannot be undone\.'/g, "t('editor.clearConfirmBody')");
  content = content.replace(/text: 'Cancel',/g, "text: t('editor.cancel'),");
  content = content.replace(/text: 'Clear',/g, "text: t('editor.clear'),");

  content = content.replace(/'Tag limit'/g, "t('editor.tagLimitTitle')");
  content = content.replace(/'You can select up to 3 mood tags for your story\.'/g, "t('editor.tagLimitBody')");

  content = content.replace(/'Invalid length'/g, "t('editor.invalidLengthTitle')");
  content = content.replace(/'Stories must be between 50 and 300 words\.'/g, "t('editor.invalidLengthBody')");

  content = content.replace("<Text style={styles.headerTitle}>Composer</Text>", "<Text style={styles.headerTitle}>{t('editor.title')}</Text>");
  content = content.replace("<Text style={styles.savedText}>Saved</Text>", "<Text style={styles.savedText}>{t('editor.saved')}</Text>");

  content = content.replace('placeholder="Type your story here... Let the words flow."', "placeholder={t('editor.placeholder')}");

  content = content.replace("{wordCount} words", "{wordCount} {t('editor.words')}");
  content = content.replace("{wordCount < 50 ? 'Needs 50+' : wordCount > 300 ? 'Trim down (300 max)' : 'Perfect length'}", "{wordCount < 50 ? t('editor.needs50') : wordCount > 300 ? t('editor.trimDown') : t('editor.perfectLength')}");

  content = content.replace("<Text style={[styles.toolLabel, { color: theme.colors.crimson }]}>Clear</Text>", "<Text style={[styles.toolLabel, { color: theme.colors.crimson }]}>{t('editor.clear')}</Text>");
  content = content.replace("<Text style={[styles.toolLabel, { color: theme.colors.primary }]}>AI Assistant</Text>", "<Text style={[styles.toolLabel, { color: theme.colors.primary }]}>{t('editor.aiAssistant')}</Text>");
  content = content.replace("<Text style={[styles.toolLabel, { color: isWordCountValid ? theme.colors.emerald : theme.colors.textMuted }]}>Submit</Text>", "<Text style={[styles.toolLabel, { color: isWordCountValid ? theme.colors.emerald : theme.colors.textMuted }]}>{t('editor.submit')}</Text>");

  content = content.replace("<Text style={styles.modalTitle}>Describe the mood</Text>", "<Text style={styles.modalTitle}>{t('editor.moodTitle')}</Text>");
  content = content.replace("<Text style={styles.modalSubtitle}>Select up to 3 tags to help readers find your story.</Text>", "<Text style={styles.modalSubtitle}>{t('editor.moodSub')}</Text>");

  content = content.replace(/title="Cancel"/g, "title={t('editor.cancel')}");
  content = content.replace('title="Publish Story"', "title={t('editor.publishBtn')}");

  content = content.replace("<Text style={styles.successTitle}>Story Published!</Text>", "<Text style={styles.successTitle}>{t('editor.successTitle')}</Text>");
  content = content.replace("<Text style={styles.successXp}>+100 XP Earned</Text>", "<Text style={styles.successXp}>{t('editor.successXp')}</Text>");
  content = content.replace("<Text style={styles.successSubtitle}>Your words have been spilled onto the canvas.</Text>", "<Text style={styles.successSubtitle}>{t('editor.successSub')}</Text>");

  return content;
});

