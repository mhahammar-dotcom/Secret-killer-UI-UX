# Secret Killer - Game Engine Migration Plan (Android Java to React TypeScript)

## 1. Executive Summary & Objective

This document formalizes the mapping and migration strategy from the original Android Java game engine (`mhahammar-dotcom/Secret-killer`) into the React TypeScript project (`Secret-killer-UI-UX`).

### Guiding Principles
1. **Preserve the Premium Noir UI**: Maintain the dark atmosphere, gold palette (`#c8923a`), Arabic typography (Cairo/Tajawal), animations, and existing visual components.
2. **True Engine Decoupling**: Extract all game rules, vote counting, character allocation, round progression, and win-condition evaluations from `App.tsx` and UI components into a dedicated `src/game/` layer.
3. **Strict Game Rules Compliance**:
   - Support **4–12 players**.
   - Every story has an atmospheric, narrative **Introduction**.
   - Every player receives an authentic **in-universe story character** with a legitimate role/profession.
   - The guilty player has a legitimate character and profession; **"Killer" is never their story role name**.
   - **NO "secret" mechanics**: Players discuss, bluff, or deduce naturally based on character knowledge and public evidence.
   - **NO player objectives**: Focus purely on social deduction, evidence analysis, and voting.
   - **Multi-Guilty Scaling**: Support multiple guilty characters for larger groups (1 guilty for 4–6 players, 2 for 7–9 players, 3 for 10–12 players).
   - **Evidence & Clues**: Reveal evidence progressively across discussion rounds or upon tie/wrong votes.

---

## 2. Comprehensive Class & Model Mapping (Android Java → TypeScript)

| Original Android Class | Primary Responsibility | Target TypeScript Module | Key Methods / Properties Mapped |
| :--- | :--- | :--- | :--- |
| **`GameManager.java`** | Central game loop, phase controller, round manager, win condition checker | `src/game/GameEngine.ts` & `src/game/GameState.ts` | `startGame()`, `nextPhase()`, `recordVote()`, `evaluateWinCondition()`, `eliminatePlayer()`, `getAlivePlayers()`, `currentRound`, `wrongVotesCount` |
| **`Story.java`** | Story entity definition, pools, solution, clues, validation | `src/game/StoryEngine.ts` & `src/game/types.ts` (`Story`) | `id`, `title`, `description`, `minPlayers`, `maxPlayers`, `introduction`, `guiltyPool`, `innocentPool`, `clues`, `wrongVoteHints`, `solution`, `investigationRounds` |
| **`StoryIntroduction.java`** | Narrative scene setter (setting, situation, incident, stakes) | `src/game/types.ts` (`StoryIntroduction`) | `setting`, `situation`, `incident`, `stakes` *(Removed deprecated `objective`)* |
| **`StoryCharacter.java`** | In-universe character definition | `src/game/types.ts` (`StoryCharacter`) | `name`, `profession`, `publicIdentity`, `knowledge` (contextual testimony/alibi), `guilty` (internal flag) |
| **`Player.java`** | Active player instance bound to a story character | `src/game/types.ts` (`Player`) & `src/game/PlayerManager.ts` | `id`, `name`, `character`, `guilty`, `isAlive`, `votedForId` |
| **`InvestigationRound.java`** | Progressive round-by-round evidence & prompts | `src/game/types.ts` (`InvestigationRound`) | `roundNumber`, `title`, `publicClue`, `description`, `discussionPrompt` |
| **`Clue.java` / `InvestigationData.java`** | Static case clues & progressive reveals | `src/game/types.ts` (`ClueData`) | `id`, `text`, `roundRevealed`, `isPublic` |
| **`VotingEngine` (inside GameManager)** | Secret voting, plurality tally, tie detection, elimination | `src/game/VotingEngine.ts` | `tallyVotes()`, `resolveElimination()`, `isTie()`, `getVoteSummary()` |
| **`CustomStoryStore.java`** | Local persistence, JSON serialization, validation of user cases | `src/game/StoryStore.ts` | `getStories()`, `saveCustomStory()`, `deleteCustomStory()`, `validateStory()` |

---

## 3. Review of `src/types.ts` & Deprecated Mechanics

### A. Deprecated Fields in Types
1. **`StoryIntroductionData.objective`**
   - *Status*: **REMOVE**.
   - *Reason*: User design mandate explicitly forbids player/case objectives. The objective is universally understood: find the guilty party through deduction.
   - *Replacement*: Keep only `setting`, `situation`, `incident`, and `stakes`.

2. **`StoryCharacterData.knowledge`**
   - *Status*: **KEEP & REPURPOSE as In-Universe Testimony/Alibi**.
   - *Reason*: This is NOT an artificial "secret" token or mission. It provides authentic narrative context (e.g. "You were in the library at 9 PM and saw the lights flicker"). It gives players real story material to discuss, verify, or lie about.
   - *Replacement*: Clarify documentation that `knowledge` represents character testimony/alibi, with no arbitrary secret scoring or mechanical constraints.

### B. Review of `GameScreen` Enum States
| Screen State | Current Usage | Verdict | Action / Replacement |
| :--- | :--- | :--- | :--- |
| `role_reveal` | Split between `role_pass` and `role_reveal` | **CONSOLIDATE** into `role_pass` | `SecretRoleScreen.tsx` already handles the pass-and-tap private reveal internally. Having both `role_pass` and `role_reveal` as top-level screens creates confusing duplicate state. |
| `evidence_reveal` | Interstitial evidence display | **INTEGRATE** into `free_discussion` | `DiscussionEvidenceScreen.tsx` seamlessly combines active round timer, discussion prompts, and unlocked evidence cards. Standalone `evidence_reveal` is redundant. |
| `start_round` | Old interstitial countdown screen | **REMOVE** | Replaced by direct transition into `free_discussion` with round announcement header. |
| `confirm_vote` | Confirmation dialog state in old Android flow | **MODAL/COMPONENT STATE** in `VotingScreen` | `VotingScreen.tsx` already manages selection and confirmation states cleanly within its own component. |
| `how_to_play` | Modal popup in React UI | **MODAL ONLY** | Managed via `RulesModal.tsx` overlay rather than a disruptive full-page route change. |
| `reveal_truth` vs `killer_reveal` | Two sequential killer reveal screens in React | **CLARIFY FLOW** | `killer_reveal` reveals the guilty identity dramatically; `crime_explanation` explains the full narrative backstory and mechanics of the crime. `reveal_truth` was an unnecessary duplicate and is consolidated into `crime_explanation`. |

---

## 4. Current Architecture vs. Proposed TypeScript Engine Architecture

### A. Current Architecture (Problematic Scattering)
```text
App.tsx (Holds all state, voting math, elimination, win condition logic, custom stories)
  ├── Hardcoded vote counting and tie detection
  ├── Hardcoded character assignment and slice logic
  ├── LocalStorage calls scattered across App.tsx and CustomStoryModal.tsx
  └── 19 React UI Screens directly mutating and reading raw state
```

### B. Proposed Clean Game Engine Architecture
```text
src/game/
  ├── types.ts              # Core pure TypeScript interfaces & enums
  ├── GameState.ts          # State definitions & initial state factories
  ├── StoryEngine.ts        # Story validation, retrieval, and cast definitions
  ├── CharacterAllocator.ts # Scales 4–12 player casts, assigns roles without exposing 'Killer'
  ├── PlayerManager.ts      # Active/eliminated players, turn rotation
  ├── VotingEngine.ts       # Pure vote tallying, plurality, tie detection, elimination resolution
  ├── StoryStore.ts         # Persistent story store (built-in 13 cases + custom stories via localStorage)
  ├── GameEngine.ts         # Central controller coordinating phase transitions & win conditions
  └── index.ts              # Clean public API exports
```

---

## 5. Model Comparison: Android vs. React

### Story Model Comparison
| Feature | Android Model | Current React Model | Unified Strategy |
| :--- | :--- | :--- | :--- |
| **Player Count Support** | 4–12 players | Listed 4–10 in places, 4–12 in others | Strictly enforce 4–12 across all built-in & custom stories |
| **Guilty Scaling** | 1 for 4-6, 2 for 7-9, 3 for 10-12 | Fixed single killer in some screens | Support `guiltyPool` allocating exact count based on player size |
| **Character Identity** | Full story role with in-universe profession | Present in `repoStories.json` | Maintain authentic story character names and professions |
| **Wrong Vote Hints** | Progressive clues revealed on failed votes | Array in story data, partially unhooked | Connect directly to `VotingEngine` on wrong vote tally |
| **Investigation Rounds** | Progressive round data with public clues | Included in `repoStories.json` | Fully driven by `GameEngine.currentRound` |

### Player Model Comparison
| Feature | Android Model | Current React Model | Unified Strategy |
| :--- | :--- | :--- | :--- |
| **Role Exposure** | Hidden internal flag | Exposed in some debug logs | Character has `name` and `profession`. Only private screen displays status clearly without setting role to "Killer". |
| **Elimination Status** | `isEliminated` boolean | `eliminated` boolean | Unified to `isEliminated`, preventing eliminated players from voting or receiving votes. |
| **Vote Record** | Map/Array of target IDs | `votedForId` optional number | Track complete round-by-round voting history for post-game stats. |

---

## 6. Detailed Logic Extraction Plan (App.tsx → Game Engine)

1. **Vote Tally & Elimination Logic (Lines 94–146 in `App.tsx`)**:
   - *Extract to*: `VotingEngine.tally(votes, alivePlayers, story)`
   - *Outcome*: Determines selected player, checks guilt, handles ties, updates wrong vote count, and returns a structured `VoteResult`.
2. **Character & Role Assignment Logic (Lines 46–77 in `App.tsx`)**:
   - *Extract to*: `CharacterAllocator.allocate(story, playerNames)`
   - *Outcome*: Guarantees correct guilty/innocent ratio for 4–12 players without exposing "Killer" in public identity.
3. **Win Condition Checks**:
   - *Extract to*: `GameEngine.checkWinCondition(state)`
   - *Innocent Victory*: All guilty characters eliminated.
   - *Guilty Victory*: Number of guilty players equals or exceeds innocent players, OR maximum allowed wrong votes reached.
4. **Story Storage & Validation**:
   - *Extract to*: `StoryStore` with built-in story hydration and `localStorage` syncing.

---

## 7. Phased Implementation Roadmap (Phases 2 to 10)

1. **Phase 2**: Create TypeScript Game Engine (`src/game/*`) with unit-tested pure functions.
2. **Phase 3**: Connect Story Selection & Player Setup (4–12 players) to `StoryStore` & `CharacterAllocator`.
3. **Phase 4**: Connect Role Pass & Private Reveal (ensuring no "Killer" role naming).
4. **Phase 5**: Connect Discussion & Progressive Clues / Investigation Rounds.
5. **Phase 6**: Connect Voting & Elimination to `VotingEngine`.
6. **Phase 7**: Connect Multi-Killer Reveal, Crime Explanation, and Results.
7. **Phase 8**: Connect Custom Story Creation & Validation.
8. **Phase 9**: Remove redundant logic from `App.tsx` and UI components.
9. **Phase 10**: Full verification across 4, 6, 8, 10, and 12 player counts.
