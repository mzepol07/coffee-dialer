# Pour-Over Recipe Finder

An open-source web app that generates personalized pour-over coffee recipes based on your grinder, brewer, beans, and brewing goals.

## Features

- **Smart Recipe Generation**: Get customized recipes based on:
  - Your grinder (burr type, fines production)
  - Your brewer (V60, Switch, Chemex)
  - Your filter type
  - Coffee processing method, roast level, and origin
  - Your brewing goal (clarity, balanced, or sweet)

- **Detailed Pour Plans**: Step-by-step instructions with timing and water amounts

- **Grind Setting Recommendations**: Specific settings mapped to your grinder's scale

- **Educational**: Learn why each parameter is set the way it is

- **Shareable**: Each recipe has a unique URL you can bookmark or share

## Demo

Visit the live app: [Deploy on Vercel to get URL]

### Example Recipes

Try these URLs (replace `localhost:3000` with your deployed domain):

1. **High-altitude washed light roast (clarity focus)**
   ```
   /recipe?grinder=k_ultra&brewer=auto&filter=hario_white&processing=washed&roast=light&goal=clarity&dose=15&altitude=6500
   ```
   Result: V60 recipe with hot water (210°F) and fine grind

2. **High-altitude washed light roast (sweet focus)**
   ```
   /recipe?grinder=k_ultra&brewer=auto&filter=hario_white&processing=washed&roast=light&goal=sweet&dose=20&altitude=6500
   ```
   Result: Switch recipe for maximum sweetness and body

3. **Honey processed medium-light**
   ```
   /recipe?grinder=comandante_c40&brewer=v60_ceramic&filter=hario_white&processing=honey&roast=medium_light&goal=balanced&dose=15
   ```
   Result: V60 with slightly cooler water and coarser grind

4. **Natural/anaerobic (clarity focus)**
   ```
   /recipe?grinder=ode_gen2&brewer=v60_plastic&filter=hario_white&processing=natural_anaerobic&roast=light&goal=clarity&dose=15
   ```
   Result: V60 with cool water (197°F), coarse grind, minimal agitation

5. **Chemex recipe**
   ```
   /recipe?grinder=df64_stock&brewer=chemex_6cup&filter=chemex_bonded&processing=washed&roast=medium_light&goal=clarity&dose=30
   ```
   Result: Two-pour Chemex recipe optimized for thick filters

## How to Run Locally

1. Clone the repository:
```bash
git clone https://github.com/yourusername/coffee-dialer.git
cd coffee-dialer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deploy on Vercel

The easiest way to deploy this app is using Vercel:

1. Push your code to a GitHub repository
2. Import the project in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build settings
4. Click "Deploy"

No environment variables or special configuration needed!

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Project Structure

```
coffee-dialer/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page with form
│   └── recipe/page.tsx    # Recipe display page
├── catalog/               # Data catalog
│   ├── types.ts          # TypeScript types
│   ├── grinders.ts       # Grinder database
│   ├── brewers.ts        # Brewer database
│   └── filters.ts        # Filter database
├── engine/               # Recipe engine
│   ├── types.ts         # Engine types
│   ├── templates.ts     # Base recipe templates
│   ├── adjusters/       # Composable adjustment rules
│   └── recommend.ts     # Main recommendation logic
└── docs/                # Documentation
    └── ADDING_CATALOG_ITEMS.md
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Ideas

- Add your grinder to the catalog
- Add new brewers or filters
- Improve recipe templates
- Add new adjustment rules
- Improve the UI

## License

MIT License - see [LICENSE](LICENSE) for details

## Acknowledgments

Built with coffee and code. Contributions welcome from the specialty coffee community!
