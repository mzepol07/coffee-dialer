# Adding Catalog Items

This guide explains how to add grinders, brewers, and filters to the catalog.

## File Locations

- **Grinders**: `catalog/grinders.ts`
- **Brewers**: `catalog/brewers.ts`
- **Filters**: `catalog/filters.ts`
- **Types**: `catalog/types.ts`

## Adding a Grinder

### 1. Understand the Grinder Schema

```typescript
interface Grinder {
  id: string;                    // Unique identifier (lowercase, underscores)
  name: string;                  // Display name
  burr_type: "conical" | "flat"; // Burr geometry
  fines_bias: "low" | "medium" | "high"; // How many fines it produces
  scale_type: "clicks" | "steps" | "stepless"; // Adjustment mechanism
  ranges: {
    fine_range: string;      // Pour-over fine zone
    medium_range: string;    // Pour-over sweet spot
    coarse_range: string;    // Pour-over coarse zone
  };
}
```

### 2. Determine the Parameters

**Burr Type:**
- `conical`: Traditional conical burrs (most hand grinders, Encore, etc.)
- `flat`: Flat burrs (Ode, DF64, 064S, etc.)

**Fines Bias:**
- `low`: Clean particle distribution, minimal fines (premium flat burrs)
- `medium`: Moderate fines (most grinders)
- `high`: Lots of fines that can cause clogging (entry-level conical grinders)

**Scale Type:**
- `clicks`: Each adjustment is a distinct click (hand grinders)
- `steps`: Numbered steps (Encore, Ode)
- `stepless`: Infinite adjustment (some high-end grinders)

### 3. Find the Grind Ranges

This is the most important part! You need to find settings that work for pour-over.

**Method 1: Community Consensus**
- Search Reddit (r/Coffee, r/pourover)
- Search forums and reviews
- Ask other users

**Method 2: Personal Testing**
- Start at manufacturer's pour-over recommendation
- For **fine zone**: go finer until you get slow, over-extracted brews
- For **coarse zone**: go coarser until you get fast, under-extracted brews
- **Medium zone**: sweet spot in between

**Example Process for a Timemore C3:**
1. Manufacturer suggests 18-22 for pour-over
2. Testing shows:
   - 16-18: fine but not clogging
   - 18-22: sweet spot for most coffees
   - 22-26: good for naturals and slower brewers
3. Result:
   ```typescript
   ranges: {
     fine_range: "16–18",
     medium_range: "18–22",
     coarse_range: "22–26",
   }
   ```

### 4. Add to the Catalog

Edit `catalog/grinders.ts`:

```typescript
export const grinders: Grinder[] = [
  // ... existing grinders ...
  {
    id: "your_grinder",
    name: "Your Grinder Name",
    burr_type: "conical",
    fines_bias: "medium",
    scale_type: "clicks",
    ranges: {
      fine_range: "X–Y",
      medium_range: "Y–Z",
      coarse_range: "Z–W",
    },
  },
];
```

### 5. Test It

1. Run `npm run dev`
2. Select your grinder
3. Try different coffee types
4. Verify the recommended settings make sense

## Adding a Brewer

### 1. Brewer Schema

```typescript
interface Brewer {
  id: string;
  name: string;
  family: "percolation" | "hybrid";
  default_template_id: string;
  notes?: string;
}
```

### 2. Determine the Family

- `percolation`: Water flows through continuously (V60, Chemex, Kalita)
- `hybrid`: Can stop/control flow (Switch, Clever, Tricolate with valve)

### 3. Choose a Template

Available templates:
- `v60_3pour`: Standard 3-pour V60 recipe
- `switch_hybrid`: Switch-style with immersion phase
- `chemex_2pour`: Chemex-style with thick filters

Pick the closest match. You can create new templates if needed!

### 4. Add to Catalog

Edit `catalog/brewers.ts`:

```typescript
{
  id: "my_brewer",
  name: "My Brewer Name",
  family: "percolation",
  default_template_id: "v60_3pour",
  notes: "Optional notes about this brewer",
}
```

## Adding a Filter

### 1. Filter Schema

```typescript
interface Filter {
  id: string;
  name: string;
  flow_bias: "fast" | "neutral" | "slow";
  clarity_bias: "high" | "medium" | "low";
  compatible_brewers: string[];
}
```

### 2. Determine Flow Bias

Compare to Hario white filters (neutral):
- `fast`: Thinner, water flows faster (Cafec Abaca)
- `neutral`: Standard flow (Hario white)
- `slow`: Thicker, water flows slower (Hario brown, Chemex bonded)

### 3. Determine Clarity Bias

- `high`: Clean, clear cup (most bleached filters)
- `medium`: Slightly more body (natural/brown filters)
- `low`: More oils and body pass through

### 4. List Compatible Brewers

Include all brewer IDs that can use this filter:
```typescript
compatible_brewers: ["v60_plastic", "v60_ceramic", "v60_glass", "v60_metal"]
```

### 5. Add to Catalog

Edit `catalog/filters.ts`:

```typescript
{
  id: "my_filter",
  name: "My Filter Name",
  flow_bias: "neutral",
  clarity_bias: "high",
  compatible_brewers: ["v60_plastic", "v60_ceramic", "switch"],
}
```

## Creating a New Template

If existing templates don't fit your brewer, create a new one in `engine/templates.ts`:

```typescript
export function getMyTemplate(dose_g: number): RecipeSpec {
  const ratio = 16;
  const water_g = Math.round(dose_g * ratio);

  return {
    dose_g,
    ratio,
    water_g,
    temp_f: 205,                  // Starting temperature
    target_time_s_min: 150,       // Target finish time min
    target_time_s_max: 180,       // Target finish time max
    agitation_level: 1,           // 0-3 scale
    grind_index: 1.0,             // 0=fine, 1=medium, 2=coarse
    pour_plan: [
      {
        label: "Bloom",
        start_s: 0,
        end_s: 45,
        water_g: dose_g * 3,      // 3x dose bloom
        notes: "Gentle pour to wet all grounds",
      },
      // Add more steps...
    ],
    template_id: "my_template",
  };
}
```

Then register it in `getTemplateById`:

```typescript
export function getTemplateById(templateId: string, dose_g: number): RecipeSpec {
  switch (templateId) {
    case "my_template":
      return getMyTemplate(dose_g);
    // ... other cases
  }
}
```

## Need Help?

Open an issue or pull request draft and ask questions!
