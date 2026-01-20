"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseHistoryClient = void 0;
const client_1 = require("../client");
class ExerciseHistoryClient extends client_1.BaseHevyClient {
    async getByExerciseTemplateId(exerciseTemplateId, params) {
        return this.request({
            method: 'GET',
            url: `/v1/exercise_history/${exerciseTemplateId}`,
            params: {
                start_date: params?.start_date,
                end_date: params?.end_date,
            },
        });
    }
}
exports.ExerciseHistoryClient = ExerciseHistoryClient;
//# sourceMappingURL=exerciseHistory.js.map