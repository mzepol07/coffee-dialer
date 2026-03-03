# Contributing to Pour-Over Recipe Finder

Thank you for your interest in contributing! This project is designed to be community-driven and easy to extend.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/coffee-dialer.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test locally: `npm run dev`
7. Build to verify: `npm run build`
8. Commit and push
9. Open a Pull Request

## Areas for Contribution

### 1. Adding Catalog Items

The easiest way to contribute is by adding equipment to the catalog. See [docs/ADDING_CATALOG_ITEMS.md](docs/ADDING_CATALOG_ITEMS.md) for detailed instructions.

#### Adding a Grinder

Edit `catalog/grinders.ts` and add an entry:

```typescript
{
  id: "your_grinder_id",
  name: "Grinder Display Name",
  burr_type: "conical" | "flat",
  fines_bias: "low" | "medium" | "high",
  scale_type: "clicks" | "steps" | "stepless",
  ranges: {
    fine_range: "X–Y",      // e.g., "6.4–6.8"
    medium_range: "X–Y",    // e.g., "6.8–7.4"
    coarse_range: "X–Y",    // e.g., "7.6–8.5"
  },
}
```

**How to determine ranges:**
- Fine: Pour-over espresso territory (fast, channeling-prone)
- Medium: Standard pour-over sweet spot
- Coarse: Slower flow, clean cup

Test with your grinder to find ranges that work!

#### Adding a Brewer

Edit `catalog/brewers.ts`:

```typescript
{
  id: "brewer_id",
  name: "Brewer Display Name",
  family: "percolation" | "hybrid",
  default_template_id: "v60_3pour" | "switch_hybrid" | "chemex_2pour",
  notes: "Optional notes",
}
```

#### Adding a Filter

Edit `catalog/filters.ts`:

```typescript
{
  id: "filter_id",
  name: "Filter Display Name",
  flow_bias: "fast" | "neutral" | "slow",
  clarity_bias: "high" | "medium" | "low",
  compatible_brewers: ["brewer_id_1", "brewer_id_2"],
}
```

### 2. Improving the Recipe Engine

The engine is designed with composable adjusters. Each adjuster is a function that modifies the recipe spec.

Location: `engine/adjusters/`

Example adjuster:

```typescript
export const myAdjuster: Adjuster = (spec, context) => {
  const newSpec = { ...spec };
  const reasons = [];

  // Your logic here
  if (someCondition) {
    newSpec.temp_f += 2;
    reasons.push({
      factor: "Your factor",
      explanation: "Why you made this change",
    });
  }

  return { spec: newSpec, reasons };
};
```

Add it to `engine/adjusters/index.ts` and import it in `engine/recommend.ts`.

### 3. Adding New Templates

Templates are in `engine/templates.ts`. Follow the pattern:

```typescript
export function getMyTemplate(dose_g: number): RecipeSpec {
  return {
    dose_g,
    ratio: 16,
    water_g: Math.round(dose_g * 16),
    temp_f: 205,
    target_time_s_min: 150,
    target_time_s_max: 180,
    agitation_level: 1,
    grind_index: 1.0,
    pour_plan: [
      {
        label: "Bloom",
        start_s: 0,
        end_s: 45,
        water_g: dose_g * 3,
        notes: "Your notes",
      },
      // ... more steps
    ],
    template_id: "my_template",
  };
}
```

### 4. UI Improvements

The UI uses Tailwind CSS and is intentionally minimal. Improvements are welcome:

- Better mobile responsiveness
- Accessibility enhancements
- Visual improvements (keep it simple!)
- Additional helpful information

### 5. Documentation

Help improve:
- This file
- README.md
- Code comments
- The ADDING_CATALOG_ITEMS guide

## Code Style

- Use TypeScript strict mode
- Follow existing patterns
- Keep functions small and focused
- Add comments for complex logic
- Use meaningful variable names

## Testing Your Changes

1. Run dev server: `npm run dev`
2. Test all form combinations
3. Verify recipe output makes sense
4. **Run build**: `npm run build` (must succeed!)
5. Check for TypeScript errors: `npx tsc --noEmit`

## Pull Request Process

1. Ensure your code builds successfully
2. Update documentation if needed
3. Write a clear PR description:
   - What does this change?
   - Why is it needed?
   - How did you test it?
4. Link any related issues

## Questions?

Open an issue or start a discussion. We're friendly!

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to make better coffee.
