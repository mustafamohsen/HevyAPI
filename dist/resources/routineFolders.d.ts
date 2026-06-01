import { BaseHevyClient } from '../client';
import type { PaginatedRoutineFolders, PaginationParams, PostRoutineFolderRequestBody, RoutineFolder } from '../types';
export declare class RoutineFoldersClient extends BaseHevyClient {
    getAll(params?: PaginationParams): Promise<PaginatedRoutineFolders>;
    getById(folderId: string | number): Promise<RoutineFolder>;
    create(folder: PostRoutineFolderRequestBody): Promise<RoutineFolder>;
}
//# sourceMappingURL=routineFolders.d.ts.map