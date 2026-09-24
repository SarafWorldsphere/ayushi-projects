// SWAIS standard: the ONLY place API URLs are constructed.
// Components never call fetch() with a hardcoded URL.

const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim().replace(/\/+$/, "");

if (!BASE_URL && typeof window !== "undefined") {
  // Fail loudly — a silent fallback cost us a debugging round once.
  console.error(
    "NEXT_PUBLIC_API_BASE_URL is not set. Create .env.local from .env.example and rebuild."
  );
}

export function apiUrl(path) {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API ${options.method || "GET"} ${path} failed: ${response.status}`);
  }
  return response.json();
}
