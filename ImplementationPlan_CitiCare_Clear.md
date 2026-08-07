# CitiCare -- ImplementationPlan.md

> **Purpose:** This document defines exactly what should be built, in
> what order, and what must be completed before moving to the next
> phase. Follow the phases sequentially.

------------------------------------------------------------------------

# Phase 0 -- Project Setup

## Goal

Prepare the project before writing any application code.

### Tasks

-   [ ] Create GitHub repository
-   [ ] Create Next.js project (TypeScript)
-   [ ] Create Express.js project (TypeScript)
-   [ ] Configure PostgreSQL
-   [ ] Configure Prisma
-   [ ] Configure Tailwind CSS
-   [ ] Install shadcn/ui
-   [ ] Configure ESLint & Prettier
-   [ ] Create environment files
-   [ ] Connect frontend and backend

### Output

-   Frontend runs.
-   Backend runs.
-   Database connects.
-   Git repository ready.

------------------------------------------------------------------------

# Phase 1 -- Design System

## Goal

Create a consistent UI before building pages.

### Tasks

-   [ ] Choose color palette
-   [ ] Choose typography
-   [ ] Define spacing
-   [ ] Create button variants
-   [ ] Create input components
-   [ ] Create card components
-   [ ] Create modal component
-   [ ] Create navbar
-   [ ] Create sidebar
-   [ ] Create loading & empty states

### Output

Reusable UI component library.

------------------------------------------------------------------------

# Phase 2 -- Database

## Goal

Create the database structure.

### Tasks

-   [ ] Create Prisma schema
-   [ ] Create Users table
-   [ ] Create Departments table
-   [ ] Create Categories table
-   [ ] Create Complaints table
-   [ ] Create Images table
-   [ ] Create Status History table
-   [ ] Create Feedback table
-   [ ] Create Notifications table
-   [ ] Create Audit Logs table
-   [ ] Run first migration
-   [ ] Seed departments & categories

### Output

Database is ready.

------------------------------------------------------------------------

# Phase 3 -- Authentication

## Goal

Allow users to securely access the system.

### Tasks

-   [ ] User registration
-   [ ] User login
-   [ ] Password hashing (bcrypt)
-   [ ] JWT authentication
-   [ ] Role-based authorization
-   [ ] Forgot password
-   [ ] Reset password
-   [ ] Protected routes
-   [ ] Logout

### Test Checklist

-   Citizen login
-   Official login
-   Admin login
-   Invalid login handling

------------------------------------------------------------------------

# Phase 4 -- Citizen Module

## Goal

Allow citizens to report issues.

### Tasks

-   [ ] Citizen dashboard
-   [ ] Complaint form
-   [ ] Category selection
-   [ ] Image upload
-   [ ] GPS location
-   [ ] Manual address
-   [ ] Form validation
-   [ ] Generate complaint number
-   [ ] Save complaint
-   [ ] Success page

### Test Checklist

-   Complaint saved
-   Images uploaded
-   GPS stored
-   CRN generated

------------------------------------------------------------------------

# Phase 5 -- Routing Engine

## Goal

Automatically assign complaints.

### Tasks

-   [ ] Create category mapping
-   [ ] Lookup department
-   [ ] Assign department
-   [ ] Save assignment
-   [ ] Notify official

### Test Checklist

Every complaint reaches the correct department.

------------------------------------------------------------------------

# Phase 6 -- Official Module

## Goal

Officials manage complaints.

### Tasks

-   [ ] Official dashboard
-   [ ] Assigned complaints
-   [ ] Complaint details
-   [ ] Update status
-   [ ] Resolution notes
-   [ ] Upload proof images
-   [ ] Filter & search

### Test Checklist

Complete complaint lifecycle works.

------------------------------------------------------------------------

# Phase 7 -- Admin Module

## Goal

Manage the whole platform.

### Tasks

-   [ ] Dashboard
-   [ ] User management
-   [ ] Department management
-   [ ] Category mapping
-   [ ] Complaint monitoring
-   [ ] SLA settings
-   [ ] Reports
-   [ ] Audit logs

### Test Checklist

Admin controls every module.

------------------------------------------------------------------------

# Phase 8 -- Notifications

### Tasks

-   [ ] Email on registration
-   [ ] Email on complaint submission
-   [ ] Email on status update
-   [ ] Email on resolution
-   [ ] In-app notifications
-   [ ] Notification center

------------------------------------------------------------------------

# Phase 9 -- Analytics

### Citizen

-   [ ] Complaint summary
-   [ ] Status distribution

### Official

-   [ ] Pending complaints
-   [ ] Resolution time
-   [ ] Department workload

### Admin

-   [ ] Complaint trends
-   [ ] Category chart
-   [ ] Department comparison
-   [ ] Resolution statistics

------------------------------------------------------------------------

# Phase 10 -- Public Map

### Tasks

-   [ ] Show complaint markers
-   [ ] Category filter
-   [ ] Complaint preview
-   [ ] Current location
-   [ ] Marker clustering (optional)

------------------------------------------------------------------------

# Phase 11 -- Testing

### Backend

-   [ ] Authentication
-   [ ] APIs
-   [ ] Validation
-   [ ] Permissions

### Frontend

-   [ ] Responsive UI
-   [ ] Forms
-   [ ] Navigation
-   [ ] Error states

### System

-   [ ] End-to-end complaint flow

------------------------------------------------------------------------

# Phase 12 -- Deployment

### Frontend

-   [ ] Deploy to Vercel

### Backend

-   [ ] Deploy to Render

### Database

-   [ ] Deploy Neon PostgreSQL

### Storage

-   [ ] Connect Cloudinary

### Final

-   [ ] Configure environment variables
-   [ ] HTTPS
-   [ ] Production testing

------------------------------------------------------------------------

# Final Acceptance Checklist

-   [ ] Landing page complete
-   [ ] Authentication complete
-   [ ] Citizen module complete
-   [ ] Routing works
-   [ ] Official module complete
-   [ ] Admin module complete
-   [ ] Notifications complete
-   [ ] Analytics complete
-   [ ] Public map complete
-   [ ] Testing passed
-   [ ] Production deployed

## Build Order Summary

1.  Project Setup
2.  Design System
3.  Database
4.  Authentication
5.  Citizen Module
6.  Routing Engine
7.  Official Module
8.  Admin Module
9.  Notifications
10. Analytics
11. Public Map
12. Testing
13. Deployment

> **Rule:** Do not start the next phase until every task in the current
> phase is complete and tested.
