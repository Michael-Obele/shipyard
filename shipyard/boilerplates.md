---
title: Shipyard Code Boilerplates
status: in-progress
---

[← Back to Index](./index.md)

# Boilerplates & Code Snippets

Use these snippets to build the core functionality with zero overhead.

## 1. The Project Card (Svelte 5)

`src/lib/components/ProjectCard.svelte`

```html
<script lang="ts">
  import { Star, Clock, Box, ExternalLink } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";

  let { project } = $props();
</script>

<Card.Root
  class="group project-card transition-all hover:border-primary/50 bg-card/50 backdrop-blur-md"
>
  <Card.Header>
    <div class="flex items-center justify-between">
      <Box class="size-5 text-muted-foreground" />
      <div class="flex gap-3 text-xs text-muted-foreground">
        <span class="flex items-center gap-1"
          ><Star class="size-3" /> {project.stars}</span
        >
        <span class="flex items-center gap-1"
          ><Clock class="size-3" /> {project.lastUpdate}</span
        >
      </div>
    </div>
    <Card.Title class="mt-2">{project.name}</Card.Title>
    <Card.Description class="line-clamp-2"
      >{project.description}</Card.Description
    >
  </Card.Header>
  <Card.Content>
    <div class="flex flex-wrap gap-2">
      {#each project.languages as lang}
      <Badge variant="secondary" style="border-color: {lang.color}">
        {lang.name}
      </Badge>
      {/each}
    </div>
  </Card.Content>
  <Card.Footer class="justify-end gap-2">
    <a href="{project.url}" target="_blank" class="text-xs hover:underline"
      >Code</a
    >
    {#if project.homepage}
    <a href="{project.homepage}" target="_blank" class="text-xs hover:underline"
      >Demo</a
    >
    {/if}
  </Card.Footer>
</Card.Root>
```

## 2. Registry Filter Logic (Runes)

`src/routes/+page.svelte`

```html
<script lang="ts">
  import ProjectCard from "$lib/components/ProjectCard.svelte";

  let { data } = $props();

  let searchQuery = $state("");
  let activeTag = $state("All");

  let filteredProjects = $derived(
    data.projects.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesTag =
        activeTag === "All" || p.topics.includes(activeTag.toLowerCase());
      return matchesSearch && matchesTag;
    }),
  );
</script>

<input bind:value="{searchQuery}" placeholder="Search arsenal..." class="..." />

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each filteredProjects as project (project.id)}
  <ProjectCard {project} />
  {/each}
</div>
```

## 3. GitHub Data Fetcher

`src/lib/server/github.ts`

```typescript
export async function getGithubProjects(token: string) {
  const query = `...`; // from engineering.md
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}` },
    body: JSON.stringify({ query }),
  });
  const json = await response.json();
  return json.data.viewer.repositories.nodes;
}
```

---

### Related Documents

- [Index](./index.md)
- [Engineering](./engineering.md)
- [Design System](./design-system.md)
- [Todos](./todos.md)
