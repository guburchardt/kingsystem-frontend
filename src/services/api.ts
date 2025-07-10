import { config } from '../config/env';

export const API_BASE_URL = config.API_URL;

export const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}; 