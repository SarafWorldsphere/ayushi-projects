// SWAIS standard: the ONLY place API URLs are constructed.
// Components never call fetch() with a hardcoded URL.

// Fallback to port 8000 as configured in our backend fixes
const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000").trim().replace(/\/+$/, "");

if (!process.env.NEXT_PUBLIC_API_BASE_URL && typeof window !== "undefined") {
  // Warn instead of failing silently so development can continue
  console.warn(
    "NEXT_PUBLIC_API_BASE_URL is not set. Defaulting to http://127.0.0.1:8000. Create .env.local from .env.example and rebuild."
  );
}

export function apiUrl(path) {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Automatically attach the secure JWT token to every request if the user is logged in
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
  });

  if (!response.ok) {
    // If the backend returns 401 Unauthorized, the token is invalid or expired.
    // Clear the bad token from storage automatically.
    if (response.status === 401 && typeof window !== "undefined") {
      console.error("Session expired or invalid token. Clearing auth state.");
      localStorage.removeItem("token");
      localStorage.removeItem("customer"); // Assuming you store customer info here too
      // Optional: Force reload or redirect to login page
      // window.location.href = "/";
    }
    throw new Error(`API ${options.method || "GET"} ${path} failed: ${response.status}`);
  }
  
  return response.json();
}