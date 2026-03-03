import { Filter } from "./types";

export const filters: Filter[] = [
  {
    id: "hario_white",
    name: "Hario White V60 Filters",
    flow_bias: "neutral",
    clarity_bias: "high",
    compatible_brewers: ["v60_plastic", "v60_ceramic", "v60_glass", "v60_metal", "switch"],
  },
  {
    id: "hario_brown",
    name: "Hario Brown/Natural V60 Filters",
    flow_bias: "slow",
    clarity_bias: "medium",
    compatible_brewers: ["v60_plastic", "v60_ceramic", "v60_glass", "v60_metal", "switch"],
  },
  {
    id: "chemex_bonded",
    name: "Chemex Bonded Filters",
    flow_bias: "slow",
    clarity_bias: "high",
    compatible_brewers: ["chemex_6cup"],
  },
  {
    id: "cafec_t90",
    name: "Cafec T90 Filters",
    flow_bias: "fast",
    clarity_bias: "high",
    compatible_brewers: ["v60_plastic", "v60_ceramic", "v60_glass", "v60_metal", "switch"],
  },
  {
    id: "cafec_t92",
    name: "Cafec T92 Filters",
    flow_bias: "fast",
    clarity_bias: "high",
    compatible_brewers: ["v60_plastic", "v60_ceramic", "v60_glass", "v60_metal", "switch"],
  },
  {
    id: "cafec_abaca",
    name: "Cafec Abaca Filters",
    flow_bias: "fast",
    clarity_bias: "high",
    compatible_brewers: ["v60_plastic", "v60_ceramic", "v60_glass", "v60_metal", "switch"],
  },
];

export function getFilterById(id: string): Filter | undefined {
  return filters.find((f) => f.id === id);
}

export function getFiltersForBrewer(brewerId: string): Filter[] {
  return filters.filter((f) => f.compatible_brewers.includes(brewerId));
}
