# Developer Portfolio & Blog Platform

A premium, highly interactive, and translation-ready (i18n) developer portfolio and technical blog platform built on **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**.

---

## 🚀 Key Features

- **Global Reading Progress Indicator**: Smooth spring-animated, theme-responsive glowing scroll bar on all public views (built using `framer-motion`).
- **Fully Responsive Light & Dark Mode**: Handled via dynamic CSS custom properties to prevent FOUC (flash of incorrect theme), ensuring maximum visual clarity across layouts.
- **Multilingual Support (i18n)**: Multi-locale routing for English (`en`), Vietnamese (`vi`), and Japanese (`ja`) with translations stored in dictionary files.
- **Admin CMS Dashboard**: Safe, password-protected management control panel at `/admin` for updating skills, experiences, projects, and publishing blog markdown.
- **Performant & Dynamic Routing**:
  - Incremental Static Regeneration (ISR) for fast static portfolio loading.
  - Server-side rendering (SSR) for dynamic blog pages.
  - Edge routing middleware for auth checks and request filters.
- **Smooth Animations**: Integrated with **Lenis** smooth scroll and **Framer Motion** transitions.

---

## 🛠️ Technology Stack

- **Frontend Core**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, PostCSS, Framer Motion
- **Database & ORM**: PostgreSQL, Prisma ORM, `@prisma/adapter-pg`
- **State & Validation**: Zod, React Hook Form, `@hookform/resolvers`
- **Authentication**: NextAuth.js (v5 Beta)
- **Utilities**: Lucide Icons, bcryptjs, pg

---

## 📁 Project Structure

```text
├── prisma/                 # Prisma schema definition, migrations, and seed script
├── public/                 # Static public assets (images, documents/resume.pdf)
└── src/
    ├── app/                # Next.js App Router (multilingual routes in [locale])
    ├── components/         # Shared & feature components (common, layout, portfolio, blog)
    ├── i18n/               # Translation dictionary configuration and locales (en, vi, ja)
    ├── lib/                # Client utilities, database wrappers, and Zod schemas
    ├── repositories/       # Data-access repository layers for DB interactions
    ├── services/           # Business-logic services mapping data layer to views
    └── middleware.ts       # Next.js Edge Auth and Routing middleware
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- **pnpm** (preferred package manager)
- PostgreSQL database instance

### Installation

1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env` file in the root directory and configure environment variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   AUTH_SECRET="your-nextauth-secret-key"
   ```

3. Generate the Prisma Client code:
   ```bash
   pnpm prisma generate
   ```

4. Run the migrations and seed the database with initial profiles, skills, and projects:
   ```bash
   pnpm prisma db push
   pnpm prisma db seed
   ```

5. Launch the local development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🧹 Available Scripts

- `pnpm dev`: Runs the Next.js development server.
- `pnpm build`: Compiles the application and generates optimized production builds.
- `pnpm start`: Runs the built production server.
- `pnpm lint`: Lints codebase files via ESLint.
- `pnpm prisma db seed`: Triggers the Prisma database seeding file.
- `pnpm prisma studio`: Opens an interactive database GUI.
