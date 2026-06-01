import { BaseHevyClient, type HevyClientConfig } from '../client';
import type { ExerciseHistoryResponse } from '../types';
export declare class ExerciseHistoryClient extends BaseHevyClient {
    constructor(config: HevyClientConfig);
    getByExerciseTemplateId(exerciseTemplateId: string, params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<ExerciseHistoryResponse>;
}
//# sourceMappingURL=exerciseHistory.d.ts.map