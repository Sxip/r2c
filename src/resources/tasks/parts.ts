import { TaskPart, TaskPartCreate, TaskPartUpdate } from '.';
import { RequestOptions } from '../../api';
import { APIResource } from '../../resource';
import { JobsheetResponse } from '../sheets';

export class Parts extends APIResource {
  /**
   * Gets an instance of a Part based on the provided identifier
   * @example
   * ```ts
   * const part = await client.tasks.parts.get({
   *   jobsheetId: '123',
   *   taskId: '456',
   *   partId: '789',
   * });
   * ```
   */
  public get(params: PartGetParams, options?: RequestOptions): Promise<TaskPart> {
    const { jobsheetId, taskId, partId } = params;
    return this.client.get<TaskPart>(
      `/Jobsheets/${jobsheetId}/Tasks/${taskId}/Parts/${partId}`,
      options
    );
  }

  /**
   * Updates an instance of a Part by the provided identifier using the values specified in the request body
   * @example
   * ```ts
   * const jobsheet = await client.tasks.parts.patch({
   *   jobsheetId: '123',
   *   taskId: '456',
   *   partId: '789',
   *   quantity: 4,
   * });
   * ```
   */
  public patch(params: PartPatchParams, options?: RequestOptions): Promise<JobsheetResponse> {
    const { jobsheetId, taskId, partId, ...body } = params;
    return this.client.patch<JobsheetResponse>(
      `/Jobsheets/${jobsheetId}/Tasks/${taskId}/Parts/${partId}`,
      body,
      options
    );
  }

  /**
   * Adds a Part to a Task
   * @example
   * ```ts
   * const jobsheet = await client.tasks.parts.create({
   *   jobsheetId: '123',
   *   taskId: '456',
   *   description: 'Brake Pads',
   *   quantity: 1,
   *   unitPrice: 45.00,
   *   vatRate: 0.20,
   * });
   * ```
   */
  public create(params: PartCreateParams, options?: RequestOptions): Promise<JobsheetResponse> {
    const { jobsheetId, taskId, ...body } = params;
    return this.client.post<JobsheetResponse>(
      `/Jobsheets/${jobsheetId}/Tasks/${taskId}/Parts`,
      body,
      options
    );
  }
}

export interface PartGetParams {
  /**
   * Jobsheet Id
   */
  jobsheetId: string;
  /**
   * Task Id
   */
  taskId: string;
  /**
   * Part Id
   */
  partId: string;
}

export type PartPatchParams = TaskPartUpdate & {
  /**
   * Jobsheet Id
   */
  jobsheetId: string;
  /**
   * Task Id
   */
  taskId: string;
  /**
   * Part Id
   */
  partId: string;
};

export type PartCreateParams = TaskPartCreate & {
  /**
   * Jobsheet Id
   */
  jobsheetId: string;
  /**
   * Task Id
   */
  taskId: string;
};
