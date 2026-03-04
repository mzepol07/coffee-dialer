import { Adjuster, Reason } from "../types";

export const filterAdjuster: Adjuster = (spec, context) => {
  const { filter } = context.brew;
  const newSpec = { ...spec };
  const reasons: Reason[] = [];

  switch (filter.flow_bias) {
    case "slow":
      newSpec.grind_index += 0.2;
      newSpec.agitation_level -= 0.1;
      reasons.push({
        factor: `${filter.name} (slow flow)`,
        explanation: "Thicker filter restricts flow; coarser grind and less agitation prevent clogging and over-extraction",
      });
      break;

    case "fast":
      newSpec.grind_index -= 0.1;
      reasons.push({
        factor: `${filter.name} (fast flow)`,
        explanation: "Thinner filter allows faster flow; finer grind ensures adequate extraction time",
      });
      break;

    case "neutral":
      // No adjustment needed
      break;
  }

  return { spec: newSpec, reasons };
};
