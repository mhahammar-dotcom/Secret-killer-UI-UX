export type GameScreen = 
  | 'home'
  | 'story_select'
  | 'story_intro'
  | 'player_setup'
  | 'role_pass'
  | 'role_reveal'
  | 'free_discussion'
  | 'evidence_reveal'
  | 'start_round'
  | 'voting'
  | 'confirm_vote'
  | 'vote_result'
  | 'killer_reveal'
  | 'crime_explanation'
  | 'reveal_truth'
  | 'results'
  | 'how_to_play';

export interface StoryIntroductionData {
  setting: string;
  situation: string;
  incident: string;
  stakes: string;
  objective: string;
}

export interface StoryCharacterData {
  name: string;
  profession: string;
  publicIdentity: string;
  knowledge: string;
  guilty: boolean;
}

export interface InvestigationRoundData {
  roundNumber: number;
  title: string;
  publicClue: string;
  description: string;
  discussionPrompt: string;
}

export interface StoryGameRulesData {
  maxWrongVotes?: number;
}

export interface StoryData {
  id: string;
  title: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  isBuiltInFixed?: boolean;
  isCustom?: boolean;
  introduction: StoryIntroductionData;
  guiltyPool: StoryCharacterData[];
  innocentPool: StoryCharacterData[];
  fixedCharacters?: StoryCharacterData[];
  clues: string[];
  wrongVoteHints: string[];
  investigationRounds?: InvestigationRoundData[];
  evidence?: any[];
  solution: string;
  customEnding?: string;
  gameRules?: StoryGameRulesData;
  maxWrongVotes?: number;
}

export interface PlayerData {
  id: number;
  name: string;
  character: StoryCharacterData;
  guilty: boolean;
  eliminated: boolean;
  votedForId?: number;
}

export interface GameSettings {
  language: 'ar' | 'en';
  soundEnabled: boolean;
  ambientSound: boolean;
  timerMinutes: number;
  dramaticEffects: boolean;
  secretBallotMode?: boolean;
}

export interface GameStats {
  totalGames: number;
  innocentWins: number;
  guiltyWins: number;
  totalRounds: number;
  totalWrongVotes: number;
  storiesPlayed: string[];
}
