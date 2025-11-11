# Logistics Network Optimization Dashboard

A real-time analytics dashboard for logistics network optimization, providing comprehensive insights into delivery performance, route efficiency, cost analysis, and bottleneck identification.

## Features

### 📊 Real-Time Analytics
- Live dashboard updates every 5 seconds with fresh metrics
- Dynamic KPI monitoring with trend indicators
- Interactive data visualization using Recharts

### 🚚 Route Performance Analysis
- Comprehensive route efficiency metrics
- Cost per mile calculations
- On-time delivery rate tracking
- Performance rankings and recommendations
- Route optimization suggestions

### 💰 Cost Analysis
- Detailed cost breakdown (Fuel, Labor, Maintenance, Overhead)
- Cost distribution visualization
- Highest cost route identification
- Cost per mile efficiency tracking

### 🔍 Bottleneck Detection
- Automated identification of network bottlenecks
- Severity-based categorization (High, Medium, Low)
- Impact assessment for each bottleneck
- Actionable insights for improvement

### 📈 Trend Monitoring
- Historical delivery trends
- Cost trend analysis
- On-time delivery rate tracking over time

### 📤 Report Export
- JSON export functionality for detailed reports
- Comprehensive summary statistics
- Route performance snapshots

## Technology Stack

### Frontend Framework
- **Next.js 16.0.0** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript** - Type-safe development

### UI Components & Styling
- **Radix UI** - Accessible component primitives
- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **Lucide React** - Icon library
- **shadcn/ui** - Re-usable component system

### Data Visualization
- **Recharts** - Composable charting library

### Additional Libraries
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **date-fns** - Date manipulation
- **Sonner** - Toast notifications
- **Vercel Analytics** - Analytics integration

## Prerequisites

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/johaankjis/Logistics-Network-Optimization-Dashboard.git
cd Logistics-Network-Optimization-Dashboard
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

## Usage

### Development Mode

Start the development server:
```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the dashboard.

### Production Build

Build the application for production:
```bash
pnpm build
# or
npm run build
```

Start the production server:
```bash
pnpm start
# or
npm start
```

### Linting

Run the linter:
```bash
pnpm lint
# or
npm run lint
```

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main dashboard page
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── bottleneck-list.tsx  # Bottleneck display component
│   ├── cost-breakdown-chart.tsx # Cost visualization
│   ├── icons.tsx            # Icon components
│   ├── kpi-card.tsx         # KPI metric cards
│   ├── route-performance-table.tsx # Route analysis table
│   ├── theme-provider.tsx   # Theme management
│   └── trend-chart.tsx      # Trend visualization
├── hooks/                   # Custom React hooks
│   ├── use-mobile.ts        # Mobile detection hook
│   └── use-toast.ts         # Toast notification hook
├── lib/                     # Utility libraries
│   ├── analytics.ts         # Analytics & ETL functions
│   ├── mock-data.ts         # Mock data generation
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
├── styles/                  # Additional styles
├── components.json          # shadcn/ui configuration
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies and scripts
├── postcss.config.mjs       # PostCSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Key Components

### Main Dashboard (`app/page.tsx`)
The core dashboard component featuring:
- Four main tabs: Overview, Route Analysis, Cost Analysis, Bottlenecks
- Real-time data updates
- Export functionality
- Responsive layout

### Analytics Engine (`lib/analytics.ts`)
Provides data processing functions:
- `calculateKPIs()` - Compute key performance indicators
- `analyzeRoutePerformance()` - Route efficiency analysis
- `calculateTrends()` - Historical trend computation
- `identifyBottlenecks()` - Bottleneck detection algorithm

### Mock Data Generator (`lib/mock-data.ts`)
Generates realistic logistics data:
- Delivery records
- Route information
- Shipment details
- Cost breakdowns

## Dashboard Tabs

### Overview
- Total deliveries
- On-time delivery rate
- Average cost per delivery
- Fleet utilization
- Delivery trends
- Network summary

### Route Analysis
- Detailed performance table
- Top performing routes
- Most cost-efficient routes
- Routes needing improvement

### Cost Analysis
- Interactive cost breakdown chart
- Cost distribution by category
- Highest cost routes

### Bottlenecks
- Identified issues with severity levels
- Impact assessment
- Summary by severity

## Data Model

### Delivery
- Unique ID, shipment ID, route ID
- Origin and destination
- Distance and delivery time
- Cost and status
- Date timestamp

### Route
- Route identification
- Origin and destination
- Average metrics (distance, time, cost)
- Utilization rate
- Delivery count

### Cost Breakdown
- Fuel costs
- Labor costs
- Maintenance costs
- Overhead costs

## Development

### Adding New Components

The project uses shadcn/ui. To add new components:
```bash
pnpm dlx shadcn@latest add [component-name]
```

### Customizing Analytics

Modify the analytics functions in `lib/analytics.ts` to adjust:
- KPI calculations
- Performance metrics
- Bottleneck detection thresholds
- Trend analysis algorithms

### Extending Mock Data

Update `lib/mock-data.ts` to:
- Add new cities or routes
- Adjust data generation parameters
- Modify delivery distributions

## Configuration

### Next.js Config (`next.config.mjs`)
- TypeScript build errors are currently ignored
- Image optimization is disabled

### TypeScript Config (`tsconfig.json`)
- Strict mode enabled
- Path aliases configured (`@/*`)

## Performance Considerations

- Real-time updates occur every 5 seconds
- Mock data generates 500 deliveries per update
- Component rendering is optimized with React 19
- Server-side rendering for initial load

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project is private and proprietary.

## Contributing

This is a private repository. For contribution guidelines, please contact the repository owner.

## Support

For issues, questions, or support, please open an issue in the GitHub repository.
