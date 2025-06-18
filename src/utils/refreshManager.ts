import axios from 'axios';
import { API_REFRESH_TOKEN_KEY, API_ACCESS_TOKEN_KEY } from '@/constants/app.constant';
import type { RefreshResponse } from '@/@types/auth';

let isRefreshing = false;
let subscribers: Array<(token: string) => void> = [];

export function addSubscriber(cb: (token: string) => void) {
    subscribers.push(cb);
}

export function onRefreshed(token: string) {
    subscribers.forEach(cb => cb(token));
    subscribers = [];
}

export function setRefreshing(value: boolean) {
    isRefreshing = value;
}

export function getRefreshing(): boolean {
    return isRefreshing;
}

export async function getNewAccessToken(): Promise<string> {
    const refreshToken = localStorage.getItem(API_REFRESH_TOKEN_KEY);
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await axios.post<RefreshResponse>(
        '/api/refresh',
        { refreshToken },
        { baseURL: '' }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem(API_ACCESS_TOKEN_KEY, accessToken);
    if (newRefreshToken) {
        localStorage.setItem(API_REFRESH_TOKEN_KEY, newRefreshToken);
    }

    return accessToken;
}