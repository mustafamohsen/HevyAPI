import { BaseHevyClient } from '../client';
import type {
  Workout,
  WorkoutSummary,
  PostWorkoutsRequestBody,
  PaginatedWorkouts,
  PaginatedWorkoutEvents,
  PaginationParams,
} from '../types';

export class WorkoutsClient extends BaseHevyClient {
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
      url: `/v1/workouts/${workoutId}`,
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
      url: `/v1/workouts/${workoutId}`,
      data: workout,
    });
  }
}
