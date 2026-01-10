import { describe, it, expect } from 'vitest';
import { R2CClient } from '../src/index';

describe('R2CClient', () => {
  describe('Constructor', () => {
    it('should create client with bearer token', () => {
      const client = new R2CClient({
        bearerToken: 'test-token',
      });

      expect(client).toBeInstanceOf(R2CClient);
      expect(client.baseURL).toBe('https://www.r2clive.com/api/Jobsheet/2');
    });

    it('should create client with OAuth credentials', () => {
      const client = new R2CClient({
        oauthCredentials: {
          username: 'user',
          password: 'pass',
          site_id: 'site',
          client_id: 'client',
          client_secret: 'secret',
        },
      });

      expect(client).toBeInstanceOf(R2CClient);
    });

    it('should accept custom baseURL', () => {
      const client = new R2CClient({
        bearerToken: 'test-token',
        baseURL: 'https://custom.api.com',
      });

      expect(client.baseURL).toBe('https://custom.api.com');
    });

    it('should throw error when no authentication is provided', () => {
      expect(() => {
        new R2CClient({} as any);
      }).toThrow('Either bearerToken or oauthCredentials is required');
    });

    it('should throw error when both auth methods are provided', () => {
      expect(() => {
        new R2CClient({
          bearerToken: 'token',
          oauthCredentials: {
            username: 'user',
            password: 'pass',
            site_id: 'site',
            client_id: 'client',
            client_secret: 'secret',
          },
        });
      }).toThrow('Cannot provide both bearerToken and oauthCredentials');
    });
  });

  describe('Resources', () => {
    it('should have jobsheets resource', () => {
      const client = new R2CClient({
        bearerToken: 'test-token',
      });

      expect(client.jobsheets).toBeDefined();
      expect(typeof client.jobsheets.get).toBe('function');
      expect(typeof client.jobsheets.search).toBe('function');
      expect(typeof client.jobsheets.patch).toBe('function');
    });
  });
});
