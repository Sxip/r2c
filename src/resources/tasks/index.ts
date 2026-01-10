import { RequestOptions } from '../../api';
import { APIResource } from '../../resource';
import { JobsheetResponse } from '../sheets';

import * as PartsAPI from './parts';
import * as LabourAPI from './labour';
import * as FluidsAPI from './fluids';
import * as ConsumablesAPI from './consumables';

/**
 * Tasks resource for interacting with task endpoints
 */
export class Tasks extends APIResource {
  public parts: PartsAPI.Parts = new PartsAPI.Parts(this.client);
  public labour: LabourAPI.Labour = new LabourAPI.Labour(this.client);
  public fluids: FluidsAPI.Fluids = new FluidsAPI.Fluids(this.client);
  public consumables: ConsumablesAPI.Consumables = new ConsumablesAPI.Consumables(this.client);

  /**
   * Gets an instance of Task based on the provided identifiers
   * @example
   * ```ts
   * const task = await client.tasks.get({
   *   taskId: '456',
   * });
   * ```
   */
  public get(params: TaskGetParams, options?: RequestOptions): Promise<TaskResponse> {
    const { taskId } = params;
    return this.client.get<TaskResponse>(`/Task/${taskId}`, options);
  }

  /**
   * Patches changes to a jobsheet task only patches data that is provided
   * @example
   * ```ts
   * const result = await client.tasks.patch({
   *   jobsheetId: '123',
   *   taskId: '456',
   *   actualCompletionHours: 2.5,
   * });
   * ```
   */
  public patch(params: TaskPatchParams, options?: RequestOptions): Promise<void> {
    const { jobsheetId, taskId, ...body } = params;
    return this.client.patch<void>(`/Jobsheets/${jobsheetId}/Tasks/${taskId}`, body, options);
  }

  /**
   * Adds a non digital workline to the Jobsheet as a Task
   * Only one instance of Inspection, Service, MOT or Repair can be populated at a time
   * @example
   * ```ts
   * const jobsheet = await client.tasks.create({
   *   jobsheetId: '123',
   *   reasonForWork: 'Annual Service',
   *   service: {
   *     description: 'Full service'
   *   },
   *   labour: {
   *     description: 'Service labour',
   *     quantity: 2,
   *     vatRate: 0.20
   *   }
   * });
   * ```
   */
  public create(params: TaskCreateParams, options?: RequestOptions): Promise<JobsheetResponse> {
    const { jobsheetId, ...body } = params;
    return this.client.post<JobsheetResponse>(`/Jobsheets/${jobsheetId}/Tasks`, body, options);
  }
}

/**
 * Parameters for retrieving a task
 */
export type TaskGetParams = {
  taskId: string;
};

/**
 * Parameters for creating a task
 */
export type TaskCreateParams = {
  jobsheetId: string;
  reasonForWork: string;
  actualCompletionHours?: number | null;
  standardTime?: number | null;
  inspection?: TaskInspectionCreate | null;
  service?: TaskServiceCreate | null;
  mot?: TaskMotCreate | null;
  repair?: TaskRepairCreate | null;
  labour?: TaskLabourCreate | null;
};

/**
 * Parameters for updating a task
 */
export type TaskPatchParams = {
  jobsheetId: string;
  taskId: string;
  actualCompletionHours?: number | null;
  standardTime?: number | null;
};

/**
 * Task details returned from the API
 */
export type TaskResponse = {
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
 * Inspection details for creating
 */
export type TaskInspectionCreate = {
  description?: string | null;
};

/**
 * Service details for creating
 */
export type TaskServiceCreate = {
  description?: string | null;
};

/**
 * Repair details for creating
 */
export type TaskRepairCreate = {
  description?: string | null;
};

/**
 * MOT details for creating
 */
export type TaskMotCreate = {
  description?: string | null;
};

/**
 * Labour details for creating
 */
export type TaskLabourCreate = {
  code?: string | null;
  description: string;
  quantity: number;
  rate?: number | null;
  vatRate: number;
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
 * Updates for labour line item
 */
export type TaskLabourUpdate = {
  quantity?: number | null;
  rate?: number | null;
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
 * Updates for part line item
 */
export type TaskPartUpdate = {
  quantity: number;
};

/**
 * Part details for creating
 */
export type TaskPartCreate = {
  code?: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
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
 * Updates for fluid line item
 */
export type TaskFluidUpdate = {
  quantity: number;
};

/**
 * Fluid details for creating
 */
export type TaskFluidCreate = {
  code?: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
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

/**
 * Updates for consumable line item
 */
export type TaskConsumableUpdate = {
  quantity: number;
};

/**
 * Consumable details for creating
 */
export type TaskConsumableCreate = {
  code?: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
};
