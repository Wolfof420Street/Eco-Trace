# EcoTrace — AI Agent Build Plan
## DEV Weekend Challenge: Earth Day Edition

> **Agent Instructions**: Read this entire document before writing a single line of code. Follow the phases in order. Do not skip ahead. Every architectural decision here is intentional — DRY, SOLID, Clean Architecture, and security-first. When in doubt, refer back to this document.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Principles](#2-architecture-principles)
3. [Tech Stack](#3-tech-stack)
4. [Design System](#4-design-system)
5. [Project Structure](#5-project-structure)
6. [Environment Variables](#6-environment-variables)
7. [Database Schema](#7-database-schema)
8. [Domain Models & Types](#8-domain-models--types)
9. [Core Libraries & Services](#9-core-libraries--services)
10. [API Routes](#10-api-routes)
11. [Server Actions](#11-server-actions)
12. [Page-by-Page Implementation](#12-page-by-page-implementation)
13. [Components Library](#13-components-library)
14. [Hooks](#14-hooks)
15. [Security Checklist](#15-security-checklist)
16. [Build Order (Phases)](#16-build-order-phases)
17. [Prize Category Evidence](#17-prize-category-evidence)
18. [DEV Post Outline](#18-dev-post-outline)

---

## 1. Project Overview

**EcoTrace** is a full-stack Next.js 14 app (App Router) that lets users track, visualize, and reduce their personal carbon footprint using AI-powered insights. Users log daily activities, see real-time CO₂ impact scores, chat with an AI that *remembers* their eco-journey across sessions, and earn on-chain badges minted on Solana for hitting sustainability milestones.

### Prize Categories Targeted (all 6)
| Category | Integration |
|---|---|
| ✅ Google Gemini | AI insight engine — routed through Backboard |
| ✅ Solana | NFT eco-badges via Metaplex Bubblegum (cNFTs on devnet) |
| ✅ GitHub Copilot | Documented as coding assistant throughout DEV post |
| ✅ Backboard | Persistent AI memory layer — EcoTrace AI remembers your eco-journey |
| ✅ Auth0 for Agents | User auth + Token Vault for Calendar/Gmail agent scanning + CIBA push approval |
| ✅ Snowflake | Emission factors DB + anonymous community percentile benchmarking |

---

## 2. Architecture Principles

### Clean Architecture Layers
```
app/               → Presentation Layer (pages, layouts, UI components)
  ├── (auth)/      → Auth group
  ├── (app)/       → Protected app group
  └── api/         → API Routes (HTTP adapters only — thin, no business logic)

src/
  ├── domain/      → Domain Layer (entities, value objects, interfaces — pure TS, zero deps)
  ├── application/ → Application Layer (use cases, DTOs — orchestrates domain)
  ├── infrastructure/ → Infrastructure Layer (DB, external APIs, repos — implements interfaces)
  └── presentation/ → Presentation helpers (mappers, view models)
```

### SOLID Principles Applied
- **S** — Every module has one reason to change. `CarbonCalculator` only calculates. `ActivityRepository` only persists. `GeminiClient` only calls Gemini.
- **O** — Emission factor providers are open for extension (add new categories) without modifying the calculator.
- **L** — All repositories implement interfaces (`IActivityRepository`). Swap Snowflake for Supabase without touching business logic.
- **I** — Clients only depend on interfaces they use. `IReadRepository` vs `IWriteRepository` split where needed.
- **D** — High-level modules (use cases) depend on abstractions (interfaces), not concrete implementations (Supabase/Snowflake classes).

### DRY Principles Applied
- Single source of truth for emission factors (Snowflake DB, seeded once)
- Shared `ApiResponse<T>` wrapper for all API routes
- Shared `withAuth` middleware wrapper — never repeat auth checks
- Shared `withValidation` wrapper using Zod schemas — never repeat validation
- All date formatting, number formatting, CO₂ equivalency strings live in `src/domain/utils/` — imported everywhere, defined once

---

## 3. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | RSC + Server Actions + API Routes |
| Language | TypeScript (strict mode) | Type safety end-to-end |
| Styling | Tailwind CSS + CSS Variables | Design tokens, dark/light mode |
| Fonts | Fraunces (display) + DM Mono (data) + Geist (body) | Distinctive, non-generic |
| Auth | Auth0 for Agents | User auth + Token Vault + CIBA |
| AI Memory | Backboard | Persistent memory across sessions, routes to Gemini |
| AI Model | Google Gemini 1.5 Flash (via Backboard) | Fast, capable, prize category |
| Blockchain | Solana devnet + Metaplex Bubblegum | cNFT eco-badges |
| Database | Supabase (Postgres + RLS) | User data, activities, badges |
| Analytics DB | Snowflake | Emission factors, community benchmarking |
| Charts | Recharts | Composable, accessible charts |
| Animations | Framer Motion | Page transitions, spring physics |
| Validation | Zod | Runtime type safety, shared client/server |
| Forms | React Hook Form + Zod resolver | Controlled, validated forms |
| Icons | Lucide React | Consistent icon system |
| Deployment | Vercel | Edge functions, env management |

---

## 4. Design System

### Aesthetic Direction: "Bioluminescent Data" 
Dark forest depths with glowing data points. Organic shapes meet precise data visualization. The UI feels like looking at the Earth from space — dark, beautiful, with living light underneath. Light mode inverts to "Sunlit Canopy" — warm cream backgrounds with deep forest greens and amber accents.

### Color Tokens (CSS Variables)

```css
/* globals.css */
:root {
  /* Light Mode — "Sunlit Canopy" */
  --bg-base:          #f5f0e8;   /* Warm parchment */
  --bg-surface:       #ede8dc;   /* Slightly deeper */
  --bg-elevated:      #ffffff;
  --bg-overlay:       rgba(245, 240, 232, 0.85);

  --accent-primary:   #1a6b3c;   /* Deep forest green */
  --accent-secondary: #2d9a5f;   /* Mid canopy */
  --accent-glow:      #4cc97a;   /* Bioluminescent green */
  --accent-amber:     #c47c2b;   /* Warm sun */
  --accent-red:       #c0392b;   /* Alert */

  --text-primary:     #0d1f0f;
  --text-secondary:   #3d5c42;
  --text-muted:       #7a9b7f;
  --text-inverse:     #f5f0e8;

  --border:           rgba(26, 107, 60, 0.15);
  --border-strong:    rgba(26, 107, 60, 0.35);
  --shadow-sm:        0 1px 3px rgba(13, 31, 15, 0.08);
  --shadow-md:        0 4px 16px rgba(13, 31, 15, 0.12);
  --shadow-lg:        0 16px 48px rgba(13, 31, 15, 0.18);
  --glow-green:       0 0 24px rgba(76, 201, 122, 0.35);
  --glow-amber:       0 0 24px rgba(196, 124, 43, 0.35);

  --radius-sm:        6px;
  --radius-md:        12px;
  --radius-lg:        20px;
  --radius-xl:        32px;
  --radius-full:      9999px;
}

[data-theme="dark"] {
  /* Dark Mode — "Bioluminescent Depths" */
  --bg-base:          #050e07;   /* Deep forest black */
  --bg-surface:       #0a1a0c;   /* Dark moss */
  --bg-elevated:      #0f2414;   /* Elevated card */
  --bg-overlay:       rgba(5, 14, 7, 0.90);

  --accent-primary:   #4cc97a;   /* Bioluminescent green — inverted role */
  --accent-secondary: #2d9a5f;
  --accent-glow:      #7fffab;   /* Bright glow */
  --accent-amber:     #f0a855;
  --accent-red:       #ff6b6b;

  --text-primary:     #e8f5eb;
  --text-secondary:   #86c99a;
  --text-muted:       #4a7a58;
  --text-inverse:     #050e07;

  --border:           rgba(76, 201, 122, 0.12);
  --border-strong:    rgba(76, 201, 122, 0.28);
  --shadow-sm:        0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md:        0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg:        0 16px 48px rgba(0, 0, 0, 0.6);
  --glow-green:       0 0 32px rgba(76, 201, 122, 0.4);
  --glow-amber:       0 0 32px rgba(240, 168, 85, 0.4);
}
```

### Typography Scale

```css
/* Use next/font to load these */
--font-display: 'Fraunces', Georgia, serif;     /* Headlines, hero text */
--font-body:    'Geist', system-ui, sans-serif;  /* Body copy, UI text */
--font-mono:    'DM Mono', monospace;             /* CO₂ numbers, data */

--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */
--text-5xl:  3rem;      /* 48px */
--text-6xl:  3.75rem;   /* 60px */
--text-7xl:  5rem;      /* 80px — hero only */
```

### Motion Tokens

```css
--duration-fast:   150ms;
--duration-base:   250ms;
--duration-slow:   400ms;
--duration-slower: 700ms;
--ease-out:        cubic-bezier(0.0, 0.0, 0.2, 1);
--ease-spring:     cubic-bezier(0.175, 0.885, 0.32, 1.275);
--ease-organic:    cubic-bezier(0.37, 0, 0.63, 1);
```

### Component Design Patterns
- **Cards**: Subtle border + `var(--bg-elevated)` + `var(--shadow-md)`. Hover lifts with `translateY(-2px)` + stronger shadow.
- **Glow Elements**: Earned badges, active states, score rings use `box-shadow: var(--glow-green)`. Pulsing animation on "live" elements.
- **Noise Texture**: Subtle SVG noise overlay on hero backgrounds (5% opacity) for organic depth.
- **Data Numbers**: Always rendered in `--font-mono` with tabular-nums. CO₂ values animate up/down on change.
- **Score Ring**: SVG `stroke-dasharray/dashoffset` animated with Framer Motion spring. Color lerps green → amber → red based on value.
- **Shimmer**: Loading skeletons use a moving gradient animation (`@keyframes shimmer`).

---

## 5. Project Structure

```
ecotrace/
├── app/                                  # Next.js App Router
│   ├── layout.tsx                        # Root layout: fonts, theme provider, Auth0 provider
│   ├── globals.css                       # CSS variables, base styles, animations
│   ├── (auth)/                           # Auth route group (no sidebar)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/page.tsx             # Auth0 callback handler
│   ├── (app)/                            # Protected route group (with sidebar)
│   │   ├── layout.tsx                    # AppShell with sidebar + navbar
│   │   ├── dashboard/page.tsx
│   │   ├── log/page.tsx
│   │   ├── insights/page.tsx
│   │   ├── badges/page.tsx
│   │   └── settings/page.tsx
│   ├── page.tsx                          # Landing page (public)
│   └── api/
│       ├── auth/
│       │   └── [...auth0]/route.ts       # Auth0 dynamic route handler
│       ├── carbon/
│       │   └── calculate/route.ts        # POST: calculate CO₂ for activity
│       ├── activities/
│       │   ├── route.ts                  # GET: list, POST: create
│       │   └── [id]/route.ts             # DELETE
│       ├── ai/
│       │   ├── chat/route.ts             # POST: Backboard chat (streaming)
│       │   ├── tip/route.ts              # POST: generate tip after log
│       │   └── summary/route.ts          # POST: weekly AI narrative
│       ├── badges/
│       │   ├── route.ts                  # GET: user badges
│       │   └── mint/route.ts             # POST: mint badge on Solana
│       ├── community/
│       │   └── percentile/route.ts       # GET: Snowflake community ranking
│       └── agent/
│           └── scan/route.ts             # POST: Auth0 Token Vault calendar scan
│
├── src/
│   ├── domain/                           # Pure business logic — no framework deps
│   │   ├── entities/
│   │   │   ├── Activity.ts
│   │   │   ├── Badge.ts
│   │   │   ├── CarbonScore.ts
│   │   │   └── UserProfile.ts
│   │   ├── value-objects/
│   │   │   ├── CO2Amount.ts              # Branded type: number + unit validation
│   │   │   ├── EmissionFactor.ts
│   │   │   └── DateRange.ts
│   │   ├── interfaces/
│   │   │   ├── IActivityRepository.ts
│   │   │   ├── IBadgeRepository.ts
│   │   │   ├── IEmissionFactorRepository.ts
│   │   │   ├── ICommunityRepository.ts
│   │   │   └── IAIService.ts
│   │   ├── constants/
│   │   │   ├── emission-categories.ts    # Category/subcategory definitions
│   │   │   └── badge-definitions.ts      # Badge metadata
│   │   └── utils/
│   │       ├── carbon-equivalencies.ts   # "= X trees = Y km of driving"
│   │       ├── date-utils.ts
│   │       └── formatters.ts             # CO₂ display formatting
│   │
│   ├── application/                      # Use cases — orchestrates domain
│   │   ├── use-cases/
│   │   │   ├── LogActivityUseCase.ts
│   │   │   ├── GetDashboardDataUseCase.ts
│   │   │   ├── GetAIInsightsUseCase.ts
│   │   │   ├── CheckMilestonesUseCase.ts
│   │   │   ├── MintBadgeUseCase.ts
│   │   │   └── GetCommunityPercentileUseCase.ts
│   │   └── dtos/
│   │       ├── ActivityDTO.ts
│   │       ├── DashboardDTO.ts
│   │       ├── BadgeDTO.ts
│   │       └── InsightDTO.ts
│   │
│   ├── infrastructure/                   # External system implementations
│   │   ├── supabase/
│   │   │   ├── client.ts                 # Browser Supabase client (singleton)
│   │   │   ├── server.ts                 # Server Supabase client (per-request)
│   │   │   ├── ActivityRepository.ts     # Implements IActivityRepository
│   │   │   └── BadgeRepository.ts        # Implements IBadgeRepository
│   │   ├── snowflake/
│   │   │   ├── connection.ts             # Singleton pool manager
│   │   │   ├── EmissionFactorRepository.ts # Implements IEmissionFactorRepository
│   │   │   └── CommunityRepository.ts    # Implements ICommunityRepository
│   │   ├── backboard/
│   │   │   ├── client.ts                 # Backboard API client
│   │   │   └── AIService.ts              # Implements IAIService
│   │   ├── auth0/
│   │   │   ├── client.ts                 # Auth0 SDK config
│   │   │   └── AgentToolsService.ts      # Token Vault + CIBA flows
│   │   └── solana/
│   │       ├── connection.ts             # RPC connection singleton
│   │       └── BadgeMintService.ts       # Metaplex Bubblegum cNFT minting
│   │
│   └── presentation/
│       ├── mappers/
│       │   ├── activity.mapper.ts        # Entity → DTO → View Model
│       │   ├── badge.mapper.ts
│       │   └── dashboard.mapper.ts
│       └── view-models/
│           ├── ActivityViewModel.ts
│           ├── DashboardViewModel.ts
│           └── BadgeViewModel.ts
│
├── components/                           # React UI components
│   ├── ui/                               # Primitive components (design system atoms)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── ThemeToggle.tsx
│   ├── layout/
│   │   ├── AppShell.tsx                  # Sidebar + main area
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── CarbonScoreRing.tsx           # Animated SVG ring
│   │   ├── WeeklyChart.tsx               # Area chart with Recharts
│   │   ├── CategoryBreakdown.tsx         # Donut chart
│   │   ├── ActivityFeed.tsx
│   │   ├── CommunityBenchmark.tsx        # Snowflake percentile widget
│   │   ├── DailyAITip.tsx                # Backboard-generated tip
│   │   └── QuickActions.tsx
│   ├── log/
│   │   ├── CategoryPicker.tsx
│   │   ├── SubcategoryPicker.tsx
│   │   ├── ActivityForm.tsx
│   │   └── CO2Preview.tsx                # Real-time equivalency display
│   ├── insights/
│   │   ├── BackboardChat.tsx             # Persistent memory chat UI
│   │   ├── WeeklySummary.tsx
│   │   ├── TipCard.tsx
│   │   └── WhatIfScenario.tsx
│   ├── badges/
│   │   ├── BadgeGrid.tsx
│   │   ├── BadgeCard.tsx                 # Locked / earned / minted states
│   │   ├── MintFlow.tsx                  # Wallet connect + mint UI
│   │   └── WalletConnect.tsx
│   └── agent/
│       ├── AgentScanButton.tsx           # Trigger Calendar/Gmail scan
│       └── ApprovalNotification.tsx      # CIBA human-in-the-loop UI
│
├── hooks/
│   ├── useActivities.ts
│   ├── useDashboard.ts
│   ├── useCarbonScore.ts
│   ├── useBackboardChat.ts               # Chat state + streaming
│   ├── useWallet.ts
│   ├── useBadges.ts
│   ├── useTheme.ts
│   └── useCommunityPercentile.ts
│
├── lib/
│   ├── api-client.ts                     # Typed fetch wrapper for client-side API calls
│   └── cn.ts                             # clsx + tailwind-merge utility
│
├── middleware.ts                          # Auth0 session guard + route protection
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json                          # strict: true
```

---

## 6. Environment Variables

### `.env.local` (never commit — add to `.gitignore`)

```bash
# ─── Auth0 ─────────────────────────────────────────────────────────────
AUTH0_SECRET=<32-char random string: openssl rand -hex 32>
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://<your-tenant>.auth0.com
AUTH0_CLIENT_ID=<auth0 client id>
AUTH0_CLIENT_SECRET=<auth0 client secret>
# Auth0 Token Vault (for Agent Calendar/Gmail access)
AUTH0_AUDIENCE=https://<your-tenant>.auth0.com/api/v2/

# ─── Supabase ───────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>

# ─── Snowflake ──────────────────────────────────────────────────────────
SNOWFLAKE_ACCOUNT=<account-identifier>
SNOWFLAKE_USERNAME=<username>
SNOWFLAKE_PASSWORD=<password>
SNOWFLAKE_DATABASE=ECOTRACE
SNOWFLAKE_SCHEMA=PUBLIC
SNOWFLAKE_WAREHOUSE=COMPUTE_WH
SNOWFLAKE_ROLE=SYSADMIN

# ─── Backboard (AI Memory + Gemini routing) ─────────────────────────────
BACKBOARD_API_KEY=<backboard api key>
BACKBOARD_ASSISTANT_ID=<ecotrace assistant id>
# Backboard routes to Gemini — no separate Gemini key needed on server
# (Backboard uses your BYOK or their shared pool)

# ─── Solana ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_MINT_AUTHORITY_KEYPAIR=<base58 encoded keypair>

# ─── App ────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
```

### `.env.local.example` (commit this)
Same as above with all values replaced by `<description>` placeholders.

---

## 7. Database Schema

### Supabase (Postgres)

```sql
-- ─── Enable UUID extension ────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles (extends Auth0 user) ────────────────────────────────────
CREATE TABLE profiles (
  id            UUID PRIMARY KEY,           -- Auth0 sub (e.g. auth0|abc123)
  username      TEXT,
  avatar_url    TEXT,
  streak_days   INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_co2_kg  DECIMAL(10,3) DEFAULT 0,
  onboarded     BOOLEAN DEFAULT FALSE,
  region        TEXT,                       -- Broad region for Snowflake anon reporting
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Activities ────────────────────────────────────────────────────────
CREATE TABLE activities (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category      TEXT NOT NULL CHECK (category IN ('transport','food','energy','goods')),
  subcategory   TEXT NOT NULL,
  quantity      DECIMAL(10,3) NOT NULL CHECK (quantity > 0),
  unit          TEXT NOT NULL,
  co2_kg        DECIMAL(10,4) NOT NULL CHECK (co2_kg >= 0),
  notes         TEXT,
  source        TEXT DEFAULT 'manual' CHECK (source IN ('manual','agent_scan')),
  logged_at     TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_activities_user_logged ON activities(user_id, logged_at DESC);
CREATE INDEX idx_activities_user_category ON activities(user_id, category);

-- ─── User Badges ───────────────────────────────────────────────────────
CREATE TABLE user_badges (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id            TEXT NOT NULL,
  earned_at           TIMESTAMPTZ DEFAULT NOW(),
  minted              BOOLEAN DEFAULT FALSE,
  solana_mint_address TEXT,
  solana_tx_signature TEXT,
  UNIQUE(user_id, badge_id)
);

-- ─── Agent Scan Log (audit trail for Auth0 agent actions) ─────────────
CREATE TABLE agent_scan_log (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source        TEXT NOT NULL CHECK (source IN ('google_calendar','gmail')),
  scanned_at    TIMESTAMPTZ DEFAULT NOW(),
  items_found   INTEGER DEFAULT 0,
  items_approved INTEGER DEFAULT 0,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected'))
);

-- ─── Row Level Security ────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_scan_log ENABLE ROW LEVEL SECURITY;

-- Users read/write only their own data
CREATE POLICY "own_profile" ON profiles
  USING (id::TEXT = auth.uid());

CREATE POLICY "own_activities_read" ON activities FOR SELECT
  USING (user_id::TEXT = auth.uid());

CREATE POLICY "own_activities_write" ON activities FOR INSERT
  WITH CHECK (user_id::TEXT = auth.uid());

CREATE POLICY "own_activities_delete" ON activities FOR DELETE
  USING (user_id::TEXT = auth.uid());

CREATE POLICY "own_badges" ON user_badges
  USING (user_id::TEXT = auth.uid());

CREATE POLICY "own_agent_log" ON agent_scan_log
  USING (user_id::TEXT = auth.uid());

-- Service role bypasses RLS (used by server-side API routes only)
```

### Snowflake

```sql
-- ─── Database & Schema ────────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS ECOTRACE;
USE DATABASE ECOTRACE;
CREATE SCHEMA IF NOT EXISTS PUBLIC;

-- ─── Emission Factors (source of truth) ───────────────────────────────
CREATE TABLE IF NOT EXISTS EMISSION_FACTORS (
  ID            VARCHAR(64)   PRIMARY KEY,
  CATEGORY      VARCHAR(32)   NOT NULL,
  SUBCATEGORY   VARCHAR(64)   NOT NULL,
  FACTOR        FLOAT         NOT NULL,     -- kg CO₂e per unit
  UNIT          VARCHAR(16)   NOT NULL,
  LABEL         VARCHAR(128)  NOT NULL,
  SOURCE        VARCHAR(256),               -- e.g. "EPA 2024", "IPCC AR6"
  UPDATED_AT    TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  UNIQUE (CATEGORY, SUBCATEGORY)
);

-- ─── Community Daily Totals (anonymized — no PII) ─────────────────────
CREATE TABLE IF NOT EXISTS COMMUNITY_DAILY_TOTALS (
  ID            VARCHAR(64)   DEFAULT UUID_STRING() PRIMARY KEY,
  CO2_KG        FLOAT         NOT NULL,
  LOG_DATE      DATE          NOT NULL,
  REGION        VARCHAR(64),               -- broad region only, e.g. "europe", "north_america"
  CATEGORY_BREAKDOWN VARIANT                -- JSON: {transport: X, food: Y, ...}
);
CREATE INDEX IF NOT EXISTS IDX_CDT_DATE ON COMMUNITY_DAILY_TOTALS(LOG_DATE);

-- ─── Seed Emission Factors ────────────────────────────────────────────
INSERT INTO EMISSION_FACTORS (ID, CATEGORY, SUBCATEGORY, FACTOR, UNIT, LABEL, SOURCE) VALUES
  ('transport_car_petrol',  'transport', 'car_petrol',  0.192, 'km',    'Petrol Car',          'BEIS 2023'),
  ('transport_car_electric','transport', 'car_electric', 0.053, 'km',   'Electric Car',         'BEIS 2023'),
  ('transport_flight_short','transport', 'flight_short', 0.255, 'km',   'Short-haul Flight',    'ICAO 2023'),
  ('transport_flight_long', 'transport', 'flight_long',  0.195, 'km',   'Long-haul Flight',     'ICAO 2023'),
  ('transport_bus',         'transport', 'bus',          0.089, 'km',   'Bus',                  'BEIS 2023'),
  ('transport_train',       'transport', 'train',        0.041, 'km',   'Train',                'BEIS 2023'),
  ('transport_cycling',     'transport', 'cycling',      0.0,   'km',   'Cycling / Walking',    'N/A'),
  ('food_beef',             'food',      'beef',         27.0,  'kg',   'Beef',                 'OurWorldInData 2023'),
  ('food_chicken',          'food',      'chicken',      6.9,   'kg',   'Chicken',              'OurWorldInData 2023'),
  ('food_fish',             'food',      'fish',         6.1,   'kg',   'Fish',                 'OurWorldInData 2023'),
  ('food_dairy',            'food',      'dairy',        3.2,   'kg',   'Dairy',                'OurWorldInData 2023'),
  ('food_vegetables',       'food',      'vegetables',   0.4,   'kg',   'Vegetables',           'OurWorldInData 2023'),
  ('food_plant_protein',    'food',      'plant_protein',0.9,   'kg',   'Plant Protein (tofu/lentils)', 'OurWorldInData 2023'),
  ('energy_electricity',    'energy',    'electricity',  0.233, 'kWh',  'Electricity (grid avg)','IEA 2023'),
  ('energy_natural_gas',    'energy',    'natural_gas',  2.04,  'm3',   'Natural Gas',          'BEIS 2023'),
  ('energy_heating_oil',    'energy',    'heating_oil',  2.52,  'litre','Heating Oil',          'BEIS 2023'),
  ('goods_clothing',        'goods',     'clothing',     20.0,  'item', 'Clothing Item',        'WRAP 2023'),
  ('goods_electronics',     'goods',     'electronics',  70.0,  'item', 'Electronic Device',    'iNEMI 2022'),
  ('goods_streaming',       'goods',     'streaming',    0.036, 'hours','Video Streaming',      'IEA 2023');
```

---

## 8. Domain Models & Types

### Value Objects

```typescript
// src/domain/value-objects/CO2Amount.ts
export type CO2Amount = {
  readonly _brand: 'CO2Amount';
  readonly kg: number;
};

export function createCO2Amount(kg: number): CO2Amount {
  if (kg < 0) throw new Error('CO2Amount cannot be negative');
  return { _brand: 'CO2Amount', kg };
}

export function addCO2(a: CO2Amount, b: CO2Amount): CO2Amount {
  return createCO2Amount(a.kg + b.kg);
}
```

```typescript
// src/domain/value-objects/EmissionFactor.ts
export type EmissionFactor = {
  readonly id: string;
  readonly category: ActivityCategory;
  readonly subcategory: string;
  readonly factor: number;  // kg CO2e per unit
  readonly unit: string;
  readonly label: string;
  readonly source?: string;
};
```

### Entities

```typescript
// src/domain/entities/Activity.ts
import { CO2Amount } from '../value-objects/CO2Amount';

export type ActivityCategory = 'transport' | 'food' | 'energy' | 'goods';
export type ActivitySource = 'manual' | 'agent_scan';

export type Activity = {
  readonly id: string;
  readonly userId: string;
  readonly category: ActivityCategory;
  readonly subcategory: string;
  readonly quantity: number;
  readonly unit: string;
  readonly co2: CO2Amount;
  readonly notes?: string;
  readonly source: ActivitySource;
  readonly loggedAt: Date;
};
```

```typescript
// src/domain/entities/Badge.ts
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type BadgeState = 'locked' | 'earned' | 'minted';

export type BadgeDefinition = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly rarity: BadgeRarity;
  readonly artwork: string;          // path to SVG
  readonly threshold: BadgeThreshold | null;
};

export type BadgeThreshold = {
  readonly metric: BadgeMetric;
  readonly value: number;
  readonly operator: 'lt' | 'lte' | 'gt' | 'gte' | 'eq';
};

export type BadgeMetric =
  | 'first_log'
  | 'daily_co2_kg'
  | 'streak_days'
  | 'meat_free_days'
  | 'week_reduction_pct'
  | 'total_logs';

export type UserBadge = {
  readonly id: string;
  readonly userId: string;
  readonly badgeId: string;
  readonly definition: BadgeDefinition;
  readonly state: BadgeState;
  readonly earnedAt: Date;
  readonly solanaMintAddress?: string;
  readonly solanaTxSignature?: string;
};
```

```typescript
// src/domain/entities/UserProfile.ts
export type UserProfile = {
  readonly id: string;             // Auth0 sub
  readonly username?: string;
  readonly avatarUrl?: string;
  readonly streakDays: number;
  readonly longestStreak: number;
  readonly totalCO2Kg: number;
  readonly onboarded: boolean;
  readonly region?: string;
  readonly createdAt: Date;
};
```

### Repository Interfaces

```typescript
// src/domain/interfaces/IActivityRepository.ts
import { Activity, ActivityCategory } from '../entities/Activity';

export type CreateActivityInput = Omit<Activity, 'id' | 'createdAt'>;

export type ActivityFilters = {
  userId: string;
  from?: Date;
  to?: Date;
  category?: ActivityCategory;
  limit?: number;
};

export interface IActivityRepository {
  create(input: CreateActivityInput): Promise<Activity>;
  findMany(filters: ActivityFilters): Promise<Activity[]>;
  findById(id: string): Promise<Activity | null>;
  delete(id: string, userId: string): Promise<void>;
  getDailyTotals(userId: string, days: number): Promise<DailyTotal[]>;
  getCategoryBreakdown(userId: string, days: number): Promise<CategoryBreakdown[]>;
}

export type DailyTotal = { date: string; co2Kg: number };
export type CategoryBreakdown = { category: ActivityCategory; co2Kg: number };
```

```typescript
// src/domain/interfaces/IEmissionFactorRepository.ts
import { EmissionFactor } from '../value-objects/EmissionFactor';
import { ActivityCategory } from '../entities/Activity';

export interface IEmissionFactorRepository {
  getAll(): Promise<EmissionFactor[]>;
  getByCategory(category: ActivityCategory): Promise<EmissionFactor[]>;
  getById(id: string): Promise<EmissionFactor | null>;
}
```

```typescript
// src/domain/interfaces/ICommunityRepository.ts
export type CommunityStats = {
  percentile: number;    // 0-100: you're better than N% of users
  avgCO2Today: number;
  userCount: number;
};

export interface ICommunityRepository {
  recordDailyTotal(co2Kg: number, region?: string, breakdown?: Record<string, number>): Promise<void>;
  getPercentile(co2Kg: number, date?: Date): Promise<CommunityStats>;
}
```

```typescript
// src/domain/interfaces/IAIService.ts
export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type AIContext = {
  userId: string;
  threadId: string;       // Backboard persistent thread
  weeklyTotalCO2: number;
  topCategory: string;
  recentActivities: Array<{ category: string; co2Kg: number }>;
};

export interface IAIService {
  chat(threadId: string, message: string, context: AIContext): Promise<ReadableStream>;
  generateTip(context: AIContext): Promise<string>;
  generateWeeklySummary(context: AIContext): Promise<string>;
}
```

### Zod Validation Schemas (shared client/server)

```typescript
// src/domain/schemas/activity.schema.ts
import { z } from 'zod';

export const CreateActivitySchema = z.object({
  category: z.enum(['transport', 'food', 'energy', 'goods']),
  subcategory: z.string().min(1).max(64),
  quantity: z.number().positive().max(100000),
  unit: z.string().min(1).max(16),
  notes: z.string().max(500).optional(),
  loggedAt: z.string().datetime().optional(),
});

export type CreateActivityInput = z.infer<typeof CreateActivitySchema>;
```

```typescript
// src/domain/schemas/chat.schema.ts
import { z } from 'zod';

export const ChatRequestSchema = z.object({
  threadId: z.string().min(1),
  message: z.string().min(1).max(2000),
});
```

---

## 9. Core Libraries & Services

### `lib/cn.ts`
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### `lib/api-client.ts`
```typescript
// Typed fetch wrapper — use in client components only
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
  }
}

export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    throw new ApiError(res.status, json.error, json.code);
  }
  return json.data;
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) => request<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
```

### Infrastructure: Supabase

```typescript
// src/infrastructure/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase.generated';

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => cookieStore.set({ name, value, ...options }),
        remove: (name, options) => cookieStore.delete({ name, ...options }),
      },
    },
  );
}

export function createSupabaseAdminClient() {
  // Service role — only use in API routes, never expose to client
  const { createClient } = require('@supabase/supabase-js');
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
```

```typescript
// src/infrastructure/supabase/ActivityRepository.ts
import type { IActivityRepository, CreateActivityInput, ActivityFilters, DailyTotal, CategoryBreakdown } from '@/domain/interfaces/IActivityRepository';
import type { Activity } from '@/domain/entities/Activity';
import { createCO2Amount } from '@/domain/value-objects/CO2Amount';
import { createSupabaseAdminClient } from './server';

export class SupabaseActivityRepository implements IActivityRepository {
  private get db() { return createSupabaseAdminClient(); }

  async create(input: CreateActivityInput): Promise<Activity> {
    const { data, error } = await this.db
      .from('activities')
      .insert({
        user_id: input.userId,
        category: input.category,
        subcategory: input.subcategory,
        quantity: input.quantity,
        unit: input.unit,
        co2_kg: input.co2.kg,
        notes: input.notes,
        source: input.source,
        logged_at: input.loggedAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapRow(data);
  }

  async findMany(filters: ActivityFilters): Promise<Activity[]> {
    let query = this.db
      .from('activities')
      .select('*')
      .eq('user_id', filters.userId)
      .order('logged_at', { ascending: false });

    if (filters.from) query = query.gte('logged_at', filters.from.toISOString());
    if (filters.to) query = query.lte('logged_at', filters.to.toISOString());
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data.map(this.mapRow);
  }

  async findById(id: string): Promise<Activity | null> {
    const { data } = await this.db.from('activities').select('*').eq('id', id).single();
    return data ? this.mapRow(data) : null;
  }

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await this.db
      .from('activities')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);  // Security: ensure user owns the record
    if (error) throw new Error(error.message);
  }

  async getDailyTotals(userId: string, days: number): Promise<DailyTotal[]> {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const { data, error } = await this.db.rpc('get_daily_totals', {
      p_user_id: userId,
      p_from: from.toISOString(),
    });
    if (error) throw new Error(error.message);
    return data;
  }

  async getCategoryBreakdown(userId: string, days: number): Promise<CategoryBreakdown[]> {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const { data, error } = await this.db
      .from('activities')
      .select('category, co2_kg')
      .eq('user_id', userId)
      .gte('logged_at', from.toISOString());

    if (error) throw new Error(error.message);

    const totals: Record<string, number> = {};
    for (const row of data) {
      totals[row.category] = (totals[row.category] ?? 0) + Number(row.co2_kg);
    }

    return Object.entries(totals).map(([category, co2Kg]) => ({
      category: category as any,
      co2Kg,
    }));
  }

  private mapRow(row: any): Activity {
    return {
      id: row.id,
      userId: row.user_id,
      category: row.category,
      subcategory: row.subcategory,
      quantity: Number(row.quantity),
      unit: row.unit,
      co2: createCO2Amount(Number(row.co2_kg)),
      notes: row.notes ?? undefined,
      source: row.source,
      loggedAt: new Date(row.logged_at),
    };
  }
}
```

### Infrastructure: Snowflake

```typescript
// src/infrastructure/snowflake/connection.ts
import snowflake from 'snowflake-sdk';

let pool: snowflake.ConnectionPool | null = null;

export function getSnowflakePool(): snowflake.ConnectionPool {
  if (!pool) {
    pool = snowflake.createPool(
      {
        account: process.env.SNOWFLAKE_ACCOUNT!,
        username: process.env.SNOWFLAKE_USERNAME!,
        password: process.env.SNOWFLAKE_PASSWORD!,
        database: process.env.SNOWFLAKE_DATABASE!,
        schema: process.env.SNOWFLAKE_SCHEMA!,
        warehouse: process.env.SNOWFLAKE_WAREHOUSE!,
        role: process.env.SNOWFLAKE_ROLE,
      },
      { max: 5, min: 0 },
    );
  }
  return pool;
}

export async function querySnowflake<T>(sql: string, binds: unknown[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    getSnowflakePool().use(async (conn) => {
      conn.execute({
        sqlText: sql,
        binds: binds as any,
        complete: (err, _stmt, rows) => {
          if (err) reject(err);
          else resolve((rows ?? []) as T[]);
        },
      });
    });
  });
}
```

```typescript
// src/infrastructure/snowflake/EmissionFactorRepository.ts
import type { IEmissionFactorRepository } from '@/domain/interfaces/IEmissionFactorRepository';
import type { EmissionFactor } from '@/domain/value-objects/EmissionFactor';
import type { ActivityCategory } from '@/domain/entities/Activity';
import { querySnowflake } from './connection';

type SnowflakeRow = {
  ID: string; CATEGORY: string; SUBCATEGORY: string;
  FACTOR: number; UNIT: string; LABEL: string; SOURCE: string;
};

export class SnowflakeEmissionFactorRepository implements IEmissionFactorRepository {
  async getAll(): Promise<EmissionFactor[]> {
    const rows = await querySnowflake<SnowflakeRow>(
      'SELECT * FROM EMISSION_FACTORS ORDER BY CATEGORY, SUBCATEGORY',
    );
    return rows.map(this.mapRow);
  }

  async getByCategory(category: ActivityCategory): Promise<EmissionFactor[]> {
    const rows = await querySnowflake<SnowflakeRow>(
      'SELECT * FROM EMISSION_FACTORS WHERE CATEGORY = ? ORDER BY SUBCATEGORY',
      [category],
    );
    return rows.map(this.mapRow);
  }

  async getById(id: string): Promise<EmissionFactor | null> {
    const rows = await querySnowflake<SnowflakeRow>(
      'SELECT * FROM EMISSION_FACTORS WHERE ID = ?',
      [id],
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  private mapRow(row: SnowflakeRow): EmissionFactor {
    return {
      id: row.ID,
      category: row.CATEGORY as ActivityCategory,
      subcategory: row.SUBCATEGORY,
      factor: row.FACTOR,
      unit: row.UNIT,
      label: row.LABEL,
      source: row.SOURCE,
    };
  }
}
```

```typescript
// src/infrastructure/snowflake/CommunityRepository.ts
import type { ICommunityRepository, CommunityStats } from '@/domain/interfaces/ICommunityRepository';
import { querySnowflake } from './connection';
import { randomUUID } from 'crypto';

export class SnowflakeCommunityRepository implements ICommunityRepository {
  async recordDailyTotal(
    co2Kg: number,
    region?: string,
    breakdown?: Record<string, number>,
  ): Promise<void> {
    await querySnowflake(
      `INSERT INTO COMMUNITY_DAILY_TOTALS (ID, CO2_KG, LOG_DATE, REGION, CATEGORY_BREAKDOWN)
       VALUES (?, ?, CURRENT_DATE(), ?, PARSE_JSON(?))`,
      [randomUUID(), co2Kg, region ?? 'unknown', JSON.stringify(breakdown ?? {})],
    );
  }

  async getPercentile(co2Kg: number, date?: Date): Promise<CommunityStats> {
    const logDate = (date ?? new Date()).toISOString().split('T')[0];
    const rows = await querySnowflake<{
      PERCENTILE: number; AVG_CO2: number; USER_COUNT: number;
    }>(
      `SELECT
        ROUND(
          COUNT_IF(CO2_KG > ?) / NULLIF(COUNT(*), 0) * 100
        , 1) AS PERCENTILE,
        ROUND(AVG(CO2_KG), 2) AS AVG_CO2,
        COUNT(*) AS USER_COUNT
       FROM COMMUNITY_DAILY_TOTALS
       WHERE LOG_DATE = ?`,
      [co2Kg, logDate],
    );
    const row = rows[0];
    return {
      percentile: row?.PERCENTILE ?? 50,
      avgCO2Today: row?.AVG_CO2 ?? 13.15,
      userCount: row?.USER_COUNT ?? 0,
    };
  }
}
```

### Infrastructure: Backboard

```typescript
// src/infrastructure/backboard/client.ts
const BACKBOARD_BASE = 'https://app.backboard.io/api/v1';

export type BackboardChatPayload = {
  thread_id: string;
  content: string;
  memory: 'Auto' | 'off';
  model_name?: string;
  send_to_llm: boolean;
  stream?: boolean;
  system_prompt?: string;
};

export async function backboardChat(payload: BackboardChatPayload): Promise<Response> {
  const res = await fetch(`${BACKBOARD_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BACKBOARD_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_name: 'gemini-1.5-flash',
      ...payload,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Backboard error ${res.status}: ${err}`);
  }
  return res;
}

export async function backboardCreateThread(assistantId: string): Promise<string> {
  const res = await fetch(`${BACKBOARD_BASE}/threads`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BACKBOARD_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assistant_id: assistantId }),
  });
  if (!res.ok) throw new Error('Failed to create Backboard thread');
  const json = await res.json();
  return json.thread_id;
}
```

```typescript
// src/infrastructure/backboard/AIService.ts
import type { IAIService, AIContext } from '@/domain/interfaces/IAIService';
import { backboardChat } from './client';

function buildSystemPrompt(context: AIContext): string {
  return `You are EcoTrace AI — a warm, knowledgeable sustainability coach with memory of this user's journey.

User's current data:
- Weekly CO₂ total: ${context.weeklyTotalCO2.toFixed(1)} kg (global avg: 92 kg/week)
- Biggest impact category: ${context.topCategory}
- Recent activities: ${JSON.stringify(context.recentActivities)}

Your memory: You remember everything this user has ever told you and all their eco-data. Reference it naturally.
Be specific (use their actual numbers), concise (max 150 words per response), encouraging but honest.
Always end with one concrete action they can take TODAY. Never be preachy.`;
}

export class BackboardAIService implements IAIService {
  async chat(threadId: string, message: string, context: AIContext): Promise<ReadableStream> {
    const res = await backboardChat({
      thread_id: threadId,
      content: message,
      memory: 'Auto',
      send_to_llm: true,
      stream: true,
      system_prompt: buildSystemPrompt(context),
    });
    return res.body!;
  }

  async generateTip(context: AIContext): Promise<string> {
    const res = await backboardChat({
      thread_id: context.threadId,
      content: 'Give me one specific, actionable tip based on my most recent activity. Keep it under 80 words.',
      memory: 'Auto',
      send_to_llm: true,
      system_prompt: buildSystemPrompt(context),
    });
    const json = await res.json();
    return json.content ?? '';
  }

  async generateWeeklySummary(context: AIContext): Promise<string> {
    const res = await backboardChat({
      thread_id: context.threadId,
      content: 'Give me a 3-sentence narrative summary of my carbon week. Be specific. End with my biggest opportunity.',
      memory: 'Auto',
      send_to_llm: true,
      system_prompt: buildSystemPrompt(context),
    });
    const json = await res.json();
    return json.content ?? '';
  }
}
```

### Infrastructure: Auth0

```typescript
// src/infrastructure/auth0/client.ts
import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_ISSUER_BASE_URL!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  secret: process.env.AUTH0_SECRET!,
  appBaseUrl: process.env.AUTH0_BASE_URL!,
  authorizationParameters: {
    scope: 'openid profile email',
  },
});
```

```typescript
// src/infrastructure/auth0/AgentToolsService.ts
// Token Vault integration for Calendar/Gmail agent scanning
// Requires Auth0 for Agents Token Vault to be configured in dashboard

export type AgentScanResult = {
  source: 'google_calendar' | 'gmail';
  items: Array<{
    title: string;
    estimatedCategory: string;
    estimatedSubcategory: string;
    estimatedQuantity: number;
    confidence: number;
  }>;
};

export class Auth0AgentToolsService {
  // Exchange Auth0 access token for Google Calendar token via Token Vault
  async getCalendarToken(auth0AccessToken: string): Promise<string> {
    const res = await fetch(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/me/token-vault/google`,
      {
        headers: { Authorization: `Bearer ${auth0AccessToken}` },
      },
    );
    if (!res.ok) throw new Error('Token Vault: failed to get Calendar token');
    const json = await res.json();
    return json.access_token;
  }

  // Scan Google Calendar for carbon-relevant events (flights, etc.)
  async scanCalendar(calendarToken: string): Promise<AgentScanResult> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${oneWeekAgo.toISOString()}&singleEvents=true&orderBy=startTime`,
      { headers: { Authorization: `Bearer ${calendarToken}` } },
    );
    if (!res.ok) throw new Error('Calendar API error');
    const { items = [] } = await res.json();

    // Filter for travel-related events (flights, train bookings)
    const carbonEvents = items.filter((event: any) => {
      const summary = (event.summary ?? '').toLowerCase();
      return ['flight', 'fly', 'train', 'drive', 'hotel'].some(k => summary.includes(k));
    });

    return {
      source: 'google_calendar',
      items: carbonEvents.map((event: any) => ({
        title: event.summary,
        estimatedCategory: 'transport',
        estimatedSubcategory: (event.summary ?? '').toLowerCase().includes('flight') ? 'flight_long' : 'car_petrol',
        estimatedQuantity: 0,   // AI will estimate from context
        confidence: 0.7,
      })),
    };
  }
}
```

### Infrastructure: Solana

```typescript
// src/infrastructure/solana/connection.ts
import { Connection } from '@solana/web3.js';

let connection: Connection | null = null;

export function getSolanaConnection(): Connection {
  if (!connection) {
    connection = new Connection(
      process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com',
      'confirmed',
    );
  }
  return connection;
}
```

```typescript
// src/infrastructure/solana/BadgeMintService.ts
import { Keypair, PublicKey } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplBubblegum, mintToCollectionV1 } from '@metaplex-foundation/mpl-bubblegum';
import { keypairIdentity, generateSigner } from '@metaplex-foundation/umi';
import { getSolanaConnection } from './connection';
import type { BadgeDefinition } from '@/domain/entities/Badge';

export type MintResult = {
  mintAddress: string;
  txSignature: string;
  explorerUrl: string;
};

export class SolanaBadgeMintService {
  private getUmi() {
    const keypairBytes = JSON.parse(
      Buffer.from(process.env.SOLANA_MINT_AUTHORITY_KEYPAIR!, 'base64').toString(),
    );
    const mintAuthority = Keypair.fromSecretKey(Uint8Array.from(keypairBytes));

    const umi = createUmi(process.env.SOLANA_RPC_URL!).use(mplBubblegum());
    const authority = umi.eddsa.createKeypairFromSecretKey(mintAuthority.secretKey);
    umi.use(keypairIdentity(authority));
    return umi;
  }

  async mint(
    recipientWallet: string,
    badge: BadgeDefinition,
    merkleTree: string,
  ): Promise<MintResult> {
    const umi = this.getUmi();
    const recipient = new PublicKey(recipientWallet);
    const leafOwner = { publicKey: umi.eddsa.findPublicKey(recipient.toBuffer()) } as any;

    const { signature } = await mintToCollectionV1(umi, {
      leafOwner,
      merkleTree: new PublicKey(merkleTree) as any,
      metadata: {
        name: badge.name,
        uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/badges/metadata/${badge.id}`,
        sellerFeeBasisPoints: 0,
        collection: { key: new PublicKey(merkleTree) as any, verified: false },
        creators: [],
      },
    }).sendAndConfirm(umi);

    const txSig = Buffer.from(signature).toString('base64');
    return {
      mintAddress: merkleTree,
      txSignature: txSig,
      explorerUrl: `https://explorer.solana.com/tx/${txSig}?cluster=devnet`,
    };
  }
}
```

### Application: Use Cases

```typescript
// src/application/use-cases/LogActivityUseCase.ts
import type { IActivityRepository } from '@/domain/interfaces/IActivityRepository';
import type { IEmissionFactorRepository } from '@/domain/interfaces/IEmissionFactorRepository';
import type { ICommunityRepository } from '@/domain/interfaces/ICommunityRepository';
import type { IBadgeRepository } from '@/domain/interfaces/IBadgeRepository';
import { createCO2Amount } from '@/domain/value-objects/CO2Amount';
import type { Activity } from '@/domain/entities/Activity';
import type { CreateActivityInput } from '@/domain/schemas/activity.schema';
import { CheckMilestonesUseCase } from './CheckMilestonesUseCase';

export type LogActivityResult = {
  activity: Activity;
  newBadges: string[];
};

export class LogActivityUseCase {
  constructor(
    private readonly activities: IActivityRepository,
    private readonly factors: IEmissionFactorRepository,
    private readonly community: ICommunityRepository,
    private readonly badges: IBadgeRepository,
  ) {}

  async execute(userId: string, input: CreateActivityInput): Promise<LogActivityResult> {
    // 1. Fetch emission factor from Snowflake
    const factorId = `${input.category}_${input.subcategory}`;
    const factor = await this.factors.getById(factorId);
    if (!factor) throw new Error(`Unknown emission factor: ${factorId}`);

    // 2. Calculate CO₂
    const co2Kg = input.quantity * factor.factor;
    const co2 = createCO2Amount(co2Kg);

    // 3. Persist activity
    const activity = await this.activities.create({
      userId,
      category: input.category,
      subcategory: input.subcategory,
      quantity: input.quantity,
      unit: factor.unit,
      co2,
      notes: input.notes,
      source: 'manual',
      loggedAt: input.loggedAt ? new Date(input.loggedAt) : new Date(),
    });

    // 4. Record to Snowflake community (async, don't block response)
    this.community.recordDailyTotal(co2Kg).catch(console.error);

    // 5. Check milestones
    const checkMilestones = new CheckMilestonesUseCase(this.activities, this.badges);
    const newBadges = await checkMilestones.execute(userId);

    return { activity, newBadges };
  }
}
```

```typescript
// src/application/use-cases/CheckMilestonesUseCase.ts
import type { IActivityRepository } from '@/domain/interfaces/IActivityRepository';
import type { IBadgeRepository } from '@/domain/interfaces/IBadgeRepository';
import { BADGE_DEFINITIONS } from '@/domain/constants/badge-definitions';

export class CheckMilestonesUseCase {
  constructor(
    private readonly activities: IActivityRepository,
    private readonly badges: IBadgeRepository,
  ) {}

  async execute(userId: string): Promise<string[]> {
    const [totalLogs, earnedBadges, dailyTotals] = await Promise.all([
      this.activities.findMany({ userId, limit: 1000 }),
      this.badges.findByUserId(userId),
      this.activities.getDailyTotals(userId, 30),
    ]);

    const earnedIds = new Set(earnedBadges.map(b => b.badgeId));
    const newlyEarned: string[] = [];

    for (const def of BADGE_DEFINITIONS) {
      if (earnedIds.has(def.id)) continue;

      let earned = false;

      if (def.id === 'first_log' && totalLogs.length >= 1) earned = true;

      if (def.threshold) {
        const { metric, value, operator } = def.threshold;
        let metricValue = 0;

        if (metric === 'total_logs') metricValue = totalLogs.length;
        if (metric === 'streak_days') {
          // Calculate current streak from dailyTotals
          metricValue = this.calculateStreak(dailyTotals);
        }

        earned = this.compare(metricValue, value, operator);
      }

      if (earned) {
        await this.badges.create({ userId, badgeId: def.id });
        newlyEarned.push(def.id);
      }
    }

    return newlyEarned;
  }

  private calculateStreak(dailyTotals: Array<{ date: string }>): number {
    // ... streak calculation logic
    return 0;
  }

  private compare(a: number, b: number, op: string): boolean {
    if (op === 'lt') return a < b;
    if (op === 'lte') return a <= b;
    if (op === 'gt') return a > b;
    if (op === 'gte') return a >= b;
    if (op === 'eq') return a === b;
    return false;
  }
}
```

---

## 10. API Routes

### Shared Middleware Wrappers

```typescript
// app/api/_middleware/withAuth.ts
import { auth0 } from '@/src/infrastructure/auth0/client';
import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/api-client';

type Handler = (req: NextRequest, userId: string) => Promise<NextResponse>;

export function withAuth(handler: Handler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const session = await auth0.getSession(req);
    if (!session?.user?.sub) {
      const res: ApiResponse<never> = { success: false, error: 'Unauthorized', code: 'AUTH_REQUIRED' };
      return NextResponse.json(res, { status: 401 });
    }
    return handler(req, session.user.sub);
  };
}
```

```typescript
// app/api/_middleware/withValidation.ts
import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import type { ApiResponse } from '@/lib/api-client';

export function withValidation<T>(schema: ZodSchema<T>, handler: (data: T) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const body = await req.json().catch(() => null);
    const result = schema.safeParse(body);
    if (!result.success) {
      const res: ApiResponse<never> = {
        success: false,
        error: 'Validation failed',
        code: 'INVALID_INPUT',
      };
      return NextResponse.json(res, { status: 400 });
    }
    return handler(result.data);
  };
}
```

```typescript
// app/api/_helpers/response.ts
import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/api-client';

export function ok<T>(data: T, status = 200): NextResponse {
  const res: ApiResponse<T> = { success: true, data };
  return NextResponse.json(res, { status });
}

export function err(message: string, code?: string, status = 400): NextResponse {
  const res: ApiResponse<never> = { success: false, error: message, code };
  return NextResponse.json(res, { status });
}
```

### Activity Routes

```typescript
// app/api/activities/route.ts
import { withAuth } from '../_middleware/withAuth';
import { withValidation } from '../_middleware/withValidation';
import { ok, err } from '../_helpers/response';
import { CreateActivitySchema } from '@/src/domain/schemas/activity.schema';
import { LogActivityUseCase } from '@/src/application/use-cases/LogActivityUseCase';
import { SupabaseActivityRepository } from '@/src/infrastructure/supabase/ActivityRepository';
import { SupabaseBadgeRepository } from '@/src/infrastructure/supabase/BadgeRepository';
import { SnowflakeEmissionFactorRepository } from '@/src/infrastructure/snowflake/EmissionFactorRepository';
import { SnowflakeCommunityRepository } from '@/src/infrastructure/snowflake/CommunityRepository';
import { NextRequest } from 'next/server';

// Dependency wiring — single place, no duplication
function buildLogUseCase() {
  return new LogActivityUseCase(
    new SupabaseActivityRepository(),
    new SnowflakeEmissionFactorRepository(),
    new SnowflakeCommunityRepository(),
    new SupabaseBadgeRepository(),
  );
}

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  const body = await req.json().catch(() => null);
  const parsed = CreateActivitySchema.safeParse(body);
  if (!parsed.success) return err('Validation failed', 'INVALID_INPUT');

  try {
    const useCase = buildLogUseCase();
    const result = await useCase.execute(userId, parsed.data);
    return ok(result, 201);
  } catch (e: any) {
    console.error('[POST /api/activities]', e);
    return err(e.message ?? 'Internal error', 'SERVER_ERROR', 500);
  }
});

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100);

  try {
    const repo = new SupabaseActivityRepository();
    const activities = await repo.findMany({ userId, limit });
    return ok(activities);
  } catch (e: any) {
    return err(e.message, 'SERVER_ERROR', 500);
  }
});
```

### AI Chat Route (Streaming)

```typescript
// app/api/ai/chat/route.ts
import { withAuth } from '../_middleware/withAuth';
import { ChatRequestSchema } from '@/src/domain/schemas/chat.schema';
import { BackboardAIService } from '@/src/infrastructure/backboard/AIService';
import { SupabaseActivityRepository } from '@/src/infrastructure/supabase/ActivityRepository';
import { NextRequest } from 'next/server';

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  const body = await req.json().catch(() => null);
  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response('Invalid input', { status: 400 });
  }

  const { threadId, message } = parsed.data;

  // Build AI context from recent data
  const repo = new SupabaseActivityRepository();
  const [recentActivities, dailyTotals] = await Promise.all([
    repo.findMany({ userId, limit: 10 }),
    repo.getDailyTotals(userId, 7),
  ]);

  const weeklyTotal = dailyTotals.reduce((sum, d) => sum + d.co2Kg, 0);
  const categoryTotals: Record<string, number> = {};
  for (const a of recentActivities) {
    categoryTotals[a.category] = (categoryTotals[a.category] ?? 0) + a.co2.kg;
  }
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'unknown';

  const context = {
    userId,
    threadId,
    weeklyTotalCO2: weeklyTotal,
    topCategory,
    recentActivities: recentActivities.slice(0, 5).map(a => ({
      category: a.category,
      co2Kg: a.co2.kg,
    })),
  };

  const aiService = new BackboardAIService();
  const stream = await aiService.chat(threadId, message, context);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
});
```

### Community Percentile Route

```typescript
// app/api/community/percentile/route.ts
import { withAuth } from '../_middleware/withAuth';
import { ok, err } from '../_helpers/response';
import { SnowflakeCommunityRepository } from '@/src/infrastructure/snowflake/CommunityRepository';
import { NextRequest } from 'next/server';

export const GET = withAuth(async (req: NextRequest, _userId: string) => {
  const { searchParams } = new URL(req.url);
  const co2Kg = Number(searchParams.get('co2'));

  if (isNaN(co2Kg) || co2Kg < 0) {
    return err('Invalid co2 value', 'INVALID_INPUT');
  }

  try {
    const repo = new SnowflakeCommunityRepository();
    const stats = await repo.getPercentile(co2Kg);
    return ok(stats);
  } catch (e: any) {
    return err(e.message, 'SERVER_ERROR', 500);
  }
});
```

---

## 11. Server Actions

```typescript
// app/(app)/actions.ts
'use server';

import { auth0 } from '@/src/infrastructure/auth0/client';
import { SupabaseActivityRepository } from '@/src/infrastructure/supabase/ActivityRepository';
import { backboardCreateThread } from '@/src/infrastructure/backboard/client';

export async function getOrCreateBackboardThread(userId: string): Promise<string> {
  // Store threadId in user's profile (Supabase). Create if not exists.
  const repo = new SupabaseActivityRepository();
  // ... get from profile, create if null, persist back
  return backboardCreateThread(process.env.BACKBOARD_ASSISTANT_ID!);
}

export async function getCurrentUser() {
  const session = await auth0.getSession();
  return session?.user ?? null;
}
```

---

## 12. Page-by-Page Implementation

### `app/page.tsx` — Landing Page

**Design**: Full-screen dark hero with animated particle system (CSS-only, SVG circles with `animation-delay` stagger). Fraunces display font for hero headline. Noise texture overlay.

**Sections**:
1. **Hero**: `"Know Your Impact. Own Your Change."` + animated CO₂ counter counting up to 37B tonnes/year. CTA: "Start Tracking Free" → `/login`.
2. **How It Works**: 3-step visual flow (Log → Visualize → Earn).
3. **Features**: 3 feature cards (AI Memory, Solana Badges, Community Ranking) with hover glow.
4. **Earth Day Stats**: Full-bleed section with 3 large numbers. Stark, data-editorial design.
5. **Footer**: Minimal, with links.

### `app/(auth)/login/page.tsx`
- Auth0 Universal Login redirect (server action calls `auth0.handleLogin()`)
- On callback: create/update Supabase `profiles` row from Auth0 user
- If new user (`!profile.onboarded`): redirect to onboarding flow

### `app/(app)/dashboard/page.tsx`
- **Server Component** — fetch all data server-side, pass to client components
- Data fetched: `GetDashboardDataUseCase` → `DashboardDTO`
- Components:
  - `CarbonScoreRing`: today's score vs. daily average (Framer Motion spring animation)
  - `WeeklyChart`: 7-day area chart (Recharts, gradient fill)
  - `CategoryBreakdown`: animated donut chart
  - `ActivityFeed`: last 10 activities
  - `CommunityBenchmark`: "You're better than X% of users today" (Snowflake)
  - `DailyAITip`: Backboard-generated tip, loaded via `Suspense`
  - `QuickActions`: floating action buttons

### `app/(app)/log/page.tsx`
- **Client Component** (real-time CO₂ preview requires client state)
- UX flow: Category → Subcategory → Quantity → Preview → Submit
- `CO2Preview`: live calculation as user types, shows equivalencies (trees, km, charges)
- On submit: POST `/api/activities` → toast notification → milestone modal if new badge earned

### `app/(app)/insights/page.tsx`
- **Split view**: AI Summary panel (left) + Chat panel (right) on desktop. Tabs on mobile.
- `WeeklySummary`: Backboard narrative, loaded on mount
- `BackboardChat`:
  - Messages stored in `useState` (no persistence needed — Backboard has memory)
  - Streaming via `ReadableStream`, typewriter effect with `requestAnimationFrame`
  - Suggested prompt chips
  - Thread ID loaded from server action (`getOrCreateBackboardThread`)
- `WhatIfScenario`: "If you swapped beef for lentils 1x/week..." — static calculations using domain utils

### `app/(app)/badges/page.tsx`
- **Server Component** — loads badge definitions + user earned badges
- `BadgeGrid`: masonry-style grid, earned badges animate with glow pulse
- `BadgeCard` states: locked (grayscale + lock icon + progress bar) / earned / minted
- `MintFlow`: modal triggered by "Mint on Solana" button
  - Step 1: Connect Phantom/Solflare wallet
  - Step 2: Confirm mint (shows badge preview + gas estimate on devnet)
  - Step 3: Success with explorer link

### `app/(app)/settings/page.tsx`
- Profile (username, avatar from Auth0)
- Notification preferences
- **Agent Scanner section**: "Connect Google Calendar" via Auth0 Token Vault
  - `AgentScanButton`: triggers `/api/agent/scan`
  - Shows scan results, user approves/rejects each item (CIBA human-in-the-loop)
- Theme toggle
- Data export (download all activities as CSV)
- Delete account

---

## 13. Components Library

### `components/ui/Button.tsx`
```typescript
// Variants: 'primary' | 'secondary' | 'ghost' | 'danger'
// Sizes: 'sm' | 'md' | 'lg'
// Loading state with spinner
// Framer Motion press animation (scale: 0.97)
```

### `components/ui/Card.tsx`
```typescript
// Variants: 'default' | 'elevated' | 'glow'
// 'glow' variant: border + box-shadow: var(--glow-green) on hover
// Optional onClick for interactive cards
```

### `components/dashboard/CarbonScoreRing.tsx`
```typescript
// SVG circle with stroke-dasharray animation
// Props: score (0-100), todayKg, avgKg
// Color: green (0-40) → amber (41-70) → red (71-100) using CSS lerp
// Inner text: large mono number + unit + comparison text
// Framer Motion: spring(stiffness: 80, damping: 20) on mount
// Pulsing dot indicator when "live" (today's data)
```

### `components/dashboard/WeeklyChart.tsx`
```typescript
// Recharts AreaChart
// Gradient fill from accent-primary to transparent
// ReferenceLine at global daily average (dashed)
// Custom Tooltip with styled card
// Responsive via ResponsiveContainer
// Animated on mount (Recharts built-in)
```

### `components/dashboard/CommunityBenchmark.tsx`
```typescript
// Props: percentile (0-100), avgCO2Today, userCO2Today, userCount
// Visual: horizontal bar showing user position vs. community
// Large number: "Better than 63% of users"
// Subtext: "Based on N EcoTrace users today"
// Color: green if above median, amber if below
```

### `components/insights/BackboardChat.tsx`
```typescript
// State: messages[], input, isStreaming, threadId
// On send: POST /api/ai/chat → ReadableStream → typewriter append
// Message bubbles: user (right, accent bg) / AI (left, surface bg)
// AI avatar: animated leaf icon with subtle pulse while streaming
// Suggested prompts: 4 chip buttons, disappear after first message
// Auto-scroll: useEffect on messages change
```

### `components/badges/BadgeCard.tsx`
```typescript
// State-driven rendering: locked | earned | minted
// Locked: CSS filter grayscale(1), lock icon overlay, progress bar
// Earned: animated border glow, "Mint on Solana" CTA
// Minted: shimmer animation, explorer link, "Verified on-chain" tag
// Rarity color coding: common=gray, uncommon=green, rare=blue, epic=purple, legendary=gold
// Framer Motion: hover lift + glow intensify
```

---

## 14. Hooks

```typescript
// hooks/useBackboardChat.ts
export function useBackboardChat(threadId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const send = useCallback(async (content: string) => {
    const userMsg: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    let aiContent = '';
    const aiMsg: ChatMessage = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, aiMsg]);

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, message: content }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      aiContent += decoder.decode(value, { stream: true });
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: aiContent },
      ]);
    }

    setIsStreaming(false);
  }, [threadId]);

  return { messages, isStreaming, send };
}
```

```typescript
// hooks/useCommunityPercentile.ts
export function useCommunityPercentile(co2Kg: number | null) {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  
  useEffect(() => {
    if (co2Kg === null || co2Kg < 0) return;
    fetch(`/api/community/percentile?co2=${co2Kg}`)
      .then(r => r.json())
      .then(res => { if (res.success) setStats(res.data); })
      .catch(console.error);
  }, [co2Kg]);

  return stats;
}
```

```typescript
// hooks/useTheme.ts
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('ecotrace-theme') as 'light' | 'dark' | null;
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const resolved = stored ?? system;
    setTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
  }, []);

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('ecotrace-theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
```

---

## 15. Security Checklist

### Authentication & Authorization
- [ ] All `(app)/` routes protected by `middleware.ts` — redirect to `/login` if no session
- [ ] All API routes use `withAuth` wrapper — 401 if no session
- [ ] Supabase RLS enabled on all tables — users can only access their own data
- [ ] Admin client (`SUPABASE_SERVICE_ROLE_KEY`) only used server-side, never in client bundles
- [ ] Auth0 `AUTH0_SECRET` is 32+ random bytes, rotated per environment

### Input Validation
- [ ] All POST bodies validated with Zod before business logic executes
- [ ] Numeric inputs bounded (quantity max: 100000, limit max: 100)
- [ ] `userId` always sourced from Auth0 session, never from request body or query params
- [ ] Solana wallet address validated as valid base58 public key before mint

### API Security
- [ ] `SUPABASE_SERVICE_ROLE_KEY` never in `NEXT_PUBLIC_*` vars
- [ ] `BACKBOARD_API_KEY`, `SNOWFLAKE_PASSWORD`, `SOLANA_MINT_AUTHORITY_KEYPAIR` server-only
- [ ] Rate limit AI chat route (Vercel Edge Config or simple in-memory): max 30 requests/min/user
- [ ] CORS headers set on API routes (allow only `NEXT_PUBLIC_APP_URL`)
- [ ] No raw SQL string interpolation — all Snowflake queries use parameterized binds
- [ ] Supabase `.delete()` always includes `.eq('user_id', userId)` — double-check ownership

### Data Privacy
- [ ] Community Snowflake data is fully anonymized — no user IDs, no PII
- [ ] Agent scan results require explicit user approval before logging (CIBA flow)
- [ ] Audit log (`agent_scan_log`) records all agent actions for transparency
- [ ] `region` field in profiles is coarse-grained (continent/country, not city)

### Frontend
- [ ] `Content-Security-Policy` header set via `next.config.ts`
- [ ] `X-Frame-Options: DENY` header set
- [ ] Wallet addresses truncated in UI (never log full addresses to console in production)
- [ ] No secrets in client-side code or `NEXT_PUBLIC_*` env vars (audit with grep)

### `middleware.ts`
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth0 } from '@/src/infrastructure/auth0/client';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/api/auth'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Allow public paths and API auth routes
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const session = await auth0.getSession(req);
  if (!session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
```

---

## 16. Build Order (Phases)

> Follow exactly. Each phase assumes the previous is complete. Don't start Phase N+1 until Phase N passes a basic smoke test.

### Phase 1 — Scaffolding & Config (Target: 45 min)
1. `npx create-next-app@latest ecotrace --typescript --tailwind --app --src-dir=false`
2. Install all dependencies (see package list below)
3. Create full directory structure as in §5
4. Set up `globals.css` with all CSS variables from §4
5. Configure `tailwind.config.ts` — add custom colors mapping to CSS vars
6. Create `tsconfig.json` with `strict: true`, path aliases (`@/*`)
7. Create `.env.local` from template, populate with real keys
8. **Smoke test**: `npm run dev` — app starts, no TS errors

### Phase 2 — Domain Layer (Target: 30 min)
1. Create all entities (`Activity`, `Badge`, `UserProfile`)
2. Create value objects (`CO2Amount`, `EmissionFactor`)
3. Create all repository interfaces
4. Create Zod schemas (`activity.schema.ts`, `chat.schema.ts`)
5. Create `badge-definitions.ts` with all 5 badge definitions
6. Create `carbon-equivalencies.ts` with helper functions
7. Create `formatters.ts` (CO₂ number formatting)
8. **Smoke test**: `tsc --noEmit` — zero type errors in domain layer

### Phase 3 — Infrastructure: Supabase (Target: 30 min)
1. Create Supabase project, run SQL schema from §7
2. Run SQL Stored Procedure for `get_daily_totals` RPC
3. Implement `SupabaseActivityRepository`
4. Implement `SupabaseBadgeRepository`
5. Implement `createSupabaseServerClient` + `createSupabaseAdminClient`
6. **Smoke test**: Write a test script that inserts and retrieves one activity

### Phase 4 — Infrastructure: Snowflake (Target: 20 min)
1. Create Snowflake trial account, run schema SQL from §7
2. Seed emission factors with INSERT statements
3. Implement `SnowflakeEmissionFactorRepository`
4. Implement `SnowflakeCommunityRepository`
5. **Smoke test**: Query all factors, verify 19 rows returned

### Phase 5 — Auth0 (Target: 30 min)
1. Create Auth0 application (Regular Web App), configure callback URLs
2. Install `@auth0/nextjs-auth0`
3. Create `src/infrastructure/auth0/client.ts`
4. Create `/app/api/auth/[...auth0]/route.ts`
5. Implement `middleware.ts` with session guard
6. Create `/app/(auth)/login/page.tsx` — redirect to Auth0 Universal Login
7. Create `/app/(auth)/callback/page.tsx` — handle callback, create Supabase profile
8. **Smoke test**: Full login → callback → profile creation flow

### Phase 6 — Backboard AI (Target: 30 min)
1. Create Backboard account, create EcoTrace Assistant with system prompt
2. Note assistant ID → `BACKBOARD_ASSISTANT_ID`
3. Implement `BackboardAIService`
4. Create `/app/api/ai/chat/route.ts` (streaming)
5. Create `/app/api/ai/tip/route.ts`
6. Create `/app/api/ai/summary/route.ts`
7. **Smoke test**: Curl the chat endpoint, verify streaming response

### Phase 7 — Application Layer (Target: 30 min)
1. Implement `LogActivityUseCase`
2. Implement `CheckMilestonesUseCase`
3. Implement `GetDashboardDataUseCase`
4. Implement `GetAIInsightsUseCase`
5. Wire all API routes: `/api/activities`, `/api/community/percentile`
6. **Smoke test**: POST an activity via curl, verify 201 + CO₂ calculated correctly

### Phase 8 — Solana Badges (Target: 45 min)
1. Generate mint authority keypair: `solana-keygen new --outfile mint-authority.json`
2. Fund on devnet: `solana airdrop 2 <pubkey> --url devnet`
3. Create Merkle tree for cNFTs using Metaplex CLI
4. Implement `SolanaBadgeMintService`
5. Create `/app/api/badges/mint/route.ts`
6. Create wallet adapter provider setup in root layout
7. **Smoke test**: Mint one badge on devnet, verify in Solana Explorer

### Phase 9 — UI Core (Target: 90 min)
1. Create all primitive UI components: `Button`, `Card`, `Badge`, `Input`, `Select`, `Skeleton`, `Modal`, `Toast`, `ThemeToggle`
2. Create layout: `AppShell`, `Navbar`, `Sidebar`
3. Implement `useTheme` hook + theme toggle
4. Create landing page (`app/page.tsx`) with all sections + animations
5. **Smoke test**: Landing page renders in light + dark mode. All primitives in Storybook or demo page.

### Phase 10 — Dashboard (Target: 60 min)
1. Implement `GetDashboardDataUseCase`
2. Build `CarbonScoreRing` with Framer Motion spring
3. Build `WeeklyChart` with Recharts + gradient
4. Build `CategoryBreakdown` donut chart
5. Build `ActivityFeed`
6. Build `CommunityBenchmark` + `useCommunityPercentile` hook
7. Build `DailyAITip` (fetches from `/api/ai/tip`)
8. Wire `app/(app)/dashboard/page.tsx` as Server Component
9. **Smoke test**: Dashboard loads with real data after login

### Phase 11 — Activity Logging (Target: 45 min)
1. Build `CategoryPicker` + `SubcategoryPicker` (data from Snowflake via server action)
2. Build `ActivityForm` with React Hook Form + Zod
3. Build `CO2Preview` with live calculation
4. Wire form submission → POST `/api/activities`
5. Toast on success, milestone modal on badge unlock
6. **Smoke test**: Log one of each category, verify DB rows + CO₂ calculated

### Phase 12 — AI Insights (Target: 45 min)
1. Build `BackboardChat` component + `useBackboardChat` hook
2. Build `WeeklySummary` (fetch from `/api/ai/summary`)
3. Build `WhatIfScenario` (client-side calculation)
4. Build suggested prompt chips
5. Wire `app/(app)/insights/page.tsx`
6. **Smoke test**: Send 3 messages, verify memory persists (AI recalls earlier messages)

### Phase 13 — Badges (Target: 45 min)
1. Build `BadgeCard` with all three states + animations
2. Build `BadgeGrid`
3. Build `WalletConnect` (Phantom + Solflare)
4. Build `MintFlow` modal
5. Wire `/api/badges/mint`
6. Wire `app/(app)/badges/page.tsx`
7. **Smoke test**: Earn first badge by logging, connect wallet, mint, see Explorer link

### Phase 14 — Agent Features (Target: 30 min)
1. Configure Auth0 Token Vault for Google Calendar in Auth0 dashboard
2. Implement `AgentToolsService`
3. Build `AgentScanButton` + `/api/agent/scan`
4. Build `ApprovalNotification` (list of detected events + approve/reject each)
5. Wire into `/app/(app)/settings/page.tsx`
6. **Smoke test**: Connect Calendar, scan, approve one item, verify activity logged with `source: 'agent_scan'`

### Phase 15 — Polish & Deploy (Target: 60 min)
1. Responsive design pass (mobile breakpoints for all pages)
2. Loading skeletons for all async data
3. Error boundaries on all pages
4. Empty states for new users (no activities yet)
5. Accessibility pass: ARIA labels, focus rings, color contrast (WCAG AA)
6. `next.config.ts`: security headers (CSP, X-Frame-Options)
7. Push to GitHub
8. Deploy to Vercel, set all env vars in dashboard
9. Seed demo account with 14 days of activities for screenshots
10. Record Loom demo video (2-3 min)
11. **Final smoke test**: Full user journey on production URL

---

## Package Installation

```bash
npx create-next-app@latest ecotrace --typescript --tailwind --app --src-dir=false
cd ecotrace

# Core UI
npm install framer-motion lucide-react recharts
npm install clsx tailwind-merge
npm install react-hook-form @hookform/resolvers zod

# Fonts
npm install @fontsource/fraunces @fontsource/geist @fontsource/dm-mono

# Auth0
npm install @auth0/nextjs-auth0

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Snowflake
npm install snowflake-sdk

# Solana
npm install @solana/web3.js
npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui
npm install @solana/wallet-adapter-phantom @solana/wallet-adapter-solflare
npm install @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi
npm install @metaplex-foundation/umi-bundle-defaults

# Dev
npm install -D @types/node @types/snowflake-sdk
```

---

## `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.auth0.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-eval in dev
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "connect-src 'self' https://*.auth0.com https://api.devnet.solana.com https://app.backboard.io",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     'var(--bg-base)',
          surface:  'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
        },
        accent: {
          primary:   'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          glow:      'var(--accent-glow)',
          amber:     'var(--accent-amber)',
          red:       'var(--accent-red)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
          inverse:   'var(--text-inverse)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong:  'var(--border-strong)',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body:    ['Geist', 'system-ui', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm:    'var(--shadow-sm)',
        md:    'var(--shadow-md)',
        lg:    'var(--shadow-lg)',
        glow:  'var(--glow-green)',
        amber: 'var(--glow-amber)',
      },
      animation: {
        shimmer:  'shimmer 2s linear infinite',
        pulse:    'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float:    'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(76, 201, 122, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(76, 201, 122, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Domain Constants

### `src/domain/constants/badge-definitions.ts`

```typescript
import type { BadgeDefinition } from '../entities/Badge';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first_log',
    name: 'Earth Observer',
    description: 'Logged your first carbon activity',
    rarity: 'common',
    artwork: '/badges/earth-observer.svg',
    threshold: null,
  },
  {
    id: 'below_average_day',
    name: 'Light Footprint',
    description: 'Kept a day under 7 kg CO₂ — half the global average',
    rarity: 'uncommon',
    artwork: '/badges/light-footprint.svg',
    threshold: { metric: 'daily_co2_kg', value: 7, operator: 'lt' },
  },
  {
    id: 'week_streak',
    name: 'Committed Tracker',
    description: 'Logged activities 7 days in a row',
    rarity: 'rare',
    artwork: '/badges/committed-tracker.svg',
    threshold: { metric: 'streak_days', value: 7, operator: 'gte' },
  },
  {
    id: 'plant_based_week',
    name: 'Plant Pioneer',
    description: 'Logged zero meat for an entire week',
    rarity: 'rare',
    artwork: '/badges/plant-pioneer.svg',
    threshold: { metric: 'meat_free_days', value: 7, operator: 'gte' },
  },
  {
    id: 'carbon_reducer',
    name: 'Climate Champion',
    description: 'Reduced weekly footprint by 20% vs. the prior week',
    rarity: 'epic',
    artwork: '/badges/climate-champion.svg',
    threshold: { metric: 'week_reduction_pct', value: 20, operator: 'gte' },
  },
];
```

### `src/domain/utils/carbon-equivalencies.ts`

```typescript
// Single source of truth for CO₂ equivalency strings
export function getCO2Equivalencies(co2Kg: number): string[] {
  const trees = (co2Kg / 21.77).toFixed(2);       // 1 tree absorbs ~21.77 kg CO₂/year
  const drivingKm = (co2Kg / 0.192).toFixed(0);   // petrol car avg
  const phones = (co2Kg / 0.005).toFixed(0);      // ~5g per phone charge
  const beefGrams = (co2Kg / 0.027).toFixed(0);   // 27kg CO₂/kg beef

  return [
    `🌳 ${trees} trees absorbing CO₂ for a year`,
    `🚗 ${drivingKm} km driven in a petrol car`,
    `📱 ${phones} smartphone charges`,
    `🥩 ${beefGrams}g of beef`,
  ];
}

export const DAILY_AVERAGE_KG = 13.15;   // 4,800 kg/year ÷ 365
export const ANNUAL_AVERAGE_KG = 4_800;
export const PARIS_TARGET_DAILY_KG = 6.3; // 2.3 tonnes/year target
```

---

## 17. Prize Category Evidence

Each integration goes beyond cosmetic — here's the "judge, here's the depth" summary to include in the DEV post:

| Category | Depth of Integration | Unique Feature Unlocked |
|---|---|---|
| **Google Gemini** | Gemini 1.5 Flash used as the LLM inside Backboard for all AI features (chat, tips, summary). Model specified in Backboard payload. | Personalized AI sustainability coach |
| **Solana** | Metaplex Bubblegum cNFTs minted on-chain. Merkle tree created, mint authority keypair, full wallet adapter integration. | Verifiable, permanent eco-achievement badges |
| **GitHub Copilot** | Documented inline in DEV post: autocomplete for Recharts config, Snowflake SQL, Zod schemas. Screenshot evidence. | Faster development of complex integrations |
| **Backboard** | Persistent thread per user (Backboard Assistant + Thread). `memory: "Auto"` on every message. AI recalls eco-history across sessions. | AI that actually *remembers* your journey |
| **Auth0 for Agents** | User auth (Universal Login) + Token Vault for Calendar scanning + CIBA async approval flow for agent-logged activities. | Background agent that asks permission before logging |
| **Snowflake** | Emission factors served from Snowflake DB (not hardcoded). Anonymous community totals written daily. Percentile query powers "better than X% of users" widget. | Live-updateable factors + community benchmarking |

---

## 18. DEV Post Outline

```markdown
# EcoTrace: I Built an AI Carbon Tracker with Persistent Memory and Solana Badges — Using All 6 Prize Tech Stacks 🌍

## What I Built
EcoTrace is a personal carbon footprint tracker powered by an AI coach that 
*remembers your eco-journey* (Backboard), secured by Auth0, with emission data 
live from Snowflake, NFT achievement badges on Solana, and community benchmarking 
that shows how you stack up against other users — all in a Next.js 14 app with 
a bioluminescent dark/light UI.

## Demo
[Loom video link]
[Live app link — ecotrace.vercel.app]
[GitHub repo link]

## The Problem I'm Solving
I had no idea how carbon-heavy my daily choices were. When I started tracking, 
I was shocked: one beef burger = driving 30km. One short-haul flight = 2 weeks 
of commuting. The data exists — people just never see it in their own life context.

## Technical Breakdown

### Architecture: Clean + DRY
- Clean Architecture layers: Domain → Application → Infrastructure → Presentation
- Repository pattern: swap Supabase/Snowflake without touching business logic
- Shared Zod schemas validated client AND server — write once, validate everywhere
- `withAuth` + `withValidation` middleware wrappers — DRY API route protection

### Backboard: AI with Memory
[Code snippet: Backboard chat call with memory:"Auto"]
[Screenshot: AI referencing a flight logged 3 sessions ago]

### Auth0 for Agents: The Background Scanner
[Code snippet: Token Vault calendar token exchange]
[Screenshot: CIBA approval notification UI]

### Snowflake: Live Data + Community
[Code snippet: percentile query]
[Screenshot: "Better than 67% of users today" widget]

### Solana: On-Chain Achievements
[Code snippet: Metaplex Bubblegum mint]
[Screenshot: Minted badge + Solana Explorer link]

### Google Gemini (via Backboard)
[Code snippet: model_name: 'gemini-1.5-flash' in payload]
[Screenshot: AI chat with personalized tip]

## What GitHub Copilot Helped With
- Recharts configuration (suggested gradient fill pattern)
- Snowflake parameterized query syntax (unfamiliar API)
- Zod schema for nested badge threshold types
[Screenshot of Copilot autocomplete in action]

## What I Learned
[Genuine reflection: Backboard's memory was the most surprising — it changes 
how you think about AI state. Auth0 Token Vault saved hours vs. rolling OAuth.]

## What's Next
- Social sharing: compare footprints with friends
- Team challenges: office vs. office carbon competitions  
- Offset marketplace: buy verified offsets directly from badges page

## Try It
[Link] — sign in with Google in one click. Your AI coach is waiting.
```

---

*EcoTrace — Built for DEV Weekend Challenge: Earth Day Edition, April 2026*
*Architecture: Clean Architecture + SOLID + DRY | Stack: Next.js 14, TypeScript, Auth0, Backboard, Snowflake, Solana, Gemini*