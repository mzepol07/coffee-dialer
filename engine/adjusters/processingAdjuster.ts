import { Adjuster, Reason, Explanation } from "../types";

export const processingAdjuster: Adjuster = (spec, context) => {
  const { processing } = context.coffee;
  const newSpec = { ...spec };
  const reasons: Reason[] = [];
  const explanations: Explanation[] = [];

  switch (processing) {
    case "washed":
      newSpec.temp_f += 3;
      newSpec.grind_index -= 0.2;
      newSpec.agitation_level += 0.3;
      reasons.push({
        factor: "Washed processing",
        explanation: "Higher solubility requires hotter water (+3°F), finer grind, and more agitation for full extraction",
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
        explanation: "Residual sugars extract easily; cooler water (-2°F), coarser grind, and less agitation prevent over-extraction",
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
        explanation: "High sweetness and solubility; cooler water (-3°F), coarser grind, and gentle agitation for balance",
      });
      explanations.push({
        category: "coffee",
        text: "Pulped natural coffees extract easily and can taste heavy, so we're using a coarser grind and gentler approach.",
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
      explanations.push({
        category: "coffee",
        text: "Natural and anaerobic coffees extract very easily and can get muddy, so we're keeping things gentle with a coarser grind and minimal agitation.",
      });
      break;
  }

  return { spec: newSpec, reasons, explanations };
};
