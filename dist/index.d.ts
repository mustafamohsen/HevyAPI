import type { HevyClientConfig } from './client';
import { BaseHevyClient } from './client';
import { WorkoutsClient } from './resources/workouts';
import { RoutinesClient } from './resources/routines';
import { ExerciseTemplatesClient } from './resources/exerciseTemplates';
import { RoutineFoldersClient } from './resources/routineFolders';
import { ExerciseHistoryClient } from './resources/exerciseHistory';
export declare class Hevy extends BaseHevyClient {
    workouts: WorkoutsClient;
    routines: RoutinesClient;
    exerciseTemplates: ExerciseTemplatesClient;
    routineFolders: RoutineFoldersClient;
    exerciseHistory: ExerciseHistoryClient;
    constructor(config: HevyClientConfig);
}
export * from './types';
export * from './errors';
export default Hevy;
//# sourceMappingURL=index.d.ts.map