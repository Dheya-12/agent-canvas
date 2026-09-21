import { useEffect, useState } from 'react';

/**
 * A live clock for navbars that show one.
 *
 * Ticks once a minute, aligned to the minute boundary rather than drifting
 * on a 60s interval, and renders nothing until mounted so server and client
 * markup agree. An invalid time zone falls back to UTC instead of throwing,
 * since the zone arrives as generated content.
 */
export function useClock(timeZone?: string): string {
  const [text, setText] = useState('');

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const zone = (() => {
      if (!timeZone) return 'UTC';
      try {
        new Intl.DateTimeFormat('en-GB', { timeZone }).format(new Date());
        return timeZone;
      } catch {
        return 'UTC';
      }
    })();

    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: zone, hour: '2-digit', minute: '2-digit', hour12: false,
    });

    const tick = () => {
      if (cancelled) return;
      const now = new Date();
      setText(fmt.format(now));
      // Align to the next minute boundary so the display never lags.
      const msToNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
      timer = setTimeout(tick, msToNextMinute + 50);
    };
    tick();

    return () => { cancelled = true; clearTimeout(timer); };
  }, [timeZone]);

  return text;
}
