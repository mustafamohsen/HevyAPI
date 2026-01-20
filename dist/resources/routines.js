"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutinesClient = void 0;
const client_1 = require("../client");
class RoutinesClient extends client_1.BaseHevyClient {
    async getAll(params) {
        return this.request({
            method: 'GET',
            url: '/v1/routines',
            params: {
                page: params?.page ?? 1,
                pageSize: params?.pageSize ?? 5,
            },
        });
    }
    async getById(routineId) {
        return this.request({
            method: 'GET',
            url: `/v1/routines/${routineId}`,
        });
    }
    async create(routine) {
        return this.request({
            method: 'POST',
            url: '/v1/routines',
            data: routine,
        });
    }
    async update(routineId, routine) {
        return this.request({
            method: 'PUT',
            url: `/v1/routines/${routineId}`,
            data: routine,
        });
    }
}
exports.RoutinesClient = RoutinesClient;
//# sourceMappingURL=routines.js.map