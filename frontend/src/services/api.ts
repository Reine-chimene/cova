import { getApiBaseUrl } from '../utils/apiConfig'
import { TOKEN_STORAGE_KEY, USER_EMAIL_STORAGE_KEY } from '../utils/constants'
import { translateApiMessage } from '../utils/i18n'

export class ApiError extends Error {
  status: number
  fieldErrors?: Record<string, string>

  constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
  auth?: boolean
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, auth = true }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  let response: Response
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(
      0,
      'Erreur réseau. Vérifiez votre connexion et réessayez.',
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  let payload: {
    message?: string
    fieldErrors?: Record<string, string>
  } | null = null

  if (text) {
    try {
      payload = JSON.parse(text) as { message?: string; fieldErrors?: Record<string, string> }
    } catch {
      payload = null
    }
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(USER_EMAIL_STORAGE_KEY)
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }

    const rawMessage =
      payload?.message ??
      (response.status >= 500
        ? 'Erreur serveur. Veuillez réessayer plus tard.'
        : response.statusText || 'La requête a échoué')

    const fieldErrors = payload?.fieldErrors
      ? Object.fromEntries(
          Object.entries(payload.fieldErrors).map(([key, value]) => [
            key,
            translateApiMessage(value),
          ]),
        )
      : undefined

    throw new ApiError(
      response.status,
      translateApiMessage(rawMessage),
      fieldErrors,
    )
  }

  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}
