export const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  return (configured || DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}

/**
 * Mock data is used only when this flag is explicitly enabled.
 * Live request failures never switch to mock data.
 */
export function isMockApiEnabled(): boolean {
  const raw = import.meta.env.VITE_USE_MOCK_API;
  return typeof raw === "string" ? raw.trim().toLowerCase() === "true" : false;
}
