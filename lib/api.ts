import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for automatic token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.client(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Attempt to refresh token
            await this.refreshToken();

            // Process failed queue
            this.processQueue(null);

            // Retry original request
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, process queue with error
            this.processQueue(refreshError);

            // Redirect to login or handle auth failure
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: unknown) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(null);
      }
    });

    this.failedQueue = [];
  }

  // Authentication methods
  async login(email: string, password: string) {
    const response = await this.client.post('/api/auth?action=login', {
      email,
      password,
    });
    return response.data;
  }

  async register(email: string, name: string, password: string) {
    const response = await this.client.post('/api/auth?action=register', {
      email,
      name,
      password,
    });
    return response.data;
  }

  async logout() {
    const response = await this.client.post('/api/auth?action=logout', {});
    return response.data;
  }

  async logoutAll() {
    const response = await this.client.post('/api/auth?action=logout-all', {});
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/api/auth?action=me');
    return response.data;
  }

  async refreshToken() {
    const response = await this.client.post('/api/auth?action=refresh', {});
    return response.data;
  }

  // Generic API methods
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;