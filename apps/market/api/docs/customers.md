# Customers module: requirements

Requirements for managing customers in `market-api`. The aim is to practise
backend skills, so some requirements are here because they teach a specific
skill rather than because the marketplace strictly needs them.

## Constraints

- `apis/auth` stays unchanged: HS256 JWT, `id` claim, `authToken` cookie.
- No events or microservices. Market is a modular monolith inside the monorepo.
- Stack: NestJS 7, TypeORM 0.2, MySQL, TypeScript 4.2, Node 16 (see `AGENTS.md`).

## Concepts

- **Identity vs. customer.** Auth owns *who the person is* (credentials, email,
  OAuth links, 2FA). Market owns *what the person is in the marketplace*
  (profile, role, status). In DDD terms these are separate bounded contexts.
  Each service does CRUD only on the data it owns.
- **Roles are per app.** Being an admin in market says nothing about other apps.
  Market ignores the JWT `role` claim and uses `customers.role` only.
- **Customers are never deleted.** State changes replace deletes, and the row
  stays as a tombstone. This keeps bans effective, keeps the history of adverts
  and dialogs intact, and stops a customer from being recreated after a delete.

## 1. Skills this spec trains

| Skill | Where you practise it |
|---|---|
| Module boundaries in a modular monolith | `customers` exposes one public API. Other modules can't import its internals, and a lint rule enforces that |
| Anti-corruption layer | The `identity` module turns auth's JWT into market's own type. It's the only code that knows auth's claim names |
| DDD tactical patterns | `Customer` aggregate, value objects, domain errors, repository interface (port) |
| Ports & adapters | The domain has no TypeORM imports. Persistence is an adapter with a mapper |
| State machines and invariants | Status transitions and role rules live in the domain, not in controllers |
| Concurrency | Two parallel first requests create one row (idempotent insert). A last-admin race (write skew) solved with `SELECT … FOR UPDATE`. Optimistic locking with `ETag`/`If-Match` |
| Transactions | One command = one transaction, including the audit row |
| HTTP API design | `/me` vs `/admin`, action endpoints for state changes, RFC 9457 errors, keyset pagination, conditional requests (RFC 9110) |
| Security | Algorithm pinned to HS256, ignoring the JWT `role` claim, user id taken only from the token (prevents IDOR), mass-assignment protection |
| Persistence craft | Migrations only (no `synchronize`), indexes chosen for the actual queries, UTC timestamps |
| Testing pyramid | Pure domain unit tests, use-case tests with an in-memory repository, repository tests against real MySQL, end-to-end tests, concurrency tests |

## 2. Module structure

```
src/
  modules/
    identity/                 ACL over the auth app's JWT
      jwt-auth.guard.ts
      authenticated-user.ts   { authUserId, email, name, image }  ← market's own type
    customers/
      domain/                 no Nest, no TypeORM imports
        customer.ts           aggregate: methods enforce all rules
        customer-status.ts, role.ts, phone.ts (value objects)
        customer.errors.ts
        customer.repository.ts  (interface = port)
      application/            one class per use case, one transaction each
        provision-customer, update-profile, close-profile, reactivate-profile,
        change-role, ban-customer, unban-customer
        queries/ get-my-profile, list-customers, get-customer, get-audit-log
      infrastructure/         TypeORM entities, mapper, repository implementation
      http/                   controllers + DTOs (never return entities)
      cli/                    promote-first-admin
      index.ts                the ONLY importable surface for other modules
  shared/                     problem-details filter, pagination, clock, config validation
  migrations/
```

**Boundary rule:** other modules (adverts, later) may import only
`modules/customers/index.ts`. They reference customers by `CustomerId` and call
something like `CustomersApi.getActiveCustomer(authUserId)`. Enforce it with
ESLint `no-restricted-imports`.

## 3. Data model

### `customers`

| Column | Type | Notes |
|---|---|---|
| `id` | `CHAR(36)` UUID | Generated **in the domain**, not by the DB, so an aggregate is complete before it's saved. Not guessable, unlike auto-increment ids. Optional extra: UUIDv7 gives better index locality |
| `auth_user_id` | `VARCHAR(64)` **UNIQUE** | Auth's user id. No FK (it's in another DB). The unique index stops duplicates and enforces the tombstone rule |
| `first_name`, `last_name` | `VARCHAR NULL` | Owned by market |
| `phone` | `VARCHAR(16) NULL` | E.164 format, validated by the `Phone` value object. Verification comes in a later section |
| `role` | `VARCHAR(16)` | `user \| admin`. Validated in the domain rather than with a MySQL `ENUM`, because changing an `ENUM` needs a migration |
| `status` | `VARCHAR(16)` | `active \| banned \| closed`. **Rows are never deleted** |
| `identity_email`, `identity_name`, `identity_image` | `NULL` | **Read-only copy** from the token. The `identity_` prefix makes clear market doesn't own them |
| `identity_synced_at` | `DATETIME(3)` | |
| `version` | `INT` | Optimistic lock (`@VersionColumn`). Exposed to clients as an `ETag` |
| `created_at`, `updated_at` | `DATETIME(3)` UTC | |

Indexes: `UNIQUE(auth_user_id)`, `(status, created_at, id)` and
`(role, created_at, id)` for filtered keyset pagination, plus a prefix index on
`identity_email` for search.

### `customer_audit_log`

| Column | Notes |
|---|---|
| `id` | |
| `customer_id` | FK to `customers` |
| `actor_customer_id` | NULL = system/CLI |
| `action` | `provisioned`, `profile_updated`, `role_changed`, `banned`, `unbanned`, `closed`, `reactivated` |
| `payload` | JSON: from/to, reason |
| `occurred_at` | `DATETIME(3)` UTC |

Written **in the same transaction** as the change. In the events step, this
table becomes the starting point for the transactional outbox.

## 4. Domain rules

All rules live inside `Customer` and domain services.

### Status state machine

```
active ──ban(reason)──▶ banned ──unban──▶ active
active ──close──▶ closed ──reactivate──▶ active
banned ──close──▶ ✗  (can't escape a ban by closing)
```

Any other transition throws `InvalidStatusTransition`.

### Rules

1. Ban needs a non-empty reason. An admin can't ban themselves or another admin
   (demote first).
2. `changeRole`: an unknown role, or the role the customer already has, is
   rejected.
3. **At least one active admin must always exist.** Admins may demote
   themselves, unless they're the last one. Two admins demoting themselves at
   the same moment both see "2 admins" under MySQL's default
   `REPEATABLE READ`, both succeed, and you end up with 0 admins (write skew).
   Solve it by locking the admin rows with `SELECT … FOR UPDATE` inside the
   transaction, and prove it with a concurrency test.
4. Only `active` customers can update their profile.
5. `isProfileComplete()` = first name, last name and phone are all set. It's
   exposed in `/me` so later modules (adverts) can use it as a gate.

## 5. Identity integration (anti-corruption layer)

- `JwtAuthGuard` reads `Authorization: Bearer <token>` and verifies it with
  `AUTH_SECRET` and `algorithms: ['HS256']` pinned (this blocks
  algorithm-confusion attacks). It checks `exp`.
- It maps auth's claims (`id`, `email`, `name`, `image`) to `AuthenticatedUser`.
  **No other file knows auth's claim names.** When auth later switches to `sub`
  or RS256, only this file changes.
- The `role` claim is **ignored**. Market authorization comes only from
  `customers.role`.
- Contract for the frontend: the Next.js server reads the `authToken` cookie
  and forwards it as a Bearer token.
- Known risk, deferred: sharing the HS256 secret means market could also create
  tokens. It gets fixed in step 2 with asymmetric keys (RS256/ES256 + JWKS).

## 6. Provisioning (insert if missing, never recreate)

`ProvisionCustomer` runs for every authenticated request, through a
`CurrentCustomer` resolver:

- **Not found:** create it with `role=user`, `status=active` and an audit entry
  `provisioned`. If two parallel requests race, catch `ER_DUP_ENTRY` and read
  the row again. Either way the result is one row (idempotency).
- **Found:** refresh the identity copy **only if the claims changed**, so you
  don't write on every request.
- **Banned or closed:** never change it automatically. Return the status and let
  the guards decide.

## 7. API

All errors use `application/problem+json` (RFC 9457) with a stable `code`.

### Self-service (logged in)

| Endpoint | Behaviour |
|---|---|
| `GET /me` | Profile + `status`, `role`, `isProfileComplete`, identity copy |
| `PATCH /me` | Update `firstName`, `lastName`, `phone`. Active customers only |
| `POST /me/close` | `active → closed` |
| `POST /me/reactivate` | `closed → active` |

### Admin (active customer with `role=admin`)

| Endpoint | Behaviour |
|---|---|
| `GET /admin/customers?status=&role=&q=&limit=&cursor=` | Keyset pagination on `(created_at, id)`. Filters come from an allow-list. `q` = prefix search on email/name |
| `GET /admin/customers/:id` | Returns an `ETag` header (the version) |
| `POST /admin/customers/:id/role` `{ role }` | Requires `If-Match`. A stale version returns **412**. Checks the last-admin rule |
| `POST /admin/customers/:id/ban` `{ reason }` | Requires `If-Match` |
| `POST /admin/customers/:id/unban` | Requires `If-Match` |
| `GET /admin/customers/:id/audit` | Audit history |

State changes are **action endpoints** rather than `PATCH { status }`. Each
action maps to one use case, one permission and one audit entry, whereas a
generic `PATCH` hides intent.

### Error codes

| Code | HTTP |
|---|---|
| `UNAUTHENTICATED` | 401 |
| `CUSTOMER_BANNED`, `CUSTOMER_CLOSED`, `FORBIDDEN` | 403 |
| `CUSTOMER_NOT_FOUND` | 404 |
| `INVALID_STATUS_TRANSITION`, `LAST_ADMIN`, `ROLE_UNCHANGED` | 409 |
| `VERSION_CONFLICT` | 412 |
| `PRECONDITION_REQUIRED` | 428 |
| `VALIDATION_FAILED` | 400 |

Domain errors know nothing about HTTP. One global exception filter maps them to
status codes.

### CLI

`customers:promote <authUserId>` creates the first admin. It boots Nest without
HTTP (`NestFactory.createApplicationContext`), and the audit log records the
actor as `system`.

## 8. Cross-cutting requirements

- `ValidationPipe` with `whitelist`, `forbidNonWhitelisted` and `transform`, so
  clients can't set fields like `role` through a profile update.
- Config is validated at startup: the app fails fast if `AUTH_SECRET` or the DB
  settings are missing.
- `synchronize: false`. Schema changes only through migrations.
- A `Clock` abstraction, so time-based logic can be tested.
- Logs include a request id and never contain tokens or personal data.

## 9. Testing requirements

| Level | What | Tools |
|---|---|---|
| Domain unit | Every transition and rule, with no Nest or DB | Jest |
| Use case | Transactions, audit writes, error mapping | In-memory repository |
| Repository integration | Mapper, unique index, locking | Real MySQL |
| End-to-end | Auth guard, status codes, problem+json, ETag/412 | Supertest, tokens signed with a test secret |
| Concurrency | 10 parallel first requests produce 1 row. Two admins demoting themselves in parallel: exactly 1 succeeds | Jest + real MySQL |

## 10. Out of scope for now

- `UserDeleted`/`UserUpdated` events and the outbox (step 2)
- Any change to `apis/auth`
- SMS phone verification (cabinet section)
- `moderator` role (adverts section; it slots into `role`)
- Swagger

## 11. Build order

One step at a time, with a review pause after each.

1. Module skeleton, boundary lint rule, problem-details filter, config validation
2. `identity` module: JWT guard + `AuthenticatedUser`
3. `Customer` domain model + unit tests (no DB)
4. Migration, TypeORM entity, mapper, repository + integration tests
5. Provisioning + `GET /me` + race handling
6. Self-service: `PATCH /me`, close/reactivate
7. Admin read side: list with keyset pagination, show, audit
8. Admin commands: role (last-admin lock), ban/unban, optimistic locking
9. CLI to create the first admin
