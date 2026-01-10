import { vi } from 'vitest';

if (typeof global.fetch === 'undefined') {
  global.fetch = vi.fn();
}
