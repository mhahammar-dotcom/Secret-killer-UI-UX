import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Star, Heart, MessageSquare, Sparkles, Send } from 'lucide-react';
import { sound } from '../utils/audio';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    sound.playVoteConfirm();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.9)] flex flex-col items-center text-center gap-4 font-['Cairo']"
      >
        <div className="flex items-center justify-between w-full border-b border-amber-900/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <h3 className="text-lg font-black text-[#f5ebd9]">تقييم اللعبة</h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-[#e5b35a] border border-[#c8923a]/50 flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!submitted ? (
          <>
            <p className="text-xs sm:text-sm text-[#d4cfc7] leading-relaxed">
              رأيك يهمنا لتطوير المزيد من القضايا والألغاز الغامضة! كيف كانت تجربتك؟
            </p>

            {/* Stars */}
            <div className="flex items-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    sound.playClick();
                    setRating(star);
                  }}
                  className="p-1 cursor-pointer transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'text-[#f3cb79] fill-[#f3cb79] drop-shadow-[0_0_8px_rgba(243,203,121,0.6)]'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="اكتب ملاحظاتك أو اقتراحاتك لقضايا جديدة..."
              rows={3}
              className="w-full p-3 rounded-2xl bg-black/40 border border-[#7a5c2b]/50 text-[#f5ebd9] text-xs focus:outline-none focus:border-[#c8923a] text-right"
            />

            <button
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>إرسال التقييم</span>
            </button>
          </>
        ) : (
          <div className="py-6 flex flex-col items-center gap-2">
            <Heart className="w-12 h-12 text-red-500 fill-red-500 animate-bounce" />
            <h4 className="text-lg font-black text-[#f3cb79]">شكراً جزيلاً لدعمك!</h4>
            <p className="text-xs text-[#a39a8c]">تم حفظ تقييمك بنجاح وسنعمل على تطوير المزيد.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
