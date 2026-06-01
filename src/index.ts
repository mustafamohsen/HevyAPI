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

export class Hevy extends BaseHevyClient {
  public workouts: WorkoutsClient;
  public routines: RoutinesClient;
  public exerciseTemplates: ExerciseTemplatesClient;
  public routineFolders: RoutineFoldersClient;
  public exerciseHistory: ExerciseHistoryClient;
  public user: UserClient;
  public bodyMeasurements: BodyMeasurementsClient;

  constructor(config: HevyClientConfig) {
    super(config);
    this.workouts = new WorkoutsClient(config);
    this.routines = new RoutinesClient(config);
    this.exerciseTemplates = new ExerciseTemplatesClient(config);
    this.routineFolders = new RoutineFoldersClient(config);
    this.exerciseHistory = new ExerciseHistoryClient(config);
    this.user = new UserClient(config);
    this.bodyMeasurements = new BodyMeasurementsClient(config);
  }
}

export * from './errors';
// Re-export types and errors for convenience
export * from './types';

// Default export for convenience
export default Hevy;
