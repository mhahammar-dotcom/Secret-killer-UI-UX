import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scale, ChevronLeft, Home, Play, UserX, Eye, EyeOff, Lock, Users } from 'lucide-react';
import { StoryData, PlayerData } from '../types';
import { VoteResult } from '../game/types';
import { sound } from '../utils/audio';
import { AR_STRINGS, EN_STRINGS } from '../data/translations';

interface VoteResultScreenProps {
  story: StoryData;
  players: PlayerData[];
  votes: Record<number, number>;
  round: number;
  wrongVotesCount: number;
  voteResult?: VoteResult | null;
  onProceedNextRound: () => void;
  onProceedToTruth: (winner: 'innocents' | 'guilty') => void;
  onBack?: () => void;
  onNavigateHome?: () => void;
  language?: 'ar' | 'en';
  secretBallotMode?: boolean;
}

export const VoteResultScreen: React.FC<VoteResultScreenProps> = ({
  story,
  players,
  votes,
  round,
  wrongVotesCount,
  voteResult,
  onProceedNextRound,
  onProceedToTruth,
  onBack,
  onNavigateHome,
  language = 'ar',
  secretBallotMode = false,
}) => {
  const isEn = language === 'en';
  const t = isEn ? EN_STRINGS : AR_STRINGS;
  const isRtl = !isEn;

  // Local state to toggle voter identities reveal (initialized based on secretBallotMode)
  const [revealIdentities, setRevealIdentities] = useState<boolean>(!secretBallotMode);

  // Helper to find all players who cast their vote for a specific target suspect
  const getVotersForPlayer = (targetPlayerId: number): PlayerData[] => {
    return Object.entries(votes || {})
      .filter(([_, targetId]) => Number(targetId) === targetPlayerId)
      .map(([voterIdStr]) => players.find((p) => p.id === Number(voterIdStr)))
      .filter((p): p is PlayerData => Boolean(p));
  };

  // If voteResult is provided from GameEngine, use it directly as authoritative single source of truth
  const voteCounts: Record<number, number> = {};
  (Object.values(votes || {}) as number[]).forEach((targetId) => {
    voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
  });

  let fallbackMaxVotes = 0;
  let fallbackTopCandidateIds: number[] = [];

  Object.entries(voteCounts).forEach(([idStr, count]) => {
    const id = parseInt(idStr, 10);
    if (count > fallbackMaxVotes) {
      fallbackMaxVotes = count;
      fallbackTopCandidateIds = [id];
    } else if (count === fallbackMaxVotes) {
      fallbackTopCandidateIds.push(id);
    }
  });

  const isTie = voteResult !== undefined && voteResult !== null
    ? voteResult.isTie
    : (fallbackTopCandidateIds.length !== 1 || fallbackMaxVotes === 0);

  const maxVotes = voteResult !== undefined && voteResult !== null
    ? (voteResult.tallies.length > 0 ? voteResult.tallies[0].voteCount : 0)
    : fallbackMaxVotes;

  const eliminatedPlayerId = voteResult !== undefined && voteResult !== null
    ? voteResult.selectedPlayerId
    : (!isTie ? fallbackTopCandidateIds[0] : null);

  const eliminatedPlayer = players.find((p) => p.id === eliminatedPlayerId) ||
    (voteResult?.eliminatedPlayer ? {
      id: voteResult.eliminatedPlayer.id,
      name: voteResult.eliminatedPlayer.name,
      character: voteResult.eliminatedPlayer.character,
      guilty: voteResult.eliminatedPlayer.guilty,
      eliminated: true,
      votedForId: voteResult.eliminatedPlayer.votedForId,
    } : null);

  // Authoritative game-over evaluation from GameEngine
  const isGameOver = voteResult !== undefined && voteResult !== null
    ? voteResult.gameOver
    : (() => {
        const updatedPlayers = players.map((p) =>
          p.id === eliminatedPlayerId ? { ...p, eliminated: true } : p
        );
        const guiltyAlive = updatedPlayers.filter((p) => !p.eliminated && p.guilty).length;
        const innocentAlive = updatedPlayers.filter((p) => !p.eliminated && !p.guilty).length;
        return !isTie && (guiltyAlive === 0 || (guiltyAlive >= innocentAlive && guiltyAlive > 0));
      })();

  const winner: 'innocents' | 'guilty' = voteResult !== undefined && voteResult !== null
    ? (voteResult.winner === 'GUILTY' ? 'guilty' : 'innocents')
    : (eliminatedPlayer?.guilty ? 'innocents' : 'guilty');

  // Render voter chips helper
  const renderVoterChips = (targetPlayerId: number) => {
    const voters = getVotersForPlayer(targetPlayerId);
    if (!revealIdentities) return null;

    return (
      <div className="w-full mt-2 pt-2 border-t border-amber-900/30 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-[#a39a8c] font-bold me-1">
          {t.votedBy}
        </span>
        {voters.length > 0 ? (
          voters.map((voter) => (
            <span
              key={voter.id}
              className="text-[11px] px-2 py-0.5 rounded-lg bg-black/60 border border-[#c8923a]/40 text-[#f5ebd9] font-medium inline-flex items-center gap-1 shadow-sm"
            >
              <span className="text-[#f3cb79]">👤</span>
              <span className="font-bold">{voter.name}</span>
              <span className="text-[#a39a8c] text-[10px]">({voter.character.name})</span>
            </span>
          ))
        ) : (
          <span className="text-[10px] text-[#7a7469] italic">
            {t.noVotesForSuspect}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[#07080c] select-none text-slate-100 pb-16 pt-4 px-3 sm:px-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background Subtle Gradient & Ambient Noir Vignettes */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0e1117] via-[#090b0f] to-[#050608] pointer-events-none" />
      <div className="fixed top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(200,146,58,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Page Container */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-5">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between w-full pt-2 pb-1 border-b border-amber-900/20">
          {/* Back Button */}
          <button
            onClick={() => {
              sound.playClick();
              if (onBack) onBack();
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title={t.back}
          >
            <ChevronLeft className={`w-6 h-6 stroke-[2.4] ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          <div className="text-center">
            <h1 className={`text-2xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md`}>
              {t.voteResults}
            </h1>
            <p className={`text-xs sm:text-sm text-[#9b988f] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
              {isEn ? `Round ${round} • Majority Decision` : `الجولة ${round} • قرار الأغلبية`}
            </p>
          </div>

          {/* Home Button */}
          <button
            onClick={() => {
              sound.playClick();
              if (onNavigateHome) onNavigateHome();
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title={t.home}
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Top Outcome Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col items-center text-center gap-4"
        >
          {isTie ? (
            /* TIE CASE */
            <>
              <div className="w-20 h-20 rounded-3xl bg-[#c8923a]/20 border border-[#c8923a]/60 flex items-center justify-center text-[#f3cb79] shadow-xl">
                <Scale className="w-10 h-10" />
              </div>

              <div>
                <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full bg-black/60 text-[#f3cb79] border border-[#c8923a]/40 mb-2 inline-block ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                  {t.voteTie}
                </span>
                <h3 className={`text-2xl sm:text-3xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] mt-1`}>
                  {t.voteInconclusive}
                </h3>
                <p className={`text-sm text-[#c4beb3] mt-2 max-w-[340px] leading-relaxed ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                  {t.voteTieDescription}
                </p>
              </div>

              {/* Vote tallies breakdown */}
              {voteResult?.tallies && voteResult.tallies.length > 0 && (
                <div className="w-full mt-2 pt-4 border-t border-amber-900/30 flex flex-col gap-3">
                  {/* Header with Mode Badge & Interactive Reveal Toggle */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs text-[#a39a8c] font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                        {t.voteDistribution}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/70 border border-[#c8923a]/50 text-[#f3cb79]">
                        {secretBallotMode ? t.secretBallotActiveBadge : t.publicBallotActiveBadge}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setRevealIdentities(!revealIdentities);
                      }}
                      className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-black/70 border border-[#c8923a]/50 hover:border-[#f3cb79] text-[#f3cb79] transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      {revealIdentities ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{revealIdentities ? t.hideVoterIdentities : t.revealVoterIdentities}</span>
                    </button>
                  </div>

                  <div className={`grid ${revealIdentities ? 'grid-cols-1' : 'grid-cols-2'} gap-2.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {voteResult.tallies.map((tally) => (
                      <div
                        key={tally.playerId}
                        className={`p-3 rounded-2xl bg-black/50 border border-[#7a5c2b]/50 flex flex-col text-xs ${isRtl ? "font-['Cairo']" : 'font-sans'}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="text-[#f5ebd9] font-bold text-sm">
                              {tally.characterName}
                            </span>
                            <span className="text-[11px] text-[#a39a8c]">
                              {tally.playerName}
                            </span>
                          </div>
                          <span className="text-[#f3cb79] font-black text-sm px-2.5 py-1 rounded-lg bg-[#c8923a]/15 border border-[#c8923a]/40">
                            {isEn ? `${tally.voteCount} votes` : `${tally.voteCount} أصوات`}
                          </span>
                        </div>
                        {renderVoterChips(tally.playerId)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ELIMINATION CASE */
            <>
              <div className="w-20 h-20 rounded-3xl bg-red-950/25 border border-red-500/60 flex items-center justify-center text-red-400 shadow-xl">
                <UserX className="w-10 h-10" />
              </div>

              <div>
                <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full bg-black/60 text-[#f3cb79] border border-[#c8923a]/40 mb-2 inline-block ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                  {isEn ? `Majority Decision (${maxVotes} votes)` : `حُسم قرار الأغلبية (${maxVotes} أصوات)`}
                </span>
                <h3 className={`text-2xl sm:text-3xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] mt-1`}>
                  {isEn ? `Eliminated: ${eliminatedPlayer?.character.name}` : `تم استبعاد: ${eliminatedPlayer?.character.name}`}
                </h3>
                <p className={`text-xs sm:text-sm text-[#e5b35a] font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
                  {isEn ? `Player: ${eliminatedPlayer?.name} • ${eliminatedPlayer?.character.profession}` : `اللاعب: ${eliminatedPlayer?.name} • ${eliminatedPlayer?.character.profession}`}
                </p>
              </div>

              {/* Suspenseful Status Notice */}
              <div className={`w-full py-3.5 px-4 rounded-2xl bg-black/50 border border-[#7a5c2b]/60 text-center font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} text-xs sm:text-sm text-[#d4cfc7] leading-relaxed`}>
                <span>
                  {t.suspectEliminatedNotice}
                </span>
              </div>

              {/* Vote tallies breakdown */}
              {voteResult?.tallies && voteResult.tallies.length > 0 && (
                <div className="w-full mt-1 pt-4 border-t border-amber-900/30 flex flex-col gap-3">
                  {/* Header with Mode Badge & Interactive Reveal Toggle */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs text-[#a39a8c] font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                        {t.tallyResults}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/70 border border-[#c8923a]/50 text-[#f3cb79]">
                        {secretBallotMode ? t.secretBallotActiveBadge : t.publicBallotActiveBadge}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setRevealIdentities(!revealIdentities);
                      }}
                      className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-black/70 border border-[#c8923a]/50 hover:border-[#f3cb79] text-[#f3cb79] transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      {revealIdentities ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{revealIdentities ? t.hideVoterIdentities : t.revealVoterIdentities}</span>
                    </button>
                  </div>

                  <div className={`grid ${revealIdentities ? 'grid-cols-1' : 'grid-cols-2'} gap-2.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {voteResult.tallies.map((tally) => (
                      <div
                        key={tally.playerId}
                        className={`p-3 rounded-2xl border flex flex-col text-xs transition-all ${isRtl ? "font-['Cairo']" : 'font-sans'} ${
                          tally.playerId === eliminatedPlayerId
                            ? 'bg-red-950/30 border-red-500/60 text-red-200 shadow-md'
                            : 'bg-black/50 border-[#7a5c2b]/50 text-[#f5ebd9]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">
                              {tally.characterName}
                            </span>
                            <span className="text-[11px] text-[#a39a8c]">
                              {tally.playerName}
                            </span>
                          </div>
                          <span className={`font-black text-sm px-2.5 py-1 rounded-lg ${
                            tally.playerId === eliminatedPlayerId
                              ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                              : 'bg-[#c8923a]/15 border border-[#c8923a]/40 text-[#f3cb79]'
                          }`}>
                            {isEn ? `${tally.voteCount} votes` : `${tally.voteCount} أصوات`}
                          </span>
                        </div>
                        {renderVoterChips(tally.playerId)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Bottom CTA Actions */}
        <div className="pt-2">
          {isGameOver ? (
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sound.playClick();
                onProceedToTruth(winner);
              }}
              className={`w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-base sm:text-lg shadow-[0_6px_22px_rgba(220,38,38,0.35)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer`}
            >
              <Eye className="w-5 h-5 stroke-[2.5]" />
              <span>{t.sessionEndedReveal}</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sound.playClick();
                onProceedNextRound();
              }}
              className={`w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer`}
            >
              <Play className="w-5 h-5 fill-slate-950 stroke-none" />
              <span>{isEn ? `Continue Discussion (Round ${round + 1})` : `متابعة النقاش والتحقيق (الجولة ${round + 1})`}</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};


