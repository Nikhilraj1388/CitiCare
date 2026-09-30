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

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Complaint List Response
export interface ComplaintListResponse {
  complaints: Complaint[];
  pagination: Pagination;
}

// Map Complaint
export interface MapComplaint {
  id: string;
  complaintNumber: string;
  title: string;
  status: ComplaintStatus;
  latitude: number;
  longitude: number;
  address?: string;
  createdAt: string;
  category?: { name: string; icon?: string };
  department?: { name: string };
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalComplaints: number;
  submitted: number;
  underReview: number;
  inProgress: number;
  resolved: number;
  reopened: number;
  resolutionRate: number;
  categoryStats: { category: string; count: number }[];
  recentComplaints: Complaint[];
  departmentName?: string;
}

// User List Row
export interface UserRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: { complaints: number };
  departmentUsers?: { department: { id: string; name: string } }[];
}

// User List Response
export interface UserListResponse {
  users: UserRow[];
  pagination: Pagination;
}

// Department with count
export interface DepartmentWithCount extends Department {
  _count: { departmentUsers: number; complaints: number };
}

// Notification List Response
export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
}
