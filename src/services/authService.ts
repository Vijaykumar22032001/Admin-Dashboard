import type { LoginCredentials, AuthResponse } from '../types';

const STATIC_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'Secret@123'
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (
      credentials.email === STATIC_CREDENTIALS.email &&
      credentials.password === STATIC_CREDENTIALS.password
    ) {
      const token = this.generateToken();
      const authResponse: AuthResponse = {
        token,
        user: {
          id: 1,
          name: 'Admin User',
          email: credentials.email,
          role: 'Admin'
        }
      };

      this.setToken(authResponse.token);
      this.setUser(authResponse.user);
      return authResponse;
    }

    throw new Error('Invalid email or password');
  }

  private generateToken(): string {
    return 'Bearer_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.clearAuth();
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUser(user: AuthResponse['user']): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): AuthResponse['user'] | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async validateToken(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const token = this.getToken();

    if (!token || !token.startsWith('Bearer_')) {
      this.clearAuth();
      return false;
    }

    return true;
  }
}

export const authService = new AuthService();
