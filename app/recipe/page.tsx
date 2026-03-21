"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import { getGrinderById, getBrewerById, getFilterById } from "@/catalog";
import type { Processing, Roast, Goal } from "@/catalog";
import { generateRecommendation } from "@/engine";
import type { Context } from "@/engine";
import FeedbackModal from "../components/FeedbackModal";

function RecipeContent() {
  const searchParams = useSearchParams();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const grinderId = searchParams.get("grinder") || "k_ultra";
  const brewerId = searchParams.get("brewer") || "auto";
  const filterId = searchParams.get("filter") || "hario_white";
  const processing = (searchParams.get("processing") || "washed") as Processing;
  const roast = (searchParams.get("roast") || "medium_light") as Roast;
  const goal = (searchParams.get("goal") || "clarity") as Goal;
  const doseG = Number(searchParams.get("dose") || "15");
  const altitudeFt = searchParams.get("altitude") ? Number(searchParams.get("altitude")) : undefined;
  const originCountry = searchParams.get("origin") || undefined;
  const isBlend = searchParams.get("isBlend") === "true";

  const grinder = getGrinderById(grinderId);
  const initialBrewer = brewerId === "auto" ? getBrewerById("v60_plastic") : getBrewerById(brewerId);
  const filter = getFilterById(filterId);

  if (!grinder || !initialBrewer || !filter) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Invalid parameters. Please go back and try again.</p>
        <Link href="/" className="text-amber-600 hover:underline mt-4 inline-block">
          Back to home
        </Link>
      </div>
    );
  }

  const context: Context = {
    coffee: {
      processing,
      roast,
      origin_country: originCountry,
      altitude_ft: altitudeFt,
      goal,
      is_blend: isBlend,
    },
    brew: {
      grinder,
      brewer: initialBrewer,
      filter,
      dose_g: doseG,
    },
  };

  const recommendation = generateRecommendation(context, brewerId);
  const { spec, grind_setting, grind_zone, reasons, brewer: finalBrewer, summary } = recommendation;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <main className="min-h-screen p-4 md:p-8 fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm transition-colors" style={{ color: "var(--subtle)", textDecoration: "none" }}>
            <span>←</span>
            <span className="hover:underline">Back to form</span>
          </Link>
        </div>

        <div className="recipe-card">
          <h1 className="recipe-header">
            Your Pour-Over Recipe
          </h1>
          <p className="recipe-subheader">
            {finalBrewer.name} • {filter.name} • {grinder.name}
          </p>

          {/* Summary */}
          <div className="summary-box">
            <p className="summary-text">
              {summary}
            </p>
          </div>

          {/* Recipe Overview */}
          <div className="recipe-overview-grid">
            <div className="recipe-overview-item">
              <div className="recipe-overview-item-label">Dose</div>
              <div className="recipe-overview-item-value">{spec.dose_g}g</div>
            </div>
            <div className="recipe-overview-item">
              <div className="recipe-overview-item-label">Water</div>
              <div className="recipe-overview-item-value">{spec.water_g}g</div>
            </div>
            <div className="recipe-overview-item">
              <div className="recipe-overview-item-label">Ratio</div>
              <div className="recipe-overview-item-value">1:{spec.ratio.toFixed(1)}</div>
            </div>
            <div className="recipe-overview-item">
              <div className="recipe-overview-item-label">Temp</div>
              <div className="recipe-overview-item-value">{Math.round(spec.temp_f)}°F ({Math.round((spec.temp_f - 32) * 5 / 9)}°C)</div>
            </div>
          </div>

          {/* Grind Setting */}
          <div className="grind-setting-box">
            <h2 className="grind-setting-title">
              Grind Setting
            </h2>
            <span className={`zone-badge zone-${grind_zone}`}>
              {grind_zone}
            </span>
            <p className="grind-setting-value">
              {grind_setting}
            </p>
            <p className="grind-setting-zone">
              on {grinder.name}
            </p>
            <div className="grind-setting-tips">
              <div className="hint">If sour or thin → grind finer</div>
              <div className="hint">If bitter or muddy → grind coarser</div>
            </div>
          </div>

          {/* Pour Plan */}
          <div className="pour-plan-section">
            <h2 className="pour-plan-title">
              Pour Plan
            </h2>
            <div className="pour-plan-card">
              {spec.pour_plan.map((step, index) => (
                <div key={index} className="pour-step">
                  <div className="step-time">
                    {formatTime(step.start_s)}
                    {step.end_s && `–${formatTime(step.end_s)}`}
                  </div>
                  <div>
                    <div className="step-label">
                      {index + 1}. {step.label}
                    </div>
                    {step.notes && (
                      <div className="step-note">{step.notes}</div>
                    )}
                  </div>
                  <div className="step-weight">
                    {step.water_g > 0 ? `${step.water_g}g` : "—"}
                  </div>
                </div>
              ))}
              <div className="target-time-box">
                <p className="text-sm" style={{ color: "var(--espresso)" }}>
                  <span className="font-semibold">Target finish:</span>{" "}
                  {formatTime(spec.target_time_s_min)}–{formatTime(spec.target_time_s_max)}
                </p>
              </div>
            </div>
          </div>

          {/* Why These Settings */}
          <div className="reasons-section">
            <h2 className="reasons-title">
              Why These Settings?
            </h2>
            <div className="reasons-card">
              <div className="reasons-list">
                {reasons.map((reason, index) => (
                  <div key={index} className="reason">
                    <span className="reason-emoji">
                      {index === 0 ? "☕" : index === 1 ? "🌡️" : index === 2 ? "⚖️" : index === 3 ? "📄" : "⚙️"}
                    </span>
                    <div className="reason-text">
                      <strong>{reason.factor}:</strong> {reason.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Share */}
          <div className="share-section">
            <p className="share-label">Share this recipe:</p>
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="share-input"
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center text-xs" style={{ color: "var(--subtle)" }}>
          <button
            onClick={() => setShowFeedbackModal(true)}
            style={{ color: "var(--caramel)", textDecoration: "none", background: "none", border: "none", cursor: "pointer" }}
            className="hover:underline font-medium"
          >
            Feedback & Resources
          </button>
        </div>

        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
        />
      </div>
    </main>
  );
}

export default function RecipePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading recipe...</div>
      </div>
    }>
      <RecipeContent />
    </Suspense>
  );
}
