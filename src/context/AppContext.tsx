import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserStats, Story, Battle, Badge, Comment } from '../services/mockData';
import * as storage from '../services/storage';

interface AppContextProps {
  userStats: UserStats | null;
  stories: Story[];
  battles: Battle[];
  drafts: Record<string, string>;
  isLoading: boolean;
  isOnboarded: boolean;
  completeOnboarding: (username: string, favoriteGenres: string[], writingGoal: string) => Promise<void>;
  saveDraft: (promptId: string, content: string) => Promise<void>;
  deleteDraft: (promptId: string) => Promise<void>;
  publishStory: (promptId: string, promptText: string, content: string, moodTags: string[]) => Promise<Story | null>;
  toggleLikeStory: (storyId: string) => Promise<void>;
  addCommentToStory: (storyId: string, content: string) => Promise<void>;
  voteInBattle: (battleId: string, selection: 'A' | 'B') => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  resetApp: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userStats, setUserStatsState] = useState<UserStats | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        await storage.initializeStorage();
        const stats = await storage.getUserStats();
        const feedStories = await storage.getStories();
        const currentBattles = await storage.getBattles();
        const currentDrafts = await storage.getDrafts();

        setUserStatsState(stats);
        setStories(feedStories);
        setBattles(currentBattles);
        setDrafts(currentDrafts);

        if (stats && stats.favoriteGenres && stats.favoriteGenres.length > 0) {
          setIsOnboarded(true);
        }
      } catch (err) {
        console.error('Failed to load storage data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const saveStatsHelper = async (updated: UserStats) => {
    setUserStatsState(updated);
    await storage.saveUserStats(updated);
  };

  const completeOnboarding = async (username: string, favoriteGenres: string[], writingGoal: string) => {
    if (!userStats) return;
    const updated: UserStats = {
      ...userStats,
      username: username || 'Scribe',
      favoriteGenres,
      writingGoal,
    };
    await saveStatsHelper(updated);
    setIsOnboarded(true);
  };

  const addXp = async (amount: number) => {
    if (!userStats) return;
    let newXp = userStats.xp + amount;
    let newLevel = userStats.level;
    let newNextLevelXp = userStats.nextLevelXp;
    let leveledUp = false;

    while (newXp >= newNextLevelXp) {
      newXp -= newNextLevelXp;
      newLevel += 1;
      newNextLevelXp = newLevel * 500;
      leveledUp = true;
    }

    const updatedBadges = [...userStats.badges];
    // Check level badge ("Word Artisan")
    if (newLevel >= 5) {
      const idx = updatedBadges.findIndex(b => b.id === '3');
      if (idx !== -1 && !updatedBadges[idx].unlockedAt) {
        updatedBadges[idx] = { ...updatedBadges[idx], unlockedAt: new Date().toISOString() };
        newXp += updatedBadges[idx].xpValue; // award bonus XP
      }
    }

    const updated: UserStats = {
      ...userStats,
      xp: newXp,
      level: newLevel,
      nextLevelXp: newNextLevelXp,
      badges: updatedBadges
    };

    await saveStatsHelper(updated);
  };

  const saveDraft = async (promptId: string, content: string) => {
    await storage.saveDraft(promptId, content);
    const current = await storage.getDrafts();
    setDrafts(current);

    // Badge check: Midnight Muse (saved draft/story between 12 AM and 4 AM)
    if (userStats) {
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 4) {
        const updatedBadges = [...userStats.badges];
        const idx = updatedBadges.findIndex(b => b.id === '2');
        if (idx !== -1 && !updatedBadges[idx].unlockedAt) {
          updatedBadges[idx] = { ...updatedBadges[idx], unlockedAt: new Date().toISOString() };
          const updated: UserStats = {
            ...userStats,
            badges: updatedBadges,
          };
          await saveStatsHelper(updated);
          await addXp(150); // XP value for Midnight Muse
        }
      }
    }
  };

  const deleteDraft = async (promptId: string) => {
    await storage.deleteDraft(promptId);
    const current = await storage.getDrafts();
    setDrafts(current);
  };

  const publishStory = async (promptId: string, promptText: string, content: string, moodTags: string[]) => {
    if (!userStats) return null;

    const newStory: Story = {
      id: `s-user-${Date.now()}`,
      promptId,
      promptText,
      userId: 'u-current',
      username: userStats.username,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop&q=80', // clean avatar
      content,
      likes: 0,
      commentsCount: 0,
      comments: [],
      moodTags,
      createdAt: 'Just now',
    };

    // Update stories list
    const updatedStories = [newStory, ...stories];
    setStories(updatedStories);
    await storage.saveStories(updatedStories);

    // Delete draft
    await deleteDraft(promptId);

    // Update user stats
    const updatedBadges = [...userStats.badges];
    
    // Badge 1: Ink Spiller
    const penToolIdx = updatedBadges.findIndex(b => b.id === '1');
    if (penToolIdx !== -1 && !updatedBadges[penToolIdx].unlockedAt) {
      updatedBadges[penToolIdx] = { ...updatedBadges[penToolIdx], unlockedAt: new Date().toISOString() };
    }

    // Streak and Total Stories update
    const newTotalStories = userStats.totalStories + 1;
    let newStreak = userStats.streak;
    // Streak logic: simple increment for writing
    newStreak += 1;

    // Badge 4: Streak Scribe (5 day streak)
    if (newStreak >= 5) {
      const streakIdx = updatedBadges.findIndex(b => b.id === '4');
      if (streakIdx !== -1 && !updatedBadges[streakIdx].unlockedAt) {
        updatedBadges[streakIdx] = { ...updatedBadges[streakIdx], unlockedAt: new Date().toISOString() };
      }
    }

    const updated: UserStats = {
      ...userStats,
      totalStories: newTotalStories,
      streak: newStreak,
      badges: updatedBadges,
    };
    await saveStatsHelper(updated);
    
    // Add XP: 100 XP for writing a story, plus badge XP if unlocked
    let xpReward = 100;
    if (penToolIdx !== -1 && !userStats.badges[penToolIdx].unlockedAt) {
      xpReward += updatedBadges[penToolIdx].xpValue;
    }
    if (newStreak >= 5 && !userStats.badges[3].unlockedAt) {
      xpReward += updatedBadges[3].xpValue;
    }

    await addXp(xpReward);

    return newStory;
  };

  const toggleLikeStory = async (storyId: string) => {
    const updatedStories = stories.map(story => {
      if (story.id === storyId) {
        const isLiked = !!story.isLikedByCurrentUser;
        return {
          ...story,
          likes: isLiked ? story.likes - 1 : story.likes + 1,
          isLikedByCurrentUser: !isLiked,
        };
      }
      return story;
    });

    setStories(updatedStories);
    await storage.saveStories(updatedStories);
  };

  const addCommentToStory = async (storyId: string, content: string) => {
    if (!userStats) return;

    const newComment: Comment = {
      id: `c-user-${Date.now()}`,
      username: userStats.username,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop&q=80',
      content,
      createdAt: 'Just now',
    };

    const updatedStories = stories.map(story => {
      if (story.id === storyId) {
        const comments = [...story.comments, newComment];
        return {
          ...story,
          comments,
          commentsCount: comments.length,
        };
      }
      return story;
    });

    setStories(updatedStories);
    await storage.saveStories(updatedStories);

    // Award +5 XP for active critique/community engagement
    await addXp(10);
  };

  const voteInBattle = async (battleId: string, selection: 'A' | 'B') => {
    if (!userStats) return;

    const updatedBattles = battles.map(battle => {
      if (battle.id === battleId) {
        if (battle.userVotedFor) return battle; // already voted
        return {
          ...battle,
          userVotedFor: selection,
          votesA: selection === 'A' ? battle.votesA + 1 : battle.votesA,
          votesB: selection === 'B' ? battle.votesB + 1 : battle.votesB,
          winnerRevealed: true, // immediately reveal
        };
      }
      return battle;
    });

    setBattles(updatedBattles);
    await storage.saveBattles(updatedBattles);

    // Award +20 XP for participating in Battle Mode voting
    await addXp(25);
  };

  const resetApp = async () => {
    await storage.clearAll();
    setUserStatsState(null);
    setStories([]);
    setBattles([]);
    setDrafts({});
    setIsOnboarded(false);
    setIsLoading(true);
    await storage.initializeStorage();
    const stats = await storage.getUserStats();
    const feedStories = await storage.getStories();
    const currentBattles = await storage.getBattles();
    setUserStatsState(stats);
    setStories(feedStories);
    setBattles(currentBattles);
    setIsLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        userStats,
        stories,
        battles,
        drafts,
        isLoading,
        isOnboarded,
        completeOnboarding,
        saveDraft,
        deleteDraft,
        publishStory,
        toggleLikeStory,
        addCommentToStory,
        voteInBattle,
        addXp,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
