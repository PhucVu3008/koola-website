/**
 * Admin Authentication Utilities
 * 
 * Handles JWT token storage, refresh, and authentication state with expiration checking
 */

import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'koola_admin_access_token';
const REFRESH_TOKEN_KEY = 'koola_admin_refresh_token';
const USER_KEY = 'koola_admin_user';

interface JwtPayload {
  id: number;
  email: string;
  roles?: Array<{ id: number; name: string }>;
  exp: number; // Expiration timestamp in seconds
  iat: number; // Issued at timestamp
}

export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  roles: Array<{ id: number; name: string }>;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

/**
 * Store auth tokens and user info in localStorage
 */
export const setAuthTokens = (data: LoginResponse) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
};

/**
 * Get stored access token
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Get stored user info
 */
export const getStoredUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Clear all auth data (logout)
 */
export const clearAuthTokens = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;
  
  // Check if token is expired
  return !isTokenExpired(token);
};

/**
 * Check if a JWT token is expired
 * 
 * @param token - JWT token string
 * @returns true if expired, false if still valid
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    
    // Add 10 second buffer to avoid edge cases
    return decoded.exp < (currentTime + 10);
  } catch (error) {
    console.error('[isTokenExpired] Failed to decode token:', error);
    return true; // Treat invalid tokens as expired
  }
};

/**
 * Get token expiration time
 * 
 * @param token - JWT token string
 * @returns Date object of expiration, or null if invalid
 */
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return new Date(decoded.exp * 1000); // Convert seconds to milliseconds
  } catch {
    return null;
  }
};

/**
 * Get time remaining until token expires
 * 
 * @param token - JWT token string
 * @returns Seconds until expiration, or 0 if expired/invalid
 */
export const getTokenTimeRemaining = (token: string): number => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const remaining = decoded.exp - currentTime;
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
};

/**
 * Login admin user
 */
export const loginAdmin = async (email: string, password: string): Promise<LoginResponse> => {
  // Force localhost for now (env vars need server restart to load)
  const apiUrl = 'http://localhost:4000';
  
  console.log('[loginAdmin] API URL:', apiUrl);
  console.log('[loginAdmin] Attempting login:', { email });
  
  const response = await fetch(`${apiUrl}/v1/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Login failed');
  }

  const result = await response.json();
  const data = result.data as LoginResponse;
  
  setAuthTokens(data);
  
  return data;
};

/**
 * Refresh access token using refresh token
 * 
 * Will automatically clear tokens if refresh token is expired or invalid
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.log('[refreshAccessToken] No refresh token found');
    return null;
  }

  // Check if refresh token is expired
  if (isTokenExpired(refreshToken)) {
    console.log('[refreshAccessToken] Refresh token is expired');
    clearAuthTokens();
    return null;
  }

  const apiUrl = 'http://localhost:4000';

  try {
    console.log('[refreshAccessToken] Attempting to refresh token...');
    
    const response = await fetch(`${apiUrl}/v1/admin/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.log('[refreshAccessToken] Refresh failed, clearing tokens');
      clearAuthTokens();
      return null;
    }

    const result = await response.json();
    const newAccessToken = result.data.accessToken;
    
    console.log('[refreshAccessToken] Token refreshed successfully');
    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    
    return newAccessToken;
  } catch (error) {
    console.error('[refreshAccessToken] Error:', error);
    clearAuthTokens();
    return null;
  }
};

/**
 * Logout admin user
 */
export const logoutAdmin = async (): Promise<void> => {
  const refreshToken = getRefreshToken();
  const apiUrl = 'http://localhost:4000';

  if (refreshToken) {
    try {
      await fetch(`${apiUrl}/v1/admin/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Ignore errors, just clear local tokens
    }
  }

  clearAuthTokens();
};

/**
 * Debug utility: Get token information
 * 
 * Useful for debugging authentication issues
 */
export const getTokenDebugInfo = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  if (!accessToken || !refreshToken) {
    return {
      authenticated: false,
      message: 'No tokens found',
    };
  }
  
  try {
    const accessDecoded = jwtDecode<JwtPayload>(accessToken);
    const refreshDecoded = jwtDecode<JwtPayload>(refreshToken);
    
    const now = Math.floor(Date.now() / 1000);
    
    return {
      authenticated: !isTokenExpired(accessToken),
      accessToken: {
        expiresAt: new Date(accessDecoded.exp * 1000).toLocaleString(),
        timeRemaining: `${Math.max(0, accessDecoded.exp - now)} seconds`,
        isExpired: accessDecoded.exp < now,
      },
      refreshToken: {
        expiresAt: new Date(refreshDecoded.exp * 1000).toLocaleString(),
        timeRemaining: `${Math.max(0, refreshDecoded.exp - now)} seconds`,
        isExpired: refreshDecoded.exp < now,
      },
    };
  } catch (error) {
    return {
      authenticated: false,
      error: 'Failed to decode tokens',
    };
  }
};
