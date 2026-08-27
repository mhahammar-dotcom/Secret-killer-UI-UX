import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Settings, Users, Trophy, HelpCircle, Star, Crown } from 'lucide-react';
import { sound } from '../utils/audio';
import { AchievementsModal } from './AchievementsModal';
import { OnlineComingSoonModal } from './OnlineComingSoonModal';
import { RatingModal } from './RatingModal';
import { FingerprintGraphic } from './FingerprintGraphic';
import { KillerKnifeIcon } from './KillerKnifeIcon';
import noirBg from '../assets/images/noir_home_bg_1787348360647.jpg';
import { AR_STRINGS, EN_STRINGS } from '../data/translations';

interface HomeScreenProps {
  onStartGame: () => void;
  onOpenCustomStories: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  totalStories: number;
  customStoriesCount: number;
  language?: 'ar' | 'en';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onOpenCustomStories,
  onOpenSettings,
  onOpenRules,
  totalStories,
  customStoriesCount,
  language = 'ar',
}) => {
  const [showAchievements, setShowAchievements] = useState(false);
  const [showOnlineModal, setShowOnlineModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const isEn = language === 'en';
  const t = isEn ? EN_STRINGS : AR_STRINGS;
  const isRtl = !isEn;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-3 sm:p-5 select-none bg-[#050608] overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Background Image: Full Viewport Atmospheric Noir Scene */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={noirBg}
          alt="Noir Victorian Street"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
        />
        {/* Soft atmospheric vignettes */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/90" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/35 to-black/85" />
      </div>

      {/* Main Container - Compact & Zoomed Out Layout */}
      <div className="relative z-10 w-full max-w-[360px] flex flex-col justify-between flex-1 py-2">
        
        {/* 1. Top Header Bar (Settings + Premium Crown) */}
        <div className="flex items-center justify-between w-full pt-1 px-1">
          {/* Settings Circle Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/50 text-[#e5b35a] flex items-center justify-center hover:bg-black/80 hover:border-[#e5b35a] shadow-lg shadow-black/80 transition-all cursor-pointer active:scale-95"
            title={t.settings}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Premium Crown Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#c8923a]/60 text-[#f3cb79] text-[11px] font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} shadow-lg shadow-black/80`}>
            <Crown className="w-3.5 h-3.5 text-[#e5b35a] fill-[#e5b35a]" />
            <span>{t.premiumEdition}</span>
          </div>
        </div>

        {/* 2. Hero Visual Area: Big Bold "SECRET KILLER" Title with Faded Fingerprint */}
        <div className="flex flex-col items-center justify-center text-center my-auto py-2">
          <motion.div
            whileTap={{ scale: 0.96 }}
            onClick={() => sound.playTitleVoice(true)}
            className="relative flex flex-col items-center justify-center w-full cursor-pointer select-none group"
            title={isEn ? "Click to play title voice" : "انقر لسماع صوت اللعبة"}
          >
            {/* Pure Realistic Forensic Fingerprint with glowing red lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-1 w-40 h-52 pointer-events-none flex items-center justify-center">
              <FingerprintGraphic
                className="w-full h-full group-hover:scale-105 transition-transform"
                opacity={0.42}
              />
            </div>

            {/* Big Prominent Title */}
            <div className="relative z-10 flex flex-col items-center">
              <h1 className="text-[44px] sm:text-[50px] font-black font-sans uppercase tracking-[0.18em] text-slate-100 drop-shadow-[0_6px_18px_rgba(0,0,0,1)] leading-[0.95] pl-[0.18em] group-hover:text-white transition-colors">
                SECRET
              </h1>
              <h1 className="text-[44px] sm:text-[50px] font-black font-sans uppercase tracking-[0.24em] text-[#dc2626] drop-shadow-[0_6px_22px_rgba(220,38,38,0.95)] leading-[0.95] pl-[0.24em] mt-0.5 group-hover:drop-shadow-[0_6px_28px_rgba(239,68,68,1)] transition-all">
                KILLER
              </h1>

              {/* Tagline */}
              <p className={`text-xs text-slate-200/90 font-semibold ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-2.5 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]`}>
                {t.gameTagline}
              </p>
            </div>
          </motion.div>
        </div>

        {/* 3. Action Cards Stack - Clean, Compact, Zoomed-Out */}
        <div className="flex flex-col gap-2.5 w-full my-auto">
          {/* Card 1: Play Story (Featured Red Card) */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            className="w-full rounded-2xl p-3 shadow-xl border border-[#b8860b]/55 bg-gradient-to-r from-[#441812]/95 via-[#34120e]/95 to-[#260c09]/95 hover:from-[#541e17] hover:to-[#36100c] transition-all cursor-pointer flex items-center justify-between backdrop-blur-md group"
          >
            {/* Movie Killer Knife Icon */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[#e5b35a] group-hover:text-amber-300 shrink-0 transition-colors">
              <KillerKnifeIcon className="w-8 h-8 drop-shadow-[0_0_8px_rgba(229,179,90,0.55)]" />
            </div>

            {/* Title & Subtitle */}
            <div className="text-center flex-1 px-1">
              <h3 className={`text-base font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-white group-hover:text-amber-200 transition-colors leading-tight`}>
                {isEn ? 'Play a Case' : 'العب قصة'}
              </h3>
              <p className={`text-[11px] text-amber-200/75 font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
                {isEn ? 'Select a mystery and begin' : 'اختر قصة وابدأ اللعبة'}
              </p>
            </div>

            {/* Spacer */}
            <div className="w-11 h-11 shrink-0 opacity-0" />
          </motion.button>

          {/* Card 2: Custom Cases */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onOpenCustomStories();
            }}
            className="w-full rounded-2xl p-3 shadow-lg border border-[#8a6828]/45 bg-[#0c0e15]/90 hover:bg-[#131722]/95 hover:border-[#c8923a]/65 transition-all cursor-pointer flex items-center justify-between backdrop-blur-md group"
          >
            {/* Book Icon */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#e5b35a] shrink-0">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>

            {/* Title & Subtitle */}
            <div className="text-center flex-1 px-1">
              <h3 className={`text-base font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-slate-100 group-hover:text-amber-300 transition-colors leading-tight`}>
                {isEn ? 'Custom Cases' : 'قصصي المخصصة'}
              </h3>
              <p className={`text-[11px] text-slate-400 font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
                {isEn ? 'Create and manage your own cases' : 'أنشئ قصتك الخاصة'}
              </p>
            </div>

            {/* Spacer */}
            <div className="w-10 h-10 shrink-0 opacity-0" />
          </motion.button>

          {/* Card 3: Online Multiplayer */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              setShowOnlineModal(true);
            }}
            className="w-full rounded-2xl p-3 shadow-lg border border-[#8a6828]/45 bg-[#0c0e15]/90 hover:bg-[#131722]/95 hover:border-[#c8923a]/65 transition-all cursor-pointer flex items-center justify-between backdrop-blur-md group"
          >
            {/* Users Icon */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#e5b35a] shrink-0">
              <Users className="w-6 h-6 stroke-[2.2]" />
            </div>

            {/* Title & Subtitle */}
            <div className="text-center flex-1 px-1">
              <h3 className={`text-base font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-slate-100 group-hover:text-amber-300 transition-colors leading-tight`}>
                {t.onlinePartyMode}
              </h3>
              <p className={`text-[11px] text-slate-400 font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
                {isEn ? 'Play remotely with friends' : 'العب مع أصدقائك عن بُعد'}
              </p>
            </div>

            {/* Badge: Coming Soon */}
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <span className={`bg-[#701616] border border-[#a82a2a]/70 text-red-100 text-[10px] px-2 py-0.5 rounded-lg font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} shadow-sm`}>
                {t.comingSoon}
              </span>
            </div>
          </motion.button>

          {/* Card 4: Achievements */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              setShowAchievements(true);
            }}
            className="w-full rounded-2xl p-3 shadow-lg border border-[#8a6828]/45 bg-[#0c0e15]/90 hover:bg-[#131722]/95 hover:border-[#c8923a]/65 transition-all cursor-pointer flex items-center justify-between backdrop-blur-md group"
          >
            {/* Trophy Icon */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#e5b35a] shrink-0">
              <Trophy className="w-6 h-6 stroke-[2.2]" />
            </div>

            {/* Title & Subtitle */}
            <div className="text-center flex-1 px-1">
              <h3 className={`text-base font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-slate-100 group-hover:text-amber-300 transition-colors leading-tight`}>
                {t.achievements}
              </h3>
              <p className={`text-[11px] text-slate-400 font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
                {isEn ? 'Track stats and detective badges' : 'تتبع إحصائياتك وإنجازاتك'}
              </p>
            </div>

            {/* Spacer */}
            <div className="w-10 h-10 shrink-0 opacity-0" />
          </motion.button>
        </div>

        {/* 4. Bottom Navigation / Actions Footer */}
        <div className="flex items-center justify-between gap-2.5 w-full mt-2 pt-1">
          {/* Left Button: Rate Game */}
          <button
            onClick={() => {
              sound.playClick();
              setShowRatingModal(true);
            }}
            className={`flex-1 py-2 px-3 rounded-2xl bg-[#0e1017]/85 hover:bg-[#181d2c]/95 border border-slate-700/60 hover:border-[#c8923a]/50 text-slate-300 hover:text-white transition-all text-[11px] font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} flex items-center justify-center gap-1.5 shadow-md backdrop-blur-md cursor-pointer`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{t.rateGame}</span>
          </button>

          {/* Right Button: How to Play */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            className={`flex-1 py-2 px-3 rounded-2xl bg-[#0e1017]/85 hover:bg-[#181d2c]/95 border border-slate-700/60 hover:border-[#c8923a]/50 text-slate-300 hover:text-white transition-all text-[11px] font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} flex items-center justify-center gap-1.5 shadow-md backdrop-blur-md cursor-pointer`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.howToPlay}</span>
          </button>
        </div>

      </div>

      {/* Modals */}
      <AchievementsModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      <OnlineComingSoonModal
        isOpen={showOnlineModal}
        onClose={() => setShowOnlineModal(false)}
      />

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
      />
    </div>
  );
};

