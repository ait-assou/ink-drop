import AsyncStorage from '@react-native-async-storage/async-storage';
import { Story, Prompt, Battle, Badge, UserStats, MOCK_STORIES, MOCK_BATTLES, INITIAL_BADGES } from './mockData';

const KEYS = {
  USER_STATS: '@inkdrop:user_stats_v1',
  STORIES: '@inkdrop:stories_v1',
  DRAFTS: '@inkdrop:drafts_v1',
  BATTLES: '@inkdrop:battles_v1',
  INITIALIZED: '@inkdrop:initialized_v1',
};

export async function initializeStorage(): Promise<boolean> {
  try {
    const isInitialized = await AsyncStorage.getItem(KEYS.INITIALIZED);
    if (!isInitialized) {
      // Seed initial data
      const defaultStats: UserStats = {
        username: 'AnonymousScribe',
        level: 1,
        xp: 0,
        nextLevelXp: 500,
        streak: 3, // Start with a small streak to make it interesting
        totalStories: 0,
        favoriteGenres: [],
        writingGoal: 'daily',
        badges: INITIAL_BADGES,
      };

      await AsyncStorage.setItem(KEYS.USER_STATS, JSON.stringify(defaultStats));
      await AsyncStorage.setItem(KEYS.STORIES, JSON.stringify(MOCK_STORIES));
      await AsyncStorage.setItem(KEYS.BATTLES, JSON.stringify(MOCK_BATTLES));
      await AsyncStorage.setItem(KEYS.DRAFTS, JSON.stringify({}));
      await AsyncStorage.setItem(KEYS.INITIALIZED, 'true');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return false;
  }
}

export async function getUserStats(): Promise<UserStats | null> {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_STATS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}

export async function saveUserStats(stats: UserStats): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USER_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving user stats:', error);
  }
}

export async function getStories(): Promise<Story[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.STORIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting stories:', error);
    return [];
  }
}

export async function saveStories(stories: Story[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.STORIES, JSON.stringify(stories));
  } catch (error) {
    console.error('Error saving stories:', error);
  }
}

export async function getDrafts(): Promise<Record<string, string>> {
  try {
    const data = await AsyncStorage.getItem(KEYS.DRAFTS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting drafts:', error);
    return {};
  }
}

export async function getDraft(promptId: string): Promise<string> {
  const drafts = await getDrafts();
  return drafts[promptId] || '';
}

export async function saveDraft(promptId: string, content: string): Promise<void> {
  try {
    const drafts = await getDrafts();
    drafts[promptId] = content;
    await AsyncStorage.setItem(KEYS.DRAFTS, JSON.stringify(drafts));
  } catch (error) {
    console.error('Error saving draft:', error);
  }
}

export async function deleteDraft(promptId: string): Promise<void> {
  try {
    const drafts = await getDrafts();
    if (drafts[promptId] !== undefined) {
      delete drafts[promptId];
      await AsyncStorage.setItem(KEYS.DRAFTS, JSON.stringify(drafts));
    }
  } catch (error) {
    console.error('Error deleting draft:', error);
  }
}

export async function getBattles(): Promise<Battle[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.BATTLES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting battles:', error);
    return [];
  }
}

export async function saveBattles(battles: Battle[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.BATTLES, JSON.stringify(battles));
  } catch (error) {
    console.error('Error saving battles:', error);
  }
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing async storage:', error);
  }
}
