import { API_BASE_URL, apiFetch } from "@/api/api";

export interface MeResponse {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  created_at?: string;
}

export async function fetchMe(): Promise<{
  data?: MeResponse;
  error?: string;
}> {
  const url = new URL("/me", API_BASE_URL);
  return apiFetch(url, { method: "GET" });
}
