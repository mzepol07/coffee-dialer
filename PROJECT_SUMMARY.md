# Project Summary: Pour-Over Recipe Finder

## Overview

A fully functional, open-source Next.js web application that generates personalized pour-over coffee recipes. Built to deploy seamlessly on Vercel with clean architecture for community contributions.

## Completed Features

### Core Functionality
- ✅ Smart recipe generation based on equipment and coffee characteristics
- ✅ 7 grinders in catalog (conical & flat burrs, various fines profiles)
- ✅ 6 brewers (V60 variants, Switch, Chemex)
- ✅ 4 filter types with flow and clarity characteristics
- ✅ 3 recipe templates (V60 3-pour, Switch hybrid, Chemex 2-pour)
- ✅ Composable rules engine with 5 adjusters
- ✅ Grind setting mapping to specific grinder scales
- ✅ Shareable URLs via query parameters
- ✅ **Coffee blend handling** with intelligent processing logic
- ✅ Temperature display in both Fahrenheit and Celsius

### Architecture
- ✅ Catalog system with typed data (grinders, brewers, filters)
- ✅ Composable adjuster pattern for recipe modifications
- ✅ Template system for base recipes
- ✅ Type-safe TypeScript throughout
- ✅ Clean separation: catalog → engine → UI

### UI
- ✅ Home page with comprehensive form
- ✅ Visually separated form sections (Equipment, Coffee, Brewing Parameters)
- ✅ Custom stylesheet (app/styles.css) with reusable CSS classes
- ✅ Recipe display page with detailed instructions
- ✅ Pour plan with timing and water amounts
- ✅ Educational "Why These Settings?" section
- ✅ Grind adjustment tips
- ✅ Dark mode support via Tailwind
- ✅ Responsive design

### Deployment Ready
- ✅ `npm run build` succeeds
- ✅ `npm run dev` works locally
- ✅ Vercel-compatible (no special config needed)
- ✅ Static generation for optimal performance

### Documentation
- ✅ README.md with examples and deployment instructions
- ✅ LICENSE (MIT)
- ✅ CONTRIBUTING.md with clear guidelines
- ✅ ADDING_CATALOG_ITEMS.md with detailed instructions
- ✅ QUICKSTART.md for rapid onboarding
- ✅ GitHub issue template for adding grinders
- ✅ **BLEND_HANDLING.md** with comprehensive blend logic documentation

## Rules Engine Behavior

### Adjusters Implemented
1. **Processing Adjuster**
   - Washed: +3°F (+2°C), finer grind, more agitation
   - Honey: -2°F (-1°C), coarser grind, less agitation
   - Pulped Natural: -3°F (-2°C), coarser grind, minimal agitation
   - Natural/Anaerobic: -5°F (-3°C), very coarse grind, minimal agitation
   - Natural: -5°F (-3°C), coarse grind, minimal agitation
   - Anaerobic: -5°F (-3°C), coarse grind, minimal agitation
   - Wet Hulled: -2°F (-1°C), coarser grind, gentler approach
   - **Blend/Mixed/Unknown: 0°F (0°C), balanced defaults, roast-driven**

2. **Roast Adjuster**
   - Light: +2°F (+1°C) (denser beans)
   - Medium-Light: baseline
   - Medium: -3°F (-2°C), coarser grind

3. **Altitude Adjuster**
   - ≥6000ft: +3°F (+2°C), finer grind (very dense beans)
   - 4500-6000ft: +1°F (+0.5°C)
   - <4500ft: -1°F (-0.5°C), coarser grind

4. **Filter Adjuster**
   - Slow flow: coarser grind, less agitation
   - Fast flow: finer grind
   - Neutral: no change

5. **Grinder Adjuster**
   - Conical + high fines: coarser grind, gentle agitation
   - Flat + low fines: finer grind
   - Medium fines: baseline

### Brewer Selection (when set to "Auto")
- Default: V60
- Special case: Switch chosen when goal=sweet AND processing=washed AND roast=light AND altitude≥6000

### Constraints
- Temperature: 195-212°F (91-100°C)
- Grind index: 0-2 (0=fine, 1=medium, 2=coarse)
- Pour plan totals always match final water amount

### Blend Handling

The system intelligently handles coffee blends without defaulting to "washed" processing:

**Processing Types:**
- Standard: washed, honey, pulped_natural, natural, natural_anaerobic, anaerobic, wet_hulled
- Blend-specific: mixed, blend, unknown

**Blend Logic:**
1. **Single-origin** → Use provided processing method normally
2. **Uniform blend** (all components same) → Use that processing method
3. **Mixed processing blend** → Set to "mixed", use balanced defaults
4. **Unknown blend** → Set to "blend" or "unknown", never default to washed

**Balanced Defaults for Blends:**
- No processing-based temperature adjustment (0°F/0°C)
- Medium grind baseline
- Standard agitation
- Roast level becomes primary driver
- Brew method is secondary driver
- Summary emphasizes "adjust by taste"

**See:** `docs/BLEND_HANDLING.md` for comprehensive documentation

## Example Recipes Generated

### Test Case 1: High-altitude washed light (clarity)
- Input: K-Ultra, auto brewer, white filter, washed, light, 6500ft, clarity, 15g
- Output: V60, 210°F, fine grind (6.4-6.8), 15.5:1 ratio
- Reasons: High altitude (+3°F), light roast (+2°F), washed processing (+3°F, finer)

### Test Case 2: High-altitude washed light (sweet)
- Input: K-Ultra, auto brewer, white filter, washed, light, 6500ft, sweet, 20g
- Output: **Switch** (auto-selected), 203°F, fine-medium grind, 16:1 ratio
- Reasons: Auto-selected Switch for sweetness, includes immersion phase

### Test Case 3: Natural anaerobic (clarity)
- Input: Ode Gen 2, V60 plastic, white filter, natural_anaerobic, light, clarity, 15g
- Output: V60, 197°F, coarse grind (6-7), minimal agitation
- Reasons: Very soluble coffee requires cool water and coarse grind

### Test Case 4: Chemex
- Input: DF64, Chemex, bonded filter, washed, medium-light, clarity, 30g
- Output: Chemex 2-pour, 205°F, medium-coarse grind (24-28), 16.5:1 ratio
- Reasons: Thick filter requires coarser grind

## File Structure

```
coffee-dialer/
├── app/
│   ├── globals.css
│   ├── styles.css            # Custom component styles
│   ├── layout.tsx
│   ├── page.tsx              # Home form
│   └── recipe/
│       └── page.tsx          # Recipe display
├── catalog/
│   ├── types.ts              # Type definitions
│   ├── grinders.ts           # 7 grinders
│   ├── brewers.ts            # 6 brewers
│   ├── filters.ts            # 4 filters
│   └── index.ts
├── engine/
│   ├── types.ts              # Engine types
│   ├── templates.ts          # 3 templates
│   ├── recommend.ts          # Main orchestration
│   ├── explain.ts            # Summary generation
│   ├── blendUtils.ts         # Blend processing utilities
│   ├── adjusters/
│   │   ├── processingAdjuster.ts
│   │   ├── roastAdjuster.ts
│   │   ├── altitudeAdjuster.ts
│   │   ├── filterAdjuster.ts
│   │   ├── grinderAdjuster.ts
│   │   └── index.ts
│   └── __tests__/
│       └── blendHandling.test.ts
├── docs/
│   ├── ADDING_CATALOG_ITEMS.md
│   └── BLEND_HANDLING.md
├── .github/
│   └── ISSUE_TEMPLATE/
│       └── add_grinder.md
├── README.md
├── CONTRIBUTING.md
├── QUICKSTART.md
├── LICENSE
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vercel.json
```

## Deployment Instructions

### Via Vercel (Recommended)

1. Push code to GitHub
2. Import in Vercel
3. Vercel auto-detects Next.js
4. Click Deploy
5. Done!

No environment variables needed. No special configuration.

### Local Testing

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # Verify production build
```

## Extension Points for Future Development

### Easy Extensions (No Architecture Changes)
- Add more grinders to catalog
- Add more brewers (Kalita, Orea, etc.)
- Add more filters
- Tweak existing adjuster rules
- Add new templates for different brew methods

### Medium Extensions (Minor Architecture)
- Add new adjusters (e.g., water mineral content)
- Support custom dose amounts beyond 15/20/30g
- Add recipe scaling (multiply everything by factor)
- Temperature unit toggle (°F/°C)
- Recipe favorites (localStorage)

### Advanced Extensions (Requires New Features)
- User accounts and saved recipes (requires DB)
- Community recipe ratings
- Recipe comments and variations
- Mobile app version
- Brew timer interface

## Why This Architecture?

### Catalog Separation
- Easy for non-technical users to contribute data
- JSON-like structure for simple catalog additions
- Type-safe but approachable

### Composable Adjusters
- Each rule is isolated and testable
- Easy to add/remove/modify rules
- Clear reasoning output for each adjustment
- Order matters but is explicit

### Template System
- Base recipes reflect real-world techniques
- Templates can be brewer-specific
- Easy to add new brew methods

### No Database (V0)
- Zero infrastructure complexity
- Instant deploy on Vercel
- Stateless = simple scaling
- Can add DB later without breaking anything

## Success Metrics

- ✅ Builds successfully
- ✅ No TypeScript errors
- ✅ Routes work with query params
- ✅ Responsive on mobile
- ✅ Dark mode works
- ✅ Shareable URLs
- ✅ Clear documentation for contributors
- ✅ Vercel-ready out of the box

## Next Steps for Maintainers

1. Deploy to Vercel and update README with live URL
2. Add screenshot/demo GIF to README
3. Set up GitHub repository
4. Enable GitHub Discussions for community
5. Create first release (v0.1.0)
6. Share with r/Coffee and r/pourover

## Community Contribution Path

1. User opens issue: "Add Grinder X"
2. Uses issue template to provide details
3. Maintainer or user submits PR with catalog addition
4. Vercel automatically creates preview deployment
5. Test preview URL
6. Merge PR
7. Auto-deploy to production

Simple, fast, and approachable for coffee enthusiasts who may not be developers.
