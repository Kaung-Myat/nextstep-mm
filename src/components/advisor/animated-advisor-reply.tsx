"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AdvisorMarkdown } from "@/components/advisor/advisor-markdown";
import { sanitizeAdvisorReply } from "@/lib/advisor/sanitize-reply";

function splitWords(text: string) {
  return text.match(/\S+\s*/g) ?? [text];
}

/** Keep typing snappy: batch words and skip heavy markdown until finished. */
const BATCH = 6;
const TICK_MS = 28;
const MAX_ANIMATED_WORDS = 160;

export function AnimatedAdvisorReply({
  content,
  animate,
  onComplete,
}: {
  content: string;
  animate: boolean;
  onComplete?: () => void;
}) {
  const clean = useMemo(() => sanitizeAdvisorReply(content), [content]);
  const words = useMemo(() => splitWords(clean), [clean]);
  const shouldAnimate = animate && words.length <= MAX_ANIMATED_WORDS;
  const [count, setCount] = useState(shouldAnimate ? 0 : words.length);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(words.length);
      if (animate) onCompleteRef.current?.();
      return;
    }

    setCount(0);
    let index = 0;
    let timer = 0;

    const tick = () => {
      index = Math.min(words.length, index + BATCH);
      setCount(index);
      if (index >= words.length) {
        onCompleteRef.current?.();
        return;
      }
      timer = window.setTimeout(tick, TICK_MS);
    };

    timer = window.setTimeout(tick, TICK_MS);
    return () => window.clearTimeout(timer);
  }, [shouldAnimate, animate, clean, words]);

  const done = count >= words.length;
  const visible = words.slice(0, count).join("");

  // Plain text while typing — avoids re-parsing markdown hundreds of times.
  if (!done) {
    return (
      <div className="relative text-[15px] leading-7 text-[color:var(--color-text)]">
        <span className="whitespace-pre-wrap">{visible}</span>
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] animate-pulse bg-[color:var(--color-accent)] align-baseline"
        />
      </div>
    );
  }

  return <AdvisorMarkdown content={clean} />;
}
