# Shipyard: Project Registry Blueprint

You are an expert AI agent working on **Shipyard**, a unified, high-performance project showcase system. This project acts as a "Mechanical Artisan" engineering registry, moving beyond generic portfolios to a product-focused ecosystem.

## 🏗️ Core Architecture

- **Runtime & Tooling**: Bun (`bun`, `bunx`) is the preferred package manager and task runner.
- **Framework**: SvelteKit 5 (using Runes: `$state`, `$props`, `$derived`, `$effect`).
- **Styling**: Tailwind CSS v4 using a **Slate + Indigo** theme.
- **Data Layer**: Hybrid strategy merging live [GitHub GraphQL stats](shipyard/engineering.md#data-layer) with curated metadata from `registry.yaml`.
- **Database**: Prisma ORM with PostgreSQL (Singleton client at `$lib/server/db`).
- **Icons**: Use `@lucide/svelte`. Import as: `import { IconName } from '@lucide/svelte'`.
- **Components**: shadcn-svelte primitives and Bits UI.

## 🎨 Design Philosophy: "The Mechanical Artisan"

Follow these styling patterns to maintain the project's identity:

- **Structural Sincerity**: Use `slate-800` borders and `primary/20` glows. Elevate grids and borders instead of hiding them.
- **Bento Logic**: Curation via size. High-impact projects occupy larger Bento cells.
- **Kinetic Weight**: Use `ease-out` transitions with subtle `102%` scaling on hover.
- **Glassmorphism**: Apply `bg-card/50 backdrop-blur-md` to cards for a layered feel.
- **Controlled Glows**: Use radial gradients ONLY for "machined" surface effects on hover as defined in [design-system.md](shipyard/design-system.md).

## 🛠️ Coding Conventions

### Svelte 5 Runes & Patterns

Always use Svelte 5 runes. NEVER use legacy `export let`, `$:`, or `on:click`.

- **Runes**: `$state()`, `$props()`, `$derived()`, `$effect()`, `$bindable()`.
- **Events**: Use modern event attributes (e.g., `onclick`, `onsubmit`) directly on elements.
- **Snippets**: Use `{@render children()}` instead of `<slot />`.
- **State**: Use `$app/state` instead of `$app/stores` for `page`, `navigating`, etc.

### Data Fetching & Mutations (Remote Functions)

Default to **Remote Functions** (experimental `@sveltejs/kit` features) over `+page.server.ts` actions for mutations.

- **Location**: `src/lib/remote/` with `.remote.ts` extension.
- **Types**: `query` (reading), `form` (form-based mutations), `command` (script-based mutations).
- **Validation**: Always use **Valibot** for input validation.

### Quality Gate

- **Proactive Checking**: Run `bun check` immediately after substantive edits.
- **Error Handling**: Use `<svelte:boundary>` for async operations to handle loading/error states gracefully.
- **Package Management**: Install via CLI (`bun add`). Never edit `package.json` manually.

## 📂 Key Files & Directories

- [shipyard/](shipyard/): Project specification and blueprint (Source of Truth).
- `src/lib/remote/`: Logic for data fetching and mutations.
- `src/lib/components/`: Reusable UI components following the design system.
- `registry.yaml`: (To be created) Curated metadata and cluster definitions.

## 🚀 Common Workflows

- `bun run dev`: Start development server.
- `bun run check`: Type-checking and Svelte-check.
- `bun run build`: Production build.

## 🤖 AI Agent Integration

- **Memory**: Persist context via Memory MCP during sessions.
- **Docs**: Use `mcp_svelte_get-documentation` for Svelte 5 logic and `mcp_svelte_svelte-autofixer` to validate components.
