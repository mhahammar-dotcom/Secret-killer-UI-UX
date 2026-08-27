import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, ChevronLeft, SlidersHorizontal, Check, Home } from 'lucide-react';
import { StoryData } from '../types';
import { sound } from '../utils/audio';
import { STORY_COVERS, DEFAULT_STORY_COVER } from '../assets/covers';
import { AR_STRINGS, EN_STRINGS } from '../data/translations';

interface StorySelectScreenProps {
  stories: StoryData[];
  onSelectStory: (story: StoryData) => void;
  onOpenCustomStoryModal: () => void;
  onBack: () => void;
  onNavigateHome?: () => void;
  language?: 'ar' | 'en';
}

// Story metadata mapping: difficulty, difficulty level (1=easy, 2=medium, 3=hard), unique thematic image, and badge
interface StoryMeta {
  difficultyLevel: 1 | 2 | 3; // 1: easy (green), 2: medium (gold/yellow), 3: hard (red)
  isNew?: boolean;
  image: string;
}

// Highly specific, curated, cinematic images directly reflecting each story's mystery and location
const STORY_META_MAP: Record<string, StoryMeta> = {
  dreams: { difficultyLevel: 2, isNew: true, image: STORY_COVERS.dreams },
  gala_toast: { difficultyLevel: 1, isNew: true, image: STORY_COVERS.gala_toast },
  museum: { difficultyLevel: 3, image: STORY_COVERS.museum },
  train: { difficultyLevel: 2, image: STORY_COVERS.train },
  observatory: { difficultyLevel: 3, image: STORY_COVERS.observatory },
  desert_archive: { difficultyLevel: 2, image: STORY_COVERS.desert_archive },
  drowned_village: { difficultyLevel: 3, image: STORY_COVERS.drowned_village },
  arctic_station: { difficultyLevel: 2, image: STORY_COVERS.arctic_station },
  film_set: { difficultyLevel: 1, image: STORY_COVERS.film_set },
  submarine: { difficultyLevel: 3, image: STORY_COVERS.submarine },
  court: { difficultyLevel: 2, image: STORY_COVERS.court },
  greenhouse: { difficultyLevel: 1, image: STORY_COVERS.greenhouse },
  royal_kitchen: { difficultyLevel: 2, image: STORY_COVERS.royal_kitchen },
};

const DEFAULT_STORY_IMAGE = DEFAULT_STORY_COVER;

export const StorySelectScreen: React.FC<StorySelectScreenProps> = ({
  stories,
  onSelectStory,
  onOpenCustomStoryModal,
  onBack,
  onNavigateHome,
  language = 'ar',
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'easy' | 'medium' | 'hard' | 'custom'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const isEn = language === 'en';
  const t = isEn ? EN_STRINGS : AR_STRINGS;
  const isRtl = !isEn;

  // Filter logic
  const filteredStories = stories.filter((s) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'custom') return !!s.isCustom;
    const meta = STORY_META_MAP[s.id] || { difficultyLevel: 2 };
    if (activeFilter === 'easy') return meta.difficultyLevel === 1;
    if (activeFilter === 'medium') return meta.difficultyLevel === 2;
    if (activeFilter === 'hard') return meta.difficultyLevel === 3;
    return true;
  });

  const handleRandomPick = () => {
    sound.playClick();
    if (stories.length === 0) return;
    const randomIndex = Math.floor(Math.random() * stories.length);
    onSelectStory(stories[randomIndex]);
  };

  const getDifficultyMeta = (story: StoryData) => {
    const meta = STORY_META_MAP[story.id] || {
      difficultyLevel: 2 as const,
      isNew: story.isCustom,
      image: DEFAULT_STORY_IMAGE,
    };

    let text = t.medium;
    if (meta.difficultyLevel === 1) text = t.easy;
    if (meta.difficultyLevel === 3) text = t.hard;

    return {
      ...meta,
      difficultyText: text,
    };
  };

  const getStoryImage = (story: StoryData): string => {
    if (STORY_META_MAP[story.id]?.image) {
      return STORY_META_MAP[story.id].image;
    }
    return DEFAULT_STORY_IMAGE;
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[#07080c] select-none text-slate-100 pb-16 pt-4 px-3 sm:px-6" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Background Subtle Gradient & Ambient Noir Vignettes */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0e1117] via-[#090b0f] to-[#050608] pointer-events-none" />
      <div className="fixed top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(200,146,58,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Page Container */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-5">
        
        {/* 1. Header Bar */}
        <div className="flex items-center justify-between w-full pt-2 pb-1 border-b border-amber-900/20">
          {/* Back Button */}
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title={t.back}
          >
            <ChevronLeft className={`w-6 h-6 stroke-[2.4] ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          {/* Title & Subtitle in Center */}
          <div className="text-center">
            <h1 className={`text-2xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md`}>
              {t.selectStoryTitle}
            </h1>
            <p className={`text-xs sm:text-sm text-[#9b988f] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
              {t.selectStorySubtitle}
            </p>
          </div>

          {/* Actions: Filter + Home Button */}
          <div className="flex items-center gap-2">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowFilterDropdown(!showFilterDropdown);
                }}
                className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 text-xs sm:text-sm font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} transition-all cursor-pointer shadow-md ${
                  activeFilter !== 'all'
                    ? 'bg-[#c8923a]/30 text-[#f5ebd9] border-[#e5b35a]'
                    : 'bg-black/60 border-[#c8923a]/60 text-[#e5b35a] hover:border-[#f3cb79] hover:text-[#f3cb79]'
                }`}
                title={t.filterStories}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.filter}</span>
              </button>

              {/* Filter Dropdown Popover */}
              <AnimatePresence>
                {showFilterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-2 w-44 rounded-2xl bg-[#0f121a] border border-[#c8923a]/60 shadow-2xl p-2 z-30 flex flex-col gap-1 backdrop-blur-xl`}
                  >
                    {[
                      { key: 'all', label: t.allStories },
                      { key: 'easy', label: t.easy },
                      { key: 'medium', label: t.medium },
                      { key: 'hard', label: t.hard },
                      { key: 'custom', label: t.customStories },
                    ].map((filterItem) => (
                      <button
                        key={filterItem.key}
                        onClick={() => {
                          sound.playClick();
                          setActiveFilter(filterItem.key as any);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} flex items-center justify-between transition-colors cursor-pointer ${
                          activeFilter === filterItem.key
                            ? 'bg-[#c8923a]/25 text-[#f3cb79]'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <span>{filterItem.label}</span>
                        {activeFilter === filterItem.key && <Check className="w-4 h-4 text-[#e5b35a]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Home Button */}
            <button
              onClick={() => {
                sound.playClick();
                if (onNavigateHome) onNavigateHome();
                else onBack();
              }}
              className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
              title={t.home}
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Stories List */}
        <div className="flex flex-col gap-4 w-full">
          {filteredStories.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 gap-4 bg-[#0c0e14] rounded-3xl border border-amber-900/20">
              <p className={`text-base font-bold text-slate-300 ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                {t.noStoriesMatch}
              </p>
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-5 py-2.5 rounded-xl bg-[#c8923a]/20 text-[#f3cb79] border border-[#c8923a]/50 text-sm font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} cursor-pointer`}
              >
                {t.allStories}
              </button>
            </div>
          ) : (
            filteredStories.map((story, idx) => {
              const meta = getDifficultyMeta(story);
              const isNew = meta.isNew || idx === 0;
              const storyImg = getStoryImage(story);

              return (
                <motion.div
                  key={story.id}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    sound.playClick();
                    onSelectStory(story);
                  }}
                  className="relative w-full rounded-[22px] bg-[#0d0f16] border border-[#7a5c2b]/50 hover:border-[#c8923a] p-3.5 sm:p-4.5 shadow-[0_6px_22px_rgba(0,0,0,0.7)] transition-all cursor-pointer flex items-center gap-3.5 sm:gap-4.5 overflow-hidden group"
                >
                  {/* Thumbnail Image with Ribbon Badge */}
                  <div className="relative w-[110px] sm:w-[140px] h-[105px] sm:h-[125px] rounded-[16px] overflow-hidden shrink-0 border border-[#3b3223] shadow-md bg-black">
                    <img
                      src={storyImg}
                      alt={story.title}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    
                    {/* Atmospheric Shadow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                    {/* Ribbon Tag "NEW" */}
                    {isNew && (
                      <div className={`absolute -top-1 ${isRtl ? '-right-1' : '-left-1'} overflow-hidden w-14 h-14 pointer-events-none`}>
                        <div className={`absolute transform ${isRtl ? 'rotate-45 right-[-24px]' : '-rotate-45 left-[-24px]'} bg-[#c52222] text-white text-[10.5px] font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-center py-0.5 top-[12px] w-[80px] shadow-md tracking-wider`}>
                          {t.newBadge}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Story Content */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5 h-full">
                    
                    {/* Title & Arrow */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-base sm:text-lg font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f0caa0] group-hover:text-[#fae0be] transition-colors leading-snug line-clamp-1`}>
                        {story.title}
                      </h3>
                      <ChevronLeft className={`w-5 h-5 text-[#9a886c] group-hover:text-[#f0caa0] group-hover:translate-x-[-3px] transition-transform shrink-0 mt-0.5 ${isRtl ? '' : 'rotate-180'}`} />
                    </div>

                    {/* Story Description */}
                    <p className={`text-xs sm:text-[13px] text-[#c4beb3] font-normal ${isRtl ? "font-['Cairo']" : 'font-sans'} line-clamp-2 leading-relaxed mt-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                      {story.description}
                    </p>

                    {/* Bottom Metadata Fields */}
                    <div className={`flex items-center justify-between pt-2.5 mt-2 border-t border-amber-900/25 text-xs sm:text-sm ${isRtl ? "font-['Cairo']" : 'font-sans'} gap-2`}>
                      
                      {/* Players Count Field */}
                      <div className="flex items-center gap-1.5 shrink-0 text-[#ede6d8]">
                        <Users className="w-4 h-4 text-[#c8923a] shrink-0" />
                        <span className="font-extrabold text-xs sm:text-sm whitespace-nowrap text-[#f5ede0]">
                          {story.minPlayers === story.maxPlayers
                            ? `${story.minPlayers}`
                            : `${story.minPlayers}-${story.maxPlayers}`}
                        </span>
                        <span className="text-[11px] sm:text-xs text-[#a39a8c] whitespace-nowrap">{t.players}</span>
                      </div>

                      {/* Difficulty Field with Signal Bars */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] sm:text-xs text-[#a39a8c] whitespace-nowrap">{t.difficulty}</span>
                        
                        {/* Custom 3-Bar Difficulty Signal Icon */}
                        <div className="flex items-end gap-[2.5px] h-3.5 px-0.5 shrink-0">
                          <div
                            className={`w-[3.5px] rounded-sm transition-all ${
                              meta.difficultyLevel >= 1
                                ? meta.difficultyLevel === 1
                                  ? 'h-2 bg-[#4ade80] shadow-[0_0_6px_rgba(74,222,128,0.5)]'
                                  : meta.difficultyLevel === 2
                                  ? 'h-2 bg-[#facc15] shadow-[0_0_6px_rgba(250,204,21,0.5)]'
                                  : 'h-2 bg-[#ef4444] shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                                : 'h-2 bg-slate-700'
                            }`}
                          />
                          <div
                            className={`w-[3.5px] rounded-sm transition-all ${
                              meta.difficultyLevel >= 2
                                ? meta.difficultyLevel === 2
                                  ? 'h-2.5 bg-[#facc15] shadow-[0_0_6px_rgba(250,204,21,0.5)]'
                                  : 'h-2.5 bg-[#ef4444] shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                                : 'h-2.5 bg-slate-700'
                            }`}
                          />
                          <div
                            className={`w-[3.5px] rounded-sm transition-all ${
                              meta.difficultyLevel >= 3
                                ? 'h-3.5 bg-[#ef4444] shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                                : 'h-3.5 bg-slate-700'
                            }`}
                          />
                        </div>

                        <span className={`font-extrabold text-xs sm:text-sm whitespace-nowrap ${
                          meta.difficultyLevel === 1
                            ? 'text-emerald-400'
                            : meta.difficultyLevel === 2
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}>
                          {meta.difficultyText}
                        </span>
                      </div>

                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* 3. Bottom Action: Random Story Box */}
        <div className="pt-3">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRandomPick}
            className="w-full rounded-[24px] py-4 px-6 bg-[#0d0f16] border border-[#c8923a]/65 hover:border-[#f3cb79] shadow-xl flex items-center justify-center gap-4 transition-all cursor-pointer group"
          >
            {/* 3D Gold Dice Icon */}
            <div className="text-3xl transition-transform group-hover:rotate-12">
              🎲
            </div>

            {/* Centered Text */}
            <div className="text-center">
              <span className={`text-base font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] group-hover:text-amber-200 block leading-tight`}>
                {t.randomStory}
              </span>
              <span className={`text-xs text-[#9b988f] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} block mt-1`}>
                {t.randomStorySubtitle}
              </span>
            </div>
          </motion.button>
        </div>

      </div>
    </div>
  );
};

