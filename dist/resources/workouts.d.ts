import { BaseHevyClient, type HevyClientConfig } from '../client';
import type { PaginatedWorkoutEvents, PaginatedWorkouts, PaginationParams, PostWorkoutsRequestBody, Workout, WorkoutSummary } from '../types';
export declare class WorkoutsClient extends BaseHevyClient {
    constructor(config: HevyClientConfig);
    getAll(params?: PaginationParams): Promise<PaginatedWorkouts>;
    getById(workoutId: string): Promise<Workout>;
    count(): Promise<WorkoutSummary>;
    getEvents(params: PaginationParams & {
        since?: string;
    }): Promise<PaginatedWorkoutEvents>;
    create(workout: PostWorkoutsRequestBody): Promise<Workout>;
    update(workoutId: string, workout: PostWorkoutsRequestBody): Promise<Workout>;
}
//# sourceMappingURL=workouts.d.ts.map