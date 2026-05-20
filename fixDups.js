const fs = require('fs');
const path = require('path');

const srcPath = path.join('/Users/aitassou/Desktop/_prj/ink-drop/src/screens');

function fixFile(file) {
  const fullPath = path.join(srcPath, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix duplicate imports
    content = content.replace(/import \{ useTranslation \} from '\.\.\/i18n\/LanguageContext';\n+/g, "import { useTranslation } from '../i18n/LanguageContext';\n");
    
    // Fix duplicate const { t } = useTranslation();
    content = content.replace(/const \{ t \} = useTranslation\(\);\s+const \{ t \} = useTranslation\(\);/g, "const { t } = useTranslation();");
    
    // Fix duplicate const { t, language, setLanguage } = useTranslation();
    content = content.replace(/const \{ t, language, setLanguage \} = useTranslation\(\);\s+const \{ t, language, setLanguage \} = useTranslation\(\);/g, "const { t, language, setLanguage } = useTranslation();");

    // Fix CATEGORY_TABS duplicate in FeedScreen
    if (file === 'FeedScreen.tsx') {
      content = content.replace(/const CATEGORY_TABS = \[[\s\S]*?\];\s+const CATEGORY_TABS = \[[\s\S]*?\];/g, "const CATEGORY_TABS = [\n    { key: 'All', label: t('feed.category.all') },\n    { key: 'Sci-Fi', label: t('feed.category.scifi') },\n    { key: 'Fantasy', label: t('feed.category.fantasy') },\n    { key: 'Mystery', label: t('feed.category.mystery') },\n    { key: 'Horror', label: t('feed.category.horror') },\n    { key: 'Emotional', label: t('feed.category.emotional') },\n    { key: 'Absurd', label: t('feed.category.absurd') },\n    { key: 'Funny', label: t('feed.category.funny') },\n  ];");
    }

    fs.writeFileSync(fullPath, content);
    console.log(`Fixed ${file}`);
  }
}

fixFile('BattleScreen.tsx');
fixFile('EditorScreen.tsx');
fixFile('FeedScreen.tsx');
fixFile('ProfileScreen.tsx');
