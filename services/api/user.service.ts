import { apiClient } from './client';

export const userService = {
    async getProfile(): Promise<any> {
        return apiClient.get('/users/profile');
    },

    async updateProfile(updates: any): Promise<any> {
        return apiClient.put('/users/profile', updates);
    },

    async updateContactInfo(data: {
        phone?: string;
        email?: string;
    }): Promise<void> {
        await apiClient.put('/users/contact', data);
    },

    async updateAddress(address: string): Promise<void> {
        await apiClient.put('/users/address', { address });
    },

    async getDashboardStats(): Promise<any> {
        return apiClient.get('/users/stats');
    },
};