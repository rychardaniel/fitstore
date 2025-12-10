const API_BASE = "/api";

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        credentials: "include", // Send cookies with requests
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers as Record<string, string>),
        },
    });

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ message: "Request failed" }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

export const api = {
    get: <T>(url: string) => fetchApi<T>(url),
    post: <T>(url: string, data?: unknown) =>
        fetchApi<T>(url, { method: "POST", body: JSON.stringify(data) }),
    put: <T>(url: string, data?: unknown) =>
        fetchApi<T>(url, { method: "PUT", body: JSON.stringify(data) }),
    patch: <T>(url: string, data?: unknown) =>
        fetchApi<T>(url, { method: "PATCH", body: JSON.stringify(data) }),
    delete: <T>(url: string) => fetchApi<T>(url, { method: "DELETE" }),
};
