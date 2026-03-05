import { Adjuster, Reason, Explanation } from "../types";

export const roastAdjuster: Adjuster = (spec, context) => {
  const { roast } = context.coffee;
  const newSpec = { ...spec };
  const reasons: Reason[] = [];
  const explanations: Explanation[] = [];

  switch (roast) {
    case "light":
      newSpec.temp_f += 2;
      reasons.push({
        factor: "Light roast",
        explanation: "Denser beans require hotter water (+2°F) for better extraction",
      });
      explanations.push({
        category: "coffee",
        text: "Light roasts are denser and need hotter water to extract fully.",
      });
      break;

    case "medium_light":
      // No change - this is the baseline
      break;

    case "medium":
      newSpec.temp_f -= 3;
      newSpec.grind_index += 0.2;
      reasons.push({
        factor: "Medium roast",
        explanation: "More developed beans extract easily; cooler water (-3°F) and coarser grind prevent bitterness",
      });
      explanations.push({
        category: "coffee",
        text: "Medium roasts extract more easily, so we're dialing back heat and grind to avoid bitterness.",
      });
      break;
  }

  return { spec: newSpec, reasons, explanations };
};
