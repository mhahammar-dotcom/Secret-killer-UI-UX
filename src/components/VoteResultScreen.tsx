import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, Scale, Sparkles, AlertCircle, ArrowLeft, Eye, Play, FileText, CheckCircle2, ChevronLeft, Home } from 'lucide-react';
import { StoryData, PlayerData } from '../types';
import { sound } from '../utils/audio';

interface VoteResultScreenProps {
  story: StoryData;
  players: PlayerData[];
  votes: Record<number, number>;
  round: number;
  wrongVotesCount: number;
  onProceedNextRound: () => void;
  onProceedToTruth: (winner: 'innocents' | 'guilty') => void;
  onBack?: () => void;
  onNavigateHome?: () => void;
}

export const VoteResultScreen: React.FC<VoteResultScreenProps> = ({
  story,
  players,
  votes,
  round,
  wrongVotesCount,
  onProceedNextRound,
  onProceedToTruth,
  onBack,
  onNavigateHome,
}) => {
  // Compute tally
  const voteCounts: Record<number, number> = {};
  (Object.values(votes) as number[]).forEach((targetId) => {
    voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
  });

  let maxVotes = 0;
  let topCandidateIds: number[] = [];

  Object.entries(voteCounts).forEach(([idStr, count]) => {
    const id = parseInt(idStr, 10);
    if (count > maxVotes) {
      maxVotes = count;
      topCandidateIds = [id];
    } else if (count === maxVotes) {
      topCandidateIds.push(id);
    }
  });

  const isTie = topCandidateIds.length !== 1 || maxVotes === 0;
  const eliminatedPlayerId = !isTie ? topCandidateIds[0] : null;
  const eliminatedPlayer = players.find((p) => p.id === eliminatedPlayerId);

  // Extra clue reveal for ties
  const [extraClueRevealed, setExtraClueRevealed] = useState<boolean>(false);
  const extraClueText = story.clues && story.clues.length > 0
    ? story.clues[Math.min(round - 1, story.clues.length - 1)]
    : 'لم يتم العثور على أثر جديد في مسرح الجريمة.';

  // Progressive wrong vote hint
  const wrongHintIndex = Math.min(wrongVotesCount, (story.wrongVoteHints?.length || 1) - 1);
  const wrongHint = story.wrongVoteHints?.[wrongHintIndex] || 'راجعوا الأدلة بعناية قبل التسرع في التصويت القادم.';

  // Check Game Over status
  const updatedPlayers = players.map((p) =>
    p.id === eliminatedPlayerId ? { ...p, eliminated: true } : p
  );

  const guiltyAlive = updatedPlayers.filter((p) => !p.eliminated && p.guilty).length;
  const innocentAlive = updatedPlayers.filter((p) => !p.eliminated && !p.guilty).length;

  const isGameOver = !isTie && (guiltyAlive === 0 || (guiltyAlive >= innocentAlive && guiltyAlive > 0));
  const winner: 'innocents' | 'guilty' = guiltyAlive === 0 ? 'innocents' : 'guilty';

  const handleRevealExtraClue = () => {
    sound.playRoleReveal();
    setExtraClueRevealed(true);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[#07080c] select-none text-slate-100 pb-16 pt-4 px-3 sm:px-6" dir="rtl">
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
            title="رجوع"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.4] rtl:rotate-180" />
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-black font-['Cairo'] text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md">
              نتيجة التصويت
            </h1>
            <p className="text-xs sm:text-sm text-[#9b988f] font-medium font-['Cairo'] mt-0.5">
              الجولة {round} • قرار الأغلبية
            </p>
          </div>

          {/* Home Button */}
          <button
            onClick={() => {
              sound.playClick();
              if (onNavigateHome) onNavigateHome();
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title="الرئيسية"
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
                <h3 className="text-2xl sm:text-3xl font-black font-['Cairo'] text-[#f5ebd9]">
                  ⚖️ تعادل في الأصوات!
                </h3>
                <p className="text-xs sm:text-sm text-[#c4beb3] mt-1.5 max-w-[320px] leading-relaxed font-['Cairo']">
                  تساوت أصوات المشتبه بهم، لذلك لا يتم استبعاد أي شخص في هذه الجولة.
                </p>
              </div>

              {/* Extra Clue Section */}
              {!extraClueRevealed ? (
                <button
                  onClick={handleRevealExtraClue}
                  className="mt-2 px-5 py-3 rounded-2xl bg-[#c8923a]/20 hover:bg-[#c8923a]/30 text-[#f3cb79] border border-[#c8923a]/60 text-xs sm:text-sm font-black font-['Cairo'] flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#f3cb79]" />
                  <span>كشف دليل إضافي لكسر التعادل 🧩</span>
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full p-4 rounded-2xl bg-[#141724] border border-[#c8923a]/50 text-right"
                >
                  <span className="text-xs sm:text-sm font-black text-[#f3cb79] flex items-center gap-1.5 font-['Cairo'] mb-1">
                    <FileText className="w-4 h-4 text-[#c8923a]" />
                    <span>دليل إضافي جديد ظهر في مسرح الجريمة:</span>
                  </span>
                  <p className="text-xs sm:text-sm text-[#f5ebd9] font-medium leading-relaxed font-['Cairo']">
                    {extraClueText}
                  </p>
                </motion.div>
              )}
            </>
          ) : (
            /* ELIMINATION CASE */
            <>
              <div
                className={`w-20 h-20 rounded-3xl border flex items-center justify-center shadow-xl ${
                  eliminatedPlayer?.guilty
                    ? 'bg-[#c52222]/20 border-red-500/60 text-red-400'
                    : 'bg-[#121520] border-[#c8923a]/50 text-[#f3cb79]'
                }`}
              >
                {eliminatedPlayer?.guilty ? (
                  <ShieldAlert className="w-10 h-10 text-red-400" />
                ) : (
                  <ShieldCheck className="w-10 h-10 text-[#f3cb79]" />
                )}
              </div>

              <div>
                <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-black/60 text-[#f3cb79] border border-[#c8923a]/40 mb-2 inline-block font-['Cairo']">
                  أعلى نسبة أصوات ({maxVotes} أصوات)
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-['Cairo'] text-[#f5ebd9] mt-1">
                  تم استبعاد: {eliminatedPlayer?.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#e5b35a] font-bold font-['Cairo'] mt-0.5">
                  ({eliminatedPlayer?.character.name} • {eliminatedPlayer?.character.profession})
                </p>
              </div>

              {/* Status Badge */}
              <div
                className={`w-full py-3 px-4 rounded-2xl border text-center font-black font-['Cairo'] text-sm sm:text-base ${
                  eliminatedPlayer?.guilty
                    ? 'bg-[#c52222]/20 border-red-500/60 text-red-300'
                    : 'bg-[#141724] border-[#7a5c2b]/60 text-[#f5ebd9]'
                }`}
              >
                {eliminatedPlayer?.guilty ? (
                  <span>🎯 أصابت الأغلبية! هذا اللاعب كان القاتل (مذنب).</span>
                ) : (
                  <span>❌ خاب الظن! هذا اللاعب كان بريئاً تماماً.</span>
                )}
              </div>

              {/* Wrong Vote Hint */}
              {!eliminatedPlayer?.guilty && !isGameOver && (
                <div className="w-full p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-right text-xs text-[#d4cfc7] font-['Cairo'] leading-relaxed">
                  <span className="font-black text-[#f3cb79] block mb-0.5">💡 تلميح للمحققين:</span>
                  {wrongHint}
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
              className="w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black font-['Cairo'] text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <Eye className="w-5 h-5 stroke-[2.5]" />
              <span>كشف الستار وإعلان الحقيقة الكاملة</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sound.playClick();
                onProceedNextRound();
              }}
              className="w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black font-['Cairo'] text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950 stroke-none" />
              <span>بدء الجولة القادمة ({round + 1})</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
