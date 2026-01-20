"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hevy = void 0;
const client_1 = require("./client");
const workouts_1 = require("./resources/workouts");
const routines_1 = require("./resources/routines");
const exerciseTemplates_1 = require("./resources/exerciseTemplates");
const routineFolders_1 = require("./resources/routineFolders");
const exerciseHistory_1 = require("./resources/exerciseHistory");
class Hevy extends client_1.BaseHevyClient {
    constructor(config) {
        super(config);
        this.workouts = new workouts_1.WorkoutsClient(config);
        this.routines = new routines_1.RoutinesClient(config);
        this.exerciseTemplates = new exerciseTemplates_1.ExerciseTemplatesClient(config);
        this.routineFolders = new routineFolders_1.RoutineFoldersClient(config);
        this.exerciseHistory = new exerciseHistory_1.ExerciseHistoryClient(config);
    }
}
exports.Hevy = Hevy;
// Re-export types and errors for convenience
__exportStar(require("./types"), exports);
__exportStar(require("./errors"), exports);
// Default export for convenience
exports.default = Hevy;
//# sourceMappingURL=index.js.map