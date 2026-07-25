import api from './api';
import type { Claim, ClaimStats, CreateClaimData, UpdateClaimData, UploadResponse } from '../types';

export const claimsService = {
  // Patient: submit a new claim
  createClaim: async (data: CreateClaimData): Promise<Claim> => {
    const response = await api.post<Claim>('/claims', data);
    return response.data;
  },

  // Patient: get own claims
  getMyClaims: async (): Promise<Claim[]> => {
    const { data } = await api.get<Claim[]>('/claims/my');
    return data;
  },

  // Insurer: get all claims with filters
  getAllClaims: async (params?: {
    status?: string;
    search?: string;
    minAmount?: number;
    maxAmount?: number;
    sort?: string;
  }): Promise<Claim[]> => {
    const { data } = await api.get<Claim[]>('/claims', { params });
    return data;
  },

  // Both: get claim by ID
  getClaimById: async (id: string): Promise<Claim> => {
    const { data } = await api.get<Claim>(`/claims/${id}`);
    return data;
  },

  // Insurer: update claim status
  updateClaim: async (id: string, data: UpdateClaimData): Promise<Claim> => {
    const response = await api.patch<Claim>(`/claims/${id}`, data);
    return response.data;
  },

  // Stats
  getStats: async (): Promise<ClaimStats> => {
    const { data } = await api.get<ClaimStats>('/claims/stats');
    return data;
  },

  // Upload document
  uploadDocument: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<UploadResponse>('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
