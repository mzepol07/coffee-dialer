import { RecipeSpec } from "./types";

export function getV60ThreePourTemplate(dose_g: number): RecipeSpec {
  const ratio = 15.5;
  const water_g = Math.round(dose_g * ratio);

  return {
    dose_g,
    ratio,
    water_g,
    temp_f: 205,
    target_time_s_min: 150,
    target_time_s_max: 170,
    agitation_level: 1,
    grind_index: 1.0, // medium baseline
    pour_plan: [
      {
        label: "Bloom",
        start_s: 0,
        end_s: 45,
        water_g: dose_g * 3, // 3x bloom
        notes: "Gentle circular pour, ensure all grounds are wet",
      },
      {
        label: "Second pour",
        start_s: 45,
        end_s: 75,
        water_g: Math.round(water_g * 0.6) - dose_g * 3, // to 60% total
        notes: "Steady center pour, no pauses",
      },
      {
        label: "Final pour",
        start_s: 75,
        end_s: 105,
        water_g: water_g - Math.round(water_g * 0.6),
        notes: "Pour to total, aim to finish pouring by 1:45",
      },
    ],
    template_id: "v60_3pour",
  };
}

export function getSwitchHybridTemplate(dose_g: number): RecipeSpec {
  const ratio = 16;
  const water_g = Math.round(dose_g * ratio);

  return {
    dose_g,
    ratio,
    water_g,
    temp_f: 200,
    target_time_s_min: 150,
    target_time_s_max: 180,
    agitation_level: 1.5,
    grind_index: 0.9, // slightly finer than V60
    pour_plan: [
      {
        label: "Bloom (switch open)",
        start_s: 0,
        end_s: 40,
        water_g: dose_g * 3,
        notes: "Switch open, circular bloom pour",
      },
      {
        label: "Second pour",
        start_s: 40,
        end_s: 75,
        water_g: Math.round(water_g * 0.55) - dose_g * 3,
        notes: "Pour to 55% total, close switch at 1:15",
      },
      {
        label: "Final pour (switch closed)",
        start_s: 75,
        end_s: 95,
        water_g: water_g - Math.round(water_g * 0.55),
        notes: "Switch closed, pour remaining water",
      },
      {
        label: "Open switch",
        start_s: 105,
        water_g: 0,
        notes: "Open switch to let coffee drain",
      },
    ],
    template_id: "switch_hybrid",
  };
}

export function getChemexTwoPourTemplate(dose_g: number): RecipeSpec {
  const ratio = 16.5;
  const water_g = Math.round(dose_g * ratio);

  return {
    dose_g,
    ratio,
    water_g,
    temp_f: 205,
    target_time_s_min: 240,
    target_time_s_max: 300,
    agitation_level: 0.5,
    grind_index: 1.2, // medium-coarse
    pour_plan: [
      {
        label: "Bloom",
        start_s: 0,
        end_s: 45,
        water_g: dose_g * 2,
        notes: "Gentle pour to saturate all grounds",
      },
      {
        label: "Main pour",
        start_s: 45,
        end_s: 90,
        water_g: Math.round(water_g * 0.6) - dose_g * 2,
        notes: "Steady center pour to 60% total by 1:30",
      },
      {
        label: "Final pour",
        start_s: 90,
        end_s: 120,
        water_g: water_g - Math.round(water_g * 0.6),
        notes: "Pour remaining water by 2:00",
      },
    ],
    template_id: "chemex_2pour",
  };
}

export function getTemplateById(templateId: string, dose_g: number): RecipeSpec {
  switch (templateId) {
    case "v60_3pour":
      return getV60ThreePourTemplate(dose_g);
    case "switch_hybrid":
      return getSwitchHybridTemplate(dose_g);
    case "chemex_2pour":
      return getChemexTwoPourTemplate(dose_g);
    default:
      return getV60ThreePourTemplate(dose_g);
  }
}
