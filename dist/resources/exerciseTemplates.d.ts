import { BaseHevyClient } from '../client';
import type { ExerciseTemplate, CreateCustomExerciseRequestBody, PaginatedExerciseTemplates, PaginationParams } from '../types';
export declare class ExerciseTemplatesClient extends BaseHevyClient {
    getAll(params?: PaginationParams): Promise<PaginatedExerciseTemplates>;
    getById(exerciseTemplateId: string): Promise<ExerciseTemplate>;
    create(exercise: CreateCustomExerciseRequestBody): Promise<{
        id: number;
    }>;
}
//# sourceMappingURL=exerciseTemplates.d.ts.map