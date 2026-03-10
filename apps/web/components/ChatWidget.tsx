'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePathname } from 'next/navigation';

type Message = { role: 'user' | 'bot'; text: string; streaming?: boolean };

const API_BASE =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_BASE_URL || 'https://koola.vn/api'
    : '';

function getTimeGreeting(lang: 'vi' | 'en') {
  const h = new Date().getHours();
  if (lang === 'vi') {
    if (h < 12) return 'Chào buổi sáng! ☀️';
    if (h < 18) return 'Chào buổi chiều! 🌤️';
    return 'Chào buổi tối! 🌙';
  }
  if (h < 12) return 'Good morning! ☀️';
  if (h < 18) return 'Good afternoon! 🌤️';
  return 'Good evening! 🌙';
}

function getGreeting(lang: 'vi' | 'en') {
  const time = getTimeGreeting(lang);
  return lang === 'vi'
    ? `${time} Tôi là trợ lý AI của KOOLA. Bạn cần hỗ trợ gì không?`
    : `${time} I'm KOOLA's AI assistant. How can I help you?`;
}

const SUGGESTIONS = {
  vi: ['Dịch vụ của KOOLA', 'Tuyển dụng', 'Liên hệ tư vấn'],
  en: ['KOOLA services', 'Career opportunities', 'Get in touch'],
};

export function ChatWidget({ locale }: { locale: string }) {
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [greetingVisible, setGreetingVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const lang = locale === 'vi' ? 'vi' : 'en';

  if (pathname.startsWith('/admin')) return null;

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Show popup bubble after 3s if chat not opened
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (popupDismissed || open) return;
    const t = setTimeout(() => setPopupVisible(true), 3000);
    return () => clearTimeout(t);
  }, [open, popupDismissed]);

  // Hide popup when chat opens
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open) setPopupVisible(false);
  }, [open]);

  // Animate greeting when panel opens
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open && messages.length === 0) {
      setGreetingVisible(false);
      const t = setTimeout(() => setGreetingVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Focus input when panel opens
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    setInput('');
    const userMsg: Message = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const history = messages.slice(-10).map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('model' as const),
      text: m.text,
    }));

    setMessages((prev) => [...prev, { role: 'bot', text: '', streaming: true }]);

    try {
      const res = await fetch(`${API_BASE}/v1/chat`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text, locale, history }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error('No response body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            if (!data) continue;
            try {
              const parsed = JSON.parse(data);
              if (typeof parsed === 'string' && parsed) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last?.streaming) last.text += parsed;
                  return updated;
                });
              }
            } catch { /* skip malformed */ }
          }
          if (line.startsWith('event: done')) {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last?.streaming) last.streaming = false;
              return updated;
            });
          }
          if (line.startsWith('event: error')) {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last?.streaming) {
                last.text =
                  locale === 'vi'
                    ? 'Đã xảy ra lỗi. Vui lòng thử lại.'
                    : 'Something went wrong. Please try again.';
                last.streaming = false;
              }
              return updated;
            });
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.streaming) {
          last.text =
            locale === 'vi'
              ? 'Đã xảy ra lỗi. Vui lòng thử lại.'
              : 'Something went wrong. Please try again.';
          last.streaming = false;
        }
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, locale]);

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-40 right-4 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
          {/* Header */}
          <div className="flex items-center gap-3 rounded-t-2xl bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-3 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight">KOOLA Assistant</p>
              <p className="text-xs leading-tight opacity-75">
                {lang === 'vi' ? 'Thường trả lời ngay' : 'Usually replies instantly'}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 transition-colors hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4">
            <div className="space-y-3">
              {/* Greeting (always visible as first bot message) */}
              {!hasMessages && (
                <div
                  className={`flex items-end gap-2 transition-all duration-500 ${
                    greetingVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-2 opacity-0'
                  }`}
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm text-gray-700 shadow-sm ring-1 ring-black/5">
                    {getGreeting(lang)}
                  </div>
                </div>
              )}

              {/* Suggestion chips */}
              {!hasMessages && greetingVisible && (
                <div
                  className="flex flex-wrap gap-2 pl-8 transition-all delay-300 duration-500"
                  style={{ opacity: greetingVisible ? 1 : 0 }}
                >
                  {SUGGESTIONS[lang].map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-600 shadow-sm transition-colors hover:bg-brand-50 hover:border-brand-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Message list */}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-end gap-2'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] text-sm ${
                      msg.role === 'user'
                        ? 'rounded-2xl rounded-br-md bg-brand-600 px-3.5 py-2.5 text-white'
                        : 'rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-gray-700 shadow-sm ring-1 ring-black/5'
                    }`}
                  >
                    {msg.role === 'bot' ? (
                      msg.text || msg.streaming ? (
                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text + (msg.streaming ? '▋' : '')}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <TypingIndicator />
                      )
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t bg-white p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={
                  lang === 'vi' ? 'Nhập tin nhắn...' : 'Type a message...'
                }
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-all hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup greeting bubble — positioned to the left of the chat button */}
      {popupVisible && !open && (
        <div className="fixed bottom-[6.5rem] right-20 z-50 animate-in fade-in slide-in-from-right-2 duration-300">
          <div
            className="relative max-w-[260px] cursor-pointer rounded-2xl bg-white px-4 py-3 text-sm text-gray-700 shadow-lg ring-1 ring-black/10"
            onClick={() => { setPopupVisible(false); setPopupDismissed(true); setOpen(true); }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setPopupVisible(false); setPopupDismissed(true); }}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500 shadow-sm transition-colors hover:bg-gray-300"
              aria-label="Dismiss"
            >
              <X className="h-3 w-3" />
            </button>
            {getTimeGreeting(lang)} {lang === 'vi' ? 'Bạn cần hỗ trợ gì không?' : 'Need any help?'}
            {/* Triangle pointer pointing right toward the chat button */}
            <div className="absolute right-[-6px] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-white ring-1 ring-black/10" style={{ clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)' }} />
          </div>
        </div>
      )}

      {/* Floating Bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30 transition-transform hover:scale-105"
        aria-label={lang === 'vi' ? 'Mở trợ lý AI' : 'Open AI assistant'}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <span
              className="absolute inset-0 animate-ping rounded-full bg-brand-400/40"
              style={{ animationDuration: '3s' }}
            />
            <MessageCircle className="relative z-10 h-6 w-6" />
          </>
        )}
      </button>
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
    </div>
  );
}
