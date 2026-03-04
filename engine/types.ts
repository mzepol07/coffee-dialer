import { Processing, Roast, Goal, Grinder, Brewer, Filter } from "@/catalog";

export interface PourStep {
  label: string;
  start_s: number;
  end_s?: number;
  water_g: number;
  notes?: string;
}

export interface RecipeSpec {
  dose_g: number;
  ratio: number;
  water_g: number;
  temp_f: number;
  target_time_s_min: number;
  target_time_s_max: number;
  agitation_level: number; // 0-3
  grind_index: number; // 0=fine, 1=medium, 2=coarse
  pour_plan: PourStep[];
  template_id: string;
}

export interface CoffeeContext {
  processing: Processing;
  roast: Roast;
  origin_country?: string;
  altitude_ft?: number;
  goal: Goal;
}

export interface BrewContext {
  grinder: Grinder;
  brewer: Brewer;
  filter: Filter;
  dose_g: number;
}

export interface Context {
  coffee: CoffeeContext;
  brew: BrewContext;
}

export interface Reason {
  factor: string;
  explanation: string;
}

export interface AdjustmentResult {
  spec: RecipeSpec;
  reasons: Reason[];
}

export type Adjuster = (spec: RecipeSpec, context: Context) => AdjustmentResult;

export interface Recommendation {
  spec: RecipeSpec;
  grind_setting: string;
  grind_zone: "fine" | "medium" | "coarse";
  reasons: Reason[];
  brewer: Brewer;
  filter: Filter;
  grinder: Grinder;
}
