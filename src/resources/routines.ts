import { BaseHevyClient } from '../client';
import type {
  PaginatedRoutines,
  PaginationParams,
  PostRoutinesRequestBody,
  PutRoutinesRequestBody,
  Routine,
} from '../types';
import { encodePathSegment } from '../utils/path';

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
      url: `/v1/routines/${encodePathSegment(routineId)}`,
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
      url: `/v1/routines/${encodePathSegment(routineId)}`,
      data: routine,
    });
  }
}
