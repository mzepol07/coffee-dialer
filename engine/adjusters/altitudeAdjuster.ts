import { Adjuster, Reason } from "../types";

export const altitudeAdjuster: Adjuster = (spec, context) => {
  const { altitude_ft } = context.coffee;
  const newSpec = { ...spec };
  const reasons: Reason[] = [];

  if (!altitude_ft) {
    return { spec: newSpec, reasons };
  }

  if (altitude_ft >= 6000) {
    newSpec.temp_f += 3;
    newSpec.grind_index -= 0.1;
    reasons.push({
      factor: "High altitude (≥6000ft)",
      explanation: "Very dense, hard beans require hotter water (+3°F) and finer grind for proper extraction",
    });
  } else if (altitude_ft >= 4500) {
    newSpec.temp_f += 1;
    reasons.push({
      factor: "Medium-high altitude (4500-6000ft)",
      explanation: "Dense beans benefit from slightly hotter water (+1°F)",
    });
  } else {
    newSpec.temp_f -= 1;
    newSpec.grind_index += 0.1;
    reasons.push({
      factor: "Lower altitude (<4500ft)",
      explanation: "Softer beans extract more easily; slightly cooler water (-1°F) and coarser grind",
    });
  }

  return { spec: newSpec, reasons };
};
