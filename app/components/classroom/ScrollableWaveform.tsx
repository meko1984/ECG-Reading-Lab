'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './Classroom.module.css';

function SwipePictogram() {
  return <svg className={styles.swipeIcon} viewBox="0 0 54 24" aria-hidden="true">
    <path d="M3 8h19M3 8l5-5M3 8l5 5M51 8H32M51 8l-5-5M51 8l-5 5" />
    <path d="M25 21v-9.5a2 2 0 0 1 4 0V16m0-5.5a2 2 0 0 1 4 0V16m0-4a2 2 0 0 1 4 0v5.2c0 2.5-2 4.5-4.5 4.5H29c-3 0-5.5-2.2-6-5.1l-.6-2.9a1.8 1.8 0 0 1 3.4-1.1L27 15" />
  </svg>;
}

export function ScrollableWaveform({ children, className, ariaLabel }: { children: ReactNode; className: string; ariaLabel: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const element = scroller.current;
    if (!element) return;
    const update = () => setShowHint((visible) => element.scrollWidth > element.clientWidth + 2 && (visible || element.scrollLeft < 4));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, [children]);

  return <div className={styles.scrollFrame}>
    <div ref={scroller} className={className} tabIndex={0} role="region" aria-label={ariaLabel} onScroll={(event) => {
      if (Math.abs(event.currentTarget.scrollLeft) > 4) setShowHint(false);
    }}>{children}</div>
    {showHint && <div className={styles.scrollHint} aria-hidden="true"><SwipePictogram/><strong>左右にスライド</strong></div>}
  </div>;
}
