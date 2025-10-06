# Fermix Frontend

Next.js 14 frontend for the Fermix exoplanet classification system.

## Features

- **Home Page**: Hero section with project overview and statistics
- **Demo**: Interactive prediction interface with feature input form
- **Dataset Explorer**: Paginated table with search and CSV download
- **Visualizations**: Feature importance charts, class distributions, and scatter plots
- **Model Card**: Detailed model documentation and performance metrics
- **About**: Project information, tech stack, and data sources

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: React Query (@tanstack/react-query) + Axios
- **Visualizations**: Plotly.js (react-plotly.js)
- **Icons**: Lucide React
- **Utilities**: clsx

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home page
│   ├── providers.tsx       # React Query provider
│   ├── demo/page.tsx       # Prediction demo
│   ├── dataset/page.tsx    # Dataset explorer
│   ├── visuals/page.tsx    # Charts and visualizations
│   ├── model/page.tsx      # Model card documentation
│   └── about/page.tsx      # About page
├── components/
│   ├── Navigation.tsx      # Main navigation bar
│   └── Footer.tsx          # Site footer
├── lib/
│   ├── config.ts           # API configuration
│   ├── types.ts            # TypeScript interfaces
│   ├── api.ts              # API client (Axios)
│   ├── hooks.ts            # React Query hooks
│   └── utils.ts            # Helper functions
└── types/
    └── react-plotly.d.ts   # Plotly type declarations
```

## Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

For production (Vercel):

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-railway-backend.railway.app/api/v1
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   ```
   http://localhost:3000
   ```

## API Integration

The frontend communicates with the FastAPI backend via:

- `GET /health` - Health check
- `GET /dataset` - Fetch exoplanet records
- `GET /stats` - Model performance metrics
- `POST /predict` - Classify exoplanet candidate

All API calls are wrapped in React Query hooks with automatic caching and refetching.

## Key Components

### Navigation (`components/Navigation.tsx`)
- Responsive navigation bar with active link highlighting
- Links to all main pages + external API docs

### Demo Page (`app/demo/page.tsx`)
- Form with 10 feature inputs (orbital, planetary, stellar parameters)
- Model selector (Random Forest / LightGBM)
- Real-time prediction results with confidence scores and probabilities

### Dataset Page (`app/dataset/page.tsx`)
- Paginated table of 9,564 Kepler observations
- Search functionality across all fields
- CSV download button

### Visuals Page (`app/visuals/page.tsx`)
- Feature importance bar chart
- Class distribution pie chart
- Scatter plots of orbital vs planetary parameters

## Type Safety

All API responses are fully typed with TypeScript interfaces in `lib/types.ts`:
- `PredictionInput` / `PredictionOutput`
- `DatasetResponse` / `ExoplanetRecord`
- `StatsResponse` / `ModelMetrics`
- `HealthResponse`

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Import project in Vercel**
3. **Add environment variable:**
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app/api/v1
   ```
4. **Deploy**

Build command: `npm run build`  
Output directory: `.next`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Notes

- **SSR**: Plotly charts are loaded client-side with `dynamic()` to avoid SSR issues
- **Caching**: React Query caches API responses with configurable stale times
- **Error Handling**: All API calls include error boundaries and loading states
- **Responsive**: All pages are mobile-friendly with Tailwind breakpoints

## License

Built with NASA Kepler data for educational and research purposes.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
