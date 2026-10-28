import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
  lazy?: boolean;
  placeholderClassName?: string;
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  rootMargin = "0px 0px -12% 0px",
  threshold = 0.12,
  once = true,
  lazy = false,
  placeholderClassName = "min-h-[180px] w-full rounded-2xl bg-slate-100/60",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsVisible(true);
      return;
    }

    const mediaQuery =
      typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

    if (mediaQuery?.matches) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once, rootMargin, threshold]);

  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
  };

  if (lazy && !isVisible) {
    return <div ref={ref} className={placeholderClassName} aria-hidden="true" style={style} />;
  }

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 ease-out will-change-transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}
