import { Adjuster, Reason } from "../types";

export const processingAdjuster: Adjuster = (spec, context) => {
  const { processing } = context.coffee;
  const newSpec = { ...spec };
  const reasons: Reason[] = [];

  switch (processing) {
    case "washed":
      newSpec.temp_f += 3;
      newSpec.grind_index -= 0.2;
      newSpec.agitation_level += 0.3;
      reasons.push({
        factor: "Washed processing",
        explanation: "Higher solubility requires hotter water (+3°F), finer grind, and more agitation for full extraction",
      });
      break;

    case "honey":
      newSpec.temp_f -= 2;
      newSpec.grind_index += 0.2;
      newSpec.agitation_level -= 0.2;
      reasons.push({
        factor: "Honey processing",
        explanation: "Residual sugars extract easily; cooler water (-2°F), coarser grind, and less agitation prevent over-extraction",
      });
      break;

    case "pulped_natural":
      newSpec.temp_f -= 3;
      newSpec.grind_index += 0.3;
      newSpec.agitation_level -= 0.3;
      reasons.push({
        factor: "Pulped natural processing",
        explanation: "High sweetness and solubility; cooler water (-3°F), coarser grind, and gentle agitation for balance",
      });
      break;

    case "natural_anaerobic":
      newSpec.temp_f -= 5;
      newSpec.grind_index += 0.5;
      newSpec.agitation_level -= 0.5;
      reasons.push({
        factor: "Natural/anaerobic processing",
        explanation: "Very high solubility and intense flavors; much cooler water (-5°F), coarse grind, and minimal agitation to avoid muddiness",
      });
      break;
  }

  return { spec: newSpec, reasons };
};
