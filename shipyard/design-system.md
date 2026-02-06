---
title: Shipyard Design System
status: in-progress
---

[← Back to Index](./index.md)

# Design System & UI

## 🏛️ Design Philosophy: "The Mechanical Artisan"

Shipyard is not a generic portfolio; it is an engineering registry. We reject flat, "safe" design in favor of an aesthetic that celebrates the structure of software.

### Core Pillars
1. **Structural Sincerity**: We don't hide borders or grids; we elevate them. Using `slate-800` borders and `primary/20` glows to create a "machined" feel.
2. **Bento Logic**: Curation is reflected through size. High-impact projects (e.g., Cinder) occupy larger Bento cells, while utility tools are grouped in smaller, dense clusters.
3. **Kinetic Weight**: Every user interaction should feel "heavy" and deliberate. Transitions use `ease-out` with subtle 102% scaling to simulate physical movement.
4. **Information Layering**: The primary view is clean, but the **Bits UI HoverCard** provides a "technical x-ray" of the repository (stars, tech-stack, last-commit) on demand.

## Visual Language & Theming

We use a customized **Slate + Indigo** theme for a high-end, developer-centric aesthetic, replacing the standard Zinc palette.

### 1. Theme Configuration (Tailwind CSS Variables)

Apply these in your `app.css` to override the default Shadcn variables.

```css
@layer base {
  :root {
    --background: 222 47% 11%;
    --foreground: 213 31% 91%;

    --card: 222 47% 12%;
    --card-foreground: 213 31% 91%;

    --popover: 222 47% 11%;
    --popover-foreground: 213 31% 91%;

    --primary: 243 75% 59%; /* Indigo 500 */
    --primary-foreground: 210 40% 98%;

    --secondary: 222 47% 16%;
    --secondary-foreground: 210 40% 98%;

    --muted: 223 47% 16%;
    --muted-foreground: 215.4 16.3% 56.9%;

    --accent: 216 34% 17%;
    --accent-foreground: 210 40% 98%;

    --border: 216 34% 17%;
    --input: 216 34% 17%;
    --ring: 243 75% 59%;
  }
}
```

### 2. Micro-Interactions & Surfaces

- **Glassmorphism:** Use `bg-card/50 backdrop-blur-md` for repo cards for a layered feel.
- **Card Glow:** Add a subtle radial gradient on hover:
  ```css
  .project-card:hover {
    background: radial-gradient(
      circle at top left,
      hsla(var(--primary) / 0.15),
      transparent 70%
    );
  }
  ```
- **Semantic Status Colors:**
  - Active/Stable: `bg-emerald-500/10 text-emerald-500`
  - Experimental: `bg-amber-500/10 text-amber-500`
  - Clusters: `bg-indigo-500/10 text-indigo-500`

## Primitives (Bits UI)

We use **Bits UI** for interactive components. Bits UI handles the state and accessibility, while our Tailwind classes apply the Slate + Indigo styling.

### Component Mapping

| Element       | Bits UI Primitive   | Purpose                                      |
| :------------ | :------------------ | :------------------------------------------- |
| Project Group | `Collapsible`       | Expandable stacks for grouped repositories.  |
| Tech Tooltip  | `LinkPreview`       | Show detailed tech stack breakdown on hover. |
| Filtering     | `Button` / `Toggle` | Category selection and view switching.       |

## Icons {#icons}

Using **Lucide Svelte**.

| Intent     | Icon           | Import                                         |
| :--------- | :------------- | :--------------------------------------------- |
| Repository | `Box`          | `import { Box } from "lucide-svelte"`          |
| Stars      | `Star`         | `import { Star } from "lucide-svelte"`         |
| Fork       | `GitFork`      | `import { GitFork } from "lucide-svelte"`      |
| Updates    | `Clock`        | `import { Clock } from "lucide-svelte"`        |
| External   | `ExternalLink` | `import { ExternalLink } from "lucide-svelte"` |
| System     | `Layers`       | `import { Layers } from "lucide-svelte"`       |

## Visual Language

- **Background:** `slate-950`.
- **Surface:** `slate-900` with `slate-800` borders (using `border-primary/20` on hover).
- **Accent:** Indigo (`243 75% 59%`) for borders, links, and glows.
- **Micro-interactions:** 102% scale on card hover + Indigo glow effect.

---

### Related Documents

- [Index](./index.md)
- [Engineering](./engineering.md)
- [Boilerplates](./boilerplates.md)
- [Todos](./todos.md)
