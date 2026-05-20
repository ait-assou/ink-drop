import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { useTranslation } from '../i18n/LanguageContext';

interface TimerProps {
  label?: string;
}

export const Timer: React.FC<TimerProps> = ({ label }) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // next midnight

      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (num: number) => num.toString().padStart(2, '0');
      return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Clock size={14} color={theme.colors.textSecondary} style={styles.icon} />
      <Text style={styles.label}>{label || t('timer.nextPrompt')}: </Text>
      <Text style={styles.time}>{timeLeft}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontFamily: theme.fonts.sans,
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  time: {
    fontFamily: theme.fonts.sansBold,
    color: theme.colors.text,
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
