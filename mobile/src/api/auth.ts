import {apiRequest} from './client';

export interface AuthResponse {
    userId: number;
    name: string;
    accessToken: string;
    refreshToken: string;
}

export interface Userresponse {
    userId: number;
    name: string;
    email: string;
}


export async function register(
    name: string,
    email: string,
    password: string
) : Promise<AuthResponse> {
    return apiRequest<AuthResponse>("api/Auth/register", {
        method: "POST",
        body: JSON.stringify({
            name,
            email,
            password
        })
    });
}

export async function login(
    email: string,
    password: string,
) : Promise<AuthResponse> {
    return apiRequest<AuthResponse>("api/Auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password
        })
    });
}

export async function getCurrentUser() : Promise<Userresponse> {
    return apiRequest<Userresponse>("api/Auth/me");
}

export async function refreshToken(
    token: string
) : Promise<AuthResponse> {
    return apiRequest<AuthResponse>("api/Auth/refreshToken", {
        method: "POST",
        body: JSON.stringify({
            refreshToken: token
        })
    });
}