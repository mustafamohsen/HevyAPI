import axios from 'axios';
import { BaseHevyClient } from '../src/client';
import {
  AuthenticationError,
  ConfigurationError,
  Hevy,
  HevyAPIError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from '../src/index';

const createClientMock = () => ({
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
  request: vi.fn(),
});

const mockAxios = {
  create: vi.fn(createClientMock),
};

vi.mock('axios', () => ({
  default: mockAxios,
  create: mockAxios.create,
}));

class TestClient extends BaseHevyClient {}

const getResponseErrorInterceptor = (client: TestClient) =>
  (client as unknown as { client: ReturnType<typeof createClientMock> }).client.interceptors.response.use
    .mock.calls[0][1];

const getRequestInterceptor = (client: TestClient) =>
  (client as unknown as { client: ReturnType<typeof createClientMock> }).client.interceptors.request.use
    .mock.calls[0][0];

const getClientMock = (client: unknown) =>
  (client as { client: ReturnType<typeof createClientMock> }).client;

describe('Hevy Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication Errors', () => {
    it('should throw AuthenticationError for 401 status', () => {
      const mockError = {
        response: { status: 401, data: {}, headers: {} },
      };

      const client = new TestClient({ apiKey: 'test-key' });
      const interceptor = getResponseErrorInterceptor(client);

      expect(() => interceptor(mockError)).toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError for 403 status', () => {
      const mockError = {
        response: { status: 403, data: {}, headers: {} },
      };

      const client = new TestClient({ apiKey: 'test-key' });
      const interceptor = getResponseErrorInterceptor(client);

      expect(() => interceptor(mockError)).toThrow(AuthenticationError);
    });
  });

  describe('Validation Errors', () => {
    it('should throw ValidationError for 400 status with field errors', () => {
      const mockError = {
        response: {
          status: 400,
          data: { errors: { title: 'Required', description: 'Too long' } },
          headers: {},
        },
      };

      const client = new TestClient({ apiKey: 'test-key' });
      const interceptor = getResponseErrorInterceptor(client);

      try {
        interceptor(mockError);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).fieldErrors).toEqual({
          title: 'Required',
          description: 'Too long',
        });
      }
    });

    it('redacts secrets from validation field errors and JSON output', () => {
      const secret = 'validation-secret-key';
      const mockError = {
        response: {
          status: 400,
          data: {
            errors: {
              apiKey: secret,
              title: `contains ${secret}`,
            },
          },
          headers: {},
        },
      };

      const client = new TestClient({ apiKey: secret });
      const interceptor = getResponseErrorInterceptor(client);

      try {
        interceptor(mockError);
      } catch (error) {
        const validationError = error as ValidationError;
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.fieldErrors).toEqual({
          apiKey: '[REDACTED]',
          title: 'contains [REDACTED]',
        });
        expect(JSON.stringify(validationError)).not.toContain(secret);
      }
    });
  });

  describe('Not Found Errors', () => {
    it('should throw NotFoundError for 404 status', () => {
      const mockError = {
        response: { status: 404, data: {}, headers: {} },
      };

      const client = new TestClient({ apiKey: 'test-key' });
      const interceptor = getResponseErrorInterceptor(client);

      expect(() => interceptor(mockError)).toThrow(NotFoundError);
    });
  });

  describe('Rate Limit Errors', () => {
    it('should throw RateLimitError for 429 status with retry-after header', () => {
      const mockError = {
        response: { status: 429, data: {}, headers: { 'retry-after': '10' } },
      };

      const client = new TestClient({ apiKey: 'test-key' });
      const interceptor = getResponseErrorInterceptor(client);

      try {
        interceptor(mockError);
      } catch (error) {
        expect(error).toBeInstanceOf(RateLimitError);
        expect((error as RateLimitError).retryAfter).toBe(10000);
      }
    });

    it('should use default retry after when header is missing', () => {
      const mockError = {
        response: { status: 429, data: {}, headers: {} },
      };

      const client = new TestClient({ apiKey: 'test-key' });
      const interceptor = getResponseErrorInterceptor(client);

      try {
        interceptor(mockError);
      } catch (error) {
        expect(error).toBeInstanceOf(RateLimitError);
        expect((error as RateLimitError).retryAfter).toBe(5000);
      }
    });
  });

  describe('Network Errors', () => {
    it('should throw NetworkError when no response (ECONNABORTED)', () => {
      const mockError = {
        code: 'ECONNABORTED',
        response: null,
      };

      const client = new TestClient({ apiKey: 'test-key' });
      const interceptor = getResponseErrorInterceptor(client);

      expect(() => interceptor(mockError)).toThrow(NetworkError);
    });

    it('should throw NetworkError when timeout (ETIMEDOUT)', () => {
      const mockError = {
        code: 'ETIMEDOUT',
        response: null,
      };

      const client = new TestClient({ apiKey: 'test-key' });
      const interceptor = getResponseErrorInterceptor(client);

      try {
        interceptor(mockError);
      } catch (error) {
        expect(error).toBeInstanceOf(NetworkError);
        expect((error as NetworkError).message).toContain('timed out');
      }
    });

    it('redacts secrets from Axios-like network errors and JSON output', () => {
      const secret = 'super-secret-api-key';
      const mockError = Object.assign(new Error(`failed with ${secret}`), {
        code: 'ECONNRESET',
        response: null,
        config: {
          url: `/v1/workouts?apiKey=${secret}&token=${secret}`,
          headers: {
            'api-key': secret,
            Authorization: `Bearer ${secret}`,
            'x-api-key': secret,
          },
          data: JSON.stringify({ password: secret, nested: `body-${secret}` }),
        },
      });

      const client = new TestClient({ apiKey: secret });
      const interceptor = getResponseErrorInterceptor(client);

      try {
        interceptor(mockError);
      } catch (error) {
        const networkError = error as NetworkError;
        const serializedError = JSON.stringify(networkError);
        expect(networkError).toBeInstanceOf(NetworkError);
        expect(networkError.message).not.toContain(secret);
        expect(networkError.originalError?.message).not.toContain(secret);
        expect(serializedError).not.toContain(secret);
        expect(serializedError).not.toContain('Bearer super-secret-api-key');
        expect(serializedError).toContain('[REDACTED]');
      }
    });
  });

  describe('Default API Errors', () => {
    it('should throw HevyAPIError for 500 status', () => {
      const mockError = {
        response: { status: 500, data: { message: 'Server error' }, headers: {} },
      };

      const client = new TestClient({ apiKey: 'test-key' });
      const interceptor = getResponseErrorInterceptor(client);

      try {
        interceptor(mockError);
      } catch (error) {
        expect(error).toBeInstanceOf(HevyAPIError);
        expect((error as HevyAPIError).statusCode).toBe(500);
      }
    });

    it('redacts secrets from response objects and JSON output', () => {
      const secret = 'response-secret-key';
      const mockError = {
        response: {
          status: 500,
          data: {
            message: `request failed for ${secret}`,
            apiKey: secret,
            nested: { access_token: secret, note: `query=${secret}` },
          },
          headers: {},
        },
      };

      const client = new TestClient({ apiKey: secret });
      const interceptor = getResponseErrorInterceptor(client);

      try {
        interceptor(mockError);
      } catch (error) {
        const apiError = error as HevyAPIError;
        const serializedError = JSON.stringify(apiError);
        expect(apiError.response).toEqual({
          message: 'request failed for [REDACTED]',
          apiKey: '[REDACTED]',
          nested: { access_token: '[REDACTED]', note: 'query=[REDACTED]' },
        });
        expect(serializedError).not.toContain(secret);
      }
    });
  });

  describe('API Key Header', () => {
    it('should add api-key header to requests', () => {
      const mockHeaders = {
        set: vi.fn(),
      };
      const mockConfig = { headers: mockHeaders };

      const client = new TestClient({ apiKey: 'my-api-key' });
      const interceptor = getRequestInterceptor(client);

      interceptor(mockConfig);

      expect(mockHeaders.set).toHaveBeenCalledWith('api-key', 'my-api-key');
    });
  });

  describe('Base URL Trust', () => {
    it('uses the official base URL by default without explicit trust', () => {
      new TestClient({ apiKey: 'test-key' });

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({ baseURL: 'https://api.hevyapp.com' }),
      );
    });

    it('allows official-origin base URLs without explicit trust', () => {
      new TestClient({ apiKey: 'test-key', baseURL: 'https://api.hevyapp.com/v1' });

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({ baseURL: 'https://api.hevyapp.com/v1' }),
      );
    });

    it('rejects custom origins unless explicitly trusted', () => {
      expect(
        () => new TestClient({ apiKey: 'test-key', baseURL: 'https://proxy.example.com' }),
      ).toThrow(ConfigurationError);
      expect(axios.create).not.toHaveBeenCalled();
    });

    it('rejects localhost URLs unless explicitly trusted', () => {
      expect(() => new TestClient({ apiKey: 'test-key', baseURL: 'http://localhost:3000' })).toThrow(
        ConfigurationError,
      );
      expect(axios.create).not.toHaveBeenCalled();
    });

    it('allows trusted custom origins', () => {
      new TestClient({
        apiKey: 'test-key',
        baseURL: 'http://127.0.0.1:3000',
        trustBaseURL: true,
      });

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({ baseURL: 'http://127.0.0.1:3000' }),
      );
    });
  });

  describe('Resource Clients', () => {
    it('should have workouts client', () => {
      const client = new Hevy({ apiKey: 'test-key' });
      expect(client.workouts).toBeDefined();
      expect(client.workouts.getAll).toBeInstanceOf(Function);
    });

    it('should have routines client', () => {
      const client = new Hevy({ apiKey: 'test-key' });
      expect(client.routines).toBeDefined();
      expect(client.routines.getAll).toBeInstanceOf(Function);
    });

    it('should have exerciseTemplates client', () => {
      const client = new Hevy({ apiKey: 'test-key' });
      expect(client.exerciseTemplates).toBeDefined();
      expect(client.exerciseTemplates.getAll).toBeInstanceOf(Function);
    });

    it('should have routineFolders client', () => {
      const client = new Hevy({ apiKey: 'test-key' });
      expect(client.routineFolders).toBeDefined();
      expect(client.routineFolders.getAll).toBeInstanceOf(Function);
    });

    it('should have exerciseHistory client', () => {
      const client = new Hevy({ apiKey: 'test-key' });
      expect(client.exerciseHistory).toBeDefined();
      expect(client.exerciseHistory.getByExerciseTemplateId).toBeInstanceOf(Function);
    });

    it('should have user client', () => {
      const client = new Hevy({ apiKey: 'test-key' });
      expect(client.user).toBeDefined();
      expect(client.user.getInfo).toBeInstanceOf(Function);
    });

    it('should have bodyMeasurements client', () => {
      const client = new Hevy({ apiKey: 'test-key' });
      expect(client.bodyMeasurements).toBeDefined();
      expect(client.bodyMeasurements.getAll).toBeInstanceOf(Function);
    });
  });

  describe('Resource Requests', () => {
    it('encodes dynamic path segments for existing resources', async () => {
      const dangerousId = 'id /?#%💪';
      const encodedId = 'id%20%2F%3F%23%25%F0%9F%92%AA';
      const client = new Hevy({ apiKey: 'test-key' });
      const resources = [
        { resource: client.workouts, call: () => client.workouts.getById(dangerousId), url: `/v1/workouts/${encodedId}` },
        { resource: client.workouts, call: () => client.workouts.update(dangerousId, { workout: { title: 'Workout', start_time: '2024-01-01T00:00:00Z', end_time: '2024-01-01T01:00:00Z', exercises: [] } }), url: `/v1/workouts/${encodedId}` },
        { resource: client.routines, call: () => client.routines.getById(dangerousId), url: `/v1/routines/${encodedId}` },
        { resource: client.routines, call: () => client.routines.update(dangerousId, { routine: { title: 'Routine', exercises: [] } }), url: `/v1/routines/${encodedId}` },
        { resource: client.exerciseTemplates, call: () => client.exerciseTemplates.getById(dangerousId), url: `/v1/exercise_templates/${encodedId}` },
        { resource: client.routineFolders, call: () => client.routineFolders.getById(dangerousId), url: `/v1/routine_folders/${encodedId}` },
        { resource: client.exerciseHistory, call: () => client.exerciseHistory.getByExerciseTemplateId(dangerousId), url: `/v1/exercise_history/${encodedId}` },
      ];

      for (const { resource, call, url } of resources) {
        const resourceMock = getClientMock(resource);
        resourceMock.request.mockResolvedValueOnce({ data: {} });

        await call();

        expect(resourceMock.request).toHaveBeenLastCalledWith(expect.objectContaining({ url }));
      }
    });

    it('requests user info with the official response wrapper', async () => {
      const client = new Hevy({ apiKey: 'test-key' });
      const userMock = getClientMock(client.user);
      const response = { data: { id: 'user-id', name: 'Jane', url: 'https://hevy.com/user/jane' } };
      userMock.request.mockResolvedValueOnce({ data: response });

      await expect(client.user.getInfo()).resolves.toEqual(response);

      expect(userMock.request).toHaveBeenCalledWith({ method: 'GET', url: '/v1/user/info' });
    });

    it('requests body measurements with official paths, params, and bodies', async () => {
      const client = new Hevy({ apiKey: 'test-key' });
      const bodyMeasurementsMock = getClientMock(client.bodyMeasurements);
      const measurement = { date: '2024-08-14', weight_kg: 80.5, abdomen: null };
      const update = { weight_kg: 81, fat_percent: null };
      bodyMeasurementsMock.request.mockResolvedValue({ data: undefined });

      await client.bodyMeasurements.getAll();
      await client.bodyMeasurements.create(measurement);
      await client.bodyMeasurements.getByDate('2024/08/14?#%💪');
      await client.bodyMeasurements.update('2024/08/14?#%💪', update);

      expect(bodyMeasurementsMock.request).toHaveBeenNthCalledWith(1, {
        method: 'GET',
        url: '/v1/body_measurements',
        params: { page: 1, pageSize: 10 },
      });
      expect(bodyMeasurementsMock.request).toHaveBeenNthCalledWith(2, {
        method: 'POST',
        url: '/v1/body_measurements',
        data: measurement,
      });
      expect(bodyMeasurementsMock.request).toHaveBeenNthCalledWith(3, {
        method: 'GET',
        url: '/v1/body_measurements/2024%2F08%2F14%3F%23%25%F0%9F%92%AA',
      });
      expect(bodyMeasurementsMock.request).toHaveBeenNthCalledWith(4, {
        method: 'PUT',
        url: '/v1/body_measurements/2024%2F08%2F14%3F%23%25%F0%9F%92%AA',
        data: update,
      });
    });
  });
});

describe('Error Classes', () => {
  describe('HevyAPIError', () => {
    it('should have correct name, message, statusCode and response', () => {
      const error = new HevyAPIError('Test error', 400, { field: 'error' });
      expect(error.name).toBe('HevyAPIError');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.response).toEqual({ field: 'error' });
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('AuthenticationError', () => {
    it('should have default message', () => {
      const error = new AuthenticationError();
      expect(error.name).toBe('AuthenticationError');
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Authentication failed. Please verify your API key.');
    });

    it('should accept custom message', () => {
      const error = new AuthenticationError('Custom auth error');
      expect(error.message).toBe('Custom auth error');
      expect(error.statusCode).toBe(401);
    });
  });

  describe('ValidationError', () => {
    it('should have field errors', () => {
      const error = new ValidationError('Invalid', { email: 'Invalid email' });
      expect(error.name).toBe('ValidationError');
      expect(error.statusCode).toBe(400);
      expect(error.fieldErrors).toEqual({ email: 'Invalid email' });
    });

    it('should have undefined fieldErrors when not provided', () => {
      const error = new ValidationError('Invalid');
      expect(error.fieldErrors).toBeUndefined();
    });
  });

  describe('NotFoundError', () => {
    it('should have default message', () => {
      const error = new NotFoundError();
      expect(error.name).toBe('NotFoundError');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
    });

    it('should accept custom message', () => {
      const error = new NotFoundError('Custom not found');
      expect(error.message).toBe('Custom not found');
    });
  });

  describe('RateLimitError', () => {
    it('should have retry after value', () => {
      const error = new RateLimitError(10000);
      expect(error.name).toBe('RateLimitError');
      expect(error.statusCode).toBe(429);
      expect(error.retryAfter).toBe(10000);
      expect(error.message).toContain('10000');
    });

    it('should have default retry after', () => {
      const error = new RateLimitError();
      expect(error.retryAfter).toBe(5000);
    });
  });

  describe('ConfigurationError', () => {
    it('should have a configuration error name and message', () => {
      const error = new ConfigurationError('Invalid config');
      expect(error.name).toBe('ConfigurationError');
      expect(error.message).toBe('Invalid config');
    });
  });

  describe('NetworkError', () => {
    it('should have original error', () => {
      const originalError = new Error('Connection refused');
      const error = new NetworkError('Network failed', originalError);
      expect(error.name).toBe('NetworkError');
      expect(error.originalError).toBe(originalError);
      expect(error.message).toBe('Network failed');
    });

    it('should have undefined original error when not provided', () => {
      const error = new NetworkError('Network failed');
      expect(error.originalError).toBeUndefined();
    });
  });
});
