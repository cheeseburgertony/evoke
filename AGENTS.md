# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Evoke is an AI-powered code generation platform that transforms natural language descriptions into working web applications. Users describe what they want to build, and AI agents generate and execute Next.js code in sandboxed environments.

## Development Commands

```bash
# Development
npm run dev          # Start Next.js dev server

# Build
npm run build        # Production build

# Linting
npm run lint         # Run ESLint

# Database
npx prisma generate  # Generate Prisma client (runs automatically postinstall)
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open Prisma Studio GUI
```

## Architecture

### Core Flow
1. User describes app → tRPC mutation creates project + sends Inngest event
2. Inngest AI agent generates code using tools (terminal, createOrUpdateFiles, readFiles)
3. E2B sandbox executes code with hot reload
4. SSE streams real-time progress to frontend
5. Fragment saved with generated files and sandbox URL

### Directory Structure
- `src/modules/` - Feature modules (home, messages, projects, usage). Each module has `server/procedures.ts` for tRPC routes and `ui/` for React components
- `src/trpc/` - tRPC setup. `init.ts` defines context and auth middleware. Routers combined in `routers/_app.ts`
- `src/inngest/` - AI agent orchestration. `functions.ts` contains the main code generation agent with tools
- `src/lib/` - Utilities: `ai-models.ts` (model configs), `sse-manager.ts` (real-time updates), `prisma.ts` (db client)
- `src/components/ui/` - Shadcn/UI components (pre-installed, import from `@/components/ui/*`)
- `prisma/schema.prisma` - Database models: Project, Message, Fragment, Usage

### Key Patterns

**tRPC Routers**: Feature modules export routers that are merged in `src/trpc/routers/_app.ts`. Use `protectedProcedure` for authenticated routes.

**AI Models**: Configured in `src/lib/ai-models.ts`. Multiple providers (Silicon, DeepSeek, LongCat, etc.) via OpenAI-compatible APIs. Add new models to `AIModelIdType` and `aiModels` array.

**Inngest Agent**: The code agent in `src/inngest/functions.ts` uses tools for terminal commands, file operations, and sandbox interaction. Agents include code-agent, project-title-generator, fragment-title-generator, and response-generator.

**SSE Events**: Real-time progress updates via `sseManager.sendEvent()`. Frontend uses `use-sse.ts` hook to subscribe to project events.

**Prompt Engineering**: Main agent prompts in `src/prompt.ts`. The system prompt instructs the agent on Next.js environment, Shadcn usage, and file conventions.

### Database Schema
- `Project` → has many `Message`s
- `Message` → has one `Fragment` (optional, for assistant responses with generated code)
- `Fragment` → stores `sandboxUrl`, `title`, and `files` (JSON)
- `Usage` → credits/points tracking with expiration

## Environment Variables

Required services:
- `DATABASE_URL` - PostgreSQL connection (Neon)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` - Auth
- `E2B_API_KEY` - Code sandbox
- `INNGEST_EVENT_KEY` / `INNGEST_SIGNING_KEY` - Event processing
- AI provider keys: `SILICON_API_KEY`, `DEEPSEEK_API_KEY`, `LONG_CAT_API_KEY`, etc. (based on models used)

## Notes

- The dev server runs on port 3000 with hot reload. Generated apps in sandboxes also run on port 3000
- Shadcn components are pre-installed. Import directly from `@/components/ui/button`, etc. Do not re-install
- The `cn` utility must be imported from `@/lib/utils`, not from component paths
- All styling uses Tailwind CSS - no separate CSS/SCSS files
- The AI agent environment is Next.js 15.3.3 with Tailwind and Shadcn pre-configured
