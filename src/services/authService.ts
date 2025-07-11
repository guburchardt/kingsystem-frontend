import { LoginCredentials, AuthResponse, User } from "../types";
import { API_BASE_URL } from "./api";

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("authToken");
  }

  // Função de fetch com retry (baseada no artigo)
  async fetchWithRetry(url: string, options: RequestInit = {}, maxAttempts = 3): Promise<Response> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🔍 Tentativa ${attempt}/${maxAttempts} para: ${url}`);
        
        const response = await fetch(url, options);
        return response;
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Tentativa ${attempt} falhou:`, error);

        if (attempt === maxAttempts) {
          break;
        }

        // Delay progressivo entre tentativas
        const delay = attempt * 1000;
        console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  // Função de fetch com timeout para mobile
  async mobileAwareFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection.');
      }

      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔍 Tentando login em:', `${API_BASE_URL}/api/auth/login`);
      console.log('📧 Email:', credentials.email);
      
      const response = await this.fetchWithRetry(`${API_BASE_URL}/api/auth/login`, {
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
      
      // Tratamento específico baseado no artigo
      if (error instanceof Error) {
        if (error.message === 'Load failed' || error.message.includes('fetch')) {
          throw new Error("Unable to connect to server. Please check your internet connection.");
        } else if (error.name === 'TypeError') {
          throw new Error("Network error occurred. Please try again.");
        } else if (error.message.includes('timeout')) {
          throw new Error("Request timed out. Please check your connection.");
        } else {
          throw error;
        }
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
