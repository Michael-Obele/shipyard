# Shipyard 🏗️

A unified, high-performance engineering registry that showcases your GitHub projects with a "Mechanical Artisan" aesthetic. Built with SvelteKit 5, Tailwind CSS v4, shadcn-svelte, and GitHub GraphQL.

## Features

- 🎨 **Mechanical Artisan Design**: Slate + Indigo theme with structural sincerity and kinetic weight
- 📊 **Hybrid Data Layer**: Merges live GitHub GraphQL stats with curated metadata
- 🏠 **Bento Grid Layout**: High-impact projects occupy larger cells based on curation
- 🔍 **Tech X-Ray**: Hover cards reveal detailed repository stats and tech stack
- ⚡ **Instant Feedback**: ISR caching with 60-minute TTL for optimal performance
- 🎯 **Project Clustering**: Group related repositories (e.g., monorepos) into virtual entities

## Quick Start

### Prerequisites

- Bun (`bun`)
- A GitHub Personal Access Token (for public repos)

### Setup

1. **Clone and install dependencies:**

```bash
cd shipyard
bun install
```

2. **Configure environment:**

```bash
cp .env.example .env
# Edit .env with your GitHub token
```

3. **Populate the registry:**

Edit `src/lib/server/registry-config.ts` to define your project groups and overrides:

```typescript
export const registryConfig = {
	groups: [
		{
			id: 'cinder',
			name: 'Cinder Ecosystem',
			repos: ['cinder', 'cinder-sv', 'cinder-mcp'],
			featured: true
		}
	],
	overrides: {
		'tif': {
			name: 'Tech Invoice Forge',
			featured: true
		}
	}
};
```

4. **Run development server:**

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) to see your registry.

## Project Structure

```
src/
├── lib/
│   ├── components/        # UI components (shadcn-svelte)
│   ├── server/            # GitHub API & registry logic
│   │   ├── github.ts       # GraphQL query + fetcher
│   │   ├── registry.ts     # Data aggregation logic
│   │   └── registry-config.ts  # Project configuration
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions (cn, etc.)
├── routes/
│   ├── +layout.svelte      # Layout wrapper
│   ├── +page.svelte        # Main registry grid
│   ├── +page.server.ts     # Data loader
│   └── layout.css          # Design system variables
shipyard/                   # Project specification files
├── index.md
├── engineering.md          # Data layer & architecture
├── design-system.md        # Visual language & theming
├── implementation.md       # Setup guide
└── todos.md               # Roadmap
```

## Architecture Highlights

### Data Layer Strategy

The system fetches live stats from GitHub GraphQL and merges them with curated metadata:

- **Source**: GitHub GraphQL (stars, updated_at, languages, topics)
- **Controller**: `registry-config.ts` (project grouping, overrides, featured status)
- **Output**: Unified `DisplayProject[]` for rendering

### Design System

Uses **Tailwind CSS v4** with a custom Slate + Indigo palette:

- **Primary**: Indigo 500 (#7c3aed)
- **Background**: Slate 950 (#0f172a)
- **Card**: Glassmorphism with `bg-card/50 backdrop-blur-md`
- **Hover Effects**: 102% scaling with subtle radial glow

### Components

All UI primitives from **shadcn-svelte** (Bits UI):

- **Card**, **Badge**, **Button**, **Separator**: Standard Shadcn components
- **ProjectCard**: Custom wrapper showing project stats with HoverCard tech details
- **BentoGrid**: CSS Grid responsive layout with featured item expansion

## Environment Variables

```env
# .env
GITHUB_TOKEN=github_pat_xxxxx  # Your GitHub Personal Access Token
```

For public-only repositories, this token just ensures higher API rate limits.

## Build for Production

```bash
# Type check & build
bun run build

# Preview production build
bun run preview
```

Deploy to Vercel, Netlify, or any Node.js-compatible host for ISR support.

## Roadmap

See [shipyard/todos.md](./shipyard/todos.md) for planned enhancements.

## References

- [Engineering Specification](./shipyard/engineering.md)
- [Design System](./shipyard/design-system.md)
- [Implementation Guide](./shipyard/implementation.md)
- [SvelteKit Documentation](https://kit.svelte.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn-svelte](https://shadcn-svelte.com)

## License

MIT

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
