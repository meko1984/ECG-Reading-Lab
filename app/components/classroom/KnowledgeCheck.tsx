'use client';

import { useState } from 'react';
import styles from './Classroom.module.css';

export function KnowledgeCheck({ question, answers, correctIndex, explanation }: { question: string; answers: string[]; correctIndex: number; explanation: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  return <section className={styles.section}>
    <h2>ひとつ確かめる</h2><p>{question}</p>
    <div className={styles.answers} role="group" aria-label={question}>{answers.map((answer, index) => <button type="button" className={styles.answer} aria-pressed={selected === index} key={answer} onClick={() => setSelected(index)}>{answer}</button>)}</div>
    <div aria-live="polite" aria-atomic="true">{selected !== null && <p className={styles.feedback}><strong>{selected === correctIndex ? 'そのとおり。' : 'もう一度、観察してみましょう。'}</strong> {explanation}</p>}</div>
  </section>;
}
