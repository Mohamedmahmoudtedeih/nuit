// Auth utility functions with JWT token support
const AUTH_KEY = 'marketplace_auth';
const TOKEN_KEY = 'marketplace_token';
const REFRESH_TOKEN_KEY = 'marketplace_refresh_token';

export interface AuthUser {
  id: number;
  phone: string;
  email?: string;
  full_name: string;
  profile_picture?: string;
  role: 'visitor' | 'user' | 'admin';
}

export const auth = {
  // Store tokens and user data
  setAuth: (user: AuthUser, tokens: { access: string; refresh: string }): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, tokens.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
  },

  // Get access token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Set access token
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return auth.getToken() !== null;
  },

  // Get current user
  getUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return null;
    try {
      return JSON.parse(authData);
    } catch {
      return null;
    }
  },

  // Set user as logged in (backward compatibility)
  login: (user: AuthUser): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  // Logout user
  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = auth.getUser();
    return user?.role === 'admin';
  },
};

