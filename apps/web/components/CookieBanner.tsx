'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cookie-consent';

const text = {
  vi: {
    message: 'Chúng tôi sử dụng cookie để cải thiện trải nghiệm của bạn.',
    learnMore: 'Tìm hiểu thêm',
    accept: 'Chấp nhận',
    reject: 'Từ chối',
  },
  en: {
    message: 'We use cookies to improve your experience.',
    learnMore: 'Learn more',
    accept: 'Accept',
    reject: 'Decline',
  },
} as const;

/**
 * Cookie consent banner — fixed bottom, persists choice in localStorage.
 */
export function CookieBanner({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(false);
  const t = locale === 'vi' ? text.vi : text.en;

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleChoice = (choice: 'accepted' | 'rejected') => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg animate-[slideUp_0.3s_ease-out] rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-auto sm:p-5"
    >
      <p className="text-sm text-slate-600 leading-relaxed">
        {t.message}{' '}
        <a
          href={`/${locale}/cookies`}
          className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-700"
        >
          {t.learnMore}
        </a>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => handleChoice('accepted')}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          {t.accept}
        </button>
        <button
          onClick={() => handleChoice('rejected')}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          {t.reject}
        </button>
      </div>
    </div>
  );
}
