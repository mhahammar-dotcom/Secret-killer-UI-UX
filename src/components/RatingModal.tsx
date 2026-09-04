import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Heart, Send, Share2, Check, Sparkles, AlertCircle, MessageSquare } from 'lucide-react';
import { sound } from '../utils/audio';
import { submitRatingToFirestore } from '../services/ratingService';

// Once the game is published to the Google Play Store, paste your store URL here:
export const GOOGLE_PLAY_STORE_URL = ''; // e.g. 'https://play.google.com/store/apps/details?id=com.secretkiller.game'

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'ar' | 'en';
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  language = 'ar'
}) => {
  const isEn = language === 'en';
  const isRtl = !isEn;

  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [feedbackCategory, setFeedbackCategory] = useState<string>('gameplay');

  if (!isOpen) return null;

  const isHighRating = rating >= 4;

  const handleShareOrReview = async () => {
    sound.playClick();
    if (GOOGLE_PLAY_STORE_URL) {
      window.open(GOOGLE_PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
      return;
    }

    // Share link or copy to clipboard
    const shareUrl = window.location.href;
    const shareText = isEn
      ? 'Play Secret Killer with me! Uncover the clues and find the killer.'
      : 'العب معي لعبة القاتل الخفي! اكشف الأدلة واعثر على القاتل.';

    if (navigator.share) {
      try {
        await navigator.share({
          title: isEn ? 'Secret Killer' : 'القاتل الخفي',
          text: shareText,
          url: shareUrl
        });
        return;
      } catch {
        // User cancelled or unsupported, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async () => {
    sound.playVoteConfirm();
    setIsSubmitting(true);

    // If constructive rating (1, 2, or 3 stars), save to Firestore
    const currentLang: 'ar' | 'en' = language === 'en' ? 'en' : 'ar';
    if (!isHighRating) {
      await submitRatingToFirestore({
        rating,
        feedback: feedback.trim(),
        category: feedbackCategory,
        appVersion: '1.0.0',
        language: currentLang
      });
    } else {
      // For high ratings, also optionally record their rating & comments if they wrote any
      if (feedback.trim().length > 0) {
        await submitRatingToFirestore({
          rating,
          feedback: feedback.trim(),
          category: 'praise',
          appVersion: '1.0.0',
          language: currentLang
        });
      }
    }

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setFeedback('');
    }, 2400);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-sm rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.95)] flex flex-col items-center text-center gap-4 font-['Cairo']"
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full border-b border-amber-900/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <h3 className="text-base sm:text-lg font-black text-[#f5ebd9]">
              {isEn ? 'Rate the Game' : 'تقييم اللعبة'}
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-[#e5b35a] border border-[#c8923a]/50 flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center gap-3.5"
            >
              <p className="text-xs sm:text-sm text-[#d4cfc7] leading-relaxed">
                {isEn
                  ? 'How has your detective experience been? Your feedback helps us build more exciting mystery cases!'
                  : 'كيف كانت تجربتك في التحقيق؟ رأيك يساعدنا على تطوير المزيد من القضايا الغامضة!'}
              </p>

              {/* Interactive Stars */}
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setRating(star);
                    }}
                    className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= rating
                          ? 'text-[#f3cb79] fill-[#f3cb79] drop-shadow-[0_0_10px_rgba(243,203,121,0.6)]'
                          : 'text-slate-700 fill-slate-900/40'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Dynamic Smart Split Branch */}
              {isHighRating ? (
                /* High Rating Branch (4 or 5 stars) */
                <div className="w-full flex flex-col items-center gap-3 bg-amber-950/20 border border-[#c8923a]/30 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1.5 text-[#f3cb79] text-xs font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isEn ? 'We are thrilled you enjoyed it!' : 'يسعدنا جداً أن التجربة أعجبتك!'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#b5aa9a] leading-tight">
                    {GOOGLE_PLAY_STORE_URL
                      ? isEn
                        ? 'Support us with a 5-star review on Google Play!'
                        : 'ادعمنا بتقييم 5 نجوم على متجر جوجل بلاي!'
                      : isEn
                      ? 'Share the game with your detective friends or leave a comment:'
                      : 'شارك اللعبة مع أصدقائك المحققين أو اترك رسالة للفريق:'}
                  </p>

                  <button
                    type="button"
                    onClick={handleShareOrReview}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#2a1c0d] hover:bg-[#3d2914] border border-[#c8923a]/60 text-[#f3cb79] text-xs font-bold cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    {GOOGLE_PLAY_STORE_URL ? (
                      <>
                        <Star className="w-4 h-4 fill-[#f3cb79]" />
                        <span>{isEn ? 'Rate on Google Play' : 'قيّم على متجر جوجل'}</span>
                      </>
                    ) : copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">{isEn ? 'Game Link Copied!' : 'تم نسخ رابط اللعبة!'}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>{isEn ? 'Share Game with Friends' : 'مشاركة اللعبة مع الأصدقاء'}</span>
                      </>
                    )}
                  </button>

                  {/* Optional message for positive reviews */}
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Optional: What was your favorite mystery case?'
                        : 'اختياري: ما هي أكثر قضية استمتعت بحلها؟'
                    }
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-[#7a5c2b]/40 text-[#f5ebd9] text-xs focus:outline-none focus:border-[#c8923a]"
                  />
                </div>
              ) : (
                /* Constructive Feedback Branch (1, 2, or 3 stars) -> Firebase Firestore */
                <div className="w-full flex flex-col items-center gap-2.5 bg-red-950/15 border border-red-900/30 rounded-2xl p-3.5 text-right">
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold w-full justify-start">
                    <MessageSquare className="w-4 h-4 text-[#e5b35a]" />
                    <span>
                      {isEn
                        ? 'Help us fix what went wrong'
                        : 'ساعدنا في إصلاح ما لم ينل إعجابك'}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#b5aa9a] leading-tight w-full text-start">
                    {isEn
                      ? 'Your feedback goes directly to our development team to resolve bugs and improve game balance.'
                      : 'ملاحظاتك تصل مباشرة إلى فريق التطوير لإصلاح المشاكل وتحسين توازن اللعبة.'}
                  </p>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1.5 w-full justify-start py-0.5">
                    {[
                      { id: 'gameplay', ar: 'توازن اللعبة', en: 'Balance' },
                      { id: 'bugs', ar: 'مشكلة تقنية', en: 'Bug' },
                      { id: 'stories', ar: 'حبكة القصص', en: 'Story Plot' },
                      { id: 'clues', ar: 'صعوبة الأدلة', en: 'Clues' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFeedbackCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                          feedbackCategory === cat.id
                            ? 'bg-[#c8923a] text-slate-950'
                            : 'bg-black/40 text-[#a39a8c] border border-amber-900/30 hover:text-white'
                        }`}
                      >
                        {isEn ? cat.en : cat.ar}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Describe what you would like to see improved or any bugs encountered...'
                        : 'صف ما تود تحسينه أو أي مشكلة واجهتها بالتفصيل...'
                    }
                    rows={3}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#7a5c2b]/50 text-[#f5ebd9] text-xs focus:outline-none focus:border-[#c8923a]"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-opacity"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? isEn ? 'Sending...' : 'جارٍ الإرسال...'
                    : isEn ? 'Send Feedback' : 'إرسال التقييم'}
                </span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 flex flex-col items-center gap-2"
            >
              <Heart className="w-12 h-12 text-red-500 fill-red-500 animate-bounce" />
              <h4 className="text-lg font-black text-[#f3cb79]">
                {isEn ? 'Thank you for your support!' : 'شكراً جزيلاً لدعمك!'}
              </h4>
              <p className="text-xs text-[#a39a8c] max-w-xs">
                {isHighRating
                  ? isEn
                    ? 'Your feedback inspires us to create even more suspenseful stories.'
                    : 'دعمك يلهمنا لكتابة المزيد من القضايا المشوقة والمثيرة.'
                  : isEn
                  ? 'Your feedback has been delivered directly to the dev team.'
                  : 'تم إرسال ملاحظاتك مباشرة إلى فريق التطوير لدراستها وتطبيقها.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
