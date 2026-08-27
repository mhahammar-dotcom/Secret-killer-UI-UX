import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Trash2, BookOpen, Check } from 'lucide-react';
import { StoryData, StoryCharacterData } from '../types';
import { sound } from '../utils/audio';
import { AR_STRINGS, EN_STRINGS } from '../data/translations';

interface CustomStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStory: (newStory: StoryData) => void;
  language?: 'ar' | 'en';
}

export const CustomStoryModal: React.FC<CustomStoryModalProps> = ({
  isOpen,
  onClose,
  onSaveStory,
  language = 'ar',
}) => {
  if (!isOpen) return null;

  const isEn = language === 'en';
  const t = isEn ? EN_STRINGS : AR_STRINGS;
  const isRtl = !isEn;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [characters, setCharacters] = useState<StoryCharacterData[]>([
    {
      name: isEn ? 'Character 1' : 'شخصية 1',
      profession: isEn ? 'Profession' : 'المهنة',
      publicIdentity: isEn ? 'Known identity to all' : 'الهوية المعروفة للجميع',
      knowledge: isEn ? 'Secret knowledge or crime scheme' : 'المعلومة السرية أو خطة الجريمة',
      guilty: true,
    },
    {
      name: isEn ? 'Character 2' : 'شخصية 2',
      profession: isEn ? 'Profession' : 'المهنة',
      publicIdentity: isEn ? 'Known identity to all' : 'الهوية المعروفة للجميع',
      knowledge: isEn ? 'Secret knowledge observed' : 'المعلومة السرية التي رآها',
      guilty: false,
    },
    {
      name: isEn ? 'Character 3' : 'شخصية 3',
      profession: isEn ? 'Profession' : 'المهنة',
      publicIdentity: isEn ? 'Known identity to all' : 'الهوية المعروفة للجميع',
      knowledge: isEn ? 'Secret knowledge observed' : 'المعلومة السرية التي رآها',
      guilty: false,
    },
    {
      name: isEn ? 'Character 4' : 'شخصية 4',
      profession: isEn ? 'Profession' : 'المهنة',
      publicIdentity: isEn ? 'Known identity to all' : 'الهوية المعروفة للجميع',
      knowledge: isEn ? 'Secret knowledge observed' : 'المعلومة السرية التي رآها',
      guilty: false,
    },
  ]);

  const handleAddCharacter = () => {
    sound.playClick();
    if (characters.length >= 10) return;
    const newId = characters.length + 1;
    setCharacters([
      ...characters,
      {
        name: isEn ? `Character ${newId}` : `شخصية ${newId}`,
        profession: isEn ? 'Profession' : 'المهنة',
        publicIdentity: isEn ? 'Known identity to all' : 'الهوية المعروفة للجميع',
        knowledge: isEn ? 'Secret testimony/knowledge' : 'المعلومة السرية',
        guilty: false,
      },
    ]);
  };

  const handleRemoveCharacter = (idx: number) => {
    sound.playClick();
    if (characters.length <= 3) return;
    const next = characters.filter((_, i) => i !== idx);
    setCharacters(next);
  };

  const handleCharChange = (idx: number, field: keyof StoryCharacterData, val: any) => {
    const next = [...characters];
    next[idx] = { ...next[idx], [field]: val };
    setCharacters(next);
  };

  const handleToggleGuilty = (idx: number) => {
    sound.playClick();
    const next = characters.map((c, i) => ({
      ...c,
      guilty: i === idx,
    }));
    setCharacters(next);
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      alert(isEn ? 'Please enter a case title and description' : 'يرجى إدخال عنوان ووصف القضية');
      return;
    }

    sound.playVoteConfirm();

    const guiltyPool = characters.filter((c) => c.guilty);
    const innocentPool = characters.filter((c) => !c.guilty);

    const newStory: StoryData = {
      id: `custom_${Date.now()}`,
      title,
      description,
      minPlayers: characters.length,
      maxPlayers: characters.length,
      isCustom: true,
      guiltyPool: guiltyPool.length > 0 ? guiltyPool : [characters[0]],
      innocentPool: innocentPool.length > 0 ? innocentPool : characters.slice(1),
      fixedCharacters: characters,
      clues: [isEn ? 'General clue discovered at the crime scene' : 'دليل عام تم اكتشافه في مسرح الجريمة'],
      wrongVoteHints: [isEn ? 'Review the evidence carefully before casting your next vote.' : 'راجعوا الأدلة بعناية قبل التسرع في التصويت القادم.'],
      solution: solution || (isEn ? 'The custom mystery case has been resolved.' : 'تم حل لغز القضية المخصصة.'),
      introduction: {
        setting: isEn ? 'Custom Crime Scene' : 'الموقع المخصص',
        situation: description,
        incident: isEn ? 'A mysterious crime took place.' : 'وقعت الجريمة الغامضة.',
        stakes: isEn ? 'Expose the truth or let the culprit slip away.' : 'كشف الحقيقة أو إفلات الجاني.',
        objective: isEn ? 'Who is the culprit?' : 'من القاتل؟',
      },
      investigationRounds: [
        {
          roundNumber: 1,
          title: isEn ? 'Initial Trail' : 'الأثر الأول',
          publicClue: isEn ? 'Preliminary forensic traces at the scene.' : 'أدلة أولية في مسرح الحادث.',
          description: isEn ? 'Key clues extracted from the crime scene.' : 'تفاصيل الأثر المستخلص من موقع الحادث.',
          discussionPrompt: isEn ? 'Examine the initial movements of the suspects.' : 'ناقشوا التحركات الأولية للمشتبه بهم.',
        },
      ],
    };

    onSaveStory(newStory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-xl max-h-[90vh] rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.9)] overflow-y-auto flex flex-col gap-4 ${isRtl ? 'text-right' : 'text-left'} custom-scrollbar ${isRtl ? "font-['Cairo']" : 'font-sans'}`}
      >
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-black/60 border border-[#c8923a]/60 flex items-center justify-center text-[#f3cb79]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-[#f5ebd9]">{t.createCustomCase}</h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-[#e5b35a] border border-[#c8923a]/50 flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Story details */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-black text-[#f3cb79] block mb-1">
              {t.caseTitleLabel}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isEn ? 'e.g., The Manor Jewel Heist' : 'مثال: سرقة الجوهرة في القصر المعزول'}
              className="w-full p-3 rounded-xl bg-black/40 border border-[#7a5c2b]/50 text-[#f5ebd9] text-sm focus:outline-none focus:border-[#c8923a]"
            />
          </div>

          <div>
            <label className="text-xs font-black text-[#f3cb79] block mb-1">
              {t.crimeDescriptionLabel}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isEn ? 'Describe the crime scene details and what occurred...' : 'اكتب تفاصيل القصة وما حدث في مسرح الجريمة...'}
              rows={3}
              className="w-full p-3 rounded-xl bg-black/40 border border-[#7a5c2b]/50 text-[#f5ebd9] text-sm focus:outline-none focus:border-[#c8923a]"
            />
          </div>

          <div>
            <label className="text-xs font-black text-[#f3cb79] block mb-1">
              {t.solutionAndConfessionLabel}
            </label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder={isEn ? 'How the crime was committed and the culprit motive...' : 'كيف تمت الجريمة وما هي دوافع القاتل بالتفصيل...'}
              rows={2}
              className="w-full p-3 rounded-xl bg-black/40 border border-[#7a5c2b]/50 text-[#f5ebd9] text-sm focus:outline-none focus:border-[#c8923a]"
            />
          </div>
        </div>

        {/* Characters section */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-amber-900/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-[#f5ebd9]">
              {t.caseCharacters} ({characters.length})
            </span>
            <span className="text-xs text-[#a39a8c]">{t.selectCulpritHint}</span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[35vh] overflow-y-auto pr-1 custom-scrollbar">
            {characters.map((char, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex flex-col gap-2 ${
                  char.guilty
                    ? 'bg-red-950/30 border-red-500/50'
                    : 'bg-black/40 border-[#7a5c2b]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={char.name}
                    onChange={(e) => handleCharChange(idx, 'name', e.target.value)}
                    placeholder={isEn ? 'Character Name' : 'اسم الشخصية'}
                    className="w-1/2 p-2 rounded-lg bg-black/50 border border-slate-700 text-xs text-[#f5ebd9] font-bold focus:outline-none"
                  />
                  <input
                    type="text"
                    value={char.profession}
                    onChange={(e) => handleCharChange(idx, 'profession', e.target.value)}
                    placeholder={isEn ? 'Profession / Role' : 'المهنة / الصفة'}
                    className="w-1/2 p-2 rounded-lg bg-black/50 border border-slate-700 text-xs text-[#f5ebd9] focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  value={char.publicIdentity}
                  onChange={(e) => handleCharChange(idx, 'publicIdentity', e.target.value)}
                  placeholder={isEn ? 'Public Identity known to everyone' : 'الهوية العامة أمام الجميع'}
                  className="w-full p-2 rounded-lg bg-black/50 border border-slate-700 text-xs text-[#d4cfc7] focus:outline-none"
                />

                <input
                  type="text"
                  value={char.knowledge}
                  onChange={(e) => handleCharChange(idx, 'knowledge', e.target.value)}
                  placeholder={isEn ? 'Secret knowledge / private testimony' : 'المعلومة السرية الخاصة به فقط'}
                  className="w-full p-2 rounded-lg bg-black/50 border border-slate-700 text-xs text-[#d4cfc7] focus:outline-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleToggleGuilty(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      char.guilty
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-black/50 text-[#a39a8c] border border-slate-700'
                    }`}
                  >
                    {char.guilty ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{char.guilty ? (isEn ? 'Culprit (Guilty)' : 'القاتل (مذنب)') : (isEn ? 'Make Culprit' : 'جعله القاتل')}</span>
                  </button>

                  {characters.length > 3 && (
                    <button
                      onClick={() => handleRemoveCharacter(idx)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {characters.length < 10 && (
            <button
              onClick={handleAddCharacter}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#7a5c2b]/60 text-[#e5b35a] hover:bg-black/40 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isEn ? `Add another character (${characters.length + 1})` : `إضافة شخصية أخرى (${characters.length + 1})`}</span>
            </button>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="mt-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black text-sm sm:text-base shadow-md cursor-pointer"
        >
          {t.saveCustomCaseAndPlay}
        </button>
      </motion.div>
    </div>
  );
};
