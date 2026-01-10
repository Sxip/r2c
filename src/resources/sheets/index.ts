import { PaginatedResult, RequestOptions } from '../../api';
import { APIResource } from '../../resource';

/**
 * Jobsheets resource for interacting with jobsheet endpoints
 */
export class Jobsheets extends APIResource {
  /**
   * Gets an instance of Jobsheet based on the provided identifier
   * @example
   * ```ts
   * const jobsheet = await client.jobsheets.get({
   *   jobsheetId: '123',
   * });
   * ```
   */
  public get(params: JobsheetGetParams, options?: RequestOptions): Promise<JobsheetResponse> {
    const { jobsheetId } = params;
    return this.client.get<JobsheetResponse>(`/Jobsheets/${jobsheetId}`, options);
  }

  /**
   * Updates the Jobsheet by the provided identifier using the values specified in the request body
   * @example
   * ```ts
   * const jobsheet = await client.jobsheets.patch({
   *   jobsheetId: '123',
   *   status: 'InProgress',
   * });
   * ```
   */
  public patch(params: JobsheetPatchParams, options?: RequestOptions): Promise<void> {
    const { jobsheetId, ...body } = params;
    return this.client.patch<void>(`/Jobsheets/${jobsheetId}`, body, options);
  }

  /**
   * Gets a paginated list of Jobsheet IDs matching the specified criteria
   * @example
   * ```ts
   * const results = await client.jobsheets.search({
   *   reference: 'REF123',
   *   page: 1,
   * });
   * ```
   */
  public search(
    params?: JobsheetSearchParams,
    options?: Omit<RequestInit, 'method'>
  ): Promise<PaginatedResult<string>> {
    return this.client.getWithQuery<PaginatedResult<string>>('/Jobsheets/Search', params, options);
  }

  /**
   * Gets a paginated list of Jobsheets matching the specified criteria
   * @example
   * ```ts
   * const results = await client.jobsheets.searchExtended({
   *   reference: 'REF123',
   *   page: 1,
   * });
   * ```
   */
  public searchExtended(
    params?: JobsheetSearchParams,
    options?: Omit<RequestInit, 'method'>
  ): Promise<PaginatedResult<JobsheetResponse>> {
    return this.client.getWithQuery<PaginatedResult<JobsheetResponse>>(
      '/Jobsheets/Search/Extended',
      params,
      options
    );
  }

  /**
   * Gets a list of Jobsheets that have been updated since a specified DateTime
   * @example
   * ```ts
   * const results = await client.jobsheets.updated({
   *   dateTimeFrom: '2024-01-01T00:00:00Z',
   *   page: 1,
   * });
   * ```
   */
  public updated(
    params: JobsheetUpdatedParams,
    options?: Omit<RequestInit, 'method'>
  ): Promise<PaginatedResult<JobsheetResponse>> {
    return this.client.getWithQuery<PaginatedResult<JobsheetResponse>>(
      '/Jobsheets/Updated',
      params,
      options
    );
  }
}

/**
 * Parameters for retrieving a jobsheet
 */
export type JobsheetGetParams = {
  jobsheetId: string;
};

/**
 * Parameters for patching a jobsheet
 */
export type JobsheetPatchParams = JobsheetUpdate & {
  jobsheetId: string;
};

/**
 * Parameters for searching jobsheets
 */
export type JobsheetSearchParams = {
  reference?: string | null;
  registration?: string | null;
  status?: string | null;
  page?: number;
  pageSize?: number;
};

/**
 * Parameters for getting updated jobsheets
 */
export type JobsheetUpdatedParams = {
  dateTimeFrom: string;
  page?: number;
  pageSize?: number;
};

/**
 * Updates for jobsheet properties
 */
export type JobsheetUpdate = {
  bookedInDateTime?: string | null;
  requiredByDateTime?: string | null;
  purchaseOrderReference?: string | null;
  status?: string | null;
  repairerId?: number | null;
  mobileJob?: MobileJob | null;
  asset?: AssetUpdate | null;
};

/**
 * Updates for asset properties
 */
export type AssetUpdate = {
  usage?: number | null;
  usageUnit?: string | null;
};

/**
 * Jobsheet details returned from the API
 */
export type JobsheetResponse = {
  id?: string | null;
  reference?: string | null;
  status?: string | null;
  bookedInDateTime: string;
  requiredByDateTime?: string | null;
  repairer?: Organisation | null;
  mobileJob?: MobileJob | null;
  asset?: Asset | null;
  pricing?: Pricing[] | null;
  tasks?: Task[] | null;
  flags?: string[] | null;
};

/**
 * Asset information for a jobsheet
 */
export type Asset = {
  registration?: string | null;
  fleetIdentifier?: string | null;
  usage?: number | null;
  usageUnit?: string | null;
};

/**
 * Mobile job configuration
 */
export type MobileJob = {
  active: boolean;
  location?: string | null;
};

/**
 * Organisation details
 */
export type Organisation = {
  id?: string | null;
  name?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  town?: string | null;
  postCode?: string | null;
};

/**
 * Pricing information for a jobsheet
 */
export type Pricing = {
  type?: string | null;
  status?: string | null;
  purchaseOrderReference?: string | null;
};

/**
 * Task details including work performed and costs
 */
export type Task = {
  id?: string | null;
  status?: string | null;
  reasonForWork?: string | null;
  standardTime?: number | null;
  actualCompletionHours?: number | null;
  inspection?: TaskInspection | null;
  service?: TaskService | null;
  repair?: TaskRepair | null;
  mot?: TaskMot | null;
  labour?: TaskLabour[] | null;
  parts?: TaskPart[] | null;
  fluids?: TaskFluid[] | null;
  consumables?: TaskConsumable[] | null;
};

/**
 * Inspection task details
 */
export type TaskInspection = {
  description?: string | null;
};

/**
 * Service task details
 */
export type TaskService = {
  description?: string | null;
};

/**
 * Repair task details
 */
export type TaskRepair = {
  description?: string | null;
};

/**
 * MOT task details
 */
export type TaskMot = {
  description?: string | null;
};

/**
 * Labour line item
 */
export type TaskLabour = {
  id?: string | null;
  code?: string | null;
  description?: string | null;
  rate?: number | null;
  quantity?: number | null;
  vatRate?: number | null;
};

/**
 * Part line item
 */
export type TaskPart = {
  id?: string | null;
  code?: string | null;
  description?: string | null;
  unitPrice: number;
  quantity: number;
  vatRate: number;
};

/**
 * Fluid line item
 */
export type TaskFluid = {
  id?: string | null;
  code?: string | null;
  description?: string | null;
  unitPrice: number;
  quantity: number;
  vatRate: number;
};

/**
 * Consumable line item
 */
export type TaskConsumable = {
  id?: string | null;
  code?: string | null;
  description?: string | null;
  unitPrice: number;
  quantity: number;
  vatRate: number;
};
