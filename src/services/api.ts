import { config } from '../config/env';
import { authService } from './authService';

export const API_BASE_URL = config.API_URL;

export const getAuthHeaders = () => {
  return authService.getAuthHeaders();
}; 