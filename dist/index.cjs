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
  ConfigurationError: () => ConfigurationError,
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
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      response: this.response
    };
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

class ConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConfigurationError";
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message
    };
  }
}

class NetworkError extends Error {
  originalError;
  constructor(message, originalError) {
    super(message);
    this.originalError = originalError;
    this.name = "NetworkError";
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      originalError: this.originalError
    };
  }
}

// src/utils/redaction.ts
var REDACTED_VALUE = "[REDACTED]";
var SENSITIVE_KEYS = new Set([
  "api-key",
  "apikey",
  "authorization",
  "x-api-key",
  "token",
  "access_token",
  "refresh_token",
  "password",
  "secret"
]);
var MAX_REDACTION_DEPTH = 8;
var isSensitiveKey = (key) => SENSITIVE_KEYS.has(key.toLowerCase());
var redactString = (value, secrets) => {
  let redacted = value;
  for (const secret of secrets) {
    if (secret.length > 0) {
      redacted = redacted.split(secret).join(REDACTED_VALUE);
    }
  }
  return redacted;
};
var redactSensitiveData = (value, options = {}) => {
  const secrets = options.secrets ?? [];
  const seen = new WeakSet;
  const redact = (currentValue, depth) => {
    if (typeof currentValue === "string") {
      return redactString(currentValue, secrets);
    }
    if (currentValue === null || typeof currentValue === "number" || typeof currentValue === "boolean" || typeof currentValue === "undefined") {
      return currentValue;
    }
    if (typeof currentValue !== "object") {
      return String(currentValue);
    }
    if (depth >= MAX_REDACTION_DEPTH) {
      return "[REDACTED_OBJECT]";
    }
    if (seen.has(currentValue)) {
      return "[Circular]";
    }
    seen.add(currentValue);
    if (currentValue instanceof Error) {
      return sanitizeError(currentValue, options, depth + 1, redact);
    }
    if (Array.isArray(currentValue)) {
      return currentValue.map((item) => redact(item, depth + 1));
    }
    const redactedObject = {};
    for (const [key, objectValue] of Object.entries(currentValue)) {
      redactedObject[key] = isSensitiveKey(key) ? REDACTED_VALUE : redact(objectValue, depth + 1);
    }
    return redactedObject;
  };
  return redact(value, 0);
};
var sanitizeError = (error, options = {}, depth = 0, redact = (value) => redactSensitiveData(value, options)) => {
  const sanitizedError = new Error(redactString(error.message, options.secrets ?? []));
  sanitizedError.name = error.name;
  sanitizedError.stack = redactString(error.stack ?? "", options.secrets ?? []);
  for (const [key, value] of Object.entries(error)) {
    sanitizedError[key] = isSensitiveKey(key) ? REDACTED_VALUE : redact(value, depth + 1);
  }
  return sanitizedError;
};

// src/client/index.ts
var OFFICIAL_BASE_URL = "https://api.hevyapp.com";
var LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

class BaseHevyClient {
  client;
  apiKey;
  constructor(config) {
    this.apiKey = config.apiKey;
    const baseURL = this.resolveBaseURL(config);
    this.client = import_axios.default.create({
      baseURL,
      timeout: config.timeout ?? 30000,
      maxRedirects: 0,
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }
  resolveBaseURL(config) {
    const baseURL = config.baseURL || OFFICIAL_BASE_URL;
    let parsedBaseURL;
    try {
      parsedBaseURL = new URL(baseURL);
    } catch {
      throw new ConfigurationError("Invalid baseURL. Provide a valid absolute URL.");
    }
    const officialOrigin = new URL(OFFICIAL_BASE_URL).origin;
    if (parsedBaseURL.origin === officialOrigin) {
      return baseURL;
    }
    if (config.trustBaseURL !== true) {
      throw new ConfigurationError("Custom baseURL origins require trustBaseURL: true because the API key will be sent to that origin.");
    }
    const isLoopbackHTTP = parsedBaseURL.protocol === "http:" && LOOPBACK_HOSTS.has(parsedBaseURL.hostname);
    if (parsedBaseURL.protocol !== "https:" && !isLoopbackHTTP) {
      throw new ConfigurationError("Custom baseURL origins must use HTTPS unless they are trusted HTTP loopback hosts.");
    }
    return baseURL;
  }
  setupRequestInterceptor() {
    this.client.interceptors.request.use((config) => {
      config.headers.set("api-key", this.apiKey);
      return config;
    }, (error) => {
      return Promise.reject(new NetworkError("Failed to make request", this.sanitizeOriginalError(error)));
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
      throw new NetworkError(isTimeout ? "Request timed out" : "Network error occurred", this.sanitizeOriginalError(error));
    }
    const status = error.response.status;
    const responseData = this.sanitizeValue(error.response.data);
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
          acc[key] = String(this.sanitizeValue(value));
          return acc;
        }, {});
      }
    }
    return;
  }
  sanitizeValue(value) {
    return redactSensitiveData(value, { secrets: [this.apiKey] });
  }
  sanitizeOriginalError(error) {
    if (error instanceof Error) {
      return sanitizeError(error, { secrets: [this.apiKey] });
    }
    return new Error(String(this.sanitizeValue(error)));
  }
  async request(options) {
    try {
      const response = await this.client.request(options);
      return response.data;
    } catch (error) {
      if (error instanceof HevyAPIError || error instanceof NetworkError) {
        throw error;
      }
      throw new NetworkError("Unknown error occurred", this.sanitizeOriginalError(error));
    }
  }
}

// src/utils/path.ts
var encodePathSegment = (value) => encodeURIComponent(String(value));

// src/resources/bodyMeasurements.ts
class BodyMeasurementsClient extends BaseHevyClient {
  constructor(config) {
    super(config);
  }
  async getAll(params) {
    return this.request({
      method: "GET",
      url: "/v1/body_measurements",
      params: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10
      }
    });
  }
  async create(bodyMeasurement) {
    return this.request({
      method: "POST",
      url: "/v1/body_measurements",
      data: bodyMeasurement
    });
  }
  async getByDate(date) {
    return this.request({
      method: "GET",
      url: `/v1/body_measurements/${encodePathSegment(date)}`
    });
  }
  async update(date, bodyMeasurement) {
    return this.request({
      method: "PUT",
      url: `/v1/body_measurements/${encodePathSegment(date)}`,
      data: bodyMeasurement
    });
  }
}

// src/resources/exerciseHistory.ts
class ExerciseHistoryClient extends BaseHevyClient {
  constructor(config) {
    super(config);
  }
  async getByExerciseTemplateId(exerciseTemplateId, params) {
    return this.request({
      method: "GET",
      url: `/v1/exercise_history/${encodePathSegment(exerciseTemplateId)}`,
      params: {
        start_date: params?.start_date,
        end_date: params?.end_date
      }
    });
  }
}

// src/resources/exerciseTemplates.ts
class ExerciseTemplatesClient extends BaseHevyClient {
  constructor(config) {
    super(config);
  }
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
      url: `/v1/exercise_templates/${encodePathSegment(exerciseTemplateId)}`
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
  constructor(config) {
    super(config);
  }
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
      url: `/v1/routine_folders/${encodePathSegment(folderId)}`
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
  constructor(config) {
    super(config);
  }
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
      url: `/v1/routines/${encodePathSegment(routineId)}`
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
      url: `/v1/routines/${encodePathSegment(routineId)}`,
      data: routine
    });
  }
}

// src/resources/user.ts
class UserClient extends BaseHevyClient {
  constructor(config) {
    super(config);
  }
  async getInfo() {
    return this.request({
      method: "GET",
      url: "/v1/user/info"
    });
  }
}

// src/resources/workouts.ts
class WorkoutsClient extends BaseHevyClient {
  constructor(config) {
    super(config);
  }
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
      url: `/v1/workouts/${encodePathSegment(workoutId)}`
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
      url: `/v1/workouts/${encodePathSegment(workoutId)}`,
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
  user;
  bodyMeasurements;
  constructor(config) {
    super(config);
    this.workouts = new WorkoutsClient(config);
    this.routines = new RoutinesClient(config);
    this.exerciseTemplates = new ExerciseTemplatesClient(config);
    this.routineFolders = new RoutineFoldersClient(config);
    this.exerciseHistory = new ExerciseHistoryClient(config);
    this.user = new UserClient(config);
    this.bodyMeasurements = new BodyMeasurementsClient(config);
  }
}
var src_default = Hevy;

//# debugId=DA6890B01208328A64756E2164756E21
