import React from 'react';
import { View, ActivityIndicator, StyleSheet, Platform, Text, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Google Fonts loading
import {
  useFonts,
  Lora_400Regular,
  Lora_400Regular_Italic,
  Lora_700Bold,
} from '@expo-google-fonts/lora';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';

// Lucide Icons
import { Compass, BookOpen, Swords, Bell, Award, Sparkles } from 'lucide-react-native';

// Themes, Provider & Screens
import { theme } from './src/theme/theme';
import { AppProvider, useApp } from './src/context/AppContext';
import { LanguageProvider, useTranslation } from './src/i18n/LanguageContext';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { BattleScreen } from './src/screens/BattleScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { EditorScreen } from './src/screens/EditorScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navigation Custom Dark Theme
const DarkNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: theme.colors.border,
    notification: theme.colors.accent,
  },
};

// Bottom Tab Navigation
const MainTabs = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          const props = { size: 20, color: focused ? theme.colors.primary : color };
          switch (route.name) {
            case 'Home':
              return <Compass {...props} />;
            case 'Explore':
              return <BookOpen {...props} />;
            case 'Battle':
              return <Swords {...props} />;
            case 'Notifications':
              return <Bell {...props} />;
            case 'Profile':
              return <Award {...props} />;
            default:
              return <Compass {...props} />;
          }
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: theme.fonts.sansMedium,
          fontSize: 10,
          marginBottom: Platform.OS === 'ios' ? 0 : 6,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          // Always keep the tab bar visible above the keyboard
          keyboardHidesTabBar: false,
        },
        headerShown: false,
      })}
      screenListeners={{
        tabPress: () => Keyboard.dismiss(),
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('tab.home') }} />
      <Tab.Screen name="Explore" component={FeedScreen} options={{ tabBarLabel: t('tab.explore') }} />
      <Tab.Screen name="Battle" component={BattleScreen} options={{ tabBarLabel: t('tab.battle') }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ tabBarLabel: t('tab.notifications') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('tab.profile') }} />
    </Tab.Navigator>
  );
};

// Navigation controller checking onboarding status
const NavigationWrapper = () => {
  const { isOnboarded, isLoading } = useApp();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={DarkNavigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Editor" component={EditorScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Lora_400Regular,
    Lora_400Regular_Italic,
    Lora_700Bold,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.splashLogoContainer}>
          <Sparkles size={48} color={theme.colors.primary} />
          <Text style={styles.splashText}>Ink Drop</Text>
          <Text style={styles.splashTagline}>Ink Drop</Text>
        </View>
        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 32 }} />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <LanguageProvider>
        <AppProvider>
          <NavigationWrapper />
          <StatusBar style="light" />
        </AppProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogoContainer: {
    alignItems: 'center',
  },
  splashText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 32,
    color: theme.colors.text,
    marginTop: 16,
    letterSpacing: 1,
  },
  splashTagline: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 8,
    letterSpacing: 0.5,
  },
});
