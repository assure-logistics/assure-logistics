# Assure Logistics

A freight and shipment tracking platform for logistics operations managers to manage shipments, carriers, and delivery events.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/assure-logistics run dev` — run the frontend (port 24903)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, shadcn/ui, TanStack React Query, wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod validation schemas
- `lib/db/src/schema/` — Drizzle DB schema (carriers, shipments, shipment_events)
- `artifacts/api-server/src/routes/` — Express route handlers (carriers, shipments, dashboard)
- `artifacts/assure-logistics/src/pages/` — React pages (Dashboard, Shipments, ShipmentDetail, Carriers)

## Architecture decisions

- Contract-first: OpenAPI spec drives both server Zod validation and React Query hooks via Orval codegen
- Shipment events are cascade-deleted when a shipment is removed
- Dashboard summary uses SQL aggregates (no N+1 queries)
- Active shipment count per carrier is computed via SQL COUNT with GROUP BY
- Status badge styling is defined in a shared `StatusBadge` component

## Product

- **Dashboard** — fleet summary stats (total, in-transit, pending, delivered, delayed, carriers), recent shipments feed, status breakdown chart
- **Shipments** — searchable/filterable list with full CRUD, create new shipments with carrier assignment
- **Shipment Detail** — full shipment info, event timeline with add/edit support, delete with confirmation
- **Carriers** — card-based carrier directory with active shipment counts, full CRUD

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Zod body schemas are named `CreateXxxBody` / `UpdateXxxBody` (operation-shaped), not the OpenAPI component name
- `pnpm --filter @workspace/db run push-force` if push fails with column conflicts

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
