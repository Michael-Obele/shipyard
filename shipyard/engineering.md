---
title: Shipyard Engineering
status: in-progress
---

[← Back to Index](./index.md)

# Engineering Specification

## Data Layer {#data-layer}

### Hybrid Source Strategy

We merge **automated data** (GitHub API) with **curated metadata** (Local YAML).

**1. The Source: GitHub GraphQL**
Fetches live stats (stars, dates, languages) for everything.

```graphql
query {
  viewer {
    repositories(
      first: 100
      orderBy: { field: UPDATED_AT, direction: DESC }
      privacy: PUBLIC
    ) {
      nodes {
        id
        name
        description
        stargazerCount
        updatedAt
        url
        repositoryTopics(first: 5) {
          nodes {
            topic {
              name
            }
          }
        }
        languages(first: 3, orderBy: { field: SIZE, direction: DESC }) {
          nodes {
            name
            color
          }
        }
      }
    }
  }
}
```

**2. The Controller: `registry.yaml`**
Overrides the automation and defines clusters.

```yaml
groups:
  - id: "cinder"
    name: "Cinder Ecosystem"
    repos: ["cinder", "cinder-sv", "cinder-mcp"]
    featured: true
overrides:
  "tif":
    name: "Tech Invoice Forge"
    featured: true
```

## Architecture {#architecture}

### SvelteKit 5 + ISR

- **Model:** Server-side aggregation in `+page.server.ts`.
- **Caching:** Use Vercel ISR or standard Cache-Control headers (60 min TTL).
- **Remote Functions:** Use SvelteKit **Server Actions** for any admin/refresh triggers.

## Monorepo Strategy {#monorepo-strategy}

For projects like **Cinder**, the registry treats the polyrepos as a single "Virtual Monorepo."

- **Logic:** The merger function identifies repos in a `group` and combines their stats into a single `DisplayProject` object.
- **Total Stars:** Calculated as `sum(group.repos.stars)`.
- **Last Active:** Calculated as `max(group.repos.updatedAt)`.

---

### Related Documents

- [Index](./index.md)
- [Design System](./design-system.md)
- [Boilerplates](./boilerplates.md)
- [Todos](./todos.md)
