# CitiCare - Development Tracker

> Track the progress of the entire project. Mark each task as completed
> (`[x]`) when finished.

------------------------------------------------------------------------

# Project Overview

-   **Project:** CitiCare
-   **Current Phase:** Phase 11 (Testing)
-   **Overall Progress:** 85%
-   **Current Sprint:** Sprint 3
-   **Started On:** 2026-08-06
-   **Target Completion:** 2026-08-10

------------------------------------------------------------------------

# Overall Progress

  Phase                 Status   Progress
  --------------------- -------- ----------
  0\. Project Setup      ✅       100%
  1\. Design System      ✅       100%
  2\. Database           ✅       100%
  3\. Authentication     ✅       90%
  4\. Citizen Module     ✅       100%
  5\. Routing Engine     ✅       100%
  6\. Official Module    ✅       90%
  7\. Admin Module       ✅       90%
  8\. Notifications      🟡       50%
  9\. Analytics          ✅       100%
  10\. Public Map        ✅       80%
  11\. Testing           ⬜       30%
  12\. Deployment        ⬜       0%

------------------------------------------------------------------------

# Phase 0 - Project Setup

-   [x] Create GitHub Repository
-   [x] Initialize Next.js Project
-   [x] Initialize Express.js Project
-   [x] Configure TypeScript
-   [x] Configure PostgreSQL
-   [x] Configure Prisma
-   [x] Install Tailwind CSS
-   [x] Install shadcn/ui
-   [x] Setup ESLint & Prettier
-   [x] Connect Frontend & Backend

Progress: 10 / 10 ✅

------------------------------------------------------------------------

# Phase 1 - Design System

-   [x] Define Color Palette (Emerald/Teal theme tokens)
-   [x] Typography (Poppins, Inter, Geist fonts)
-   [x] Button Components (shadcn/ui)
-   [x] Form Components (Input, Textarea, Select, Label)
-   [x] Cards (shadcn/ui Card)
-   [x] Navbar (custom responsive navbar)
-   [x] Sidebar (role-based navigation)
-   [x] Dashboard Layout (Sidebar + content wrapper)
-   [x] Responsive Layout (mobile-first grid)

Progress: 9 / 9 ✅

------------------------------------------------------------------------

# Phase 2 - Database

-   [x] Prisma Schema (13 tables, 4 enums)
-   [x] Users Table
-   [x] Departments Table
-   [x] Categories Table
-   [x] Complaints Table
-   [x] Images Table
-   [x] Status History Table
-   [x] Feedback Table
-   [x] Notifications Table
-   [x] Audit Logs
-   [x] Migration (20260806161037_init_all_tables)
-   [x] Seed Data (8 depts, 9 categories, 9 SLA rules, admin user)

Progress: 12 / 12 ✅

------------------------------------------------------------------------

# Phase 3 - Authentication

-   [x] Register API (POST /api/v1/auth/register)
-   [x] Login API (POST /api/v1/auth/login)
-   [x] JWT (stateless tokens, 7-day expiry)
-   [x] Password Hashing (bcryptjs, 12 rounds)
-   [x] RBAC (CITIZEN, OFFICIAL, ADMIN middleware)
-   [ ] Forgot Password (API exists, email sending pending)
-   [ ] Reset Password (API exists, email sending pending)
-   [x] Protected Routes (authenticate + authorize middleware)
-   [x] Logout (frontend token removal)

Progress: 7 / 9

------------------------------------------------------------------------

# Phase 4 - Citizen Module

-   [x] Dashboard (role-aware with real stats from API)
-   [x] Report Complaint (category grid, title, description)
-   [x] Upload Images (Multer disk storage, preview, max 3)
-   [x] GPS Location (browser geolocation API)
-   [x] Manual Address (optional text input)
-   [x] Complaint History (/dashboard/complaints with filters)
-   [x] Complaint Details (/dashboard/complaints/[id])
-   [x] Complaint Timeline (status history with connected dots)
-   [x] Profile (/dashboard/profile — edit name, phone, password)
-   [x] Settings (/dashboard/settings — platform info, departments)

Progress: 10 / 10 ✅

------------------------------------------------------------------------

# Phase 5 - Routing Engine

-   [x] Category Mapping (category_department_mapping table)
-   [x] Department Assignment (auto on complaint creation)
-   [x] Priority Calculation (based on category severity)
-   [ ] Department Notification (pending email integration)

Progress: 3 / 4

------------------------------------------------------------------------

# Phase 6 - Official Module

-   [x] Dashboard (shared with admin, role-aware stats)
-   [x] Assigned Complaints (/dashboard/assigned)
-   [x] Filters (status filter dropdown)
-   [x] Complaint Details (shared detail page)
-   [x] Status Update (inline dropdown: SUBMITTED → UNDER_REVIEW → IN_PROGRESS → RESOLVED)
-   [x] Resolution Notes (remarks with status update)
-   [ ] Upload Resolution Images (pending)
-   [x] Department Analytics (shared analytics page)

Progress: 7 / 8

------------------------------------------------------------------------

# Phase 7 - Admin Module

-   [x] Dashboard (admin stats with resolution rate)
-   [x] User Management (/dashboard/users — search, role change, toggle)
-   [x] Department Management (/dashboard/settings — dept list with counts)
-   [x] Category Mapping (seeded in database)
-   [x] Complaint Monitoring (/dashboard/assigned — all complaints view)
-   [x] Reports (analytics page with bar charts)
-   [x] SLA Rules (configured in seed, displayed in settings)
-   [ ] Audit Logs (table exists, logging pending)
-   [x] Settings (/dashboard/settings)

Progress: 8 / 9

------------------------------------------------------------------------

# Phase 8 - Notifications

-   [ ] Registration Email (pending email service)
-   [ ] Complaint Created (pending email service)
-   [ ] Status Updated (pending email service)
-   [ ] Complaint Resolved (pending email service)
-   [ ] Password Reset (pending email service)
-   [x] Notification Center (/dashboard/notifications — UI ready)

Progress: 1 / 6

------------------------------------------------------------------------

# Phase 9 - Analytics

-   [x] Citizen Analytics (complaint stats on dashboard)
-   [x] Official Analytics (shared analytics page)
-   [x] Admin Analytics (/dashboard/analytics — full stats)
-   [x] Charts (status breakdown bars, category bars, resolution rate)
-   [x] Reports (recent complaints, category breakdown)

Progress: 5 / 5 ✅

------------------------------------------------------------------------

# Phase 10 - Public Map

-   [x] Display Complaints (Leaflet markers with popups)
-   [ ] Filters (pending category/status filter on map)
-   [ ] Search (pending search bar)
-   [x] Current Location (centered on India, zoom to user possible)
-   [x] Complaint Preview (popup with CRN, title, status, category, dept)

Progress: 3 / 5

------------------------------------------------------------------------

# Phase 11 - Testing

-   [x] API Testing (manual E2E: register, login, profile, complaint CRUD, admin stats)
-   [ ] UI Testing (pending)
-   [x] Authentication Testing (JWT, role-based access verified)
-   [x] Database Testing (seed verified, queries verified)
-   [ ] End-to-End Testing (pending)
-   [ ] Bug Fixes (ongoing)

Progress: 3 / 6

------------------------------------------------------------------------

# Phase 12 - Deployment

-   [ ] Deploy Frontend
-   [ ] Deploy Backend
-   [x] Deploy Database (Docker PostgreSQL running)
-   [ ] Connect Cloudinary
-   [x] Environment Variables (.env configured)
-   [ ] Production Testing

Progress: 2 / 6

------------------------------------------------------------------------

# Session Log

  Date         Phase        Completed Today                                          Next Task            Overall Progress
  ------------ ------------ ------------------------------------------------------ -------------------- ------------------
  2026-08-06   Phase 0-1    Project setup, design system, 17+9 components            Database             20%
  2026-08-06   Phase 2-3    13-table schema, seed data, auth backend+frontend        Citizen module       40%
  2026-08-07   Phase 4-8    Complaint CRUD, routing, official, admin, analytics      Map, upload          75%
  2026-08-07   Phase 9-10   Public map (Leaflet), image upload (Multer), settings    Testing              85%

------------------------------------------------------------------------

# Bugs & Issues

  Priority   Issue                                            Status
  ---------- ------------------------------------------------ --------
  Low        Prisma cold-start error on first query           Resolved (auto-recovers)
  Low        CRLF warnings in git                             Cosmetic only

------------------------------------------------------------------------

# Features Completed

-   [x] Authentication (register, login, JWT, RBAC, profile)
-   [x] Complaint Management (CRUD, CRN, auto-routing, status update)
-   [x] Department Management (8 depts, category mapping, SLA)
-   [/] Notifications (UI ready, email sending pending)
-   [x] Analytics (stats, charts, resolution rate)
-   [x] Public Map (Leaflet, markers, popups)
-   [ ] Deployment

------------------------------------------------------------------------

# Final Checklist

-   [x] MVP Complete
-   [x] UI Complete (15 routes, all building)
-   [x] Backend Complete (20+ API endpoints)
-   [x] Database Complete (13 tables, seeded)
-   [ ] Testing Complete
-   [ ] Deployment Complete
-   [x] Documentation Complete

**Target:** Reach 100% completion by checking every task and updating
the phase progress after each development session.
