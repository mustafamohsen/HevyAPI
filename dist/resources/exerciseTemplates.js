"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseTemplatesClient = void 0;
const client_1 = require("../client");
class ExerciseTemplatesClient extends client_1.BaseHevyClient {
    async getAll(params) {
        return this.request({
            method: 'GET',
            url: '/v1/exercise_templates',
            params: {
                page: params?.page ?? 1,
                pageSize: params?.pageSize ?? 5,
            },
        });
    }
    async getById(exerciseTemplateId) {
        return this.request({
            method: 'GET',
            url: `/v1/exercise_templates/${exerciseTemplateId}`,
        });
    }
    async create(exercise) {
        return this.request({
            method: 'POST',
            url: '/v1/exercise_templates',
            data: exercise,
        });
    }
}
exports.ExerciseTemplatesClient = ExerciseTemplatesClient;
//# sourceMappingURL=exerciseTemplates.js.map