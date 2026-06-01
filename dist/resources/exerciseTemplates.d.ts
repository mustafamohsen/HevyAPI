import { BaseHevyClient, type HevyClientConfig } from '../client';
import type { CreateCustomExerciseRequestBody, ExerciseTemplate, PaginatedExerciseTemplates, PaginationParams } from '../types';
export declare class ExerciseTemplatesClient extends BaseHevyClient {
    constructor(config: HevyClientConfig);
    getAll(params?: PaginationParams): Promise<PaginatedExerciseTemplates>;
    getById(exerciseTemplateId: string): Promise<ExerciseTemplate>;
    create(exercise: CreateCustomExerciseRequestBody): Promise<{
        id: number;
    }>;
}
//# sourceMappingURL=exerciseTemplates.d.ts.map