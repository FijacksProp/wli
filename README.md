# Wisdom Leadership Initiatives website

Responsive public website for Wisdom Leadership Initiatives (The Wisdom Place).

## Development

Install dependencies with Bun, then run the local development server:

```sh
bun install
bun run dev
```

## Project structure

- `src/routes/` contains the site pages.
- `src/components/site/` contains shared site components.
- `src/lib/content.ts` is the single source for site copy, programs, resources, team entries, and contact details.
- Unconfirmed content should remain visibly marked until approved.
- Contact and newsletter forms are frontend prototypes until connected to delivery services.

## Available commands

- `bun run build` creates a production build.
- `bun run lint` checks source formatting and code quality.
- `bun run test` runs the existing test suite.
