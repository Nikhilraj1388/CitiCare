# CitiCare - Application Flow (AppFlow.md)

## Overview

This document explains how every user interacts with CitiCare from
entering the website until a complaint is resolved. It defines the
navigation flow, module flow, and system behavior.

------------------------------------------------------------------------

# 1. System Flow

``` text
Open Website
      │
      ▼
Landing Page
      │
 ┌────┼─────────────┐
 ▼    ▼             ▼
About Login     Register
      │
      ▼
Authentication
      │
      ▼
Role Detection
      │
 ┌────┼───────────────┐
 ▼    ▼               ▼
Citizen Official    Admin
Dashboard Dashboard Dashboard
```

------------------------------------------------------------------------

# 2. Landing Page Flow

Visitor opens website.

Available actions: - Home - About - Features - Complaint Categories -
Contact - Login - Register

Primary CTA: - Report an Issue - Track Complaint

------------------------------------------------------------------------

# 3. Authentication Flow

``` text
Register/Login
      │
Validate Data
      │
Create Account / Verify Credentials
      │
Generate JWT
      │
Redirect to Dashboard
```

Roles: - Citizen - Department Official - Administrator

------------------------------------------------------------------------

# 4. Citizen Flow

``` text
Citizen Dashboard
      │
Submit Complaint
      │
Select Category
      │
Fill Title & Description
      │
Upload Images
      │
Capture GPS / Manual Address
      │
Submit
      │
Generate Complaint ID (CRN)
      │
Assign Department
      │
Notification Sent
      │
Track Complaint
      │
Resolved
      │
Feedback
```

Citizen can also: - View complaint history - Edit profile - Read
notifications - View public complaint map

------------------------------------------------------------------------

# 5. Complaint Submission Flow

1.  Open "Report Issue".
2.  Select category.
3.  Enter title.
4.  Enter description.
5.  Upload up to 3 images.
6.  Share GPS or address.
7.  Validate input.
8.  Create complaint.
9.  Generate CRN.
10. Save to database.
11. Notify department.
12. Show success screen.

------------------------------------------------------------------------

# 6. Routing Flow

``` text
Complaint Created
      │
Category Selected
      │
Lookup Mapping
      │
Assign Department
      │
Store Department ID
      │
Notify Official
```

------------------------------------------------------------------------

# 7. Department Official Flow

``` text
Login
   │
Dashboard
   │
Assigned Complaints
   │
Open Complaint
   │
Review Images & Location
   │
Update Status
   │
Add Notes
   │
Upload Resolution Images
   │
Mark Resolved
```

Dashboard includes: - Pending - Under Review - In Progress - Resolved -
Search & Filters - Analytics

------------------------------------------------------------------------

# 8. Complaint Status Flow

``` text
Submitted
    │
Under Review
    │
In Progress
    │
Resolved
    │
Citizen Rating
```

Every status update: - Saves history - Sends notification - Updates
dashboard

------------------------------------------------------------------------

# 9. Notification Flow

Events: - Registration Successful - Complaint Submitted - Complaint
Assigned - Status Updated - Complaint Resolved - Password Reset

Channels: - In-App - Email

------------------------------------------------------------------------

# 10. Admin Flow

``` text
Admin Login
     │
Dashboard
     │
Users
Departments
Complaints
Analytics
Settings
Reports
SLA
Audit Logs
```

Admin can: - Manage users - Manage departments - Change category
mappings - Monitor complaints - View analytics - Escalate complaints

------------------------------------------------------------------------

# 11. Public Complaint Map Flow

``` text
Open Map
   │
Load Open Complaints
   │
Display Markers
   │
Filter by Category
   │
Open Complaint Preview
```

------------------------------------------------------------------------

# 12. Analytics Flow

Citizen: - Personal complaint summary

Official: - Department performance - Resolution time - Pending
complaints

Admin: - Complaint trends - Department comparison - Resolution rates -
Category distribution

------------------------------------------------------------------------

# 13. Error Flow

Validation Error → Show field errors

Authentication Error → Redirect to Login

Network Error → Retry option

Permission Error → Access Denied page

Server Error → Friendly error page

------------------------------------------------------------------------

# 14. Navigation Structure

``` text
Public
├── Home
├── About
├── Features
├── Contact
├── Login
└── Register

Citizen
├── Dashboard
├── Report Issue
├── My Complaints
├── Complaint Details
├── Notifications
├── Public Map
├── Profile
└── Settings

Official
├── Dashboard
├── Assigned Complaints
├── Complaint Details
├── Analytics
└── Profile

Admin
├── Dashboard
├── Users
├── Departments
├── Complaints
├── Analytics
├── Reports
├── SLA
├── Audit Logs
└── Settings
```

------------------------------------------------------------------------

# 15. Complete End-to-End Flow

``` text
Citizen
   │
Register/Login
   │
Submit Complaint
   │
Upload Images + GPS
   │
System Validation
   │
Create Complaint
   │
Generate CRN
   │
Assign Department
   │
Notify Official
   │
Official Reviews
   │
Update Status
   │
Resolve Complaint
   │
Citizen Receives Notification
   │
Citizen Gives Feedback
   │
Analytics Updated
```

------------------------------------------------------------------------

# 16. Success Criteria

-   Complaint submission in under 60 seconds.
-   Automatic department assignment.
-   Real-time status tracking.
-   Secure role-based access.
-   Transparent complaint lifecycle.
-   Responsive experience on desktop and mobile.

This document defines the navigation and workflow of every major feature
in CitiCare so developers, designers, testers, and AI coding agents
understand how the application should behave from start to finish.
