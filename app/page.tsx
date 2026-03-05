"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { grinders, brewers, filters, getFiltersForBrewer } from "@/catalog";
import type { Processing, Roast, Goal } from "@/catalog";
import FeedbackModal from "./components/FeedbackModal";
import Tooltip from "./components/Tooltip";
import { processingTooltip, roastTooltip, altitudeTooltip, originTooltip } from "@/content/tooltips";

export default function Home() {
  const router = useRouter();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [grinderId, setGrinderId] = useState(grinders[0].id);
  const [brewerId, setBrewerId] = useState<string>("auto");
  const [filterId, setFilterId] = useState("");
  const [processing, setProcessing] = useState<Processing>("washed");
  const [roast, setRoast] = useState<Roast>("medium_light");
  const [goal, setGoal] = useState<Goal>("clarity");
  const [doseG, setDoseG] = useState(15);
  const [altitudeFt, setAltitudeFt] = useState("");
  const [originCountry, setOriginCountry] = useState("");

  // Set default filter when brewer changes
  useEffect(() => {
    if (brewerId === "auto") {
      // Default to v60_plastic filters
      const availableFilters = getFiltersForBrewer("v60_plastic");
      if (availableFilters.length > 0) {
        setFilterId(availableFilters[0].id);
      }
    } else {
      const availableFilters = getFiltersForBrewer(brewerId);
      if (availableFilters.length > 0) {
        setFilterId(availableFilters[0].id);
      }
    }
  }, [brewerId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams({
      grinder: grinderId,
      brewer: brewerId,
      filter: filterId,
      processing,
      roast,
      goal,
      dose: doseG.toString(),
    });

    if (altitudeFt) params.set("altitude", altitudeFt);
    if (originCountry) params.set("origin", originCountry);

    router.push(`/recipe?${params.toString()}`);
  };

  const grinderTypes = Array.from(new Set(grinders.map((g) => g.grinder_type)));

  const availableFilters = brewerId === "auto"
    ? getFiltersForBrewer("v60_plastic")
    : getFiltersForBrewer(brewerId);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-6">
          <div className="text-xs uppercase mb-3" style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", color: "var(--caramel)" }}>
            Pour-Over Coffee
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "var(--espresso)", letterSpacing: "-0.02em" }}>
            Recipe Finder
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: "var(--subtle)", lineHeight: "1.75" }}>
            Get a personalized pour-over recipe based on your equipment and beans
          </p>
          <div className="mt-6 text-center text-xs space-y-2" style={{ color: "var(--subtle)" }}>
            <p>
              <button
                onClick={() => setShowFeedbackModal(true)}
                style={{ color: "var(--caramel)", textDecoration: "none", background: "none", border: "none", cursor: "pointer" }}
                className="hover:underline font-medium"
              >
                Feedback & Resources
              </button>
            </p>
          </div>  
        </div>

        <form onSubmit={handleSubmit} className="fade-in">
          {/* Equipment Section */}
          <div className="form-section">
            <h2 className="section-label">
              ⚙️ Equipment
            </h2>
            <p className="section-description">
              Select your grinder, brewer, and filter
            </p>

            <div className="form-field">
              <label className="form-label">Grinder</label>
              <select
                value={grinderId}
                onChange={(e) => setGrinderId(e.target.value)}
                className="form-select"
              >
                {grinderTypes.map((type) => (
                  <optgroup
                    key={type}
                    label={type === "manual" ? "Manual Grinders" : "Electric Grinders"}
                  >
                    {grinders
                      .filter((g) => g.grinder_type === type)
                      .map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Brewer</label>
              <select
                value={brewerId}
                onChange={(e) => setBrewerId(e.target.value)}
                className="form-select"
              >
                <option value="auto">Auto</option>
                {brewers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Filter</label>
              <select
                value={filterId}
                onChange={(e) => setFilterId(e.target.value)}
                className="form-select"
                disabled={availableFilters.length === 0}
              >
                {availableFilters.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Coffee Characteristics Section */}
          <div className="form-section">
            <h2 className="section-label">
              ☕ Coffee Characteristics
            </h2>
            <p className="section-description">
              Describe your coffee beans
            </p>

            <div className="form-field">
              <label className="form-label">
                Processing Method
                <Tooltip content={processingTooltip} />
              </label>
              <select
                value={processing}
                onChange={(e) => setProcessing(e.target.value as Processing)}
                className="form-select"
              >
                <option value="washed">Washed</option>
                <option value="honey">Honey</option>
                <option value="pulped_natural">Pulped Natural</option>
                <option value="natural_anaerobic">Natural/Anaerobic</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">
                Roast Level
                <Tooltip content={roastTooltip} />
              </label>
              <select
                value={roast}
                onChange={(e) => setRoast(e.target.value as Roast)}
                className="form-select"
              >
                <option value="light">Light</option>
                <option value="medium_light">Medium-Light</option>
                <option value="medium">Medium</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">
                Altitude (feet, optional)
                <Tooltip content={altitudeTooltip} />
              </label>
              <input
                type="number"
                value={altitudeFt}
                onChange={(e) => setAltitudeFt(e.target.value)}
                placeholder="e.g., 6000"
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                Origin Country (optional)
                <Tooltip content={originTooltip} />
              </label>
              <input
                type="text"
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                placeholder="e.g., Ethiopia"
                className="form-input"
              />
            </div>
          </div>

          {/* Output Parameters Section */}
          <div className="form-section">
            <h2 className="section-label">
              🎯 Brewing Parameters
            </h2>
            <p className="section-description">
              Set your brewing goal and dose
            </p>

            <div className="form-field">
              <label className="form-label">Brewing Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as Goal)}
                className="form-select"
              >
                <option value="clarity">Clarity</option>
                <option value="balanced">Balanced</option>
                <option value="sweet">Sweet</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Dose (grams)</label>
              <select
                value={doseG}
                onChange={(e) => setDoseG(Number(e.target.value))}
                className="form-select"
              >
                <option value={15}>15g</option>
                <option value={20}>20g</option>
                <option value={30}>30g (Chemex)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Generate Recipe
          </button>
        </form>

        <div className="mt-8 text-center text-xs space-y-2" style={{ color: "var(--subtle)" }}>
          <p>
            <button
              onClick={() => setShowFeedbackModal(true)}
              style={{ color: "var(--caramel)", textDecoration: "none", background: "none", border: "none", cursor: "pointer" }}
              className="hover:underline font-medium"
            >
              Feedback & Resources
            </button>
          </p>
          <p>Open source on <a href="https://github.com/mzepol07/coffee-dialer" style={{ color: "var(--caramel)", textDecoration: "none" }} className="hover:underline">GitHub</a></p>
        </div>

        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
        />
      </div>
    </main>
  );
}
