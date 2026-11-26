import { Capacitor } from '@capacitor/core';
import { LocalError, localApi } from '../local/localApi';

export const TOKEN_KEY = 'medirecord_token';

/** App Android (o VITE_OFFLINE=1): todo se guarda en el dispositivo, sin servidor ni cuentas. */
export const OFFLINE = Capacitor.isNativePlatform() || import.meta.env.VITE_OFFLINE === '1';

const BASE_URL: string = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let onUnauthorized: () => void = () => {};

export function setOnUnauthorized(fn: () => void): void {
  onUnauthorized = fn;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function detailMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'detail' in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail[0] && typeof detail[0].msg === 'string') {
      return detail[0].msg.replace(/^Value error, /, '') || detail[0].msg;
    }
  }
  return fallback;
}

export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  if (OFFLINE) {
    try {
      return await localApi<T>(path, init);
    } catch (err) {
      if (!(err instanceof LocalError)) throw new ApiError(500, 'Algo salió mal. Intentá de nuevo.');
      if (err.status === 401) {
        setToken(null);
        onUnauthorized();
      }
      throw new ApiError(err.status, err.message);
    }
  }
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (init.body !== undefined) headers['Content-Type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: init.method ?? 'GET',
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.');
  }

  if (res.status === 204) return undefined as T;

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (res.status === 401) {
    setToken(null);
    onUnauthorized();
    throw new ApiError(401, detailMessage(body, 'Tu sesión venció. Volvé a entrar.'));
  }
  if (!res.ok) {
    throw new ApiError(res.status, detailMessage(body, 'Algo salió mal. Intentá de nuevo.'));
  }
  return body as T;
}
