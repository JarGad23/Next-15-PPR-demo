# Next.js PPR Demo with Authentication

A comprehensive demonstration of Next.js Partial Pre-rendering (PPR) with real authentication, database integration, and advanced caching strategies.

## Features

🚀 **Next.js 15 with PPR** - Partial Pre-rendering for optimal performance  
🔐 **Real Authentication** - JWT-based auth with secure session management  
🗄️ **Database Integration** - PostgreSQL with Drizzle ORM and Neon DB  
⚡ **tRPC v11** - End-to-end type safety with React Query  
🎨 **Modern UI** - shadcn/ui components with Tailwind CSS  
🛡️ **Error Boundaries** - Comprehensive error handling  
📊 **Real-time Analytics** - Dashboard with live data  
🔒 **Protected Routes** - Server-side authentication checks  

## Architecture Highlights

- **Server-side prefetching** with `HydrationBoundary`
- **Strategic caching** using `unstable_cache` (5-15 minutes for different data types)
- **Partial prerendering** on dynamic pages
- **Protected routes** with automatic redirects
- **Role-based access control** (user/admin)
- **Optimistic updates** with tRPC mutations
- **Build-time safe** database queries for static generation
- **Instant navigation** with server-side auth state

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- A Neon database (or any PostgreSQL database)

### 1. Clone and Install

```bash
git clone <your-repo>
cd next_ppr_demo
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Add your database URL and JWT secret:

```env
DATABASE_URL="postgresql://username:password@host:5432/database_name"
JWT_SECRET="your-secure-secret-key-here"
```

### 3. Database Setup

Generate and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

Seed the database with sample data:

```bash
npm run db:seed
```

### 4. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000`

## Demo Credentials

After seeding, you can login with:

- **Email:** `demo@example.com`
- **Password:** `password123`

## Quick Deployment to Vercel

1. **Fork this repository** to your GitHub account

2. **Create a Neon database**:
   - Go to [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

3. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository
   - Add environment variables:
     - `DATABASE_URL` = your Neon connection string
     - `JWT_SECRET` = a secure random string
   - Deploy!

4. **Seed your database** (optional):
   ```bash
   npm run db:seed
   ```

The app will automatically run migrations during deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── users/             # User management
│   ├── posts/             # Post details
│   ├── profile/           # Protected user profile
│   └── dashboard/         # Analytics dashboard
├── components/            # Reusable UI components
├── db/                    # Database schema and queries
│   ├── schema.ts          # Drizzle schema
│   ├── queries.ts         # Database operations
│   └── index.ts           # DB connection
├── server/                # Backend logic
│   ├── auth.ts            # Authentication logic
│   ├── context.ts         # tRPC context
│   └── api/trpc.ts        # tRPC router
└── utils/                 # Utilities and helpers
```

## Key Pages

### Public Pages
- **Home** (`/`) - PPR demo with server/client components
- **Dashboard** (`/dashboard`) - Real-time analytics
- **Users** (`/users`) - User directory
- **Posts** (`/posts/[id]`) - Individual post pages
- **Login/Signup** (`/auth/*`) - Authentication

### Protected Pages
- **Profile** (`/profile`) - User settings and activity

## PPR Implementation

The project demonstrates PPR in several ways:

1. **Static Shell + Dynamic Content** - Pages load instantly with progressive enhancement
2. **Server-side Prefetching** - Critical data preloaded on the server
3. **Client-side Hydration** - Seamless transition to interactive content
4. **Suspense Boundaries** - Granular loading states
5. **Error Boundaries** - Graceful error handling

## Build Output Analysis

Run `npm run build` to see PPR in action:

```
○ (Static)             - Prerendered as static content
◐ (Partial Prerender)  - Prerendered with dynamic content
ƒ (Dynamic)            - Server-rendered on demand
```

## Database Commands

```bash
# Generate migrations
npm run db:generate

# Apply migrations  
npm run db:migrate

# Open Drizzle Studio
npm run db:studio

# Seed sample data
npm run db:seed
```

## Authentication Flow

1. **Registration/Login** - Secure password hashing with bcrypt
2. **JWT Tokens** - Signed with JOSE for security
3. **Session Management** - Database-backed sessions
4. **Cookie Storage** - HttpOnly cookies for security
5. **Protected Routes** - Server-side authentication checks

## Technologies Used

- **Next.js 15** (Canary) with PPR
- **tRPC v11** with TanStack Query v5
- **Drizzle ORM** with PostgreSQL
- **shadcn/ui** with Radix primitives
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **React Error Boundary** for error handling

## Performance Optimizations

- **Removed artificial delays** for instant data fetching
- **Server-side caching** with `unstable_cache` for build-time safety
- **Optimized tRPC configuration** with reduced retries and smart refetching
- **Server-side navigation** with immediate auth state rendering
- **Comprehensive caching strategy** for optimal performance
- **Type-safe from database to UI** with full TypeScript integration
- **PPR-optimized** components for instant page loads

## Contributing

This is a demo project showcasing modern web development patterns. Feel free to explore, modify, and learn from the implementation.

## License

MIT License - feel free to use this code for learning and building awesome applications!