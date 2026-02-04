/**
 * Session Timer Component (Optional Enhancement)
 * 
 * Displays session expiration countdown in admin header
 * Can be added to AdminLayout if desired
 */

'use client';

import { useEffect, useState } from 'react';
import { getAccessToken, getTokenTimeRemaining, isTokenExpired, refreshAccessToken } from '@/lib/admin-auth';
import { Clock, AlertCircle } from 'lucide-react';
import { logger } from '@/lib/logger';

interface SessionTimerProps {
  locale: 'en' | 'vi';
  onSessionExpired?: () => void;
}

export function SessionTimer({ locale, onSessionExpired }: SessionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const token = getAccessToken();
      if (!token) {
        setTimeRemaining(0);
        return;
      }

      if (isTokenExpired(token)) {
        setTimeRemaining(0);
        onSessionExpired?.();
        return;
      }

      const remaining = getTokenTimeRemaining(token);
      setTimeRemaining(remaining);

      // Show warning if less than 5 minutes remaining
      setShowWarning(remaining < 300 && remaining > 0);

      // Auto-refresh if less than 2 minutes remaining
      if (remaining < 120 && remaining > 0) {
        refreshAccessToken().then(newToken => {
          if (newToken) {
            logger.debug('Token auto-refreshed by SessionTimer');
          }
        });
      }
    };

    // Update immediately
    updateTimer();

    // Update every 10 seconds
    const interval = setInterval(updateTimer, 10000);

    return () => clearInterval(interval);
  }, [onSessionExpired]);

  if (timeRemaining === 0) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getText = () => {
    if (locale === 'vi') {
      return {
        sessionExpires: 'Phiên làm việc hết hạn sau',
        sessionExpiring: 'Phiên sắp hết hạn!',
      };
    }
    return {
      sessionExpires: 'Session expires in',
      sessionExpiring: 'Session expiring soon!',
    };
  };

  const t = getText();

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
        showWarning
          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
      }`}
      title={showWarning ? t.sessionExpiring : t.sessionExpires}
    >
      {showWarning ? (
        <AlertCircle className="w-4 h-4" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
    </div>
  );
}
