import { BaseHevyClient } from '../client';
import type { ExerciseHistoryResponse } from '../types';

export class ExerciseHistoryClient extends BaseHevyClient {
  async getByExerciseTemplateId(
    exerciseTemplateId: string,
    params?: { start_date?: string; end_date?: string },
  ): Promise<ExerciseHistoryResponse> {
    return this.request<ExerciseHistoryResponse>({
      method: 'GET',
      url: `/v1/exercise_history/${exerciseTemplateId}`,
      params: {
        start_date: params?.start_date,
        end_date: params?.end_date,
      },
    });
  }
}
