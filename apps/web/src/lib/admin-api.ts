/**
 * Admin API Client
 * 
 * Centralized API client for admin operations with authentication
 */

import { getAccessToken, refreshAccessToken, clearAuthTokens } from './admin-auth';

// Use server-side URL for SSR, client-side URL for browser
const getApiBaseUrl = () => {
  // Check if running on server (Node.js) or client (browser)
  if (typeof window === 'undefined') {
    // Server-side: use internal Docker network
    return process.env.API_BASE_URL_SERVER || 'http://api:4000';
  }
  // Client-side: use localhost
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
};

const API_BASE_URL = getApiBaseUrl();

export interface ApiResponse<T = any> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

class AdminApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make authenticated request with automatic token refresh
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const accessToken = getAccessToken();

    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    // First attempt with current token
    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });

    // If 401, try to refresh token and retry once
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      
      if (!newToken) {
        clearAuthTokens();
        window.location.href = '/en/admin/login';
        throw new Error('Session expired');
      }

      // Retry with new token
      response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
          ...options.headers,
        },
      });
    }

    if (!response.ok) {
      const error: ApiError = await response.json();
      
      // Format detailed validation errors
      if (error.error?.code === 'VALIDATION_ERROR' && error.error?.details?.issues) {
        const issues = error.error.details.issues as Array<{
          path: string[];
          message: string;
          expected?: string;
          received?: string;
        }>;
        
        const errorMessages = issues.map(issue => {
          const field = issue.path.join('.');
          let msg = `• ${field}: ${issue.message}`;
          
          if (issue.expected && issue.received) {
            msg += `\n  Expected: ${issue.expected}\n  Received: ${issue.received}`;
          }
          
          return msg;
        });
        
        throw new Error(
          `Validation Error:\n\n${errorMessages.join('\n\n')}\n\nPlease fix the errors above and try again.`
        );
      }
      
      throw new Error(error.error?.message || 'Request failed');
    }

    return response.json();
  }

  // ========== Services ==========

  async listServices(params?: { locale?: string; status?: string; page?: number; pageSize?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/v1/admin/services?${query}`);
  }

  async getServiceById(id: number) {
    return this.request(`/v1/admin/services/${id}`);
  }

  async createService(data: any) {
    return this.request('/v1/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: number, data: any) {
    return this.request(`/v1/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: number) {
    return this.request(`/v1/admin/services/${id}`, {
      method: 'DELETE',
    });
  }
  
  /**
   * Translate/Sync service to another locale
   * @param id - Service ID
   * @param targetLocale - Target locale ('en' or 'vi')
   * @param mode - Translation mode ('manual' or 'auto')
   */
  async translateService(id: number, targetLocale: 'en' | 'vi', mode: 'manual' | 'auto') {
    return this.request(`/v1/admin/services/${id}/translate`, {
      method: 'POST',
      body: JSON.stringify({ targetLocale, mode }),
    });
  }
  
  /**
   * Sync images across all locales with the same slug_group
   * @param id - Service ID
   */
  async syncServiceImages(id: number) {
    return this.request(`/v1/admin/services/${id}/sync-images`, {
      method: 'POST',
      body: JSON.stringify({}), // Empty object to satisfy content-type requirement
    });
  }

  // ========== Posts ==========

  async listPosts(params?: { locale?: string; status?: string; page?: number; pageSize?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/v1/admin/posts?${query}`);
  }

  async getPostById(id: number) {
    return this.request(`/v1/admin/posts/${id}`);
  }

  async createPost(data: any) {
    return this.request('/v1/admin/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePost(id: number, data: any) {
    return this.request(`/v1/admin/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePost(id: number) {
    return this.request(`/v1/admin/posts/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== Categories ==========

  async listCategories(params?: { locale?: string; kind?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/v1/admin/categories?${query}`);
  }

  async getCategoryById(id: number) {
    return this.request(`/v1/admin/categories/${id}`);
  }

  async createCategory(data: any) {
    return this.request('/v1/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: number, data: any) {
    return this.request(`/v1/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: number) {
    return this.request(`/v1/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== Tags ==========

  async listTags(params?: { locale?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/v1/admin/tags?${query}`);
  }

  async getTagById(id: number) {
    return this.request(`/v1/admin/tags/${id}`);
  }

  async createTag(data: any) {
    return this.request('/v1/admin/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTag(id: number, data: any) {
    return this.request(`/v1/admin/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTag(id: number) {
    return this.request(`/v1/admin/tags/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== Pages ==========

  async listPages(params?: { locale?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/v1/admin/pages?${query}`);
  }

  async getPageById(id: number) {
    return this.request(`/v1/admin/pages/${id}`);
  }

  async createPage(data: any) {
    return this.request('/v1/admin/pages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePage(id: number, data: any) {
    return this.request(`/v1/admin/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePage(id: number) {
    return this.request(`/v1/admin/pages/${id}`, {
      method: 'DELETE',
    });
  }

  // Page Sections
  async listPageSections(pageId: number) {
    return this.request(`/v1/admin/pages/${pageId}/sections`);
  }

  async createPageSection(pageId: number, data: any) {
    return this.request(`/v1/admin/pages/${pageId}/sections`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePageSection(pageId: number, sectionId: number, data: any) {
    return this.request(`/v1/admin/pages/${pageId}/sections/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePageSection(pageId: number, sectionId: number) {
    return this.request(`/v1/admin/pages/${pageId}/sections/${sectionId}`, {
      method: 'DELETE',
    });
  }

  // ========== Navigation ==========

  async listNavItems(params?: { locale?: string; placement?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/v1/admin/nav-items?${query}`);
  }

  async getNavItemById(id: number) {
    return this.request(`/v1/admin/nav-items/${id}`);
  }

  async createNavItem(data: any) {
    return this.request('/v1/admin/nav-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNavItem(id: number, data: any) {
    return this.request(`/v1/admin/nav-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNavItem(id: number) {
    return this.request(`/v1/admin/nav-items/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== Site Settings ==========

  async listSettings(params?: { locale?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/v1/admin/site-settings?${query}`);
  }

  async getSettingByKey(key: string, locale?: string) {
    const query = locale ? `?locale=${locale}` : '';
    return this.request(`/v1/admin/site-settings/${key}${query}`);
  }

  async upsertSetting(key: string, data: any) {
    return this.request(`/v1/admin/site-settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSetting(key: string, locale?: string) {
    const query = locale ? `?locale=${locale}` : '';
    return this.request(`/v1/admin/site-settings/${key}${query}`, {
      method: 'DELETE',
    });
  }

  // ========== Leads ==========

  async listLeads(params?: { status?: string; page?: number; pageSize?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/v1/admin/leads?${query}`);
  }

  async updateLeadStatus(id: number, status: string) {
    return this.request(`/v1/admin/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // ========== Newsletter Subscribers ==========

  async listNewsletterSubscribers(params?: { status?: string; page?: number; pageSize?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/v1/admin/newsletter-subscribers?${query}`);
  }

  async updateSubscriberStatus(id: number, status: string) {
    return this.request(`/v1/admin/newsletter-subscribers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // ========== Media Assets ==========

  /**
   * Upload media file (image, video, etc.)
   * @param formData - FormData with 'file' and optional 'alt_text'
   */
  async uploadMedia(formData: FormData) {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.baseUrl}/v1/admin/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        // Don't set Content-Type - browser will set it with boundary for multipart
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try refresh token
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          // Retry with new token
          const newAccessToken = getAccessToken();
          const retryResponse = await fetch(`${this.baseUrl}/v1/admin/media`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${newAccessToken}`,
            },
            body: formData,
          });

          if (!retryResponse.ok) {
            const errorData = await retryResponse.json();
            throw new Error(errorData.error?.message || 'Upload failed');
          }

          return retryResponse.json();
        }

        clearAuthTokens();
        window.location.href = '/admin/login';
        throw new Error('Session expired');
      }

      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    return response.json();
  }

  /**
   * Get media asset by ID
   */
  async getMediaById(id: number) {
    return this.request(`/v1/admin/media/${id}`);
  }

  // ========== Users ==========

  /**
   * List all users with pagination
   */
  async listUsers(params?: { page?: number; pageSize?: number; role?: string; isActive?: boolean }) {
    // Filter out undefined values to avoid sending "undefined" as string
    const filteredParams: Record<string, string> = {};
    if (params) {
      if (params.page !== undefined) filteredParams.page = String(params.page);
      if (params.pageSize !== undefined) filteredParams.pageSize = String(params.pageSize);
      if (params.role !== undefined && params.role !== '') filteredParams.role = params.role;
      if (params.isActive !== undefined) filteredParams.isActive = String(params.isActive);
    }
    const query = new URLSearchParams(filteredParams).toString();
    return this.request(`/v1/admin/users${query ? `?${query}` : ''}`);
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number) {
    return this.request(`/v1/admin/users/${id}`);
  }

  /**
   * Create new user
   */
  async createUser(data: {
    email: string;
    password: string;
    full_name: string;
    role_ids: number[];
    is_active?: boolean;
  }) {
    return this.request('/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update user
   */
  async updateUser(id: number, data: {
    email?: string;
    full_name?: string;
    role_ids?: number[];
    is_active?: boolean;
  }) {
    return this.request(`/v1/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete user
   */
  async deleteUser(id: number) {
    return this.request(`/v1/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Change user password
   */
  async changeUserPassword(id: number, newPassword: string) {
    return this.request(`/v1/admin/users/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify({ new_password: newPassword }),
    });
  }

  /**
   * Toggle user active status
   */
  async toggleUserActive(id: number) {
    return this.request(`/v1/admin/users/${id}/toggle-active`, {
      method: 'PUT',
    });
  }

  /**
   * List all available roles
   */
  async listRoles() {
    return this.request('/v1/admin/users/roles');
  }
}

export const adminApi = new AdminApiClient(API_BASE_URL);
