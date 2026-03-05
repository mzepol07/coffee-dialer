"use client";

import { useEffect } from "react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(26, 15, 7, 0.7)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 md:p-8"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          boxShadow: "0 20px 60px rgba(26, 15, 7, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-opacity-10"
          style={{ color: "var(--subtle)" }}
          aria-label="Close modal"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal content */}
        <div className="pr-8">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "var(--espresso)",
            }}
          >
            Feedback & Resources
          </h2>

          <div className="space-y-6">
            {/* Disclaimer */}
            <div
              className="p-4 rounded-lg border-l-4"
              style={{
                background: "var(--parchment)",
                borderColor: "var(--caramel)",
              }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--espresso)" }}
              >
                This is and will always be an <strong>open-source project</strong> made
                for coffee enthusiasts. Your feedback helps improve the app for everyone.
                All contributions are reviewed at the discretion of the maintainers.
              </p>
            </div>

            {/* What we're looking for */}
            <div>
              <h3
                className="text-xs uppercase mb-3 font-medium"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.12em",
                  color: "var(--caramel)",
                }}
              >
                We Welcome Feedback On
              </h3>
              <ul
                className="space-y-2 text-sm"
                style={{ color: "var(--espresso)" }}
              >
                <li className="flex items-start gap-2">
                  <span style={{ color: "var(--caramel)" }}>•</span>
                  <span>Recipe templates and brewing techniques</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "var(--caramel)" }}>•</span>
                  <span>Grind setting ranges and adjustments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "var(--caramel)" }}>•</span>
                  <span>Equipment additions (grinders, brewers, filters)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "var(--caramel)" }}>•</span>
                  <span>Coffee processing and roast adjustments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "var(--caramel)" }}>•</span>
                  <span>User experience and interface improvements</span>
                </li>
              </ul>
            </div>

            {/* Contribution methods */}
            <div>
              <h3
                className="text-xs uppercase mb-3 font-medium"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.12em",
                  color: "var(--caramel)",
                }}
              >
                How to Contribute
              </h3>

              <div className="space-y-3">
                {/* For developers */}
                <div
                  className="p-4 rounded-xl border"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-lg">💻</span>
                    <div>
                      <h4
                        className="font-semibold text-sm mb-1"
                        style={{ color: "var(--espresso)" }}
                      >
                        For Developers & Technical Users
                      </h4>
                      <p
                        className="text-sm mb-3"
                        style={{ color: "var(--espresso)" }}
                      >
                        Submit issues or pull requests directly on GitHub
                      </p>
                      <a
                        href="https://github.com/mzepol07/coffee-dialer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                        style={{ color: "var(--caramel)" }}
                      >
                        <span>View on GitHub</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* For everyone */}
                <div
                  className="p-4 rounded-xl border"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-lg">☕</span>
                    <div>
                      <h4
                        className="font-semibold text-sm mb-1"
                        style={{ color: "var(--espresso)" }}
                      >
                        For Coffee Enthusiasts
                      </h4>
                      <p
                        className="text-sm mb-3"
                        style={{ color: "var(--espresso)" }}
                      >
                        Share structured feedback via our Google Doc
                      </p>
                      <a
                        href="https://forms.gle/oSocc5FFA7pqBtD76"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                        style={{ color: "var(--caramel)" }}
                      >
                        <span>Recipe Feedback</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                      <br />
                      <a
                        href="https://forms.gle/jc6iBfnUw8nKd1BJA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                        style={{ color: "var(--caramel)" }}
                      >
                        <span>Grinder Setting Suggestions</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                      <br />
                      <a
                        href="https://forms.gle/17X5wSE3BCsWKLGX6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                        style={{ color: "var(--caramel)" }}
                      >
                        <span>Open Feedback Doc</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional resource */}
            <div>
              <h3
                className="text-xs uppercase mb-3 font-medium"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.12em",
                  color: "var(--caramel)",
                }}
              >
                Helpful Resources
              </h3>

              <div
                className="p-4 rounded-xl border"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">📊</span>
                  <div>
                    <h4
                      className="font-semibold text-sm mb-1"
                      style={{ color: "var(--espresso)" }}
                    >
                      Grind Size Chart Reference
                    </h4>
                    <p
                      className="text-sm mb-3"
                      style={{ color: "var(--espresso)" }}
                    >
                      Comprehensive guide to grind settings across many popular grinders
                    </p>
                    <a
                      href="https://honestcoffeeguide.com/coffee-grind-size-chart/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                      style={{ color: "var(--caramel)" }}
                    >
                      <span>View Grind Chart</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
