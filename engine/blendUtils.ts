import { Processing } from "@/catalog";

/**
 * Determines the effective processing method for a coffee, accounting for blends.
 *
 * @param processing - The declared processing method
 * @param isBlend - Whether this coffee is a blend
 * @param processingComponents - Array of processing methods in the blend (if known)
 * @returns The effective processing method to use for brew recommendations
 */
export function getEffectiveProcessing(
  processing: Processing,
  isBlend?: boolean,
  processingComponents?: string[] | null
): Processing {
  // If not a blend, use the provided processing method normally
  if (!isBlend) {
    return processing;
  }

  // If it's a blend and we have component information
  if (processingComponents && processingComponents.length > 0) {
    // Normalize components (convert natural_anaerobic to natural, etc.)
    const normalizedComponents = processingComponents.map(normalizeProcessing);

    // If all components share the same process, use that process
    const uniqueProcesses = Array.from(new Set(normalizedComponents));
    if (uniqueProcesses.length === 1) {
      return uniqueProcesses[0] as Processing;
    }

    // If multiple processes, return "mixed"
    return "mixed";
  }

  // If it's a blend but processing is explicitly set to a known method, use it
  if (processing !== "washed" && processing !== "unknown" && processing !== "blend") {
    return processing;
  }

  // If it's a blend and process is unknown or defaulted to washed, return "blend"
  return "blend";
}

/**
 * Normalizes processing method names for comparison.
 * Combines similar processing types (e.g., natural_anaerobic -> natural).
 */
function normalizeProcessing(processing: string): string {
  const normalized = processing.toLowerCase().trim();

  // Map natural_anaerobic and anaerobic to natural
  if (normalized === "natural_anaerobic" || normalized === "anaerobic") {
    return "natural";
  }

  // Map pulped_natural to honey (similar processing)
  if (normalized === "pulped_natural" || normalized === "pulped natural") {
    return "honey";
  }

  return normalized;
}

/**
 * Checks if a processing method should use balanced defaults (blend-friendly).
 */
export function shouldUseBalancedDefaults(processing: Processing): boolean {
  return processing === "mixed" || processing === "blend" || processing === "unknown";
}

/**
 * Gets a display label for the processing method.
 */
export function getProcessingDisplayLabel(
  processing: Processing,
  isBlend?: boolean
): string {
  if (isBlend && processing === "mixed") {
    return "Blend (Mixed Processing)";
  }

  if (isBlend && (processing === "blend" || processing === "unknown")) {
    return "Blend";
  }

  if (isBlend) {
    return `Blend (${formatProcessing(processing)})`;
  }

  return formatProcessing(processing);
}

function formatProcessing(processing: Processing): string {
  switch (processing) {
    case "washed":
      return "Washed";
    case "honey":
      return "Honey";
    case "pulped_natural":
      return "Pulped Natural";
    case "natural_anaerobic":
      return "Natural/Anaerobic";
    case "natural":
      return "Natural";
    case "anaerobic":
      return "Anaerobic";
    case "wet_hulled":
      return "Wet Hulled";
    case "mixed":
      return "Mixed Processing";
    case "blend":
      return "Blend";
    case "unknown":
      return "Unknown";
    default:
      return processing;
  }
}
