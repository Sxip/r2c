import { describe, it, expect, beforeEach, vi } from 'vitest';
import { APIClient, R2CError } from '../src/api';

class TestClient extends APIClient {
  public async testAuthHeaders() {
    return this.authHeaders();
  }

  public async testDefaultHeaders() {
    return this.defaultHeaders();
  }

  public async testMakeRequest<T>(options: any) {
    return this.makeRequest<T>(options);
  }
}

describe('APIClient', () => {
  describe('Authentication', () => {
    it('should throw error when no authentication is provided', async () => {
      const client = new TestClient({
        baseURL: 'https://test-api.r2clive.com',
      });

      await expect(client.testAuthHeaders()).rejects.toThrow('No authentication configured');
    });

    it('should use bearer token when provided', async () => {
      const client = new TestClient({
        baseURL: 'https://test-api.r2clive.com',
        bearerToken: 'test-token-123',
      });

      const headers = await client.testAuthHeaders();
      expect(headers).toEqual({
        Authorization: 'Bearer test-token-123',
      });
    });

    it('should fetch OAuth token on first request', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: 'oauth-token-456',
          expires_in: 3600,
        }),
      });

      const client = new TestClient({
        baseURL: 'https://test-api.r2clive.com',
        oauthCredentials: {
          username: 'user',
          password: 'pass',
          site_id: 'site',
          client_id: 'client',
          client_secret: 'secret',
        },
        fetch: mockFetch,
      });

      const headers = await client.testAuthHeaders();
      expect(headers).toEqual({
        Authorization: 'Bearer oauth-token-456',
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should reuse cached OAuth token', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: 'oauth-token-456',
          expires_in: 3600,
        }),
      });

      const client = new TestClient({
        baseURL: 'https://test-api.r2clive.com',
        oauthCredentials: {
          username: 'user',
          password: 'pass',
          site_id: 'site',
          client_id: 'client',
          client_secret: 'secret',
        },
        fetch: mockFetch,
      });

      await client.testAuthHeaders();
      await client.testAuthHeaders();
      await client.testAuthHeaders();

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle OAuth authentication failure', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => 'Invalid credentials',
        headers: new Headers(),
      });

      const client = new TestClient({
        baseURL: 'https://test-api.r2clive.com',
        oauthCredentials: {
          username: 'user',
          password: 'wrong',
          site_id: 'site',
          client_id: 'client',
          client_secret: 'secret',
        },
        fetch: mockFetch,
      });

      await expect(client.testAuthHeaders()).rejects.toThrow('Authentication failed');
    });
  });

  describe('HTTP Methods', () => {
    let mockFetch: any;
    let client: TestClient;

    beforeEach(() => {
      mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: 'test' }),
      });

      client = new TestClient({
        baseURL: 'https://test-api.r2clive.com',
        bearerToken: 'test-token',
        fetch: mockFetch,
      });
    });

    it('should make GET request', async () => {
      await client.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.r2clive.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should make GET request with query parameters', async () => {
      await client.getWithQuery('/test', { page: 1, limit: 10 });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.r2clive.com/test?page=1&limit=10',
        expect.any(Object)
      );
    });

    it('should make POST request with body', async () => {
      await client.post('/test', { name: 'Test' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.r2clive.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Test' }),
        })
      );
    });

    it('should make PATCH request', async () => {
      await client.patch('/test/123', { status: 'updated' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.r2clive.com/test/123',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ status: 'updated' }),
        })
      );
    });

    it('should make DELETE request', async () => {
      await client.delete('/test/123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.r2clive.com/test/123',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should handle 204 No Content response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
        headers: new Headers(),
      });

      const result = await client.get('/test');
      expect(result).toBeNull();
    });

    it('should throw R2CError on HTTP error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Resource not found',
        headers: new Headers(),
      });

      await expect(client.get('/test')).rejects.toThrow(R2CError);
      await expect(client.get('/test')).rejects.toThrow('HTTP Error 404');
    });
  });

  describe('Token Management', () => {
    it('should clear token cache', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: 'token1',
          expires_in: 3600,
        }),
      });

      const client = new TestClient({
        baseURL: 'https://test-api.r2clive.com',
        oauthCredentials: {
          username: 'user',
          password: 'pass',
          site_id: 'site',
          client_id: 'client',
          client_secret: 'secret',
        },
        fetch: mockFetch,
      });

      await client.testAuthHeaders();
      expect(mockFetch).toHaveBeenCalledTimes(1);

      client.clearToken();

      await client.testAuthHeaders();
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should manually set token', async () => {
      const client = new TestClient({
        baseURL: 'https://test-api.r2clive.com',
        oauthCredentials: {
          username: 'user',
          password: 'pass',
          site_id: 'site',
          client_id: 'client',
          client_secret: 'secret',
        },
      });

      client.setToken('manual-token', 3600);
      const headers = await client.testAuthHeaders();

      expect(headers).toEqual({
        Authorization: 'Bearer manual-token',
      });
    });
  });
});

describe('R2CError', () => {
  it('should create error with all properties', () => {
    const headers = new Headers({ 'content-type': 'application/json' });
    const error = new R2CError('Test error', 400, headers, 'Error details');

    expect(error.message).toBe('Test error');
    expect(error.status).toBe(400);
    expect(error.headers).toBe(headers);
    expect(error.error).toBe('Error details');
    expect(error.name).toBe('R2CError');
  });

  it('should create error with minimal properties', () => {
    const error = new R2CError('Simple error');

    expect(error.message).toBe('Simple error');
    expect(error.status).toBeUndefined();
    expect(error.headers).toBeUndefined();
    expect(error.error).toBeUndefined();
  });
});
