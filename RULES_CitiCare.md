# CitiCare - AI Development Rules (RULES.md)

> **Purpose:** This document defines the rules every AI coding agent
> (ChatGPT, Claude, Cursor, Gemini, GitHub Copilot, etc.) must follow
> while working on CitiCare. The objective is to keep the project
> consistent, maintainable, secure, and production-ready.

------------------------------------------------------------------------

# 1. Source of Truth

Always follow these documents in order:

1.  PRD.md
2.  AppFlow.md
3.  Schema.md
4.  TechSpec.md
5.  ImplementationPlan.md
6.  Design.md

If documents conflict, stop and ask for clarification instead of
guessing.

------------------------------------------------------------------------

# 2. Project Stack (Do Not Change)

## Frontend

-   Next.js (App Router)
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   React Hook Form
-   Zod
-   TanStack Query
-   Axios
-   Framer Motion
-   Leaflet
-   Recharts

## Backend

-   Node.js
-   Express.js
-   TypeScript
-   Prisma ORM
-   PostgreSQL
-   JWT
-   Passport.js
-   Multer
-   Nodemailer

Do not replace this stack unless explicitly instructed.

------------------------------------------------------------------------

# 3. Development Rules

-   Build one feature at a time.
-   Finish one phase before starting the next.
-   Never generate the whole project in one step.
-   Keep code modular and reusable.
-   Do not duplicate code.
-   Prefer composition over repetition.

------------------------------------------------------------------------

# 4. Coding Standards

-   Use TypeScript everywhere.
-   Use async/await.
-   Use meaningful variable and function names.
-   Follow consistent file naming.
-   Keep functions small and focused.
-   Remove unused imports and code.

------------------------------------------------------------------------

# 5. Frontend Rules

-   Use App Router.
-   Use Server Components where appropriate.
-   Use Client Components only when required.
-   Create reusable UI components.
-   Use Tailwind CSS only.
-   Use shadcn/ui components before creating custom ones.
-   Use React Hook Form + Zod for forms.
-   Use TanStack Query for server state.
-   Use Axios for API requests.
-   Handle loading, empty, and error states.
-   Make every page responsive.

------------------------------------------------------------------------

# 6. Backend Rules

-   Keep controllers thin.
-   Put business logic in services.
-   Validate every request.
-   Return consistent JSON responses.
-   Use Prisma for all database operations.
-   Never write raw SQL unless necessary.
-   Use environment variables for secrets.

------------------------------------------------------------------------

# 7. Database Rules

-   PostgreSQL only.
-   Use Prisma migrations.
-   Maintain foreign keys.
-   Do not delete data unnecessarily.
-   Use UUIDs where defined.
-   Add timestamps to entities.
-   Add indexes to searchable fields.

------------------------------------------------------------------------

# 8. API Rules

Every endpoint must include: - Validation - Authentication (when
required) - Authorization (when required) - Error handling - Proper HTTP
status codes

API format:

``` json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

------------------------------------------------------------------------

# 9. Authentication Rules

-   JWT authentication
-   bcrypt password hashing
-   Role-Based Access Control
-   Protect private routes
-   Never expose passwords or secrets

Roles: - Citizen - Department Official - Administrator

------------------------------------------------------------------------

# 10. UI/UX Rules

-   Clean and modern interface.
-   Consistent spacing.
-   Accessible color contrast.
-   Responsive on mobile, tablet, and desktop.
-   Use subtle animations only.
-   Show meaningful validation messages.
-   Maximum three clicks to common actions.

------------------------------------------------------------------------

# 11. Complaint Module Rules

-   Generate a unique Complaint Reference Number (CRN).
-   Allow maximum 3 images.
-   Support GPS or manual address.
-   Auto-assign department.
-   Maintain status history.
-   Notify users on important events.

------------------------------------------------------------------------

# 12. Error Handling

Handle: - Validation errors - Authentication failures - Authorization
failures - Network failures - File upload errors - Server errors

Never expose internal server details.

------------------------------------------------------------------------

# 13. Security Rules

-   Validate all user input.
-   Sanitize data.
-   Use Helmet.
-   Enable CORS.
-   Hash passwords.
-   Protect file uploads.
-   Use HTTPS in production.
-   Store secrets only in environment variables.

------------------------------------------------------------------------

# 14. Documentation Rules

When adding or changing a feature: - Update the related documentation if
behavior changes. - Keep naming consistent across documents. - Do not
leave outdated documentation.

------------------------------------------------------------------------

# 15. Testing Rules

Before marking a feature complete: - Verify UI works. - Verify APIs
work. - Verify database updates. - Verify permissions. - Test success
and failure scenarios.

------------------------------------------------------------------------

# 16. Git Rules

-   One logical feature per commit.
-   Clear commit messages.
-   Do not commit secrets.
-   Keep branches focused.

------------------------------------------------------------------------

# 17. Performance Rules

-   Lazy load large pages.
-   Optimize images.
-   Paginate large lists.
-   Avoid unnecessary API calls.
-   Reuse components.

------------------------------------------------------------------------

# 18. AI Behavior Rules

The AI must: - Read existing code before modifying it. - Reuse existing
components. - Respect the current architecture. - Explain assumptions
when necessary. - Ask for clarification if requirements are ambiguous.

The AI must NOT: - Invent requirements. - Change the technology stack. -
Break existing features. - Rename files or APIs without instruction. -
Introduce unnecessary libraries.

------------------------------------------------------------------------

# 19. Definition of Done

A task is complete only when: - Feature is implemented. - UI is
responsive. - API works correctly. - Database changes are applied. -
Errors are handled. - Code is clean. - No console errors remain.

------------------------------------------------------------------------

# 20. Final Rule

Always prioritize: 1. Correctness 2. Security 3. Maintainability 4.
Consistency 5. Performance 6. Developer experience

If unsure, stop and ask instead of guessing.
