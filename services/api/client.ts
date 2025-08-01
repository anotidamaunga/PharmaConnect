import { API_CONFIG, APIError, tokenManager } from './config';

class APIClient {
    private baseURL: string;
    private timeout: number;

    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        this.timeout = API_CONFIG.timeout;
    }

    private async getHeaders(): Promise<HeadersInit> {
        const headers: HeadersInit = {
            ...API_CONFIG.headers,
        };

        const token = await tokenManager.getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        const data = isJson ? await response.json() : await response.text();

        if (!response.ok) {
            throw new APIError(
                data.error || data.message || 'Request failed',
                response.status,
                data
            );
        }

        return data;
    }

    async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const headers = await this.getHeaders();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers,
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Handle token refresh
            if (response.status === 401) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Retry the request with new token
                    const newHeaders = await this.getHeaders();
                    const retryResponse = await fetch(url, {
                        ...options,
                        headers: {
                            ...newHeaders,
                            ...options.headers,
                        },
                    });
                    return this.handleResponse<T>(retryResponse);
                }
            }

            return this.handleResponse<T>(response);
        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof APIError) {
                throw error;
            }

            if (error.name === 'AbortError') {
                throw new APIError('Request timeout', 408);
            }

            throw new APIError('Network error', 0, error);
        }
    }

    private async refreshToken(): Promise<boolean> {
        try {
            const refreshToken = await tokenManager.getRefreshToken();
            if (!refreshToken) return false;

            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: API_CONFIG.headers,
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                await tokenManager.clearTokens();
                return false;
            }

            const data = await response.json();
            await tokenManager.setTokens(data.accessToken, refreshToken);
            return true;
        } catch (error) {
            await tokenManager.clearTokens();
            return false;
        }
    }

    // HTTP methods
    async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        return this.request<T>(`${endpoint}${queryString}`, {
            method: 'GET',
        });
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        });
    }

    async upload<T>(
        endpoint: string,
        formData: FormData
    ): Promise<T> {
        const headers = await this.getHeaders();
        delete headers['Content-Type']; // Let browser set boundary

        return this.request<T>(endpoint, {
            method: 'POST',
            headers,
            body: formData,
        });
    }
}

export const apiClient = new APIClient();