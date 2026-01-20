import { BaseHevyClient } from '../client';
import type {
  RoutineFolder,
  PostRoutineFolderRequestBody,
  PaginatedRoutineFolders,
  PaginationParams,
} from '../types';

export class RoutineFoldersClient extends BaseHevyClient {
  async getAll(params?: PaginationParams): Promise<PaginatedRoutineFolders> {
    return this.request<PaginatedRoutineFolders>({
      method: 'GET',
      url: '/v1/routine_folders',
      params: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 5,
      },
    });
  }

  async getById(folderId: string): Promise<RoutineFolder> {
    return this.request<RoutineFolder>({
      method: 'GET',
      url: `/v1/routine_folders/${folderId}`,
    });
  }

  async create(folder: PostRoutineFolderRequestBody): Promise<RoutineFolder> {
    return this.request<RoutineFolder>({
      method: 'POST',
      url: '/v1/routine_folders',
      data: folder,
    });
  }
}
