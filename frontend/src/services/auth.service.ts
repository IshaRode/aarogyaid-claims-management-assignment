import api from './api';
import type { LoginResponse, UserRole } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    return data;
  },

  register: async (name: string, email: string, password: string, role: UserRole = 'patient'): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/register', { name, email, password, role });
    return data;
  },
};
