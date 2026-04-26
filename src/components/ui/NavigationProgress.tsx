"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Start progress
    setVisible(true);
    setProgress(0);

    // Clear any existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 85;
        }
        return prev + 15;
      });
    }, 100);

    // Complete after 500ms
    const completeTimer = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);

      // Fade out after 300ms
      const hideTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);

      return () => clearTimeout(hideTimer);
    }, 500);

    return () => {
      clearTimeout(completeTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pathname]);

  return (
    <div
      className="fixed top-0 left-0 z-50 h-[2px] bg-purple-500 transition-all duration-200"
      style={{
        width: `${progress}%`,
        opacity: visible ? 1 : 0,
        transition: "width 200ms ease, opacity 300ms ease",
      }}
      aria-hidden="true"
    />
  );
}
