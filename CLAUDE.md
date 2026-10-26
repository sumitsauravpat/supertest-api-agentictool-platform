# Repo conventions — read this before writing any new code here

This file exists so an automated agent (or a new engineer) can generate code that
matches this repo's real patterns on the first try, instead of guessing.

## Stack
TypeScript (strict), Jest + ts-jest, Supertest (real-URL mode, not in-process),
ESLint (typescript-eslint + eslint-recommended, flat config).

## Folder responsibilities
- `api/config/` — environment loading only. One file, `env.ts`, fail-fast `requireEnv`.
- `api/clients/` — one file per real HTTP call. Each exports one `async function`
  returning a typed `Promise<...>`. Name = verb + resource (`getSalesSummary`,
  `patchRatePlan`). Real headers come from `buildHeader()` in `api/utils/headers.ts`.
- `api/schemas/` — one `<Name>.types.ts` file per client, exporting the real response
  interface the matching client resolves to. Interface name = `<Thing>Response`.
- `api/controllers/` — composes 2+ clients into one real user-facing flow
  (e.g. `createQuoteAndFetchSummary` = patch, then fetch).
- `api/fixtures/` — static or near-static test data. A `.ts` file with REAL values is
  gitignored; a matching `.example.ts` (same shape, blanked values) is committed.
- `api/test-data/` — functions that GENERATE fresh data per run (e.g. `crypto.randomUUID()`
  ids), never static.
- `api/utils/` — shared helpers used by more than one client/test (e.g. `mockPromotionsServer.ts`).
- `api/tests/` — one `*.test.ts` file per feature area. A test that hits a REAL external
  system (not mocked) is named `*.live.test.ts` and is excluded from the default
  `npm test` run via `jest.config.js`'s `testPathIgnorePatterns` — it's not part of the
  CI blocking gate, run manually via `npm run test:live`.

## Test conventions
- `describe` groups by the thing under test; `it` names the real behavior being checked,
  not the mechanism ("returns a discount for Ontario", not "test case 1").
- A mock server standing in for a real downstream service lives in `api/utils/`, uses
  Node's built-in `http` module (no Express, no extra deps), and ALWAYS binds with
  `server.listen(0, ...)` — never a hardcoded port. Hardcoding a port breaks the moment
  two test files try to use it in parallel (`EADDRINUSE`).
- Assert on real HTTP shape: `result.status` AND `result.body`, not just one.
- A new error/edge case for an existing mock server = add one more `if` branch inside
  the server's request handler (keyed on a query param or path), then one more `it()`
  block in the matching test file asserting the real status + body for that branch.

## Code conventions
- `async`/`await` everywhere, never `.then()`.
- No `var`; `const` by default, `let` only when reassignment is real.
- Strict `===`, never `==` (except the one documented `== null` idiom, which isn't used
  in this repo yet).
- A deliberate `any` (e.g. an unvalidated inbound body) must carry
  `// eslint-disable-next-line @typescript-eslint/no-explicit-any` directly above it —
  never a silent `any`.
- No `console.log` left in committed code.

## CI
`.github/workflows/ci.yml` — `lint` and `typecheck` run in parallel, `test` (mock-based
only) waits on both via `needs:`, `live-test` runs independently with
`continue-on-error: true`. See that file before changing pipeline behavior.
