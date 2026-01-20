import type { HevyClientConfig } from './client';
import { BaseHevyClient } from './client';
import { WorkoutsClient } from './resources/workouts';
import { RoutinesClient } from './resources/routines';
import { ExerciseTemplatesClient } from './resources/exerciseTemplates';
import { RoutineFoldersClient } from './resources/routineFolders';
import { ExerciseHistoryClient } from './resources/exerciseHistory';

export class Hevy extends BaseHevyClient {
  public workouts: WorkoutsClient;
  public routines: RoutinesClient;
  public exerciseTemplates: ExerciseTemplatesClient;
  public routineFolders: RoutineFoldersClient;
  public exerciseHistory: ExerciseHistoryClient;

  constructor(config: HevyClientConfig) {
    super(config);
    this.workouts = new WorkoutsClient(config);
    this.routines = new RoutinesClient(config);
    this.exerciseTemplates = new ExerciseTemplatesClient(config);
    this.routineFolders = new RoutineFoldersClient(config);
    this.exerciseHistory = new ExerciseHistoryClient(config);
  }
}

// Re-export types and errors for convenience
export * from './types';
export * from './errors';

// Default export for convenience
export default Hevy;
