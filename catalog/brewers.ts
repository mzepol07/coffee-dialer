import { Brewer } from "./types";

export const brewers: Brewer[] = [
  {
    id: "v60_plastic",
    name: "Hario V60 (Plastic)",
    family: "percolation",
    default_template_id: "v60_3pour",
  },
  {
    id: "v60_ceramic",
    name: "Hario V60 (Ceramic)",
    family: "percolation",
    default_template_id: "v60_3pour",
  },
  {
    id: "v60_glass",
    name: "Hario V60 (Glass)",
    family: "percolation",
    default_template_id: "v60_3pour",
  },
  {
    id: "v60_metal",
    name: "Hario V60 (Metal)",
    family: "percolation",
    default_template_id: "v60_3pour",
  },
  {
    id: "switch",
    name: "Hario Switch",
    family: "hybrid",
    default_template_id: "switch_hybrid",
  },
  {
    id: "v60_similar",
    name: "V60-style Cone Brewer",
    family: "percolation",
    default_template_id: "v60_3pour",
  },
  {
    id: "chemex_6cup",
    name: "Chemex (6-cup)",
    family: "percolation",
    default_template_id: "chemex_2pour",
  },
  {
    id: "chemex_8cup",
    name: "Chemex (8-cup)",
    family: "percolation",
    default_template_id: "chemex_2pour",
  },
  {
    id: "other",
    name: "Other Brewer",
    family: "percolation",
    default_template_id: "v60_3pour",
  }
];

export function getBrewerById(id: string): Brewer | undefined {
  return brewers.find((b) => b.id === id);
}
