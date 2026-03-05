import { Adjuster, Reason, Explanation } from "../types";

export const filterAdjuster: Adjuster = (spec, context) => {
  const { filter } = context.brew;
  const newSpec = { ...spec };
  const reasons: Reason[] = [];
  const explanations: Explanation[] = [];

  switch (filter.flow_bias) {
    case "slow":
      newSpec.grind_index += 0.2;
      newSpec.agitation_level -= 0.1;
      reasons.push({
        factor: `${filter.name} (slow flow)`,
        explanation: "Thicker filter restricts flow; coarser grind and less agitation prevent clogging and over-extraction",
      });
      explanations.push({
        category: "filter",
        text: `The ${filter.name} flows slowly, so we're using a coarser grind to avoid clogging.`,
      });
      break;

    case "fast":
      newSpec.grind_index -= 0.1;
      reasons.push({
        factor: `${filter.name} (fast flow)`,
        explanation: "Thinner filter allows faster flow; finer grind ensures adequate extraction time",
      });
      explanations.push({
        category: "filter",
        text: `The ${filter.name} flows quickly, so we're grinding finer to maintain extraction.`,
      });
      break;

    case "neutral":
      // No adjustment needed
      break;
  }

  return { spec: newSpec, reasons, explanations };
};
