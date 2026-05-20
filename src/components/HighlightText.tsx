import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface HighlightTextProps {
  text: string;
  style?: TextStyle | TextStyle[];
  highlightStyle?: TextStyle | TextStyle[];
}

export const HighlightText: React.FC<HighlightTextProps> = ({ text, style, highlightStyle }) => {
  if (!text) return null;
  
  // Split by words in quotes or numbers
  const parts = text.split(/(["'].*?["']|\b\d+\b)/g);
  
  return (
    <Text style={style}>
      {parts.map((part, index) => {
        const isHighlight = /^["'].*?["']$/.test(part) || /^\d+$/.test(part);
        return (
          <Text key={index} style={isHighlight ? [styles.highlight, highlightStyle] : undefined}>
            {part}
          </Text>
        );
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  highlight: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.primary,
  },
});
