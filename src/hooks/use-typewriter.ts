"use client";

import { useState, useEffect, useCallback } from "react";

interface IUseTypewriterProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  loop?: boolean;
}

export const useTypewriter = ({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
  loop = true,
}: IUseTypewriterProps) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentText = texts[textIndex] || "";

  const tick = useCallback(() => {
    if (isPaused) return;

    if (!isDeleting) {
      // 打字阶段
      if (displayText.length < currentText.length) {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      } else {
        // 打字阶段结束，暂停一会
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      // 删除阶段
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1));
      } else {
        // 删除阶段结束，切换到下一组文字
        setIsDeleting(false);
        if (loop || textIndex < texts.length - 1) {
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }
  }, [
    displayText,
    currentText,
    isDeleting,
    isPaused,
    pauseTime,
    textIndex,
    texts.length,
    loop,
  ]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(() => {
      tick();
    }, speed);

    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  return {
    displayText,
    isTyping: !isPaused && !isDeleting,
    isDeleting,
    isPaused,
  };
};
