import { Adjuster, Reason, Explanation } from "../types";
import { shouldUseBalancedDefaults } from "../blendUtils";

export const processingAdjuster: Adjuster = (spec, context) => {
  const { processing, is_blend } = context.coffee;
  const newSpec = { ...spec };
  const reasons: Reason[] = [];
  const explanations: Explanation[] = [];

  // For blends with unknown/mixed processing, use balanced defaults
  if (shouldUseBalancedDefaults(processing)) {
    const blendLabel = is_blend ? "Blend" : "Unknown processing";
    reasons.push({
      factor: blendLabel,
      explanation: "Using balanced baseline settings; roast level will be the primary driver for adjustments",
    });
    explanations.push({
      category: "coffee",
      text: "Since this is a blend, we're starting with balanced settings and letting roast level guide the recipe.",
    });
    return { spec: newSpec, reasons, explanations };
  }

  switch (processing) {
    case "washed":
      newSpec.temp_f += 3;
      newSpec.grind_index -= 0.2;
      newSpec.agitation_level += 0.3;
      reasons.push({
        factor: "Washed processing",
        explanation: "Higher solubility requires hotter water (+3°F/+2°C), finer grind, and more agitation for full extraction",
      });
      explanations.push({
        category: "coffee",
        text: "Washed coffees often need more extraction energy, so we're using a finer grind and more agitation.",
      });
      break;

    case "honey":
      newSpec.temp_f -= 2;
      newSpec.grind_index += 0.2;
      newSpec.agitation_level -= 0.2;
      reasons.push({
        factor: "Honey processing",
        explanation: "Residual sugars extract easily; cooler water (-2°F/-1°C), coarser grind, and less agitation prevent over-extraction",
      });
      explanations.push({
        category: "coffee",
        text: "Honey process adds sweetness that extracts easily, so we're dialing back the temperature and grind slightly.",
      });
      break;

    case "pulped_natural":
      newSpec.temp_f -= 3;
      newSpec.grind_index += 0.3;
      newSpec.agitation_level -= 0.3;
      reasons.push({
        factor: "Pulped natural processing",
        explanation: "High sweetness and solubility; cooler water (-3°F/-2°C), coarser grind, and gentle agitation for balance",
      });
      explanations.push({
        category: "coffee",
        text: "Pulped natural coffees extract easily and can taste heavy, so we're using a coarser grind and gentler approach.",
      });
      break;

    case "natural_anaerobic":
    case "natural":
    case "anaerobic":
      newSpec.temp_f -= 5;
      newSpec.grind_index += 0.5;
      newSpec.agitation_level -= 0.5;
      reasons.push({
        factor: "Natural/anaerobic processing",
        explanation: "Very high solubility and intense flavors; much cooler water (-5°F/-3°C), coarse grind, and minimal agitation to avoid muddiness",
      });
      explanations.push({
        category: "coffee",
        text: "Natural and anaerobic coffees extract very easily and can get muddy, so we're keeping things gentle with a coarser grind and minimal agitation.",
      });
      break;

    case "wet_hulled":
      newSpec.temp_f -= 2;
      newSpec.grind_index += 0.2;
      newSpec.agitation_level -= 0.1;
      reasons.push({
        factor: "Wet hulled processing",
        explanation: "Earthy, full-bodied character; slightly cooler water (-2°F/-1°C) and coarser grind for clarity",
      });
      explanations.push({
        category: "coffee",
        text: "Wet hulled coffees can be heavy-bodied, so we're using a slightly gentler approach for better balance.",
      });
      break;
  }

  return { spec: newSpec, reasons, explanations };
};
