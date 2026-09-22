# AGENTS.md

## Project Overview

NestJS 10 + TypeScript backend using Prisma 7 with PostgreSQL (Supabase), organized using Clean/Hexagonal Architecture.

The project is currently a young skeleton. There are currently no Prisma migrations and no automated test files.

The main architectural layers are:

- `src/domain/`
- `src/application/`
- `src/infrastructure/`
- `src/presentation/`
- `src/shared/`

---

## Architecture

### Domain

Location:

`src/domain/`

Responsibilities:

- Business entities.
- Repository contracts.
- Domain enums.
- Domain-specific business rules.
- Repository and port tokens when they belong to the domain.

Current entity convention:

- Entities extend `Entity<T>`.
- Entities are constructed using `(id, props)`.
- Properties are exposed through getters.

The domain must remain independent from:

- NestJS.
- Prisma.
- PostgreSQL.
- HTTP.
- External frameworks.
- Infrastructure implementations.

Do not introduce infrastructure dependencies into the domain.

---

### Application

Location:

`src/application/`

Responsibilities:

- Use cases.
- Application ports.
- DTOs.
- Application-level orchestration.

Application depends on:

- `domain`

Application must not depend directly on:

- Prisma implementations.
- PostgreSQL.
- HTTP controllers.
- Infrastructure implementations.

Use interfaces/ports and dependency injection tokens to communicate with infrastructure.

---

### Infrastructure

Location:

`src/infrastructure/`

Responsibilities:

- Prisma.
- Database access.
- Repository implementations.
- Configuration.
- Environment validation.
- Authentication infrastructure.
- JWT.
- Passport.
- bcrypt.
- UUID.
- Date/time services.
- External integrations.

Infrastructure may depend on:

- `application`
- `domain`

Infrastructure implements the contracts defined by the application/domain layers.

---

### Presentation

Location:

`src/presentation/`

Responsibilities:

- Controllers.
- Guards.
- HTTP-related concerns.

Controllers should remain thin.

Controllers must delegate business operations to application use cases instead of implementing business logic directly.

---

### Shared

Location:

`src/shared/`

Use this layer only for genuinely shared concerns.

Do not use `shared/` as a generic dumping ground.

Before adding something to `shared/`, verify that it is actually shared across multiple modules or layers.

---

## Dependency Direction

Respect the following dependency direction:

```text
presentation
     ↓
application
     ↓
domain

infrastructure
     ↓
application / domain

