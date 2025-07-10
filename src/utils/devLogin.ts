import { authService } from '../services/authService';

export const devLogin = async () => {
  try {
    const result = await authService.login({
      email: 'admin@kingsystem.com',
      password: 'admin123'
    });
    console.log('Dev login successful:', result);
    return result;
  } catch (error) {
    console.error('Dev login failed:', error);
    throw error;
  }
}; 