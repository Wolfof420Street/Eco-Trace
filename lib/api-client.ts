export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string
  ) {
    super(message);
  }
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    }
  });

  const json = (await response.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new ApiError(response.status, json.error, json.code);
  }

  return json.data;
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: "POST",
      body: JSON.stringify(body)
    }),
  delete: <T>(url: string) =>
    request<T>(url, {
      method: "DELETE"
    })
};
