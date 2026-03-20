# Long-Term Memory

## Project: Paketci App (Kurye Sistemi)

### Overview
Professional courier management system with B2B focus, supporting restaurants, dealers, regional managers, and couriers.

### Key Technical Decisions

#### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Maps**: Leaflet + React-Leaflet (custom markers, heatmaps)
- **Charts**: Recharts (comprehensive analytics)
- **Animations**: Framer Motion (smooth UX)
- **Icons**: Lucide React

#### Backend Stack
- **Framework**: NestJS
- **Database**: PostgreSQL + TypeORM
- **Auth**: JWT-based with role-based access

### Role Hierarchy
1. Super Admin (system-wide)
2. Company Admin (company-wide)
3. Regional Manager (region-wide)
4. Manager (restaurant)
5. Accountant
6. Field Sales
7. Operations Support
8. Dealer
9. Restaurant
10. Courier

### Major Features Implemented

#### March 2026
- ✅ Professional map with live tracking, heatmaps, route visualization
- ✅ Comprehensive analytics dashboard with 6 chart types
- ✅ Role-based access control for all 10 user types
- ✅ Tabbed dashboard interface (Overview/Analytics/Map)
- ✅ GitHub repository setup with auto-sync

### GitHub Repository
- **URL**: https://github.com/hunkarylmaz/paketci-app
- **Branch**: master
- **Auto-sync**: Hourly via cron job

### Important Notes
- GitHub has 100MB file size limit - use git-filter-repo if needed
- Node modules should never be committed
- Use tar.gz archives for backups, not git
