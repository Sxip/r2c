import { TaskLabourUpdate } from '.';
import { RequestOptions } from '../../api';
import { APIResource } from '../../resource';
import { JobsheetResponse } from '../sheets';

export class Labour extends APIResource {
  /**
   * Updates an instance of Labour by the provided identifier using the values specified in the request body
   * @example
   * ```ts
   * const jobsheet = await client.tasks.labour.patch({
   *   jobsheetId: '123',
   *   taskId: '456',
   *   labourId: '789',
   *   quantity: 3.5,
   *   rate: 65.00,
   * });
   * ```
   */
  public patch(params: LabourPatchParams, options?: RequestOptions): Promise<JobsheetResponse> {
    const { jobsheetId, taskId, labourId, ...body } = params;
    return this.client.patch<JobsheetResponse>(
      `/Jobsheets/${jobsheetId}/Tasks/${taskId}/Labour/${labourId}`,
      body,
      options
    );
  }
}

export type LabourPatchParams = TaskLabourUpdate & {
  /**
   * Jobsheet Id
   */
  jobsheetId: string;
  /**
   * Task Id
   */
  taskId: string;
  /**
   * Labour Id
   */
  labourId: string;
};
