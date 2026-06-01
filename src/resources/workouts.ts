import { BaseHevyClient, type HevyClientConfig } from '../client';
import type {
  PaginatedWorkoutEvents,
  PaginatedWorkouts,
  PaginationParams,
  PostWorkoutsRequestBody,
  Workout,
  WorkoutSummary,
} from '../types';
import { encodePathSegment } from '../utils/path';

export class WorkoutsClient extends BaseHevyClient {
  // biome-ignore lint/complexity/noUselessConstructor: Explicit constructor keeps Bun function coverage accurate for inherited clients.
  constructor(config: HevyClientConfig) {
    super(config);
  }

  async getAll(params?: PaginationParams): Promise<PaginatedWorkouts> {
    return this.request<PaginatedWorkouts>({
      method: 'GET',
      url: '/v1/workouts',
      params: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 5,
      },
    });
  }

  async getById(workoutId: string): Promise<Workout> {
    return this.request<Workout>({
      method: 'GET',
      url: `/v1/workouts/${encodePathSegment(workoutId)}`,
    });
  }

  async count(): Promise<WorkoutSummary> {
    return this.request<WorkoutSummary>({
      method: 'GET',
      url: '/v1/workouts/count',
    });
  }

  async getEvents(params: PaginationParams & { since?: string }): Promise<PaginatedWorkoutEvents> {
    return this.request<PaginatedWorkoutEvents>({
      method: 'GET',
      url: '/v1/workouts/events',
      params: {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 5,
        since: params.since,
      },
    });
  }

  async create(workout: PostWorkoutsRequestBody): Promise<Workout> {
    return this.request<Workout>({
      method: 'POST',
      url: '/v1/workouts',
      data: workout,
    });
  }

  async update(workoutId: string, workout: PostWorkoutsRequestBody): Promise<Workout> {
    return this.request<Workout>({
      method: 'PUT',
      url: `/v1/workouts/${encodePathSegment(workoutId)}`,
      data: workout,
    });
  }
}
