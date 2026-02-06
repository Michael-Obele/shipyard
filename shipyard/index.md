---
title: Shipyard - Project Registry Blueprint
status: in-progress
owner: Michael Obele
tags: [sveltekit, github-api, showcase, engineering]
prototype: false
---

# Shipyard: The Project Registry Blueprint

**A unified, high-performance project showcase system.**

This folder condenses the research from `project-atlas` and `devvault` into a single, actionable specification. Use this as a direct reference when building the `Michael-Obele` project showcase.

---

## 🏗️ Table of Contents

### 1. Core Engineering

- [**The Data Layer**](./engineering.md#data-layer) - GitHub GraphQL + Hybrid YAML Strategy.
- [**System Architecture**](./engineering.md#architecture) - SvelteKit 5 + ISR Caching.
- [**Monorepo handling**](./engineering.md#monorepo-strategy) - Handling "Cinder" and "VaultNote" clusters.

### 2. UI & Design System

- [**Component Blueprint**](./design-system.md) - Bits UI Primitives + Shadcn tokens.
- [**Icons & Visual Language**](./design-system.md#icons) - Lucide Integration.
- [**Boilerplates & Snippets**](./boilerplates.md) - **COPY-PASTE READY CODE**.

### 3. Execution

- [**The Roadmap**](./todos.md) - Actionable Phase-based tasks.
- [**Setup & Steps**](./implementation.md) - Environment & CI/CD setup.

---

## 🏛️ Development Philosophy

Inspired by high-end developer platforms like **Linear** and **Vercel**, Shipyard is built on the **"Mechanical Artisan"** philosophy:

1.  **Structural Sincerity:** We celebrate the grid and the border. Using Slate-800 borders and primary-glows to create a "machined" feel.
2.  **Product Curation:** Every entry is a product, not just a repo. We use Bento-Grid logic to highlight high-impact clusters like Cinder.
3.  **Kinetic Intent:** Interaction is weighted and deliberate, using Svelte transitions to create physical presence.
4.  **Hybrid Intelligence:** Merging the reliability of automation (GitHub API) with the nuance of human curation (`registry.yaml`).

---

## ✅ Success Criteria

- [ ] **Unified Feed:** All selected repos (GitHub API) + Local groups appear in one view.
- [ ] **Product-Focused:** Repos like `cinder`, `cinder-sv`, and `cinder-mcp` are grouped as one "Cinder Ecosystem" card.
- [ ] **Performance:** < 100ms LCP due to ISR and efficient GraphQL queries.
- [ ] **Visual Identity:** Distinct Indigo-themed glassmorphism style.

---

## 🏗️ Roadmap (Phase-Based)

1.  **Phase 1:** High-Performance Foundation
2.  **Phase 2:** Intelligence & Data
3.  **Phase 3:** Aesthetic & Interaction
4.  **Phase 4:** Production & Scale

---


### Related Documents

- [Engineering](./engineering.md)
- [Design System](./design-system.md)
- [Boilerplates](./boilerplates.md)
- [Todos](./todos.md)

[Research Archive (Atlas)](../project-atlas/README.md) | [Research Archive (DevVault)](../devvault/README.md)
