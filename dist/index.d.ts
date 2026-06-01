import type { HevyClientConfig } from './client';
import { BaseHevyClient } from './client';
export type { HevyClientConfig } from './client';
import { BodyMeasurementsClient } from './resources/bodyMeasurements';
import { ExerciseHistoryClient } from './resources/exerciseHistory';
import { ExerciseTemplatesClient } from './resources/exerciseTemplates';
import { RoutineFoldersClient } from './resources/routineFolders';
import { RoutinesClient } from './resources/routines';
import { UserClient } from './resources/user';
import { WorkoutsClient } from './resources/workouts';
export declare class Hevy extends BaseHevyClient {
    workouts: WorkoutsClient;
    routines: RoutinesClient;
    exerciseTemplates: ExerciseTemplatesClient;
    routineFolders: RoutineFoldersClient;
    exerciseHistory: ExerciseHistoryClient;
    user: UserClient;
    bodyMeasurements: BodyMeasurementsClient;
    constructor(config: HevyClientConfig);
}
export * from './errors';
export * from './types';
export default Hevy;
//# sourceMappingURL=index.d.ts.map