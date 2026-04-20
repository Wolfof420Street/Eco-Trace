# EcoTrace

> **Know Your Impact. Own Your Change.**

EcoTrace is a full-stack web application that empowers users to track their personal carbon footprint, visualize their environmental impact, chat with an AI coach that remembers their eco-journey, and earn blockchain-verified eco-badges for hitting sustainability milestones.

**Live:** https://ecotrace.vercel.app  
**Repository:** https://github.com/Wolfof420Street/Eco-Trace

---

## ✨ Features

### 📊 Carbon Footprint Tracking
- **Smart Activity Logging**: Log daily activities across 5 categories (transport, food, energy, goods, waste)
- **Real-Time CO₂ Calculation**: Instant emissions estimate based on verified emission factors
- **Weekly Insights**: Visual breakdown of your carbon footprint by category
- **Community Benchmarking**: Compare your footprint with peers (anonymized)

### 🤖 AI-Powered Eco-Coaching
- **Memory-Backed AI**: Backboard-powered assistant remembers your patterns across sessions
- **Personalized Tips**: Context-aware sustainability recommendations
- **Carbon Scenario Modeling**: "What-if" analysis for lifestyle changes
- **Natural Language**: Chat naturally—no dashboard needed

### 🏆 On-Chain Achievements
- **Eco-Badges**: Earn verifiable NFTs (cNFTs) on Solana for sustainability milestones
- **Proof of Impact**: Shareable blockchain proof of your environmental commitment
- **Milestone Celebrations**: Unlock badges at 10kg, 50kg, 100kg CO₂ reductions

### 🔐 Privacy-First Design
- **No Tracking**: Your data stays yours (Supabase encrypted at rest)
- **Anonymous Benchmarking**: Compare progress without exposing identity
- **Auth0 Standard**: Enterprise-grade authentication
- **Row-Level Security**: Database policies ensure data isolation

---

## 🖼️ Screenshots

### Landing & Product Experience

![EcoTrace landing hero](./screenshots/Screenshot%20from%202026-04-20%2007-45-12.png)
![EcoTrace feature cards](./screenshots/Screenshot%20from%202026-04-20%2007-44-50.png)
![EcoTrace value proposition strip](./screenshots/Screenshot%20from%202026-04-20%2007-44-41.png)

### Authentication Flow

![EcoTrace login page](./screenshots/Screenshot%20from%202026-04-20%2007-44-57.png)
![Auth0 authorize app prompt](./screenshots/Screenshot%20from%202026-04-20%2007-45-24.png)
![Auth0 welcome sign-in form](./screenshots/Screenshot%20from%202026-04-20%2008-15-33.png)

### App Dashboard & Insights

![EcoTrace dashboard overview](./screenshots/Screenshot%20from%202026-04-20%2008-40-21.png)
![EcoTrace AI insights chat](./screenshots/Screenshot%20from%202026-04-20%2008-41-23.png)

### Badge Minting & Wallet

![EcoTrace badges page with wallet disconnected](./screenshots/Screenshot%20from%202026-04-20%2008-48-14.png)
![Solana wallet selector modal](./screenshots/Screenshot%20from%202026-04-20%2008-48-26.png)
![Wallet recovery phrase setup](./screenshots/Screenshot%20from%202026-04-20%2008-50-06.png)
![EcoTrace badges page with wallet connected](./screenshots/Screenshot%20from%202026-04-20%2008-56-51.png)

---

## 🏗️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) + React 18 | SSR, RSC, Server Actions |
| **Styling** | Tailwind CSS + CSS Variables | Responsive, dark mode, design tokens |
| **Language** | TypeScript (strict mode) | Type-safe end-to-end |
| **Auth** | Auth0 for Agents | Enterprise SSO + Token Vault |
| **AI** | Backboard + Google Gemini 1.5 | Persistent memory, fast inference |
| **Database** | Supabase (PostgreSQL) | Real-time, RLS, built-in auth |
| **Analytics DB** | Snowflake | Emission factors, benchmarking |
| **Blockchain** | Solana + Metaplex Bubblegum | cNFT minting (mainnet-beta or devnet) |
| **Deployment** | Vercel | Edge functions, zero-config |
| **Monitoring** | Vercel Analytics + Sentry | Performance, error tracking |

---

## 📋 Prerequisites

- **Node.js** 20+
- **npm** 10+
- **GitHub** account (for CI/CD)
- **Vercel** account (for deployment)

### Required Services (must set up before running)
1. **Auth0** tenant with a Web Application client
2. **Supabase** project with database initialized
3. **Snowflake** account (optional, for analytics; uses public demo data if unavailable)
4. **Backboard** API key + Assistant ID
5. **Solana** wallet + RPC endpoint (devnet or mainnet-beta)
6. **Vercel** project linked to GitHub

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Wolfof420Street/Eco-Trace.git
cd ecotrace
npm ci  # Use npm ci for exact dependency versions
```

### 2. Environment Setup

```bash
# Copy example environment variables
cp .env.local.example .env.local

# Edit .env.local with your credentials
nano .env.local
```

**Required environment variables:**

```env
# Auth0 (sign up at https://auth0.com)
AUTH0_SECRET=<32-char-random-string>  # Run: openssl rand -base64 32
AUTH0_DOMAIN=yourtenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_AUDIENCE=https://yourtenant.auth0.com/api/v2/

# Supabase (https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Backboard (https://backboard.chat)
BACKBOARD_API_KEY=your_backboard_api_key
BACKBOARD_ASSISTANT_ID=your_assistant_id

# Solana (https://solana.com)
NEXT_PUBLIC_SOLANA_NETWORK=devnet  # or mainnet-beta
SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_MINT_AUTHORITY_KEYPAIR=<base64-encoded-keypair>
SOLANA_MERKLE_TREE_ADDRESS=<merkle-tree-address>

# Snowflake (optional—falls back to static data if unavailable)
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USERNAME=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_DATABASE=ECOTRACE
SNOWFLAKE_SCHEMA=PUBLIC
SNOWFLAKE_WAREHOUSE=COMPUTE_WH
SNOWFLAKE_ROLE=SYSADMIN

# App
APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
```

### 3. Initialize Database

```bash
# Apply Supabase migrations
npm run supabase:migrate

# (Optional) Validate Auth0 config
npm run validate:auth0

# (Optional) Test Snowflake connection
npm run test:snowflake
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server on :3000

# Build & Production
npm run build            # Build optimized bundle
npm start                # Start production server
npm run build && npm start  # Build + run locally

# Code Quality
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript check
npm run lint:fix         # Auto-fix ESLint issues

# Validation
npm run validate:auth0   # Verify Auth0 credentials
npm run test:snowflake   # Test Snowflake connection
```

### Project Structure

```
ecotrace/
├── app/                       # Next.js App Router (presentation layer)
│   ├── (auth)/               # Auth group (login, signup, callback)
│   ├── (app)/                # Protected routes (auth required)
│   │   ├── dashboard/
│   │   ├── insights/
│   │   ├── badges/
│   │   └── settings/
│   ├── api/                  # API routes (HTTP adapters)
│   │   ├── activities/
│   │   ├── agent/            # Calendar scanner
│   │   ├── ai/               # Chat, tips, intelligence
│   │   ├── badges/           # Badge queries & minting
│   │   ├── carbon/           # CO₂ calculation
│   │   └── community/        # Percentile benchmarking
│   ├── page.tsx              # Landing page
│   └── layout.tsx            # Root layout
│
├── src/                       # Business logic (domain-driven architecture)
│   ├── domain/               # Domain layer (pure, no dependencies)
│   │   ├── constants/        # Badge definitions, categories
│   │   ├── entities/         # Activity, Badge, UserProfile, etc.
│   │   ├── interfaces/       # IActivityRepository, etc.
│   │   ├── schemas/          # Zod validation schemas
│   │   ├── utils/            # Date formatting, CO₂ calculations
│   │   └── value-objects/    # CO2Amount, EmissionFactor
│   │
│   ├── application/          # Application layer (use cases)
│   │   ├── dtos/             # Data transfer objects
│   │   ├── use-cases/        # LogActivityUseCase, GetDashboardDataUseCase
│   │   └── mappers/          # DTO ↔ Entity conversion
│   │
│   └── infrastructure/        # Infrastructure layer (implementations)
│       ├── auth0/            # Auth0 client, Agent Tools
│       ├── backboard/        # AI memory + Gemini routing
│       ├── snowflake/        # Analytics database
│       ├── solana/           # Blockchain wallet + minting
│       └── supabase/         # User data repositories
│
├── components/               # React components (reusable)
│   ├── ui/                  # Primitive (Button, Card, etc.)
│   ├── dashboard/           # Dashboard-specific
│   ├── insights/            # AI insights
│   ├── badges/              # Badge display & minting
│   ├── agent/               # Agent scanner UI
│   ├── layout/              # AppShell, Navbar, Sidebar
│   └── providers/           # Context providers
│
├── hooks/                    # React hooks
├── lib/                      # Utilities (API client, grid system)
├── public/                   # Static assets
├── scripts/                  # Utility scripts
├── supabase/                 # Database migrations
├── DEPLOYMENT_CHECKLIST.md   # Pre-production checklist
├── README.md                 # This file
└── package.json
```

### Architecture Principles

**Clean Architecture**: Layers are independent; domain layer has zero external dependencies.

```
Presentation Layer (components, pages)
         ↓
Application Layer (use cases, DTOs)
         ↓
Domain Layer (entities, interfaces) ← Pure business logic
         ↓
Infrastructure Layer (repositories, external APIs)
```

**SOLID Principles**:
- **Single Responsibility**: Each module does one thing.
- **Open/Closed**: Extend without modifying (emission factors are pluggable).
- **Liskov Substitution**: All repositories implement `IActivityRepository`.
- **Interface Segregation**: Small, focused interfaces.
- **Dependency Inversion**: Use cases depend on interfaces, not concrete classes.

---

## 🔐 Security

### Authentication Flow

1. **User clicks "Login"** → redirected to Auth0
2. **Auth0 returns JWT** → stored in secure HttpOnly cookie
3. **Protected routes** verify JWT via `withAuth` middleware
4. **Token Vault** (optional) provides calendar access for agent scanning
5. **Session refresh** automatic on every request

### Data Protection

- **Supabase RLS**: Row-level security policies ensure users see only their data
- **Encrypted at rest**: Supabase default encryption for data in DB
- **HTTPS only**: Vercel enforces TLS; custom domain uses auto-provisioned SSL
- **No hardcoded secrets**: All credentials from environment variables
- **Sanitized error messages**: Stack traces never reach client code

### API Security

- **Input validation**: Zod schemas on all routes
- **Rate limiting**: Implemented on login, chat, and minting endpoints
- **CORS**: Configured to only accept requests from known domains
- **XSS prevention**: React escapes content by default
- **SQL injection prevention**: Using parameterized queries (Supabase/Snowflake)

### Blockchain Security

- **Keypair storage**: Mint authority keypair stored as environment variable, not in code
- **Transaction verification**: All Solana transactions verified before minting
- **Merkle tree validation**: Proof verified against on-chain Merkle tree root

---

## 📊 Deployment

### Deploy to Vercel (Recommended)

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (links to GitHub repo automatically)
vercel --prod

# Set environment variables in Vercel dashboard:
# Settings → Environment Variables
# Add all values from .env.local
```

#### Automatic Deployment (GitHub Integration)

1. **Push code to main branch**:
   ```bash
   git push origin main
   ```

2. **Smoke tests run** post-deployment
   - Health checks on key endpoints

### Production Environment Variables

Set in **Vercel Settings → Environment Variables** (not in code):

| Variable | Provider | Security |
|----------|----------|----------|
| `AUTH0_*` | Auth0 tenant (production) | ✅ Private key |
| `NEXT_PUBLIC_SUPABASE_*` | Supabase (production) | ⚠️ Anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | ✅ Secret |
| `BACKBOARD_API_KEY` | Backboard | ✅ Secret |
| `SNOWFLAKE_*` | Snowflake | ✅ Credentials |
| `SOLANA_MINT_AUTHORITY_KEYPAIR` | Local | ✅ Secret |

### CI/CD Pipeline

```
GitHub Push (main)
       ↓
   ┌─────────────────────┐
   │  Code Quality       │  ← Lint, TypeScript, Auth0 validation
   └─────────────────────┘
       ↓
   ┌─────────────────────┐
   │  Security Scan      │  ← npm audit, hardcoded secrets, mock data
   └─────────────────────┘
       ↓
   ┌─────────────────────┐
   │  Build              │  ← Next.js build verification
   └─────────────────────┘
       ↓
   ┌─────────────────────┐
   │  Deploy Preview     │  ← Vercel preview (on PR)
   └─────────────────────┘
       ↓
   ┌─────────────────────┐
   │  Deploy Production  │  ← Vercel production (on main push)
   └─────────────────────┘
       ↓
   ┌─────────────────────┐
   │  Smoke Tests        │  ← Health checks, API validation
   └─────────────────────┘
```



---

## 📱 Browser Support

- **Chrome/Edge**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions (iOS 14+)
- **Mobile responsiveness**: Fully supported (tested on iPhone 12+, Android 12+)

---

## 🐛 Troubleshooting

### "Cannot find module '@/src/infrastructure/supabase'"

**Fix**: The app requires Supabase credentials. Check `.env.local`:
```bash
npm run validate:auth0  # Debug Auth0 config
```

### "Auth0 login redirect fails"

**Causes & Fixes**:
1. `AUTH0_BASE_URL` doesn't match app domain
2. Callback URL not added in Auth0 dashboard: Settings → Allowed Callback URLs
3. Logout URL not added: Allowed Logout URLs

**Debug**:
```bash
npm run validate:auth0
# Should print: ✅ Auth0 is configured
```

### "Dashboard shows empty activities"

**Likely cause**: Database migrations not applied.

**Fix**:
```bash
# Reset Supabase (development only!)
npm run supabase:reset

# Or apply migrations manually in Supabase dashboard
# https://supabase.com/dashboard → SQL Editor
```

### "Snowflake connection times out"

**Expected**: Snowflake is optional for local development.

**Fix**: Leave `SNOWFLAKE_*` empty for demo data instead.

### "Vercel deployment ENOENT error"

**Cause**: Missing environment variables in Vercel settings.

**Fix**:
1. Go to Vercel Dashboard → EcoTrace project
2. Settings → Environment Variables
3. Add all variables from `.env.local`

---

## 📈 Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Score | > 85 | Chrome DevTools → Lighthouse |
| First Contentful Paint (FCP) | < 2.5s | Web Vitals |
| Largest Contentful Paint (LCP) | < 4s | Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Web Vitals |
| Time to Interactive (TTI) | < 5s | Lighthouse |
| Bundle Size | < 500KB | `npm run analyze` |

### Optimize Bundle

```bash
# View bundle breakdown
npm run build

# Use next/dynamic for code splitting
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./Heavy'), { ssr: false });
```

---

## 🧪 Testing (Optional)

```bash
# Create tests with Jest + React Testing Library
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Coverage report
npm test -- --coverage
```

---

## 📚 API Reference

### Activities API

#### Log Activity
```http
POST /api/activities
Content-Type: application/json
Authorization: Bearer <jwt>

{
  "category": "transport",
  "subcategory": "car_petrol",
  "quantity": 25,
  "unit": "km",
  "notes": "Drove to work"
}

Response: 201 Created
{
  "id": "act_12345",
  "co2Kg": 4.8,
  "loggedAt": "2024-04-20T10:30:00Z"
}
```

#### Get Activities
```http
GET /api/activities?category=transport&days=7
Authorization: Bearer <jwt>

Response: 200 OK
{
  "activities": [...],
  "totalCO2Kg": 45.2,
  "dailyAverage": 6.46
}
```

### Chat API

#### Send Message
```http
POST /api/ai/chat
Content-Type: application/json
Authorization: Bearer <jwt>

{
  "message": "What can I do to reduce my food emissions?"
}

Response: 200 OK
{
  "response": "Based on your eating patterns...",
  "recommendations": [...]
}
```

### Badges API

#### Get User Badges
```http
GET /api/badges
Authorization: Bearer <jwt>

Response: 200 OK
[
  {
    "id": "badge_1",
    "name": "First Step",
    "state": "earned",
    "solanaMintAddress": "..."
  }
]
```

#### Mint Badge
```http
POST /api/badges/mint
Content-Type: application/json
Authorization: Bearer <jwt>

{
  "badgeId": "first_log"
}

Response: 200 OK
{
  "solanaTxSignature": "...",
  "solanaMintAddress": "..."
}
```

---

## 🤝 Contributing

We welcome contributions! Before submitting:

1. **Fork the repo**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** & test locally: `npm run lint && npm run typecheck`
4. **Push & open PR**: GitHub Actions will run checks
5. **Address feedback** from code review

**Guidelines**:
- Follow ESLint rules (auto-fixed with `npm run lint:fix`)
- Keep TypeScript strict mode clean
- Add/update comments for complex logic
- Test user-facing changes manually

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) file.

---

## 📞 Support

- **Email**: bill@affirmi.xyz
- **GitHub Issues**: [Bug reports](https://github.com/Wolfof420Street/Eco-Trace/issues)


---

## 🙏 Acknowledgments

Built with ❤️ for Earth Day and the prize categories:
- ✅ Google Gemini
- ✅ Solana
- ✅ GitHub Copilot
- ✅ Backboard
- ✅ Auth0
- ✅ Snowflake

Thanks to the Vercel team for hosting and Next.js for the framework.

---

**Last updated**: April 20, 2026  
**Version**: 0.1.0  
**Status**: Production Ready ✨

# Eco-Trace
