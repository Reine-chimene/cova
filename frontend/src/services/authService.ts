import type { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse } from '../types/auth'
import { TOKEN_STORAGE_KEY, USER_EMAIL_STORAGE_KEY } from '../utils/constants'
import { apiRequest } from './api'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function getStoredEmail(): string | null {
  return localStorage.getItem(USER_EMAIL_STORAGE_KEY)
}

export function clearAuthStorage(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_EMAIL_STORAGE_KEY)
}

export function persistAuth(token: string, email: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  localStorage.setItem(USER_EMAIL_STORAGE_KEY, email)
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredToken())
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: request,
    auth: false,
  })
  persistAuth(response.accessToken, response.email)
  return response
}

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/api/auth/register', {
    method: 'POST',
    body: request,
    auth: false,
  })
}

export function logout(): void {
  clearAuthStorage()
}
