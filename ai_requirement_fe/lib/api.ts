let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
if (rawApiUrl.endsWith('/')) {
  rawApiUrl = rawApiUrl.slice(0, -1);
}
if (!rawApiUrl.endsWith('/api')) {
  rawApiUrl += '/api';
}
const API_BASE_URL = rawApiUrl;

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("Fetching API URL:", url, "Method:", options.method || "GET");
  
  const headers: Record<string, string> = {
    ...options.headers as Record<string, string>,
  };

  // Only set Content-Type to application/json if it's not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  // Add Auth Token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined" && !endpoint.includes("/auth/login")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        window.location.href = "/login";
      }
    }

    const errorText = await response.text();
    let errorMessage = errorText;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.error || errorText;
    } catch (e) {}
    throw new Error(errorMessage || 'API request failed');
  }

  const text = await response.text();
  if (!text) return null;
  
  try {
    return JSON.parse(text);
  } catch (e) {
    // If it's not JSON (like a plain string "Đăng ký thành công"), return the raw text
    return text;
  }
};
