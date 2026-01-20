import { BaseHevyClient } from '../client';
import type { Routine, PostRoutinesRequestBody, PutRoutinesRequestBody, PaginatedRoutines, PaginationParams } from '../types';
export declare class RoutinesClient extends BaseHevyClient {
    getAll(params?: PaginationParams): Promise<PaginatedRoutines>;
    getById(routineId: string): Promise<{
        routine: Routine;
    }>;
    create(routine: PostRoutinesRequestBody): Promise<Routine>;
    update(routineId: string, routine: PutRoutinesRequestBody): Promise<Routine>;
}
//# sourceMappingURL=routines.d.ts.map