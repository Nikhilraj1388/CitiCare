// API Response types matching backend format
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// User roles
export type UserRole = "CITIZEN" | "OFFICIAL" | "ADMIN";

// Complaint status
export type ComplaintStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REOPENED";

// User
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Department
export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  createdAt: string;
}

// Complaint Category
export interface ComplaintCategory {
  id: string;
  name: string;
  icon: string;
  severity: number;
}

// Complaint
export interface Complaint {
  id: string;
  complaintNumber: string;
  citizenId: string;
  categoryId: string;
  departmentId: string;
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  priorityScore?: number;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  citizen?: User;
  category?: ComplaintCategory;
  department?: Department;
  images?: ComplaintImage[];
  statusHistory?: StatusHistory[];
  feedback?: ComplaintFeedback;
}

// Complaint Image
export interface ComplaintImage {
  id: string;
  complaintId: string;
  imageUrl: string;
  uploadedAt: string;
}

// Status History
export interface StatusHistory {
  id: string;
  complaintId: string;
  previousStatus: ComplaintStatus;
  currentStatus: ComplaintStatus;
  remarks?: string;
  updatedById: string;
  updatedBy?: { id: string; fullName: string; role: string };
  updatedAt: string;
}

// Complaint Feedback
export interface ComplaintFeedback {
  id: string;
  complaintId: string;
  citizenId: string;
  rating: number;
  comment?: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "SUCCESS" | "INFO" | "WARNING" | "ERROR";
  isRead: boolean;
  createdAt: string;
}
