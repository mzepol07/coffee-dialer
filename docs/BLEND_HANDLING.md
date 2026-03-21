# Blend Handling Documentation

## Overview

The Coffee Dialer now supports coffee blends with intelligent processing logic that avoids defaulting blends to "washed" processing and instead uses balanced, roast-driven recommendations.

## Key Features

### 1. Blend Detection
- **`is_blend: boolean`** - Indicates whether the coffee is a blend
- **`processing_method: Processing`** - The processing method used
- **`processing_components: string[] | null`** - Optional array of processing methods in the blend

### 2. Processing Method Types

The system now supports the following processing methods:

#### Standard Methods
- `washed` - Clean, bright, higher extraction
- `honey` - Sweet, moderate extraction
- `pulped_natural` - Very sweet, gentle extraction
- `natural` - Fruit-forward, easy extraction
- `natural_anaerobic` - Intense flavors, very gentle extraction
- `anaerobic` - Similar to natural, easy extraction
- `wet_hulled` - Earthy, full-bodied

#### Blend-Specific Methods
- `mixed` - Blend with multiple processing methods
- `blend` - Blend with unknown processing
- `unknown` - Processing information not available

## Blend Processing Logic

### Determination Flow

1. **Single-Origin Coffee** (`is_blend: false`)
   - Use the provided processing method normally
   - Apply standard processing-specific adjustments

2. **Uniform Blend** (all components same process)
   - If all `processing_components` are the same
   - Use that processing method
   - Apply normal processing adjustments

3. **Mixed Processing Blend**
   - If `processing_components` contains multiple different methods
   - Set `processing_method = "mixed"`
   - Use balanced defaults (see below)

4. **Unknown Blend Processing**
   - If blend has no processing information
   - Set `processing_method = "blend"` or `"unknown"`
   - **Never default to "washed"**
   - Use balanced defaults

### Balanced Defaults for Blends

When `processing_method` is `"mixed"`, `"blend"`, or `"unknown"`:

#### Filter Brewing
- **Grind**: Medium starting point (baseline)
- **Agitation**: Medium (baseline)
- **Temperature**: Standard for roast level (no processing adjustment)
- **Ratio**: Standard baseline (no processing adjustment)

#### Recommendation Priority
1. **Roast level** - Primary driver
2. **Brew method** - Secondary driver
3. **Processing** - Only when explicitly known and uniform

### Temperature Adjustments

Processing adjustments to base temperature:

| Processing | Temp Adjustment | Notes |
|------------|----------------|-------|
| Washed | +3°F (+2°C) | Higher extraction needed |
| Honey | -2°F (-1°C) | Moderate reduction |
| Pulped Natural | -3°F (-2°C) | Gentler extraction |
| Natural/Anaerobic | -5°F (-3°C) | Much gentler approach |
| Wet Hulled | -2°F (-1°C) | Slight reduction for clarity |
| Mixed/Blend/Unknown | 0°F (0°C) | No adjustment, roast-driven |

## UI Behavior

### Form Display
- Checkbox: "This is a blend"
- When checked, additional processing options appear:
  - Mixed Processing
  - Unknown

### Recipe Display

#### Blend Labels
- `is_blend: true` + `processing: "mixed"` → "Blend (Mixed Processing)"
- `is_blend: true` + `processing: "blend"` → "Blend"
- `is_blend: true` + `processing: "washed"` → "Blend (Washed)"
- `is_blend: false` + `processing: "washed"` → "Washed"

#### Summary Text
For blends with unknown/mixed processing:
> "You are brewing a blend with a V60 aiming for a balanced cup. Start with this balanced recipe and adjust by taste."

For blends with known processing:
> "You are brewing a washed processed blend with a V60 aiming for a clean and bright cup."

## User Feedback Guidance

For blends, the system emphasizes taste-based adjustments:

### Adjustment Recommendations
- **Sour or thin** → Grind finer / increase extraction
- **Bitter or astringent** → Grind coarser / reduce extraction
- **Hollow or muddy** → Reduce agitation or tighten ratio

## API Usage Examples

### Single-Origin Washed Coffee
```typescript
const context: Context = {
  coffee: {
    processing: 'washed',
    roast: 'light',
    goal: 'clarity',
    is_blend: false,
  },
  brew: { grinder, brewer, filter, dose_g: 15 }
};
```

### Blend with All Washed Components
```typescript
const context: Context = {
  coffee: {
    processing: 'washed',
    roast: 'medium_light',
    goal: 'balanced',
    is_blend: true,
    processing_components: ['washed', 'washed', 'washed'],
  },
  brew: { grinder, brewer, filter, dose_g: 15 }
};
```

### Blend with Mixed Processing
```typescript
const context: Context = {
  coffee: {
    processing: 'mixed',
    roast: 'medium',
    goal: 'sweet',
    is_blend: true,
    processing_components: ['washed', 'natural'],
  },
  brew: { grinder, brewer, filter, dose_g: 15 }
};
```

### Blend with Unknown Processing
```typescript
const context: Context = {
  coffee: {
    processing: 'blend',
    roast: 'medium_light',
    goal: 'balanced',
    is_blend: true,
    processing_components: null,
  },
  brew: { grinder, brewer, filter, dose_g: 15 }
};
```

## Implementation Details

### Core Files

1. **`catalog/types.ts`**
   - Extended `Processing` type with new methods

2. **`engine/types.ts`**
   - Added `is_blend` and `processing_components` to `CoffeeContext`

3. **`engine/blendUtils.ts`**
   - `getEffectiveProcessing()` - Determines processing method
   - `shouldUseBalancedDefaults()` - Checks if balanced defaults needed
   - `getProcessingDisplayLabel()` - Formats display labels

4. **`engine/adjusters/processingAdjuster.ts`**
   - Updated to check for blends first
   - Uses balanced defaults when appropriate
   - Supports new processing types

5. **`engine/explain.ts`**
   - Updated summary generation for blends
   - Special messaging for balanced defaults

6. **`app/page.tsx`**
   - Added blend checkbox
   - Conditional processing options

7. **`app/recipe/page.tsx`**
   - Passes blend information to engine

### Testing

Run the test suite with:
```bash
npm install --save-dev vitest @vitest/ui
npm test
```

Test coverage includes:
- Single-origin washed
- Blend with all washed components
- Blend with washed + natural
- Blend with unknown process
- Temperature bounds
- Grind recommendations
- New processing methods

## Design Principles

1. **Never assume blends are washed** - Avoid defaulting to washed processing
2. **Roast-first for blends** - Use roast level as primary driver
3. **Explicit over implicit** - Only use processing info when confirmed
4. **Balanced defaults** - Safe, middle-ground starting points
5. **User feedback emphasis** - Guide users to adjust by taste
6. **Process as weak prior** - Use metadata as suggestion, not rule

## Future Enhancements

Potential improvements:
- Machine learning from user feedback on blends
- Roaster-specific blend profiles
- Component ratio weighting (70% washed, 30% natural)
- Regional blend characteristics
- Espresso-specific blend handling
