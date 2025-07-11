import { LoginCredentials, AuthResponse, User } from "../types";
import { API_BASE_URL } from "./api";

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("authToken");
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔍 Tentando login em:', `${API_BASE_URL}/api/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log(' Status da resposta:', response.status);
      console.log('📡 Headers da resposta:', response.headers);

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Erro no login:', data);
        throw new Error(data.message || "Erro no login");
      }

      console.log('✅ Login bem-sucedido');
      this.token = data.token;
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        message: "Login realizado com sucesso",
        token: data.token,
        user: data.user
      };
    } catch (error) {
      console.error("❌ Erro detalhado no login:", error);
      
      // Tratamento específico para diferentes tipos de erro
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error("Erro inesperado no login. Tente novamente.");
    }
  }

  async getCurrentUser(): Promise<{ user: User }> {
    if (!this.token) {
      throw new Error("Usuário não autenticado");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar usuário");
      }

      return { user: data.user };
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const authService = new AuthService();
export default authService;
