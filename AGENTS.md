# Project Engineering Instructions

`docs/BACKEND_ARCHITECTURE.md` is the authoritative engineering and architecture specification for backend work in this repository.

`docs/FRONTEND-ARCHITECTURE.md` is the authoritative engineering and architecture specification for frontend work in this repository.

Do not mix those roles. Backend layering, NestJS modules, Prisma, repositories, providers, and API implementation follow `docs/BACKEND_ARCHITECTURE.md`. React dashboard layering, UI, routing, client data access, and frontend implementation follow `docs/FRONTEND-ARCHITECTURE.md`. The backend remains authoritative for HTTP contracts, business rules, permissions, entitlement, validation, and persistence.

Before planning, generating, modifying, refactoring, debugging, or reviewing code:

1. Read and follow the architecture document that governs the work (`docs/BACKEND_ARCHITECTURE.md` for backend, `docs/FRONTEND-ARCHITECTURE.md` for frontend, both when the change spans the HTTP boundary).
2. Treat the governing document's architecture, dependency rules, folder structure, naming conventions, layering, repository patterns, DTO patterns, provider patterns, transaction rules, feature organization, API/data-access patterns, server-vs-client state rules, UI system, routing, authentication conventions, error handling, testing conventions, and implementation workflows as the default engineering standard for this project.
3. Do not introduce a conflicting architectural pattern without explicitly identifying the conflict and explaining why a deviation is necessary.
4. When implementing a new feature, follow the relevant implementation workflow defined in the governing architecture document.
5. When modifying existing code, preserve architectural consistency with the governing architecture document.
6. If existing code conflicts with the governing architecture document, prefer that document for new work and explicitly flag the inconsistency before expanding the conflicting pattern.
7. Do not silently invent alternative architectural conventions when the specification already defines one.
8. Before implementation, identify the relevant sections of the governing architecture document.
9. After implementation, verify the resulting code against the governing architecture document before considering the task complete.
10. Do not modify `docs/BACKEND_ARCHITECTURE.md` or `docs/FRONTEND-ARCHITECTURE.md` unless the user explicitly requests it.

## Engineering Source of Truth

`docs/BACKEND_ARCHITECTURE.md` is the source of truth for backend engineering decisions in this repository.

`docs/FRONTEND-ARCHITECTURE.md` is the source of truth for frontend engineering decisions in this repository.

If there is a conflict between:

- existing code and the governing architecture document
- an inferred convention and the governing architecture document
- a generic NestJS, React, Next.js, or other framework pattern and the governing architecture document
- historical implementation patterns and the governing architecture document

follow the governing architecture document unless the user explicitly instructs otherwise.

If a change touches both sides of the HTTP boundary:

- follow `docs/BACKEND_ARCHITECTURE.md` for API implementation
- follow `docs/FRONTEND-ARCHITECTURE.md` for dashboard implementation
- treat the backend HTTP contract as authoritative; do not guess payloads from database models or duplicate backend business rules in the UI

## Working Procedure

For every substantial implementation:

1. Read the relevant architecture sections from the governing document(s).
2. Inspect the existing affected code.
3. Identify the domains, modules, repositories, DTOs, providers, features, routes, queries, and other boundaries involved.
4. Produce a short implementation plan.
5. Implement according to the governing architecture document(s).
6. Run or update the appropriate tests.
7. Run lint/type-check/build where available.
8. Perform a final architecture-compliance review.
9. Report any existing architecture violations discovered during the work.

Do not introduce architecture changes merely for convenience.
