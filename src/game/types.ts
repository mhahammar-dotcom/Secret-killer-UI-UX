/**
 * Secret Killer - Core Game Engine Types
 */

export type GamePhase =
  | 'LOBBY'
  | 'STORY_SELECT'
  | 'STORY_INTRO'
  | 'PLAYER_SETUP'
  | 'ROLE_PASS'
  | 'DISCUSSION'
  | 'VOTING'
  | 'VOTE_RESULT'
  | 'KILLER_REVEAL'
  | 'CRIME_EXPLANATION'
  | 'GAME_OVER';

export type WinnerSide = 'INNOCENTS' | 'GUILTY' | 'NONE';

export type GameEndReason =
  | 'ALL_GUILTY_ELIMINATED'
  | 'GUILTY_PARITY'
  | 'MAX_WRONG_VOTES'
  | 'SURRENDER';

export interface StoryIntroduction {
  setting: string;
  situation: string;
  incident: string;
  stakes: string;
  objective?: string; // Optional legacy compatibility
}

export interface StoryCharacter {
  name: string;
  profession: string;
  publicIdentity: string;
  knowledge: string; // In-universe narrative context / testimony / alibi
  guilty: boolean;   // Internal state flag only - NEVER exposed as role name
}

export interface InvestigationRound {
  roundNumber: number;
  title: string;
  publicClue: string;
  description: string;
  discussionPrompt: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  isBuiltInFixed?: boolean;
  isCustom?: boolean;
  introduction: StoryIntroduction;
  guiltyPool: StoryCharacter[];
  innocentPool: StoryCharacter[];
  fixedCharacters?: StoryCharacter[];
  clues: string[];
  wrongVoteHints: string[];
  investigationRounds: InvestigationRound[];
  solution: string;
  customEnding?: string;
  requiredGuiltyCount?: number; // Story-defined guilty count (if specified by scenario)
}

export interface Player {
  id: number;
  name: string;
  character: StoryCharacter;
  guilty: boolean;    // Internal flag
  isEliminated: boolean;
  votedForId?: number;
}

export interface VoteTally {
  playerId: number;
  playerName: string;
  characterName: string;
  voteCount: number;
}

export interface VoteResult {
  selectedPlayerId: number | null;
  selectedPlayer: Player | null;
  isTie: boolean;
  tallies: VoteTally[];
  wasGuilty: boolean;
  eliminatedPlayer: Player | null;
  wrongVotesCount: number;
  maxWrongVotes: number;
  unlockedHint: string | null;
  gameOver: boolean;
  winner: WinnerSide;
  endReason: GameEndReason | null;
}

export interface EliminationRecord {
  round: number;
  player: Player;
  wasGuilty: boolean;
}

export interface GameHistory {
  roundsPlayed: number;
  wrongVotes: number;
  eliminations: EliminationRecord[];
  votesByRound: Record<number, Record<number, number>>; // round -> (voterId -> targetId)
}

export interface GameState {
  phase: GamePhase;
  story: Story | null;
  players: Player[];
  currentViewingPlayerIndex: number; // for role reveal pass
  currentRound: number;
  revealedClues: string[];
  wrongVotesCount: number;
  maxWrongVotes: number;
  votes: Record<number, number>; // voterId -> targetId
  lastVoteResult: VoteResult | null;
  winner: WinnerSide;
  endReason: GameEndReason | null;
  history: GameHistory;
}

export interface StoryValidationResult {
  valid: boolean;
  errors: string[];
}
