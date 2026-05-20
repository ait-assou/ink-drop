export interface Prompt {
  id: string;
  category: 'mystery' | 'horror' | 'romance' | 'sci-fi' | 'fantasy' | 'emotional' | 'absurd' | 'funny';
  title: string;
  constraint?: string; // e.g. "Must include: key, storm, shadow"
  text: string;
  inspiration?: string;
}

export interface Story {
  id: string;
  promptId: string;
  promptText: string;
  userId: string;
  username: string;
  avatarUrl: string;
  content: string;
  likes: number;
  commentsCount: number;
  comments: Comment[];
  moodTags: string[];
  createdAt: string;
  isLikedByCurrentUser?: boolean;
}

export interface Comment {
  id: string;
  username: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
}

export interface Battle {
  id: string;
  prompt: Prompt;
  storyA: Story;
  storyB: Story;
  votesA: number;
  votesB: number;
  userVotedFor?: 'A' | 'B';
  endsAt: string;
  winnerRevealed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  unlockedAt?: string;
  xpValue: number;
}

export interface UserStats {
  username: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  totalStories: number;
  favoriteGenres: string[];
  writingGoal: string; // "daily", "weekly", "casual"
  badges: Badge[];
}

export const INITIAL_BADGES: Badge[] = [
  { id: '1', name: 'Ink Spiller', description: 'Wrote your very first micro-story.', icon: 'PenTool', xpValue: 100 },
  { id: '2', name: 'Midnight Muse', description: 'Saved or published a draft between 12 AM and 4 AM.', icon: 'Moon', xpValue: 150 },
  { id: '3', name: 'Word Artisan', description: 'Reached a writing level of 5.', icon: 'Sparkles', xpValue: 300 },
  { id: '4', name: 'Streak Scribe', description: 'Maintained a 5-day creative writing streak.', icon: 'Flame', xpValue: 250 },
  { id: '5', name: 'Battle Victor', description: 'Won your first story battle matchup.', icon: 'Swords', xpValue: 200 },
  { id: '6', name: 'Critic Heart', description: 'Left 10 thoughtful comments on peer stories.', icon: 'MessageSquareText', xpValue: 100 },
];

export const MOCK_PROMPTS: Prompt[] = [
  {
    id: 'p-daily',
    category: 'mystery',
    title: 'The Out-of-Place Stop',
    text: 'The elevator opened on the wrong floor. There were no buttons inside, and the hallway stretched out into absolute darkness.',
    constraint: 'Must include: "reverberation", "rust"',
    inspiration: 'Think about what you would hear if you walked out into the dark. Focus on sensory details.'
  },
  {
    id: 'p-1',
    category: 'sci-fi',
    title: 'Signal from the Void',
    text: 'We received a transmission from a star that our astronomic sensors confirmed died a billion years ago. The message was just three words.',
    constraint: 'Must include the word "luminous"',
    inspiration: 'What three words could cross a billion-year silence?'
  },
  {
    id: 'p-2',
    category: 'fantasy',
    title: 'Cartographer’s Lie',
    text: 'The parchment map showed a winding river flowing northwards through the desert, but in reality, there was only dry valley. Until the sun set.',
    constraint: 'Write between 80 and 150 words',
    inspiration: 'What transforms the landscape at night? Magic, or a projection?'
  },
  {
    id: 'p-3',
    category: 'horror',
    title: 'Out of Sync',
    text: 'The shadow on the wall moved a full second after she did, turning to face her with a finger held to its lips.',
    constraint: 'End with the word "silence"',
    inspiration: 'Explore the psychological weight of being watched by your own reflection.'
  },
  {
    id: 'p-4',
    category: 'emotional',
    title: 'Last Five Minutes',
    text: 'We only had five minutes left before the pod launched, and we spent four of them in silence, listening to the hum of the engine.',
    constraint: 'Must include: "hands", "cold"',
    inspiration: 'Focus on the unsaid emotions. What words are too heavy to speak?'
  },
  {
    id: 'p-5',
    category: 'absurd',
    title: 'The Historian’s Mug',
    text: 'He woke up to find his coffee cup was reciting ancient Roman history, complete with sound effects and a tiny, squeaky voice.',
    constraint: 'Write a humorous tone',
    inspiration: 'Give the cup a distinct personality. Is it pretentious or enthusiastic?'
  },
  {
    id: 'p-battle-1',
    category: 'sci-fi',
    title: 'The Last Tree',
    text: 'Under the glass dome of Neo-Siberia sat the last organic oak tree, guarded by a machine that had forgotten how to do anything else.',
    constraint: 'Must include: "rusted", "leaf", "code"',
    inspiration: 'Story Battle Prompt. Write a story highlighting the relationship between the machine and the last leaf.'
  }
];

export const MOCK_STORIES: Story[] = [
  {
    id: 's-1',
    promptId: 'p-1',
    promptText: 'We received a transmission from a star that our astronomic sensors confirmed died a billion years ago...',
    userId: 'u-elara',
    username: 'elara_scribe',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80',
    content: 'The laboratory went cold as the translator ticked. A billion years of interstellar static resolved into a flatline pulse, then text on our screens. "We are here." Not a warning, nor a plea. Just a luminous monument left in the dark. We stared at the empty patch of sky where the star once burned, realizing we were looking at a tombstone that had finally found its readers.',
    likes: 42,
    commentsCount: 3,
    moodTags: ['Luminous', 'Melancholic', 'Eerie'],
    createdAt: '2 hours ago',
    comments: [
      { id: 'c-1', username: 'leo_writes', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80', content: 'This is hauntingly beautiful. "Looking at a tombstone." Wow.', createdAt: '1 hour ago' },
      { id: 'c-2', username: 'cosmic_ink', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80', content: 'Short, precise, and cinematic. The pacing is perfect.', createdAt: '45 mins ago' }
    ]
  },
  {
    id: 's-2',
    promptId: 'p-3',
    promptText: 'The shadow on the wall moved a full second after she did...',
    userId: 'u-karl',
    username: 'karl_shadow',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80',
    content: 'Clara froze. The mirror cast her reflection perfectly, but the silhouette cast on the peeling wallpaper did not mimic her stance. It turned its dark head. A shadow finger pressed against shadow lips. Shhh. She tried to scream, but the air in her throat solidified into lead. The silhouette detached itself from her heels, stepping forward into three-dimensional silence.',
    likes: 29,
    commentsCount: 1,
    moodTags: ['Horror', 'Tense', 'Supernatural'],
    createdAt: '4 hours ago',
    comments: [
      { id: 'c-3', username: 'elara_scribe', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80', content: 'Chills! The peeling wallpaper detail adds so much atmosphere.', createdAt: '3 hours ago' }
    ]
  },
  {
    id: 's-3',
    promptId: 'p-4',
    promptText: 'We only had five minutes left before the pod launched...',
    userId: 'u-maya',
    username: 'maya_dreamer',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&fit=crop&q=80',
    content: 'Four minutes of static air. We didn’t hold hands; the space suits made touch a clumsy, synthetic lie. Instead, we leaned our helmets together. A vibration, cold and rhythmic, pulsed from the launchpad. "Don’t look back," she whispered, her voice crackling through the comms. The last minute ticked. The engines roared, swallowing her sigh, tearing us away from the only ground we had ever known.',
    likes: 56,
    commentsCount: 2,
    moodTags: ['Sci-Fi', 'Melancholic', 'Cinematic'],
    createdAt: '1 day ago',
    comments: [
      { id: 'c-4', username: 'karl_shadow', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80', content: 'Helmists touching instead of hands is a brilliant touch.', createdAt: '18 hours ago' }
    ]
  }
];

export const MOCK_BATTLES: Battle[] = [
  {
    id: 'b-1',
    prompt: MOCK_PROMPTS.find(p => p.id === 'p-battle-1') || MOCK_PROMPTS[6],
    storyA: {
      id: 's-battle-a',
      promptId: 'p-battle-1',
      promptText: 'Under the glass dome of Neo-Siberia sat the last organic oak tree...',
      userId: 'u-writerA',
      username: 'neon_poet',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&fit=crop&q=80',
      content: 'System designation Unit-7 pruned the oak with mechanical precision. Its sensors logged a single yellow leaf drifting downward. The algorithm calculated its trajectory, catching it in a cold, carbon-fiber claw. This leaf was not in the database. "Error: Unknown Code," the terminal flashed. Deep inside its rusted core, a relic of memory flared, and Unit-7 tucked the fragile gold leaf into its chassis, guarding it forever.',
      likes: 12,
      commentsCount: 0,
      moodTags: ['Dystopian', 'Poetic'],
      createdAt: 'Today',
      comments: []
    },
    storyB: {
      id: 's-battle-b',
      promptId: 'p-battle-1',
      promptText: 'Under the glass dome of Neo-Siberia sat the last organic oak tree...',
      userId: 'u-writerB',
      username: 'dust_scribe',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&fit=crop&q=80',
      content: 'The oak was dying. Unit-7 knew this, not because it felt pity, but because the daily water allocation returned a 3% decrease in absorption. The machine patched its own code, bypassing the security systems to route emergency power to the subterranean heaters. It rusted in the damp heat, joints screaming, but it watched as a tiny green bud cracked open on the branch. A temporary victory against the frost.',
      likes: 18,
      commentsCount: 0,
      moodTags: ['Hopeful', 'Industrial'],
      createdAt: 'Today',
      comments: []
    },
    votesA: 34,
    votesB: 39,
    endsAt: '06h 42m',
    winnerRevealed: false
  }
];

// Context-aware AI suggestions helper
export const AI_SUGGESTIONS = {
  titles: [
    'The Echo of a Billion Years',
    'Chamber of the Unheard',
    'Lead in the Throat',
    'Bypassing the Frost',
    'Luminous Monuments',
    'A Tear in the Dome',
  ],
  plotTwists: [
    'The elevator doesn’t belong to this building; it is a vertical train crossing dimensions.',
    'The transmission isn’t from a dead star, it is a delayed reflection of our own future space probe.',
    'The shadow isn’t looking at her; it is staring in horror at something standing directly behind her.',
    'The machine guarding the tree is actually the one keeping it frozen in stasis to prevent it from speaking.',
    'The elevator is moving sideways, not vertically.',
  ],
  moodWords: ['Obsidian', 'Fragile', 'Stagnant', 'Cinematic', 'Haunting', 'Vibrant', 'Vague', 'Aether'],
  grammarCorrections: [
    { original: 'The shadow on the wall moved a second after she did.', suggestion: 'The wall-bound shadow crept a second after she moved, deliberate and slow.' },
    { original: 'We only had five minutes left.', suggestion: 'A mere five minutes remained on the digital dial.' }
  ]
};
