import { BaseHevyClient, type HevyClientConfig } from '../client';
import type {
  PaginatedRoutineFolders,
  PaginationParams,
  PostRoutineFolderRequestBody,
  RoutineFolder,
} from '../types';
import { encodePathSegment } from '../utils/path';

export class RoutineFoldersClient extends BaseHevyClient {
  // biome-ignore lint/complexity/noUselessConstructor: Explicit constructor keeps Bun function coverage accurate for inherited clients.
  constructor(config: HevyClientConfig) {
    super(config);
  }

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

  async getById(folderId: string | number): Promise<RoutineFolder> {
    return this.request<RoutineFolder>({
      method: 'GET',
      url: `/v1/routine_folders/${encodePathSegment(folderId)}`,
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
