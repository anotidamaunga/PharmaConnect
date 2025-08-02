import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
    ? 'http://192.168.178.32:3000/api'
    : 'https://api.pharmaconnect.com/api';

export const API_CONFIG = {
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
};

// Storage keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: '@pharmaconnect_access_token',
    REFRESH_TOKEN: '@pharmaconnect_refresh_token',
    USER_DATA: '@pharmaconnect_user_data',
};

// API Error class
export class APIError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'APIError';
    }
}

// Token management
export const tokenManager = {
    async getAccessToken(): Promise<string | null> {
        return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    async setTokens(accessToken: string, refreshToken: string): Promise<void> {
        await AsyncStorage.multiSet([
            [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
            [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        ]);
    },

    async clearTokens(): Promise<void> {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.ACCESS_TOKEN,
            STORAGE_KEYS.REFRESH_TOKEN,
        ]);
    },

    async getRefreshToken(): Promise<string | null> {
        return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
};
