# Quick Start Guide

## For Users

1. Visit the deployed site (after deployment)
2. Fill in the form:
   - Select your grinder
   - Choose your brewer (or leave as "Auto")
   - Select your filter
   - Describe your coffee (processing, roast, optional altitude)
   - Choose your brewing goal
3. Click "Generate Recipe"
4. Follow the recipe instructions!

## For Developers

### Local Development

```bash
# Clone the repo
git clone https://github.com/yourusername/coffee-dialer.git
cd coffee-dialer

# Install dependencies
npm install

# Run dev server
npm run dev
# Visit http://localhost:3000
```

### Building

```bash
npm run build
npm start
```

### Deployment

1. Push to GitHub
2. Import in Vercel
3. Deploy (automatic configuration)

### Adding Your Grinder

1. Open `catalog/grinders.ts`
2. Add your entry:
   ```typescript
   {
     id: "my_grinder",
     name: "My Grinder Name",
     burr_type: "conical",
     fines_bias: "medium",
     scale_type: "clicks",
     ranges: {
       fine_range: "16-18",
       medium_range: "18-22",
       coarse_range: "22-26",
     },
   }
   ```
3. Test locally
4. Submit a PR

### Project Architecture

- **Catalog**: Static data (grinders, brewers, filters)
- **Engine**: Business logic (templates + adjusters)
- **Templates**: Base recipes for each brewer type
- **Adjusters**: Composable functions that modify recipes based on coffee characteristics

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## Common Tasks

### Test a specific recipe combination

Navigate to:
```
http://localhost:3000/recipe?grinder=k_ultra&brewer=v60_plastic&filter=hario_white&processing=washed&roast=light&goal=clarity&dose=15&altitude=6500
```

### Run type checking

```bash
npx tsc --noEmit
```

### Lint code

```bash
npm run lint
```
