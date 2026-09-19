import { useCallback, useSyncExternalStore } from 'react'
import {
  getStoredEmail,
  getStoredToken,
  isAuthenticated,
  logout as logoutService,
} from '../services/authService'

type AuthSnapshot = {
  token: string | null
  email: string | null
  authenticated: boolean
}

function buildAuthSnapshot(): AuthSnapshot {
  const token = getStoredToken()
  return {
    token,
    email: getStoredEmail(),
    authenticated: isAuthenticated(),
  }
}

let authSnapshot = buildAuthSnapshot()

function refreshAuthSnapshot(): void {
  authSnapshot = buildAuthSnapshot()
}

function subscribe(callback: () => void) {
  const onChange = () => {
    refreshAuthSnapshot()
    callback()
  }

  window.addEventListener('storage', onChange)
  window.addEventListener('auth-changed', onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener('auth-changed', onChange)
  }
}

function getAuthSnapshot(): AuthSnapshot {
  return authSnapshot
}

export function notifyAuthChanged() {
  refreshAuthSnapshot()
  window.dispatchEvent(new Event('auth-changed'))
}

export function useAuth() {
  const auth = useSyncExternalStore(subscribe, getAuthSnapshot, getAuthSnapshot)

  const logout = useCallback(() => {
    logoutService()
    notifyAuthChanged()
  }, [])

  return { ...auth, logout }
}
