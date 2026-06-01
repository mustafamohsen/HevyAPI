import { BaseHevyClient, type HevyClientConfig } from '../client';
import type { ExerciseHistoryResponse } from '../types';
import { encodePathSegment } from '../utils/path';

export class ExerciseHistoryClient extends BaseHevyClient {
  // biome-ignore lint/complexity/noUselessConstructor: Explicit constructor keeps Bun function coverage accurate for inherited clients.
  constructor(config: HevyClientConfig) {
    super(config);
  }

  async getByExerciseTemplateId(
    exerciseTemplateId: string,
    params?: { start_date?: string; end_date?: string },
  ): Promise<ExerciseHistoryResponse> {
    return this.request<ExerciseHistoryResponse>({
      method: 'GET',
      url: `/v1/exercise_history/${encodePathSegment(exerciseTemplateId)}`,
      params: {
        start_date: params?.start_date,
        end_date: params?.end_date,
      },
    });
  }
}
