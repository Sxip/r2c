import { APIClient, Fetch, OAuthCredentials, R2CError } from './api';
import * as RESOURCES from './resources';

export { Jobsheets } from './resources/sheets';
export { Tasks } from './resources/tasks';

export type {
  JobsheetGetParams,
  JobsheetPatchParams,
  JobsheetSearchParams,
  JobsheetUpdatedParams,
  JobsheetResponse,
  Pricing,
  Task,
  TaskInspection,
  TaskService,
  TaskRepair,
  TaskMot,
  TaskLabour,
  TaskPart,
  TaskFluid,
  TaskConsumable,
} from './resources/sheets';

export type {
  TaskGetParams,
  TaskCreateParams,
  TaskPatchParams,
  TaskResponse,
  TaskInspectionCreate,
  TaskServiceCreate,
  TaskRepairCreate,
  TaskMotCreate,
  TaskLabourCreate,
  TaskLabourUpdate,
  TaskPartUpdate,
  TaskPartCreate,
  TaskFluidUpdate,
  TaskFluidCreate,
  TaskConsumableUpdate,
  TaskConsumableCreate,
} from './resources/tasks';

export type { LabourPatchParams } from './resources/tasks/labour';
export type { PartGetParams, PartCreateParams, PartPatchParams } from './resources/tasks/parts';
export type { FluidGetParams, FluidCreateParams, FluidPatchParams } from './resources/tasks/fluids';

export type {
  ConsumableGetParams,
  ConsumableCreateParams,
  ConsumablePatchParams,
} from './resources/tasks/consumables';

/**
 * Client options for R2CClient
 */
export type ClientOptions = {
  /**
   * Bearer token for JWT authentication (static token)
   * Either provide bearerToken OR oauthCredentials, not both
   */
  bearerToken?: string;
  /**
   * OAuth credentials for automatic token management
   * Either provide bearerToken OR oauthCredentials, not both
   */
  oauthCredentials?: OAuthCredentials;
  /**
   * Override the default base URL for the API
   * @default 'https://www.r2clive.com/api/Jobsheet/2'
   */
  baseURL?: string;
  /**
   * Override the default fetch implementation
   */
  fetch?: Fetch;
};

/**
 * API Client for interfacing with the R2C Jobsheet API
 */
export class R2CClient extends APIClient {
  /**
   * Jobsheets resources for interacting with jobsheet endpoints
   */
  public readonly jobsheets: RESOURCES.Jobsheets = new RESOURCES.Jobsheets(this);

  /**
   * Tasks resources for interacting with task endpoints
   */
  public readonly tasks: RESOURCES.Tasks = new RESOURCES.Tasks(this);

  /**
   * Create a new instance of the R2C Jobsheet API client
   * @example
   * ```ts
   * // Option 1: Static bearer token
   * const client = new R2CClient({
   *   bearerToken: 'your-jwt-token',
   * });
   *
   * // Option 2: Auto-refresh with OAuth credentials
   * const client = new R2CClient({
   *   oauthCredentials: {
   *     username: 'user@example.com',
   *     password: 'password',
   *     siteId: 'site123',
   *     clientId: 'client_id',
   *     clientSecret: 'client_secret',
   *   },
   * });
   *
   * const jobsheet = await client.jobsheets.get({
   *   jobsheetId: '123',
   * });
   * ```
   */
  public constructor({ bearerToken, oauthCredentials, baseURL, fetch }: ClientOptions) {
    if (!bearerToken && !oauthCredentials)
      throw new R2CError('Either bearerToken or oauthCredentials is required');

    if (bearerToken && oauthCredentials)
      throw new R2CError(
        'Cannot provide both bearerToken and oauthCredentials. Choose one authentication method.'
      );

    super({
      baseURL: baseURL || 'https://www.r2clive.com/api/Jobsheet/2',
      bearerToken: bearerToken || null,
      oauthCredentials: oauthCredentials || null,
      fetch,
    });
  }
}
