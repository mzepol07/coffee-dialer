import { Context, Explanation, RecipeSpec } from "./types";

// Category priority order for selecting explanations
const CATEGORY_PRIORITY: Record<string, number> = {
  coffee: 1,
  brewer: 2,
  filter: 3,
  grind: 4,
  pour: 5,
  water: 6,
  general: 7,
};

/**
 * Build a natural-language summary explaining why this recipe was recommended.
 *
 * @param context - The user's coffee and brew context
 * @param explanations - List of explanation fragments from adjusters
 * @param spec - The final recipe spec
 * @returns A 2-4 sentence summary paragraph
 */
export function buildSummary(
  context: Context,
  explanations: Explanation[],
  spec: RecipeSpec
): string {
  const { coffee, brew } = context;

  // Build intro sentence
  const processingText = formatProcessing(coffee.processing);
  const goalText = formatGoal(coffee.goal);

  const intro = `You are brewing a ${processingText} processed coffee with a ${brew.brewer.name} aiming for a ${goalText} cup.`;

  // Deduplicate explanations by category (keep only the first per category)
  const seenCategories = new Set<string>();
  const uniqueExplanations = explanations.filter((exp) => {
    if (seenCategories.has(exp.category)) {
      return false;
    }
    seenCategories.add(exp.category);
    return true;
  });

  // Sort by category priority
  const sortedExplanations = uniqueExplanations.sort((a, b) => {
    return (CATEGORY_PRIORITY[a.category] || 99) - (CATEGORY_PRIORITY[b.category] || 99);
  });

  // Take up to 3 additional fragments
  const selectedFragments = sortedExplanations.slice(0, 3);

  // Build final summary
  const fragments = [intro, ...selectedFragments.map(e => e.text)];

  return fragments.join(" ");
}

function formatProcessing(processing: string): string {
  switch (processing) {
    case "washed":
      return "washed";
    case "honey":
      return "honey";
    case "pulped_natural":
      return "pulped natural";
    case "natural_anaerobic":
      return "natural/anaerobic";
    default:
      return processing;
  }
}

function formatGoal(goal: string): string {
  switch (goal) {
    case "clarity":
      return "clean and bright";
    case "balanced":
      return "balanced";
    case "sweet":
      return "sweet and syrupy";
    default:
      return goal;
  }
}
