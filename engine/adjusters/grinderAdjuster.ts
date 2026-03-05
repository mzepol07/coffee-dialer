import { Adjuster, Reason, Explanation } from "../types";

export const grinderAdjuster: Adjuster = (spec, context) => {
  const { grinder } = context.brew;
  const newSpec = { ...spec };
  const reasons: Reason[] = [];
  const explanations: Explanation[] = [];

  // Conical grinders with high fines bias
  if (grinder.burr_type === "conical" && grinder.fines_bias === "high") {
    newSpec.grind_index += 0.2;
    newSpec.agitation_level -= 0.1;
    reasons.push({
      factor: `${grinder.name} (conical, high fines)`,
      explanation: "High fines production can cause clogging; coarser grind and gentle agitation reduce channeling",
    });
    explanations.push({
      category: "grind",
      text: `Your ${grinder.name} produces more fines, so we're compensating with a slightly coarser grind.`,
    });
  }
  // Flat burrs with low fines bias
  else if (grinder.burr_type === "flat" && grinder.fines_bias === "low") {
    newSpec.grind_index -= 0.1;
    reasons.push({
      factor: `${grinder.name} (flat, low fines)`,
      explanation: "Clean particle distribution allows finer grind for better extraction without clogging",
    });
    explanations.push({
      category: "grind",
      text: `Your ${grinder.name} produces clean particle distribution, so we can grind a bit finer.`,
    });
  }
  // Medium fines bias - no adjustment needed
  else if (grinder.fines_bias === "medium") {
    // Baseline, no change
  }

  return { spec: newSpec, reasons, explanations };
};
