"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
  children?: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If not enough space below, show above
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  }, [isVisible]);

  return (
    <span className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={(e) => {
          // Don't close if focus moved to tooltip content
          if (!tooltipRef.current?.contains(e.relatedTarget as Node)) {
            setIsVisible(false);
          }
        }}
        className="inline-flex items-center justify-center w-4 h-4 ml-1 rounded-full text-xs transition-colors"
        style={{
          color: "var(--caramel)",
          background: "transparent",
          border: "1px solid var(--caramel)",
          cursor: "help",
          verticalAlign: "middle",
        }}
        aria-label="More information"
        aria-expanded={isVisible}
      >
        ⓘ
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className="absolute z-50 p-3 rounded-lg border shadow-lg text-xs leading-relaxed"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--espresso)",
            width: "280px",
            maxWidth: "90vw",
            ...(position === "bottom"
              ? { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" }
              : { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" }),
            boxShadow: "0 4px 20px rgba(26, 15, 7, 0.15)",
          }}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          {/* Arrow */}
          <div
            className="absolute"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              ...(position === "bottom"
                ? {
                    top: "-4px",
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderBottom: "6px solid var(--border)",
                  }
                : {
                    bottom: "-4px",
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid var(--border)",
                  }),
            }}
          />
          {content}
        </div>
      )}
    </span>
  );
}
