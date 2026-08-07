# CitiCare - Schema.md

## Database Overview

Database: PostgreSQL\
ORM: Prisma ORM

The database is designed using a relational model to support complaint
management, role-based access, notifications, analytics, and audit
history.

------------------------------------------------------------------------

# Entity Relationship Overview

``` text
Users
 │
 ├────< Complaints
 │           │
 │           ├────< ComplaintImages
 │           ├────< ComplaintStatusHistory
 │           ├────< ComplaintFeedback
 │           └──── Department
 │
 ├────< Notifications
 │
 └────< AuditLogs

Departments
      │
      ├────< DepartmentUsers
      └────< CategoryDepartmentMapping

ComplaintCategories
      │
      └────< Complaints
```

------------------------------------------------------------------------

# Tables

## 1. users

Purpose: Stores all platform users.

  Field       Type
  ----------- ----------------------------
  id          UUID
  fullName    String
  email       String (Unique)
  phone       String
  password    String (Hashed)
  role        Citizen / Official / Admin
  avatar      String
  isActive    Boolean
  createdAt   Timestamp
  updatedAt   Timestamp

------------------------------------------------------------------------

## 2. departments

  Field         Type
  ------------- -----------
  id            UUID
  name          String
  code          String
  description   String
  createdAt     Timestamp

Examples: - Public Works - Water Supply - Solid Waste - Electricity -
Sewage - General Administration

------------------------------------------------------------------------

## 3. department_users

Maps officials to departments.

  Field          Type
  -------------- ----------------
  id             UUID
  userId         FK Users
  departmentId   FK Departments

------------------------------------------------------------------------

## 4. complaint_categories

  Field      Type
  ---------- ---------
  id         UUID
  name       String
  icon       String
  severity   Integer

Categories: - Road Damage - Garbage - Street Light - Water Leakage -
Sewage - Public Facility Damage - Tree Hazard - Encroachment - Other

------------------------------------------------------------------------

## 5. category_department_mapping

Automatically maps complaint category to department.

  Field          Type
  -------------- ------
  id             UUID
  categoryId     FK
  departmentId   FK

------------------------------------------------------------------------

## 6. complaints

Main complaint table.

  Field             Type
  ----------------- -----------
  id                UUID
  complaintNumber   String
  citizenId         FK Users
  categoryId        FK
  departmentId      FK
  title             String
  description       Text
  latitude          Decimal
  longitude         Decimal
  address           Text
  priorityScore     Decimal
  status            Enum
  createdAt         Timestamp
  updatedAt         Timestamp

Complaint Number Format:

CIT-2026-000001

------------------------------------------------------------------------

## 7. complaint_images

  Field         Type
  ------------- -----------
  id            UUID
  complaintId   FK
  imageUrl      String
  uploadedAt    Timestamp

Maximum Images: - 3

Storage: - Cloudinary

------------------------------------------------------------------------

## 8. complaint_status_history

Stores every status update.

  Field            Type
  ---------------- -----------
  id               UUID
  complaintId      FK
  previousStatus   Enum
  currentStatus    Enum
  remarks          Text
  updatedBy        FK Users
  updatedAt        Timestamp

------------------------------------------------------------------------

## 9. complaint_feedback

  Field         Type
  ------------- ---------
  id            UUID
  complaintId   FK
  citizenId     FK
  rating        Integer
  comment       Text

Rating: 1--5 Stars

------------------------------------------------------------------------

## 10. notifications

  Field       Type
  ----------- -----------
  id          UUID
  userId      FK
  title       String
  message     Text
  type        Enum
  isRead      Boolean
  createdAt   Timestamp

Types: - Complaint Submitted - Status Updated - Complaint Resolved -
Password Reset

------------------------------------------------------------------------

## 11. audit_logs

  Field       Type
  ----------- -----------
  id          UUID
  userId      FK
  action      String
  module      String
  ipAddress   String
  createdAt   Timestamp

------------------------------------------------------------------------

## 12. system_settings

Stores configurable application settings.

  Field   Type
  ------- --------
  id      UUID
  key     String
  value   String

------------------------------------------------------------------------

## 13. sla_rules

Defines expected resolution time.

  Field             Type
  ----------------- ---------
  id                UUID
  categoryId        FK
  hours             Integer
  escalationLevel   Integer

------------------------------------------------------------------------

## Relationships

-   One User → Many Complaints
-   One User → Many Notifications
-   One Department → Many Complaints
-   One Category → Many Complaints
-   One Complaint → Many Images
-   One Complaint → Many Status Records
-   One Complaint → One Feedback

------------------------------------------------------------------------

## Enums

### Roles

-   Citizen
-   Department Official
-   Administrator

### Complaint Status

-   Submitted
-   Under Review
-   In Progress
-   Resolved
-   Reopened

### Notification Types

-   Success
-   Info
-   Warning
-   Error

------------------------------------------------------------------------

## Indexes

Create indexes on:

-   email
-   complaintNumber
-   citizenId
-   departmentId
-   categoryId
-   status
-   createdAt
-   latitude
-   longitude

------------------------------------------------------------------------

## Validation Rules

-   Email must be unique.
-   Complaint number must be unique.
-   Maximum 3 images.
-   Rating between 1 and 5.
-   GPS is optional if manual address is provided.
-   Passwords stored only as bcrypt hashes.

------------------------------------------------------------------------

## File Storage

``` text
Cloudinary
│
└── complaints/
      ├── 2026/
      │      ├── CIT-2026-000001/
      │      ├── image1.jpg
      │      └── image2.jpg
```

------------------------------------------------------------------------

## Future Tables

-   ai_predictions
-   duplicate_complaints
-   push_notifications
-   activity_logs
-   heatmap_cache

------------------------------------------------------------------------

## Summary

This schema supports: - User Management - Authentication - Complaint
Management - Department Assignment - Complaint Tracking -
Notifications - Feedback - Analytics - Audit Logging - Future AI
features

It serves as the database blueprint for CitiCare using PostgreSQL and
Prisma ORM.
