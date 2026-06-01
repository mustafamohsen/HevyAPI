var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// src/index.ts
var exports_src = {};
__export(exports_src, {
  default: () => src_default,
  ValidationError: () => ValidationError,
  RateLimitError: () => RateLimitError,
  NotFoundError: () => NotFoundError,
  NetworkError: () => NetworkError,
  HevyAPIError: () => HevyAPIError,
  Hevy: () => Hevy,
  ForbiddenError: () => ForbiddenError,
  AuthenticationError: () => AuthenticationError
});
module.exports = __toCommonJS(exports_src);

// src/client/index.ts
var import_axios = __toESM(require("axios"));

// src/errors/index.ts
class HevyAPIError extends Error {
  statusCode;
  response;
  constructor(message, statusCode, response) {
    super(message);
    this.statusCode = statusCode;
    this.response = response;
    this.name = "HevyAPIError";
  }
}

class AuthenticationError extends HevyAPIError {
  constructor(message = "Authentication failed. Please verify your API key.") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

class ValidationError extends HevyAPIError {
  fieldErrors;
  constructor(message = "Validation failed", fieldErrors) {
    super(message, 400);
    this.fieldErrors = fieldErrors;
    this.name = "ValidationError";
  }
}

class NotFoundError extends HevyAPIError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

class RateLimitError extends HevyAPIError {
  retryAfter;
  constructor(retryAfter = 5000) {
    super(`Rate limit exceeded. Please retry after ${retryAfter}ms`, 429);
    this.retryAfter = retryAfter;
    this.name = "RateLimitError";
  }
}

class ForbiddenError extends HevyAPIError {
  constructor(message = "Access forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

class NetworkError extends Error {
  originalError;
  constructor(message, originalError) {
    super(message);
    this.originalError = originalError;
    this.name = "NetworkError";
  }
}

// src/client/index.ts
class BaseHevyClient {
  client;
  apiKey;
  constructor(config) {
    this.apiKey = config.apiKey;
    this.client = import_axios.default.create({
      baseURL: config.baseURL || "https://api.hevyapp.com",
      timeout: config.timeout || 30000,
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }
  setupRequestInterceptor() {
    this.client.interceptors.request.use((config) => {
      config.headers.set("api-key", this.apiKey);
      return config;
    }, (error) => {
      return Promise.reject(new NetworkError("Failed to make request", error));
    });
  }
  setupResponseInterceptor() {
    this.client.interceptors.response.use((response) => response, (error) => {
      this.handleError(error);
    });
  }
  handleError(error) {
    if (!error.response) {
      const isTimeout = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
      throw new NetworkError(isTimeout ? "Request timed out" : "Network error occurred", error);
    }
    const status = error.response.status;
    const responseData = error.response.data;
    switch (status) {
      case 400: {
        const fieldErrors = this.extractFieldErrors(responseData);
        throw new ValidationError("Validation failed", fieldErrors);
      }
      case 401:
      case 403:
        throw new AuthenticationError("Authentication failed. Please verify your API key.");
      case 404:
        throw new NotFoundError("Resource not found");
      case 429: {
        const retryAfter = this.parseRetryAfter(error.response.headers["retry-after"]);
        throw new RateLimitError(retryAfter);
      }
      default:
        throw new HevyAPIError(`HTTP error ${status}`, status, responseData);
    }
  }
  parseRetryAfter(header) {
    if (!header)
      return 5000;
    const seconds = parseInt(header, 10);
    return Number.isNaN(seconds) ? 5000 : seconds * 1000;
  }
  extractFieldErrors(responseData) {
    if (responseData && typeof responseData === "object" && responseData.errors) {
      const errors = responseData.errors;
      if (typeof errors === "object" && errors !== null) {
        return Object.entries(errors).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {});
      }
    }
    return;
  }
  async request(options) {
    try {
      const response = await this.client.request(options);
      return response.data;
    } catch (error) {
      if (error instanceof HevyAPIError || error instanceof NetworkError) {
        throw error;
      }
      throw new NetworkError("Unknown error occurred", error);
    }
  }
}

// src/resources/exerciseHistory.ts
class ExerciseHistoryClient extends BaseHevyClient {
  async getByExerciseTemplateId(exerciseTemplateId, params) {
    return this.request({
      method: "GET",
      url: `/v1/exercise_history/${exerciseTemplateId}`,
      params: {
        start_date: params?.start_date,
        end_date: params?.end_date
      }
    });
  }
}

// src/resources/exerciseTemplates.ts
class ExerciseTemplatesClient extends BaseHevyClient {
  async getAll(params) {
    return this.request({
      method: "GET",
      url: "/v1/exercise_templates",
      params: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 5
      }
    });
  }
  async getById(exerciseTemplateId) {
    return this.request({
      method: "GET",
      url: `/v1/exercise_templates/${exerciseTemplateId}`
    });
  }
  async create(exercise) {
    return this.request({
      method: "POST",
      url: "/v1/exercise_templates",
      data: exercise
    });
  }
}

// src/resources/routineFolders.ts
class RoutineFoldersClient extends BaseHevyClient {
  async getAll(params) {
    return this.request({
      method: "GET",
      url: "/v1/routine_folders",
      params: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 5
      }
    });
  }
  async getById(folderId) {
    return this.request({
      method: "GET",
      url: `/v1/routine_folders/${folderId}`
    });
  }
  async create(folder) {
    return this.request({
      method: "POST",
      url: "/v1/routine_folders",
      data: folder
    });
  }
}

// src/resources/routines.ts
class RoutinesClient extends BaseHevyClient {
  async getAll(params) {
    return this.request({
      method: "GET",
      url: "/v1/routines",
      params: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 5
      }
    });
  }
  async getById(routineId) {
    return this.request({
      method: "GET",
      url: `/v1/routines/${routineId}`
    });
  }
  async create(routine) {
    return this.request({
      method: "POST",
      url: "/v1/routines",
      data: routine
    });
  }
  async update(routineId, routine) {
    return this.request({
      method: "PUT",
      url: `/v1/routines/${routineId}`,
      data: routine
    });
  }
}

// src/resources/workouts.ts
class WorkoutsClient extends BaseHevyClient {
  async getAll(params) {
    return this.request({
      method: "GET",
      url: "/v1/workouts",
      params: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 5
      }
    });
  }
  async getById(workoutId) {
    return this.request({
      method: "GET",
      url: `/v1/workouts/${workoutId}`
    });
  }
  async count() {
    return this.request({
      method: "GET",
      url: "/v1/workouts/count"
    });
  }
  async getEvents(params) {
    return this.request({
      method: "GET",
      url: "/v1/workouts/events",
      params: {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 5,
        since: params.since
      }
    });
  }
  async create(workout) {
    return this.request({
      method: "POST",
      url: "/v1/workouts",
      data: workout
    });
  }
  async update(workoutId, workout) {
    return this.request({
      method: "PUT",
      url: `/v1/workouts/${workoutId}`,
      data: workout
    });
  }
}

// src/index.ts
class Hevy extends BaseHevyClient {
  workouts;
  routines;
  exerciseTemplates;
  routineFolders;
  exerciseHistory;
  constructor(config) {
    super(config);
    this.workouts = new WorkoutsClient(config);
    this.routines = new RoutinesClient(config);
    this.exerciseTemplates = new ExerciseTemplatesClient(config);
    this.routineFolders = new RoutineFoldersClient(config);
    this.exerciseHistory = new ExerciseHistoryClient(config);
  }
}
var src_default = Hevy;

//# debugId=F28272532E66277164756E2164756E21
