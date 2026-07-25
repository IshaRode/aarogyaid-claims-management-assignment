export type ClaimStatus = 'Pending' | 'Approved' | 'Rejected';
export type UserRole = 'patient' | 'insurer';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Claim {
  _id: string;
  patientId: string;
  patientName: string;
  email: string;
  claimAmount: number;
  approvedAmount: number | null;
  description: string;
  uploadedDocument: string | null;
  status: ClaimStatus;
  insurerComments: string | null;
  aiSummary: string | null;
  riskLevel: RiskLevel;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalApprovedAmount: number;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface UploadResponse {
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimetype: string;
}

export interface CreateClaimData {
  patientName: string;
  email: string;
  claimAmount: number;
  description: string;
  uploadedDocument?: string;
}

export interface UpdateClaimData {
  status?: ClaimStatus;
  approvedAmount?: number;
  insurerComments?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
