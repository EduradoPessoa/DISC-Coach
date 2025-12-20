const API_URL_ENV = import.meta.env.VITE_API_URL;

// Função para determinar a URL da API dinamicamente
const getApiUrl = () => {
  if (API_URL_ENV) return API_URL_ENV;

  const { pathname, origin } = window.location;
  
  if (pathname.includes('/dist')) {
    const basePath = pathname.substring(0, pathname.indexOf('/dist'));
    return `${origin}${basePath}/api`;
  }

  return '/api';
};

export const apiRequest = async (endpoint: string, method: string = 'GET', body?: any, isRetry = false): Promise<any> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getApiUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const url = `${cleanBaseUrl}/${cleanEndpoint}`;

  // console.log(`API Request: ${method} ${url}`);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle 401 Unauthorized (Token Expired)
    if (response.status === 401 && !isRetry && !endpoint.includes('auth/login')) {
        console.log("Token expired, attempting refresh...");
        try {
            // Attempt to refresh token
            // We pass null body or explicit refreshToken if available in storage (for mobile support)
            // But Cookie should handle it for web.
            const storedRefreshToken = localStorage.getItem('refreshToken');
            
            // Avoid infinite loop if refresh endpoint itself returns 401
            if (endpoint.includes('auth/refresh')) {
                throw new Error('Refresh token invalid');
            }

            const refreshResponse = await apiRequest('/auth/refresh.php', 'POST', {
                refreshToken: storedRefreshToken
            }, true);

            if (refreshResponse && refreshResponse.accessToken) {
                console.log("Token refreshed successfully");
                localStorage.setItem('token', refreshResponse.accessToken);
                if (refreshResponse.refreshToken) {
                    localStorage.setItem('refreshToken', refreshResponse.refreshToken);
                }
                
                // Retry original request with new token
                return apiRequest(endpoint, method, body, true);
            }
        } catch (refreshError) {
            console.error("Session expired, logging out...", refreshError);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('disc_user');
            window.location.href = '#/auth/login';
            throw new Error('Session expired');
        }
    }

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'API Request Failed');
      } else {
        const textBody = await response.text();
        console.error(`API Error (${url}): Received HTML/Text instead of JSON. Status: ${response.status}`);
        throw new Error(`Server Error (${response.status}): Endpoint not found or returning HTML.`);
      }
    }

    return await response.json();
  } catch (error: any) {
    if (error.message.includes("Unexpected token") || error.message.includes("is not valid JSON")) {
      console.error(`API Error (${url}): Received HTML instead of JSON.`);
      throw new Error("Connection Error: Server returned invalid data.");
    }
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};
