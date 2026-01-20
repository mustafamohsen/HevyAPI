import { BaseHevyClient } from '../client';
import type { RoutineFolder, PostRoutineFolderRequestBody, PaginatedRoutineFolders, PaginationParams } from '../types';
export declare class RoutineFoldersClient extends BaseHevyClient {
    getAll(params?: PaginationParams): Promise<PaginatedRoutineFolders>;
    getById(folderId: string): Promise<RoutineFolder>;
    create(folder: PostRoutineFolderRequestBody): Promise<RoutineFolder>;
}
//# sourceMappingURL=routineFolders.d.ts.map