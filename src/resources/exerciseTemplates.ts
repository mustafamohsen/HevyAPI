import { BaseHevyClient } from '../client';
import type {
  ExerciseTemplate,
  CreateCustomExerciseRequestBody,
  PaginatedExerciseTemplates,
  PaginationParams,
} from '../types';

export class ExerciseTemplatesClient extends BaseHevyClient {
  async getAll(params?: PaginationParams): Promise<PaginatedExerciseTemplates> {
    return this.request<PaginatedExerciseTemplates>({
      method: 'GET',
      url: '/v1/exercise_templates',
      params: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 5,
      },
    });
  }

  async getById(exerciseTemplateId: string): Promise<ExerciseTemplate> {
    return this.request<ExerciseTemplate>({
      method: 'GET',
      url: `/v1/exercise_templates/${exerciseTemplateId}`,
    });
  }

  async create(exercise: CreateCustomExerciseRequestBody): Promise<{ id: number }> {
    return this.request<{ id: number }>({
      method: 'POST',
      url: '/v1/exercise_templates',
      data: exercise,
    });
  }
}
