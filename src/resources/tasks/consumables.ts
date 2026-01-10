import { RequestOptions } from '../../api';
import { APIResource } from '../../resource';
import { TaskConsumable, TaskConsumableUpdate, TaskConsumableCreate } from '.';
import { JobsheetResponse } from '../sheets';

export class Consumables extends APIResource {
  /**
   * Gets an instance of a Consumable based on the provided identifier
   * @example
   * ```ts
   * const consumable = await client.tasks.consumables.get({
   *   jobsheetId: '123',
   *   taskId: '456',
   *   consumableId: '789',
   * });
   * ```
   */
  get(params: ConsumableGetParams, options?: RequestOptions): Promise<TaskConsumable> {
    const { jobsheetId, taskId, consumableId } = params;
    return this.client.get<TaskConsumable>(
      `/Jobsheets/${jobsheetId}/Tasks/${taskId}/Consumables/${consumableId}`,
      options
    );
  }

  /**
   * Updates an instance of a Consumable by the provided identifier using the values specified in the request body
   * @example
   * ```ts
   * const jobsheet = await client.tasks.consumables.patch({
   *   jobsheetId: '123',
   *   taskId: '456',
   *   consumableId: '789',
   *   quantity: 3,
   * });
   * ```
   */
  patch(params: ConsumablePatchParams, options?: RequestOptions): Promise<JobsheetResponse> {
    const { jobsheetId, taskId, consumableId, ...body } = params;
    return this.client.patch<JobsheetResponse>(
      `/Jobsheets/${jobsheetId}/Tasks/${taskId}/Consumables/${consumableId}`,
      body,
      options
    );
  }

  /**
   * Adds a Consumable to a Task
   *
   * @example
   * ```ts
   * const jobsheet = await client.tasks.consumables.create({
   *   jobsheetId: '123',
   *   taskId: '456',
   *   description: 'Shop Towels',
   *   quantity: 1,
   *   unitPrice: 5.00,
   *   vatRate: 0.20,
   * });
   * ```
   */
  create(params: ConsumableCreateParams, options?: RequestOptions): Promise<JobsheetResponse> {
    const { jobsheetId, taskId, ...body } = params;
    return this.client.post<JobsheetResponse>(
      `/Jobsheets/${jobsheetId}/Tasks/${taskId}/Consumables`,
      body,
      options
    );
  }
}

export type ConsumableGetParams = {
  /**
   * Jobsheet Id
   */
  jobsheetId: string;
  /**
   * Task Id
   */
  taskId: string;
  /**
   * Consumable Id
   */
  consumableId: string;
};

export type ConsumablePatchParams = TaskConsumableUpdate & {
  /**
   * Jobsheet Id
   */
  jobsheetId: string;
  /**
   * Task Id
   */
  taskId: string;
  /**
   * Consumable Id
   */
  consumableId: string;
};

export type ConsumableCreateParams = TaskConsumableCreate & {
  /**
   * Jobsheet Id
   */
  jobsheetId: string;
  /**
   * Task Id
   */
  taskId: string;
};
