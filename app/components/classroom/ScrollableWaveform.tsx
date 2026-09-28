'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './Classroom.module.css';

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
    {showHint && <div className={styles.scrollHint} aria-hidden="true"><span>↔</span><strong>左右にスライド</strong><span>☝</span></div>}
  </div>;
}
