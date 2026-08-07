# CitiCare -- TechSpec.md

## 1. Project Technology Stack

### Frontend

  Technology        Purpose
  ----------------- ------------------------
  Next.js 15        Frontend Framework
  TypeScript        Type Safety
  Tailwind CSS      Styling
  shadcn/ui         UI Components
  Framer Motion     Animations
  React Hook Form   Form Management
  Zod               Form Validation
  Axios             API Requests
  TanStack Query    Server State & Caching
  Leaflet           Interactive Maps
  OpenStreetMap     Map Provider
  Recharts          Charts & Analytics
  Lucide React      Icons

------------------------------------------------------------------------

## 2. Backend

  Technology          Purpose
  ------------------- -------------------------
  Node.js             JavaScript Runtime
  Express.js          Backend Framework
  TypeScript          Type Safety
  Prisma ORM          Database ORM
  JWT                 Authentication
  Passport.js         Authentication Strategy
  bcrypt              Password Hashing
  Multer              File Upload
  Nodemailer          Email Notifications
  Express Validator   API Validation
  CORS                Cross-Origin Requests
  dotenv              Environment Variables
  Helmet              Security Headers
  Morgan              API Logging
  UUID                Unique ID Generation

------------------------------------------------------------------------

## 3. Database

  Technology       Purpose
  ---------------- ---------------------
  PostgreSQL       Primary Database
  Prisma Migrate   Database Migrations
  Prisma Studio    Database Management

------------------------------------------------------------------------

## 4. Cloud Services

  Technology        Purpose
  ----------------- ---------------------
  Cloudinary        Image Storage
  Vercel            Frontend Deployment
  Render            Backend Deployment
  Neon PostgreSQL   Managed PostgreSQL

------------------------------------------------------------------------

## 5. Development Tools

  Tool       Purpose
  ---------- --------------------
  VS Code    Code Editor
  Git        Version Control
  GitHub     Repository Hosting
  Postman    API Testing
  Docker     Local Development
  npm        Package Manager
  ESLint     Code Quality
  Prettier   Code Formatting

------------------------------------------------------------------------

## 6. Project Architecture

``` text
Next.js (Frontend)
        │
      Axios
        │
REST API (Express.js)
        │
Authentication (JWT)
        │
Business Logic
        │
Prisma ORM
        │
PostgreSQL
        │
Cloudinary
```

------------------------------------------------------------------------

## 7. Frontend Folder Structure

``` text
src/
 ├── app/
 ├── components/
 ├── features/
 ├── hooks/
 ├── lib/
 ├── services/
 ├── types/
 ├── utils/
 └── styles/
```

------------------------------------------------------------------------

## 8. Backend Folder Structure

``` text
src/
 ├── config/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── prisma/
 ├── routes/
 ├── services/
 ├── utils/
 ├── validators/
 └── server.ts
```

------------------------------------------------------------------------

## 9. Authentication Flow

-   JWT Access Token
-   Protected Routes
-   Role-Based Access Control (Citizen, Official, Admin)
-   Password Hashing with bcrypt
-   Forgot Password via Email

------------------------------------------------------------------------

## 10. API Standards

-   RESTful APIs
-   JSON Request/Response
-   Standard HTTP Status Codes
-   Centralized Error Handling
-   Input Validation
-   Versioned API (`/api/v1`)

------------------------------------------------------------------------

## 11. Security

-   JWT Authentication
-   bcrypt Password Hashing
-   Helmet
-   CORS
-   Input Validation
-   SQL Injection Protection (Prisma)
-   XSS Protection
-   Environment Variables

------------------------------------------------------------------------

## 12. File Upload

-   Multer for uploads
-   Cloudinary for storage
-   JPG, PNG, WEBP
-   Maximum 3 images per complaint

------------------------------------------------------------------------

## 13. Maps

-   Leaflet
-   OpenStreetMap
-   GPS Location
-   Marker Clustering (future)

------------------------------------------------------------------------

## 14. Analytics

-   Recharts
-   Complaint Trends
-   Department Performance
-   Resolution Statistics

------------------------------------------------------------------------

## 15. Notifications

-   Nodemailer
-   Complaint Submitted
-   Status Updated
-   Complaint Resolved
-   Password Reset

------------------------------------------------------------------------

## 16. Coding Standards

-   TypeScript everywhere
-   Functional Components
-   Async/Await
-   Modular Architecture
-   Reusable Components
-   Clean Code Principles

------------------------------------------------------------------------

## 17. Deployment

Frontend: - Vercel

Backend: - Render

Database: - Neon PostgreSQL

Images: - Cloudinary

------------------------------------------------------------------------

## 18. Future Technologies

-   Redis
-   BullMQ
-   WebSockets
-   PWA
-   AI Image Classification

This document defines every major technology used to build CitiCare and
serves as the technical reference for development.
