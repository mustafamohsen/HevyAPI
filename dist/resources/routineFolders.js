"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineFoldersClient = void 0;
const client_1 = require("../client");
class RoutineFoldersClient extends client_1.BaseHevyClient {
    async getAll(params) {
        return this.request({
            method: 'GET',
            url: '/v1/routine_folders',
            params: {
                page: params?.page ?? 1,
                pageSize: params?.pageSize ?? 5,
            },
        });
    }
    async getById(folderId) {
        return this.request({
            method: 'GET',
            url: `/v1/routine_folders/${folderId}`,
        });
    }
    async create(folder) {
        return this.request({
            method: 'POST',
            url: '/v1/routine_folders',
            data: folder,
        });
    }
}
exports.RoutineFoldersClient = RoutineFoldersClient;
//# sourceMappingURL=routineFolders.js.map