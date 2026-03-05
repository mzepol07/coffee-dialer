import { Context, RecipeSpec, Recommendation, Reason, Explanation } from "./types";
import { getTemplateById } from "./templates";
import {
  processingAdjuster,
  roastAdjuster,
  altitudeAdjuster,
  filterAdjuster,
  grinderAdjuster,
} from "./adjusters";
import { Brewer, getBrewerById } from "@/catalog";
import { buildSummary } from "./explain";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function chooseBrewer(context: Context, userBrewerId: string): Brewer {
  // If user explicitly chose a brewer (not "auto"), respect it
  if (userBrewerId !== "auto") {
    const brewer = getBrewerById(userBrewerId);
    if (brewer) return brewer;
  }

  // Auto selection logic
  const { processing, roast, altitude_ft, goal } = context.coffee;

  // If goal=sweet AND processing=washed AND roast=light AND altitude>=6000: choose switch
  if (
    goal === "sweet" &&
    processing === "washed" &&
    roast === "light" &&
    altitude_ft !== undefined &&
    altitude_ft >= 6000
  ) {
    const switchBrewer = getBrewerById("switch");
    if (switchBrewer) return switchBrewer;
  }

  // Default to V60 plastic
  const defaultBrewer = getBrewerById("v60_plastic");
  return defaultBrewer!;
}

function getGrindZone(grindIndex: number): "fine" | "medium" | "coarse" {
  if (grindIndex < 0.75) return "fine";
  if (grindIndex <= 1.4) return "medium";
  return "coarse";
}

function getGrindSetting(grindIndex: number, grinder: any): string {
  const zone = getGrindZone(grindIndex);
  const ranges = grinder.ranges;

  switch (zone) {
    case "fine":
      return ranges.fine_range;
    case "medium":
      return ranges.medium_range;
    case "coarse":
      return ranges.coarse_range;
    default:
      return ranges.medium_range;
  }
}

export function generateRecommendation(
  context: Context,
  userBrewerId: string = "auto"
): Recommendation {
  // Choose brewer
  const brewer = chooseBrewer(context, userBrewerId);

  // Update context with chosen brewer
  const finalContext = {
    ...context,
    brew: {
      ...context.brew,
      brewer,
    },
  };

  // Get base template
  const templateId = brewer.default_template_id;
  let spec = getTemplateById(templateId, finalContext.brew.dose_g);

  // Collect all reasons and explanations
  const allReasons: Reason[] = [];
  const allExplanations: Explanation[] = [];

  // Apply adjusters in sequence
  const adjusters = [
    processingAdjuster,
    roastAdjuster,
    altitudeAdjuster,
    filterAdjuster,
    grinderAdjuster,
  ];

  for (const adjuster of adjusters) {
    const result = adjuster(spec, finalContext);
    spec = result.spec;
    allReasons.push(...result.reasons);
    if (result.explanations) {
      allExplanations.push(...result.explanations);
    }
  }

  // Clamp values
  spec.temp_f = clamp(spec.temp_f, 195, 212);
  spec.grind_index = clamp(spec.grind_index, 0, 2);

  // Recalculate water_g based on final ratio
  spec.water_g = Math.round(spec.dose_g * spec.ratio);

  // Adjust pour plan water amounts to match total
  const totalPourWater = spec.pour_plan.reduce((sum, step) => sum + step.water_g, 0);
  if (totalPourWater !== spec.water_g) {
    // Adjust the last pour step to match exactly
    const lastPourIndex = spec.pour_plan.length - 1;
    const diff = spec.water_g - totalPourWater;
    spec.pour_plan[lastPourIndex].water_g += diff;
  }

  // Get grind setting
  const grindZone = getGrindZone(spec.grind_index);
  const grindSetting = getGrindSetting(spec.grind_index, finalContext.brew.grinder);

  // Add brewer selection reason if auto-selected
  if (userBrewerId === "auto" && brewer.id === "switch") {
    allReasons.unshift({
      factor: "Brewer auto-selection",
      explanation: "Switch chosen for sweet-focused high-altitude washed light roast to maximize sweetness and body",
    });
    allExplanations.unshift({
      category: "brewer",
      text: "We chose the Switch for its immersion-percolation hybrid to maximize sweetness and body.",
    });
  }

  // Build summary
  const summary = buildSummary(finalContext, allExplanations, spec);

  return {
    spec,
    grind_setting: grindSetting,
    grind_zone: grindZone,
    reasons: allReasons,
    brewer: finalContext.brew.brewer,
    filter: finalContext.brew.filter,
    grinder: finalContext.brew.grinder,
    summary,
    explanations: allExplanations,
  };
}
