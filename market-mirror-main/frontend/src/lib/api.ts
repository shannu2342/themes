const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3001").replace(/\/$/, "");

const USER_AUTH_TOKEN_KEY = "mm_user_auth_token";
const ADMIN_AUTH_TOKEN_KEY = "mm_admin_auth_token";
const USER_AUTH_USER_KEY = "mm_user_auth_user";
const ADMIN_AUTH_USER_KEY = "mm_admin_auth_user";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  user_metadata?: {
    full_name?: string;
  };
  created_at?: string;
}

export interface AuthSessionPayload {
  token: string;
  user: AuthUser;
  isAdmin: boolean;
}

export type AuthScope = "user" | "admin";

export interface ApiOptions {
  method?: ApiMethod;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
}

export const getApiBaseUrl = () => API_BASE_URL;

const isAdminRoute = () => window.location.pathname.startsWith("/admin");

export const getStoredToken = () => {
  const key = isAdminRoute() ? ADMIN_AUTH_TOKEN_KEY : USER_AUTH_TOKEN_KEY;
  return localStorage.getItem(key) || "";
};

export const getStoredUser = (): AuthUser | null => {
  const key = isAdminRoute() ? ADMIN_AUTH_USER_KEY : USER_AUTH_USER_KEY;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const setAuthSession = (payload: AuthSessionPayload, scope: AuthScope = "user") => {
  const tokenKey = scope === "admin" ? ADMIN_AUTH_TOKEN_KEY : USER_AUTH_TOKEN_KEY;
  const userKey = scope === "admin" ? ADMIN_AUTH_USER_KEY : USER_AUTH_USER_KEY;
  localStorage.setItem(tokenKey, payload.token);
  localStorage.setItem(userKey, JSON.stringify(payload.user));
};

export const clearAuthSession = (scope: AuthScope | "all" = "all") => {
  if (scope === "all" || scope === "user") {
    localStorage.removeItem(USER_AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_AUTH_USER_KEY);
  }
  if (scope === "all" || scope === "admin") {
    localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
    localStorage.removeItem(ADMIN_AUTH_USER_KEY);
  }
};

export const apiFetch = async <T>(path: string, options: ApiOptions = {}): Promise<T> => {
  const { method = "GET", body, headers = {}, auth = true } = options;
  const finalHeaders: Record<string, string> = {
    ...headers,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getStoredToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === "object" && data && "error" in data ? String((data as any).error) : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data as T;
};

export const apiGet = <T>(path: string, auth = true) => apiFetch<T>(path, { method: "GET", auth });
export const apiPost = <T>(path: string, body?: unknown, auth = true) => apiFetch<T>(path, { method: "POST", body, auth });
export const apiPut = <T>(path: string, body?: unknown, auth = true) => apiFetch<T>(path, { method: "PUT", body, auth });
export const apiPatch = <T>(path: string, body?: unknown, auth = true) => apiFetch<T>(path, { method: "PATCH", body, auth });
export const apiDelete = <T>(path: string, auth = true) => apiFetch<T>(path, { method: "DELETE", auth });

export const apiUploadFile = async (path: string, file: File): Promise<{ url: string }> => {
  const form = new FormData();
  form.append("file", file);
  return apiFetch<{ url: string }>(path, { method: "POST", body: form, auth: true });
};
