import { BaseHevyClient } from '../client';
import type {
  Routine,
  PostRoutinesRequestBody,
  PutRoutinesRequestBody,
  PaginatedRoutines,
  PaginationParams,
} from '../types';

export class RoutinesClient extends BaseHevyClient {
  async getAll(params?: PaginationParams): Promise<PaginatedRoutines> {
    return this.request<PaginatedRoutines>({
      method: 'GET',
      url: '/v1/routines',
      params: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 5,
      },
    });
  }

  async getById(routineId: string): Promise<{ routine: Routine }> {
    return this.request<{ routine: Routine }>({
      method: 'GET',
      url: `/v1/routines/${routineId}`,
    });
  }

  async create(routine: PostRoutinesRequestBody): Promise<Routine> {
    return this.request<Routine>({
      method: 'POST',
      url: '/v1/routines',
      data: routine,
    });
  }

  async update(routineId: string, routine: PutRoutinesRequestBody): Promise<Routine> {
    return this.request<Routine>({
      method: 'PUT',
      url: `/v1/routines/${routineId}`,
      data: routine,
    });
  }
}
