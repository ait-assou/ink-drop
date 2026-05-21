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

export const MOCK_STORIES: Story[] = [];

export const MOCK_BATTLES: Battle[] = [];

// Context-aware AI suggestions helper
export const AI_SUGGESTIONS = {
  en: {
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
  },
  fr: {
    titles: [
      'L’écho d’un milliard d’années',
      'La chambre des inaudibles',
      'Du plomb dans la gorge',
      'Contourner le gel',
      'Monuments lumineux',
      'Une larme dans le dôme',
    ],
    plotTwists: [
      'L’ascenseur n’appartient pas à cet immeuble ; c’est un train vertical traversant les dimensions.',
      'La transmission ne provient pas d’une étoile morte, c’est un reflet différé de notre propre future sonde spatiale.',
      'L’ombre ne la regarde pas ; elle fixe avec horreur quelque chose qui se tient juste derrière elle.',
      'La machine qui garde l’arbre est en réalité celle qui le maintient gelé en stase pour l’empêcher de parler.',
      'L’ascenseur se déplace latéralement, pas verticalement.',
    ],
    moodWords: ['Obsidienne', 'Fragile', 'Stagnant', 'Cinématique', 'Hantant', 'Vibrant', 'Vague', 'Éther'],
    grammarCorrections: [
      { original: "L'ombre sur le mur a bougé une seconde après elle.", suggestion: "L'ombre figée au mur a glissé une seconde après ses mouvements, lente et délibérée." },
      { original: "Il ne nous restait plus que cinq minutes.", suggestion: "À peine cinq minutes subsistaient sur le cadran numérique." }
    ]
  }
};
