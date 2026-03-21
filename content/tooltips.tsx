import { ReactNode } from "react";

export const processingTooltip: ReactNode = (
  <div className="space-y-2">
    <div>
      <strong style={{ color: "var(--caramel)" }}>Washed:</strong> Often cleaner/brighter; may need more extraction energy (hotter water, finer grind, more agitation).
    </div>
    <div>
      <strong style={{ color: "var(--caramel)" }}>Honey / Pulped Natural:</strong> Often sweeter; can get heavy if over-extracted; moderate extraction works well.
    </div>
    <div>
      <strong style={{ color: "var(--caramel)" }}>Natural / Anaerobic:</strong> Often fruit-forward; extracts easily and can taste muddy if pushed too hard; benefits from coarser grind + gentler pours.
    </div>
  </div>
);

export const roastTooltip: ReactNode = (
  <div className="space-y-2">
    <div>
      <strong style={{ color: "var(--caramel)" }}>Light:</strong> Denser, harder to extract; often benefits from hotter water and/or finer grind.
    </div>
    <div>
      <strong style={{ color: "var(--caramel)" }}>Medium-Light:</strong> Balanced; usually the easiest starting point.
    </div>
    <div>
      <strong style={{ color: "var(--caramel)" }}>Medium:</strong> More soluble; can get bitter/flat if pushed too hard; often needs slightly cooler water and/or coarser grind.
    </div>
  </div>
);

export const altitudeTooltip: ReactNode = (
  <div className="space-y-2">
    <div>
      Higher altitude often correlates with denser beans.
    </div>
    <div>
      Denser beans may need more extraction energy (hotter water, finer grind) to fully express flavor.
    </div>
  </div>
);

export const originTooltip: ReactNode = (
  <div className="space-y-2">
    <div style={{ marginBottom: "8px", fontStyle: "italic", color: "var(--subtle)" }}>
      General patterns only—roaster and processing matter most!
    </div>
    <div>
      <strong style={{ color: "var(--caramel)" }}>Ethiopia:</strong> Often floral/citrus; light roasts can be dense—watch fines, avoid over-agitation.
    </div>
    <div>
      <strong style={{ color: "var(--caramel)" }}>Kenya:</strong> Often high acidity/blackcurrant; can take higher extraction without tasting flat.
    </div>
    <div>
      <strong style={{ color: "var(--caramel)" }}>Colombia:</strong> Wide range; commonly balanced sweetness; good baseline behavior.
    </div>
    <div>
      <strong style={{ color: "var(--caramel)" }}>Guatemala:</strong> Often chocolate/spice; medium density; responds well to classic V60 recipes.
    </div>
    <div>
      <strong style={{ color: "var(--caramel)" }}>Brazil:</strong> Often nutty/chocolate, lower acidity; can taste best with slightly higher extraction for sweetness.
    </div>
    <div>
      <strong style={{ color: "var(--caramel)" }}>Indonesia:</strong> Often earthy/spice; can feel heavy—clarity-focused recipes can help.
    </div>
  </div>
);
