import { describe, it, expect, vi, beforeEach } from 'vitest';
import { R2CClient } from '../../../src/index';

describe('Consumables Resource', () => {
  let client: R2CClient;
  let mockFetch: any;

  beforeEach(() => {
    mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({}),
    });

    client = new R2CClient({
      bearerToken: 'test-token',
      fetch: mockFetch,
    });
  });

  describe('get', () => {
    it('should get a consumable by ID', async () => {
      const mockConsumable = {
        id: '789',
        code: 'CONS-001',
        description: 'Shop Towels',
        unitPrice: 5.0,
        quantity: 2,
        vatRate: 0.2,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockConsumable,
      });

      const result = await client.tasks.consumables.get({
        jobsheetId: '123',
        taskId: '456',
        consumableId: '789',
      });

      expect(result).toEqual(mockConsumable);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/Jobsheets/123/Tasks/456/Consumables/789'),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('patch', () => {
    it('should update consumable quantity', async () => {
      const mockJobsheet = { id: '123' };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockJobsheet,
      });

      const result = await client.tasks.consumables.patch({
        jobsheetId: '123',
        taskId: '456',
        consumableId: '789',
        quantity: 5,
      });

      expect(result).toEqual(mockJobsheet);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/Jobsheets/123/Tasks/456/Consumables/789'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ quantity: 5 }),
        })
      );
    });
  });

  describe('create', () => {
    it('should create a new consumable', async () => {
      const mockJobsheet = { id: '123' };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockJobsheet,
      });

      const result = await client.tasks.consumables.create({
        jobsheetId: '123',
        taskId: '456',
        description: 'Shop Towels',
        quantity: 1,
        unitPrice: 5.0,
        vatRate: 0.2,
      });

      expect(result).toEqual(mockJobsheet);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/Jobsheets/123/Tasks/456/Consumables'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Shop Towels'),
        })
      );
    });

    it('should include optional code in request', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await client.tasks.consumables.create({
        jobsheetId: '123',
        taskId: '456',
        code: 'CONS-001',
        description: 'Shop Towels',
        quantity: 1,
        unitPrice: 5.0,
        vatRate: 0.2,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('CONS-001'),
        })
      );
    });
  });
});
