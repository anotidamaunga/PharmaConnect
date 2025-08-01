import { apiClient } from './client';
import { tokenManager, STORAGE_KEYS } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '../../types';

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        role: UserRole;
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
        profile: any;
    };
}

interface SignupData {
    email: string;
    password: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    pharmacyName?: string;
    phone: string;
}

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>('/auth/login', {
            email,
            password,
        });

        // Store tokens and user data
        await tokenManager.setTokens(response.accessToken, response.refreshToken);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

        return response;
    },

    async signup(data: SignupData): Promise<{ message: string; userId: string }> {
        return apiClient.post('/auth/signup', data);
    },

    async verifyOTP(code: string, method: 'email' | 'phone'): Promise<void> {
        await apiClient.post('/auth/verify-otp', { code, method });
    },

    async resendOTP(method: 'email' | 'phone'): Promise<void> {
        await apiClient.post('/auth/resend-otp', { method });
    },

    async logout(): Promise<void> {
        await tokenManager.clearTokens();
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    },

    async getCurrentUser(): Promise<any> {
        const userDataStr = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        return userDataStr ? JSON.parse(userDataStr) : null;
    },
};