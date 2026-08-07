# CitiCare - Product Requirements Document (PRD)

**Project Name:** CitiCare\
**Project Type:** Smart Civic Issue Reporting & Resolution System

------------------------------------------------------------------------

# 1. Project Overview

CitiCare is a web application that connects **Citizens**, **Municipal
Departments**, and **Administrators** on one platform to report, manage,
and resolve civic issues.

Instead of visiting government offices or calling multiple departments,
citizens can report issues online, upload photos, share the location,
and track progress until the complaint is resolved.

------------------------------------------------------------------------

# 2. Problem Statement

Citizens face many daily civic problems such as:

-   Potholes
-   Garbage accumulation
-   Broken street lights
-   Water leakage
-   Sewage overflow
-   Public property damage
-   Tree hazards
-   Illegal encroachments

Current complaint systems have many problems:

-   No centralized platform
-   Slow complaint handling
-   No transparency
-   No complaint tracking
-   Manual department assignment
-   Poor communication between citizens and authorities

------------------------------------------------------------------------

# 3. Solution

CitiCare provides one centralized platform where citizens can:

-   Register/Login
-   Report civic issues
-   Upload photos
-   Share GPS location
-   Track complaint status
-   Receive notifications
-   Give feedback after resolution

Authorities receive complaints in their dashboard and update the
progress until completion.

------------------------------------------------------------------------

# 4. Objectives

-   Make complaint reporting simple.
-   Improve transparency.
-   Reduce complaint resolution time.
-   Automatically assign complaints to departments.
-   Increase citizen satisfaction.
-   Help authorities manage complaints efficiently.

------------------------------------------------------------------------

# 5. Target Users

## Citizen

Reports and tracks complaints.

## Department Official

Handles complaints assigned to their department.

## Administrator

Manages users, departments, analytics, and system settings.

------------------------------------------------------------------------

# 6. User Roles

### Citizen

-   Register/Login
-   Submit complaint
-   Upload images
-   Track complaint
-   View history
-   Give feedback

### Department Official

-   View assigned complaints
-   Update status
-   Add notes
-   Upload resolution images

### Administrator

-   Manage users
-   Manage departments
-   Configure routing
-   View analytics
-   Escalate complaints

------------------------------------------------------------------------

# 7. Complaint Categories

-   Road Damage
-   Garbage
-   Street Light
-   Water Leakage
-   Sewage
-   Public Facility Damage
-   Tree Hazard
-   Encroachment
-   Other

------------------------------------------------------------------------

# 8. Complaint Workflow

Citizen creates complaint

↓

System validates data

↓

Complaint ID generated

↓

Complaint assigned to department

↓

Official reviews complaint

↓

Status updated

↓

Complaint resolved

↓

Citizen provides feedback

------------------------------------------------------------------------

# 9. Complaint Status

-   Submitted
-   Under Review
-   In Progress
-   Resolved
-   Reopened (optional)

------------------------------------------------------------------------

# 10. Core Features

## Authentication

-   Register
-   Login
-   Forgot Password
-   JWT Authentication

## Complaint Management

-   Submit complaint
-   Upload up to 3 images
-   GPS/manual location
-   Complaint reference number

## Complaint Tracking

-   Timeline
-   Status updates
-   Complaint history

## Department Dashboard

-   Assigned complaints
-   Filters
-   Status updates
-   Resolution notes

## Admin Dashboard

-   User management
-   Department management
-   Reports
-   Analytics

## Notifications

-   Complaint submitted
-   Status changed
-   Complaint resolved

## Feedback

-   Rating
-   Comment

------------------------------------------------------------------------

# 11. Technology Stack

## Frontend

-   Next.js
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   TanStack Query
-   Axios
-   Leaflet
-   Recharts

## Backend

-   Node.js
-   Express.js
-   TypeScript
-   Prisma ORM
-   JWT
-   Passport.js
-   Multer
-   Nodemailer

## Database

-   PostgreSQL

## Image Storage

-   Cloudinary

------------------------------------------------------------------------

# 12. Non-Functional Requirements

-   Responsive design
-   Secure authentication
-   Fast response time
-   Mobile friendly
-   Scalable architecture
-   Clean UI
-   Accessible interface

------------------------------------------------------------------------

# 13. Success Criteria

-   Citizens can submit complaints within one minute.
-   Complaints are assigned automatically.
-   Officials can update complaint progress.
-   Citizens receive status updates.
-   Admin can monitor the entire system.

------------------------------------------------------------------------

# 14. Future Enhancements

-   AI image classification
-   Duplicate complaint detection
-   Mobile application
-   Multilingual support
-   Heatmaps
-   Push notifications

------------------------------------------------------------------------

# 15. Project Outcome

CitiCare aims to improve communication between citizens and municipal
authorities by providing a transparent, easy-to-use, and efficient
complaint management system that helps resolve civic issues faster while
increasing accountability and citizen satisfaction.
