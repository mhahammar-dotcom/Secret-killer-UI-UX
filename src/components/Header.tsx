import React from 'react';
import { Volume2, VolumeX, HelpCircle, Settings, Home, ChevronLeft } from 'lucide-react';
import { GameScreen } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentScreen: GameScreen;
  onNavigateHome: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigateHome,
  onOpenRules,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
  title,
  subtitle,
  onBack,
  showBack
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#07080c]/90 backdrop-blur-md border-b border-[#c8923a]/30 px-3 sm:px-6 py-2.5" dir="rtl">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {/* Left Side (RTL Start): Back or Home */}
        <div className="flex items-center gap-2">
          {showBack && onBack ? (
            <button
              onClick={() => {
                sound.playClick();
                onBack();
              }}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-md shadow-black/80"
              title="رجوع"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.4] rtl:rotate-180" />
            </button>
          ) : currentScreen !== 'home' ? (
            <button
              onClick={() => {
                sound.playClick();
                onNavigateHome();
              }}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-md shadow-black/80"
              title="الرئيسية"
            >
              <Home className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-2">
              <span className="text-xl">🕵️‍♂️</span>
              <span className="font-black text-[#f5ebd9] text-base tracking-wide font-['Cairo']">سيكرت كيلر</span>
            </div>
          )}
        </div>

        {/* Center: Stage / Screen Name */}
        {title && (
          <div className="text-center px-2">
            <h1 className="text-sm sm:text-base font-black text-[#f5ebd9] font-['Cairo'] leading-tight truncate max-w-[200px]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-[#9b988f] truncate max-w-[200px] font-['Cairo'] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Right Side: Quick Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/50 hover:border-[#e5b35a] text-[#e5b35a] transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md"
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#e5b35a]" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/50 hover:border-[#e5b35a] text-[#e5b35a] transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md"
            title="طريقة اللعب والقواعد"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/50 hover:border-[#e5b35a] text-[#e5b35a] transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md"
            title="الإعدادات"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
