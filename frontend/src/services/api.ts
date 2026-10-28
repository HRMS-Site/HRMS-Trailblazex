import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { getApiBaseUrl } from "@/lib/env";

export { getApiBaseUrl } from "@/lib/env";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function readErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }
  const body = payload as { detail?: unknown; message?: unknown };
  if (typeof body.message === "string" && body.message.trim()) {
    return body.message;
  }
  if (typeof body.detail === "string" && body.detail.trim()) {
    return body.detail;
  }
  if (Array.isArray(body.detail)) {
    const parts = body.detail
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item === "object" && "msg" in item) {
          const msg = (item as { msg?: unknown }).msg;
          return typeof msg === "string" ? msg : "";
        }
        return "";
      })
      .filter(Boolean);
    if (parts.length > 0) {
      return parts.join(" ");
    }
  }
  return fallback;
}

export const http = axios.create({
  headers: {
    Accept: "application/json",
  },
});

http.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  const token = sessionStorage.getItem("hrms.accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function apiRequest<T>(path: string, init: AxiosRequestConfig = {}): Promise<T> {
  try {
    const response = await http.request<T>({
      url: path,
      ...init,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (!error.response) {
        throw new ApiError(
          `Cannot reach the API at ${getApiBaseUrl()}. Confirm the backend is running and VITE_API_BASE_URL is correct.`,
          0,
        );
      }
      if (error.response.status === 401) {
        sessionStorage.removeItem("hrms.accessToken");
        sessionStorage.removeItem("hrms.session");
      }
      throw new ApiError(
        readErrorMessage(error.response.data, `Request failed with status ${error.response.status}.`),
        error.response.status,
      );
    }
    throw new ApiError("Request failed.");
  }
}

export function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of ["items", "data", "results"]) {
      if (Array.isArray(record[key])) {
        return record[key] as T[];
      }
    }
  }
  throw new ApiError(
    "The API returned an unexpected list format. Update the frontend after docs/api-contracts.md is published.",
  );
}

export function toQueryString(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      search.set(key, value);
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}
