# Supertest API + Agentic Tooling Platform

A hands-on test automation project covering API automation with Supertest/Jest, a Playwright
UI layer, CI/CD staged quality gates, and an agentic AI pipeline that generates test specs
from a requirement — built from first principles against a real, live API, with every
architectural decision explained, not copy-pasted from a template.

All data is fabricated or publicly available — no internal company names, credentials, or
proprietary values appear anywhere in this repo.

---

## Why this project exists

A learning-focused build, demonstrating four disciplines together in one coherent platform:

- **API automation with Supertest** — a lightweight, Node/Jest-native way to test real HTTP
  APIs, kept distinct from Playwright's own `APIRequestContext` approach.
- **A real Playwright UI layer** — page objects, fixtures, and a shared command library,
  structured to scale across multiple teams.
- **Staged CI/CD quality gates** — lint, type-check, unit, API/component tests, coverage
  threshold, critical E2E, deploy — any mandatory gate failing stops the pipeline.
- **Agentic AI test generation** — an agent that picks up a requirement, generates a real
  test spec from it, and pushes it through the same CI/CD pipeline — with guardrails.

---

## Project structure

```
supertest-api-agentictool-platform/
├── api/
│   ├── clients/       # thin HTTP request builders — request logic only
│   ├── controllers/   # higher-level API actions built from clients
│   ├── schemas/        # response/request shape validation
│   ├── fixtures/       # reusable setup + request bodies
│   ├── utils/           # shared helper functions
│   ├── tests/            # the actual Supertest + Jest test specs
│   └── test-data/        # test data generation/management
├── .env.example           # documents every required env var, no real values
└── README.md
```

---

## Tech stack

**Supertest** — HTTP request/assertion library, Node/Jest-native · **Jest** + **ts-jest** —
test runner + TypeScript bridge · **TypeScript** (strict mode) · **dotenv** — environment
config loading · **Playwright** — UI automation layer (added incrementally)

---

## Running it locally

```bash
npm install
cp .env.example .env   # fill in your own credentials/URLs
npm test
```

---

## Status

Work in progress — built incrementally, each piece added and explained as it's built.
