const fs = require('fs');
const path = require('path');

const srcPath = path.join('/Users/aitassou/Desktop/_prj/ink-drop/src/screens');
const files = ['BattleScreen.tsx', 'EditorScreen.tsx', 'FeedScreen.tsx', 'ProfileScreen.tsx'];

for (const file of files) {
  const fullPath = path.join(srcPath, file);
  if (!fs.existsSync(fullPath)) continue;
  
  let lines = fs.readFileSync(fullPath, 'utf8').split('\n');
  let newLines = [];
  let seenImport = false;
  let seenTDecl = false;
  let seenProfileDecl = false;
  
  for (let line of lines) {
    // Remove duplicate imports
    if (line.includes("import { useTranslation } from '../i18n/LanguageContext';")) {
      if (seenImport) continue;
      seenImport = true;
    }
    
    // Remove duplicate t hook calls
    if (line.match(/const\s+\{\s*t\s*\}\s*=\s*useTranslation\(\);/)) {
      if (seenTDecl) continue;
      seenTDecl = true;
    }

    // Remove duplicate t, language, setLanguage hook calls
    if (line.match(/const\s+\{\s*t\s*,\s*language\s*,\s*setLanguage\s*\}\s*=\s*useTranslation\(\);/)) {
      if (seenProfileDecl) continue;
      seenProfileDecl = true;
    }
    
    newLines.push(line);
  }
  
  fs.writeFileSync(fullPath, newLines.join('\n'));
  console.log(`Cleaned ${file}`);
}
