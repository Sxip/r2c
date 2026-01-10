import type { R2CClient } from './index';

/**
 * Base class for all API resources
 */
export abstract class APIResource {
  /**
   * Create a new APIResource instance
   * @param client The R2CClient instance
   * @internal
   */
  public constructor(protected readonly client: R2CClient) {}
}
