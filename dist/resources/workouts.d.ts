import { BaseHevyClient } from '../client';
import type { Workout, WorkoutSummary, PostWorkoutsRequestBody, PaginatedWorkouts, PaginatedWorkoutEvents, PaginationParams } from '../types';
export declare class WorkoutsClient extends BaseHevyClient {
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