// Resolve API Base URL and ensure it ends with '/api' without duplicate trailing slashes
let rawBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
if (!rawBaseUrl.endsWith('/api')) {
  rawBaseUrl = `${rawBaseUrl}/api`;
}
const API_BASE_URL = rawBaseUrl;

// Session Storage Keys
const TOKEN_KEY = 'userflow_jwt_token';
const USER_KEY = 'userflow_user_data';

// Event bus callback for handling 401 unauthorized session expiry
let unauthorizedHandler = null;

export const setUnauthorizedHandler = (callback) => {
  unauthorizedHandler = callback;
};

export const getStoredToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = () => {
  try {
    const data = sessionStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const saveSession = (token, user) => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

/**
 * Common request wrapper using Native Fetch API.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getStoredToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    console.error(`[API Network Error] Failed to reach: ${url}`, networkError);
    throw new Error(
      `Unable to connect to the server at ${url}. Please verify your backend is running and network connection is active.`
    );
  }

  // Handle 401 Unauthorized: Session is invalid or expired
  if (response.status === 401) {
    // Only clear session if this was an authenticated request (not the login endpoint itself)
    if (endpoint !== '/auth/login') {
      clearSession();
      if (typeof unauthorizedHandler === 'function') {
        unauthorizedHandler();
      }
    }
  }

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (parseError) {
      data = null;
    }
  }

  if (!response.ok) {
    let errorMessage = data?.message;
    if (!errorMessage) {
      if (response.status === 404) {
        errorMessage = `Endpoint not found (404). Target: ${url}. Verify VITE_API_URL in Netlify environment variables and redeploy with clear cache.`;
      } else {
        errorMessage = `Request failed with status ${response.status}`;
      }
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Authentication & User Services
 */
export const authService = {
  login: async (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  logout: async () => {
    try {
      await request('/auth/logout', {
        method: 'POST'
      });
    } catch (err) {
      // Even if network fails, proceed with client logout
    } finally {
      clearSession();
    }
  }
};

export const userService = {
  getUsers: async () => {
    return request('/users', {
      method: 'GET'
    });
  },

  createUser: async ({ name, email, password }) => {
    return request('/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  }
};
