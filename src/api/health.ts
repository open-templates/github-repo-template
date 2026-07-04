import { API_BASE_URL, apiFetch } from "@/api/api";

export type HealthStatus = "online" | "offline" | "checking";

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export async function fetchHealth(): Promise<{
  data?: HealthResponse;
  error?: string;
}> {
  const url = new URL("/health", API_BASE_URL);
  return apiFetch(url, { method: "GET" }, false);
}
