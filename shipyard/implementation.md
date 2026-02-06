---
title: Shipyard Implementation Guide
status: in-progress
---

[← Back to Index](./index.md)

# Setup & Implementation

## 1. Quick Start Commands

```bash
# 1. Initialize SvelteKit 5
bunx sv create shipyard
# Choose: SvelteKit, Typescript, Tailwind

# 2. Add Shadcn
bunx shadcn-svelte@latest init

# 3. Add Components
bunx shadcn-svelte@latest add card badge button input tabs separator

# 4. Install Dependencies
bun add @lucide/svelte bits-ui js-yaml
bun add -D @types/js-yaml
```

## 2. Environment Setup

Create a `.env` file:

```env
GITHUB_TOKEN=your_pat_token_here
```

## 3. High-Value Tasks

1.  **Repo Mirroring:** Ensure your `registry.yaml` lists `cinder`, `cinder-sv`, and `cinder-mcp` to test the clustering logic.
2.  **Private Projects:** Add your "Client Logistics Dashboard" to the `manual` section of the YAML.
3.  **Deployment:** Vercel is highly recommended for immediate GitHub sync and ISR support.

---

### Related Documents

- [Index](./index.md)
- [Engineering](./engineering.md)
- [Design System](./design-system.md)
- [Todos](./todos.md)
