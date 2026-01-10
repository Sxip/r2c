import { TaskFluid, TaskFluidCreate, TaskFluidUpdate } from '.';
import { RequestOptions } from '../../api';
import { APIResource } from '../../resource';
import { JobsheetResponse } from '../sheets';

export class Fluids extends APIResource {
  /**
   * Gets an instance of a Fluid based on the provided identifier
   * @example
   * ```ts
   * const fluid = await client.tasks.fluids.get({
   *   jobsheetId: '123',
   *   taskId: '456',
   *   fluidId: '789',
   * });
   * ```
   */
  public get(params: FluidGetParams, options?: RequestOptions): Promise<TaskFluid> {
    const { jobsheetId, taskId, fluidId } = params;
    return this.client.get<TaskFluid>(
      `/Jobsheets/${jobsheetId}/Tasks/${taskId}/Fluids/${fluidId}`,
      options
    );
  }

  /**
   * Updates an instance of a Fluid by the provided identifier using the values specified in the request body
   * @example
   * ```ts
   * const jobsheet = await client.tasks.fluids.patch({
   *   jobsheetId: '123',
   *   taskId: '456',
   *   fluidId: '789',
   *   quantity: 5,
   * });
   * ```
   */
  public patch(params: FluidPatchParams, options?: RequestOptions): Promise<JobsheetResponse> {
    const { jobsheetId, taskId, fluidId, ...body } = params;
    return this.client.patch<JobsheetResponse>(
      `/Jobsheets/${jobsheetId}/Tasks/${taskId}/Fluids/${fluidId}`,
      body,
      options
    );
  }

  /**
   * Adds a Fluid to a Task
   * @example
   * ```ts
   * const jobsheet = await client.tasks.fluids.create({
   *   jobsheetId: '123',
   *   taskId: '456',
   *   description: 'Engine Oil 5W-30',
   *   quantity: 4.5,
   *   unitPrice: 12.00,
   *   vatRate: 0.20,
   * });
   * ```
   */
  public create(params: FluidCreateParams, options?: RequestOptions): Promise<JobsheetResponse> {
    const { jobsheetId, taskId, ...body } = params;
    return this.client.post<JobsheetResponse>(
      `/Jobsheets/${jobsheetId}/Tasks/${taskId}/Fluids`,
      body,
      options
    );
  }
}

export type FluidGetParams = {
  /**
   * Jobsheet Id
   */
  jobsheetId: string;
  /**
   * Task Id
   */
  taskId: string;
  /**
   * Fluid Id
   */
  fluidId: string;
};

export type FluidPatchParams = TaskFluidUpdate & {
  /**
   * Jobsheet Id
   */
  jobsheetId: string;
  /**
   * Task Id
   */
  taskId: string;
  /**
   * Fluid Id
   */
  fluidId: string;
};

export type FluidCreateParams = TaskFluidCreate & {
  /**
   * Jobsheet Id
   */
  jobsheetId: string;

  /**
   * Task Id
   */
  taskId: string;
};
