import React from 'react';
import { motion } from 'motion/react';
import { X, Volume2, VolumeX, Clock, ShieldCheck, Sparkles, Settings } from 'lucide-react';
import { GameSettings } from '../types';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleToggleSound = () => {
    sound.playClick();
    const updated = !settings.soundEnabled;
    sound.setMuted(!updated);
    onUpdateSettings({ ...settings, soundEnabled: updated });
  };

  const handleToggleAmbient = () => {
    sound.playClick();
    const updated = !settings.ambientSound;
    if (updated) {
      sound.startAmbient();
    } else {
      sound.stopAmbient();
    }
    onUpdateSettings({ ...settings, ambientSound: updated });
  };

  const handleSetTimer = (minutes: number) => {
    sound.playClick();
    onUpdateSettings({ ...settings, timerMinutes: minutes });
  };

  const handleToggleSecretBallot = () => {
    sound.playClick();
    onUpdateSettings({ ...settings, secretBallotMode: !settings.secretBallotMode });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.9)] flex flex-col gap-4 text-right"
      >
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-black/60 border border-[#c8923a]/60 flex items-center justify-center text-[#f3cb79]">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black font-['Cairo'] text-[#f5ebd9]">إعدادات اللعبة</h3>
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

        {/* Setting options */}
        <div className="flex flex-col gap-3 font-['Cairo']">
          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
            <div className="text-right">
              <span className="text-sm sm:text-base font-black text-[#f5ebd9] block">المؤثرات الصوتية</span>
              <span className="text-xs text-[#a39a8c]">أصوات الكشف، الختم، والتصويت</span>
            </div>
            <button
              onClick={handleToggleSound}
              className={`w-13 h-7 rounded-full transition-colors relative cursor-pointer border border-[#c8923a]/40 ${
                settings.soundEnabled ? 'bg-[#c8923a]' : 'bg-black/60'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform absolute top-0.5 ${
                  settings.soundEnabled ? 'left-1' : 'left-6'
                }`}
              />
            </button>
          </div>

          {/* Ambient Music */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
            <div className="text-right">
              <span className="text-sm sm:text-base font-black text-[#f5ebd9] block">موسيقى الغموض الحية</span>
              <span className="text-xs text-[#a39a8c]">أجواء سينمائية غامضة أثناء اللعب</span>
            </div>
            <button
              onClick={handleToggleAmbient}
              className={`w-13 h-7 rounded-full transition-colors relative cursor-pointer border border-[#c8923a]/40 ${
                settings.ambientSound ? 'bg-[#c8923a]' : 'bg-black/60'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform absolute top-0.5 ${
                  settings.ambientSound ? 'left-1' : 'left-6'
                }`}
              />
            </button>
          </div>

          {/* Timer per round */}
          <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-black text-[#f5ebd9]">مؤقت جولة النقاش</span>
              <span className="text-xs text-[#f3cb79] font-black">{settings.timerMinutes} دقائق</span>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[2, 3, 5, 8].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSetTimer(mins)}
                  className={`py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    settings.timerMinutes === mins
                      ? 'bg-[#c8923a] text-slate-950 shadow-md'
                      : 'bg-black/60 text-[#d4cfc7] border border-[#7a5c2b]/40 hover:border-[#c8923a]'
                  }`}
                >
                  {mins} د
                </button>
              ))}
            </div>
          </div>

          {/* Secret ballot mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
            <div className="text-right">
              <span className="text-sm sm:text-base font-black text-[#f5ebd9] block">نمط الاقتراع السري</span>
              <span className="text-xs text-[#a39a8c]">إخفاء هوية المصوتين أثناء فرز الأصوات</span>
            </div>
            <button
              onClick={handleToggleSecretBallot}
              className={`w-13 h-7 rounded-full transition-colors relative cursor-pointer border border-[#c8923a]/40 ${
                settings.secretBallotMode ? 'bg-[#c8923a]' : 'bg-black/60'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform absolute top-0.5 ${
                  settings.secretBallotMode ? 'left-1' : 'left-6'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save/Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="mt-1 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black font-['Cairo'] text-sm sm:text-base shadow-md cursor-pointer"
        >
          حفظ وإغلاق
        </button>
      </motion.div>
    </div>
  );
};
