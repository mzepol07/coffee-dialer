export type GrinderType = "manual" | "electric";
export type BurrType = "conical" | "flat";
export type FinesBias = "low" | "medium" | "high";
export type ScaleType = "clicks" | "steps" | "stepless" | "rotations" | "notches" | "digital" | "other";

export interface GrindRange {
  fine_range: string;
  medium_range: string;
  coarse_range: string;
}

export interface Grinder {
  id: string;
  name: string;
  grinder_type: GrinderType;
  burr_type: BurrType;
  fines_bias: FinesBias;
  scale_type: ScaleType;
  ranges: GrindRange;
}

export type BrewerFamily = "percolation" | "hybrid";

export interface Brewer {
  id: string;
  name: string;
  family: BrewerFamily;
  default_template_id: string;
  notes?: string;
}


export type FlowBias = "fast" | "neutral" | "slow";
export type ClarityBias = "high" | "medium" | "low";

export interface Filter {
  id: string;
  name: string;
  flow_bias: FlowBias;
  clarity_bias: ClarityBias;
  compatible_brewers: string[];
}

export type Processing = "washed" | "honey" | "pulped_natural" | "natural_anaerobic" | "natural" | "anaerobic" | "wet_hulled" | "mixed" | "blend" | "unknown";
export type Roast = "light" | "medium_light" | "medium";
export type Goal = "clarity" | "balanced" | "sweet";
