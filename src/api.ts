/**
 * Fetch function type
 */
export type Fetch = typeof fetch;

/**
 * Paginated API response wrapper
 */
export type PaginatedResult<T> = {
  totalRecords: number;
  totalPages: number;
  page: number;
  pageSize: number;
  results?: T[] | null;
  firstPage?: string | null;
  prevPage?: string | null;
  nextPage?: string | null;
  lastPage?: string | null;
};

/**
 * Request options for API requests
 */
export type RequestOptions = Omit<RequestInit, 'body'> & {
  path: string;
  query?: Record<string, unknown>;
  body?: unknown;
};

/**
 * OAuth token cache
 */
export type TokenCache = {
  access_token: string;
  expires_at: number;
};

/**
 * OAuth credentials
 */
export type OAuthCredentials = {
  username: string;
  password: string;
  site_id: string;
  client_id: string;
  client_secret: string;
  identity_url?: string;
};

/**
 * R2C Error class for API errors
 */
export class R2CError extends Error {
  readonly status: number | undefined;
  readonly headers: Headers | undefined;
  readonly error: string | undefined;

  constructor(message: string, status?: number, headers?: Headers, error?: string) {
    super(message);
    this.name = 'R2CError';
    this.status = status;
    this.headers = headers;
    this.error = error;
  }
}

/**
 * Base class for all API clients
 */
export abstract class APIClient {
  /**
   * The base URL for the API
   */
  public baseURL: string;

  /**
   * The bearer token for authentication
   */
  public bearerToken: string | null;

  /**
   * The fetch implementation to use
   */
  private fetch: Fetch;

  /**
   * The OAuth credentials for automatic token management
   */
  private oauthCredentials: OAuthCredentials | null;

  /**
   * Cache for the current token
   */
  private tokenCache: TokenCache | null = null;

  /**
   * Promise for ongoing token refresh
   */
  private refreshPromise: Promise<string> | null = null;

  /**
   * Buffer time before token expiry to trigger a refresh
   */
  private readonly TOKEN_BUFFER_MS = 60000;

  /**
   * Construct a new APIClient instance
   * @param options The client options
   * @internal
   */
  public constructor({
    baseURL = 'https://www.r2clive.com/api/Jobsheet/2',
    bearerToken,
    oauthCredentials,
    fetch: overrideFetch,
  }: {
    baseURL?: string;
    bearerToken?: string | null;
    oauthCredentials?: OAuthCredentials | null;
    fetch?: Fetch;
  }) {
    this.baseURL = baseURL;
    this.bearerToken = bearerToken || null;
    this.oauthCredentials = oauthCredentials || null;
    this.fetch = overrideFetch ?? globalThis.fetch;
  }

  protected async authHeaders(): Promise<Record<string, string>> {
    if (this.oauthCredentials) {
      const token = await this.getOAuthToken();
      return {
        Authorization: `Bearer ${token}`,
      };
    }

    if (this.bearerToken) {
      return {
        Authorization: `Bearer ${this.bearerToken}`,
      };
    }

    throw new R2CError(
      'No authentication configured. Provide either bearerToken or oauthCredentials.'
    );
  }
  /**
   * Get a valid OAuth token, refreshing if necessary
   */
  private async getOAuthToken(): Promise<string> {
    if (this.tokenCache && this.isTokenValid()) {
      return this.tokenCache.access_token;
    }

    if (this.refreshPromise) return await this.refreshPromise;
    this.refreshPromise = this.fetchOAuthToken();

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Check if the current cached token is still valid
   */
  private isTokenValid(): boolean {
    if (!this.tokenCache) return false;

    return this.tokenCache.expires_at > Date.now() + this.TOKEN_BUFFER_MS;
  }

  /**
   * Fetch a new OAuth token from the identity server
   */
  private async fetchOAuthToken(): Promise<string> {
    if (!this.oauthCredentials) throw new R2CError('OAuth credentials not configured');

    const {
      username,
      password,
      site_id,
      client_id,
      client_secret,
      identity_url = 'https://www.r2clive.com/identity',
    } = this.oauthCredentials;

    const params = new URLSearchParams({
      username,
      password,
      siteid: site_id,
      grant_type: 'password',
      client_id: client_id,
      client_secret: client_secret,
      scope: 'openid',
    });

    const url = `${identity_url}/connect/token`;
    const response = await this.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new R2CError(
        `Authentication failed: ${response.status} ${errorText}`,
        response.status,
        response.headers,
        errorText
      );
    }

    const data = (await response.json()) as {
      access_token: string;
      expires_in: number;
    };

    const { access_token, expires_in } = data;

    if (!access_token || !expires_in) {
      throw new R2CError('Invalid token response from server');
    }

    this.tokenCache = {
      access_token: access_token,
      expires_at: Date.now() + expires_in * 1000,
    };

    return access_token;
  }

  /**
   * Clear the cached token (useful for logout)
   */
  public clearToken(): void {
    this.tokenCache = null;
  }

  /**
   * Manually set a token (if you have one from another source)
   */
  public setToken(token: string, expiresIn: number): void {
    this.tokenCache = {
      access_token: token,
      expires_at: Date.now() + expiresIn * 1000,
    };
  }

  /**
   * Default headers for API requests
   */
  protected async defaultHeaders(): Promise<Record<string, string>> {
    const authHeaders = await this.authHeaders();
    return {
      'Content-Type': 'application/json',
      ...authHeaders,
    };
  }

  /**
   * Parse the API response
   * @param response The fetch Response object
   */
  protected async parseResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new R2CError(
        `HTTP Error ${response.status}: ${errorText || response.statusText}`,
        response.status,
        response.headers,
        errorText
      );
    }

    if (response.status === 204) {
      return null as T;
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return (await response.json()) as T;
    }

    return (await response.text()) as unknown as T;
  }

  /**
   * Make an HTTP request to the API
   * @param options The request options
   */
  protected async makeRequest<T>(options: RequestOptions): Promise<T> {
    const { path, query, body, ...init } = options;

    let url = `${this.baseURL}${path}`;

    if (query) {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const defaultHeaders = await this.defaultHeaders();
    const headers = {
      ...defaultHeaders,
      ...(init.headers as Record<string, string>),
    };

    const fetchOptions: RequestInit = {
      ...init,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await this.fetch(url, fetchOptions);
    return this.parseResponse<T>(response);
  }

  /**
   * Sends a GET request
   */
  public get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>({
      path,
      method: 'GET',
      ...options,
    });
  }
  /**
   * Sends a GET request with query parameters
   */
  public getWithQuery<T>(
    path: string,
    query?: Record<string, unknown>,
    options?: Omit<RequestInit, 'method'>
  ): Promise<T> {
    return this.makeRequest<T>({
      path,
      method: 'GET',
      query,
      ...options,
    });
  }
  /**
   * Sends a GET request
   */
  public post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>({
      path,
      method: 'POST',
      body,
      ...options,
    });
  }

  /**
   * Sends a PATCH request
   */
  public patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>({
      path,
      method: 'PATCH',
      body,
      ...options,
    });
  }

  /**
   * Sends a DELETE request
   */
  public delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>({
      path,
      method: 'DELETE',
      ...options,
    });
  }
}
