"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutsClient = void 0;
const client_1 = require("../client");
class WorkoutsClient extends client_1.BaseHevyClient {
    async getAll(params) {
        return this.request({
            method: 'GET',
            url: '/v1/workouts',
            params: {
                page: params?.page ?? 1,
                pageSize: params?.pageSize ?? 5,
            },
        });
    }
    async getById(workoutId) {
        return this.request({
            method: 'GET',
            url: `/v1/workouts/${workoutId}`,
        });
    }
    async count() {
        return this.request({
            method: 'GET',
            url: '/v1/workouts/count',
        });
    }
    async getEvents(params) {
        return this.request({
            method: 'GET',
            url: '/v1/workouts/events',
            params: {
                page: params.page ?? 1,
                pageSize: params.pageSize ?? 5,
                since: params.since,
            },
        });
    }
    async create(workout) {
        return this.request({
            method: 'POST',
            url: '/v1/workouts',
            data: workout,
        });
    }
    async update(workoutId, workout) {
        return this.request({
            method: 'PUT',
            url: `/v1/workouts/${workoutId}`,
            data: workout,
        });
    }
}
exports.WorkoutsClient = WorkoutsClient;
//# sourceMappingURL=workouts.js.map