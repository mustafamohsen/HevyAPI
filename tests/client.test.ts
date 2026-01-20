import axios from 'axios';
import { Hevy, AuthenticationError, ValidationError, NotFoundError, RateLimitError, NetworkError, HevyAPIError, BaseHevyClient } from '../src/index';

// Simple mock for axios
const mockAxios = {
  create: () => ({
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    },
    request: vi.fn()
  })
};

vi.mock('axios', () => ({
  default: mockAxios,
  create: mockAxios.create
}));

describe('Hevy Client', () => {
  describe('Authentication Errors', () => {
    it('should throw AuthenticationError for 401 status', () => {
      const mockError = {
        response: { status: 401, data: {}, headers: {} }
      };
      
      const client = new Hevy({ apiKey: 'test-key' });
      const interceptor = (client as any).client.interceptors.response.use.mock.calls[0][1];
      
      expect(() => interceptor(mockError)).toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError for 403 status', () => {
      const mockError = {
        response: { status: 403, data: {}, headers: {} }
      };
      
      const client = new Hevy({ apiKey: 'test-key' });
      const interceptor = (client as any).client.interceptors.response.use.mock.calls[0][1];
      
      expect(() => interceptor(mockError)).toThrow(AuthenticationError);
    });
  });

  describe('Validation Errors', () => {
    it('should throw ValidationError for 400 status with field errors', () => {
      const mockError = {
        response: { 
          status: 400, 
          data: { errors: { title: 'Required', description: 'Too long' } },
          headers: {}
        }
      };
      
      const client = new Hevy({ apiKey: 'test-key' });
      const interceptor = (client as any).client.interceptors.response.use.mock.calls[0][1];
      
      try {
        interceptor(mockError);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).fieldErrors).toEqual({ title: 'Required', description: 'Too long' });
      }
    });
  });

  describe('Not Found Errors', () => {
    it('should throw NotFoundError for 404 status', () => {
      const mockError = {
        response: { status: 404, data: {}, headers: {} }
      };
      
      const client = new Hevy({ apiKey: 'test-key' });
      const interceptor = (client as any).client.interceptors.response.use.mock.calls[0][1];
      
      expect(() => interceptor(mockError)).toThrow(NotFoundError);
    });
  });

  describe('Rate Limit Errors', () => {
    it('should throw RateLimitError for 429 status with retry-after header', () => {
      const mockError = {
        response: { status: 429, data: {}, headers: { 'retry-after': '10' } }
      };
      
      const client = new Hevy({ apiKey: 'test-key' });
      const interceptor = (client as any).client.interceptors.response.use.mock.calls[0][1];
      
      try {
        interceptor(mockError);
      } catch (error) {
        expect(error).toBeInstanceOf(RateLimitError);
        expect((error as RateLimitError).retryAfter).toBe(10000);
      }
    });

    it('should use default retry after when header is missing', () => {
      const mockError = {
        response: { status: 429, data: {}, headers: {} }
      };
      
      const client = new Hevy({ apiKey: 'test-key' });
      const interceptor = (client as any).client.interceptors.response.use.mock.calls[0][1];
      
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
        response: null
      };
      
      const client = new Hevy({ apiKey: 'test-key' });
      const interceptor = (client as any).client.interceptors.response.use.mock.calls[0][1];
      
      expect(() => interceptor(mockError)).toThrow(NetworkError);
    });

    it('should throw NetworkError when timeout (ETIMEDOUT)', () => {
      const mockError = {
        code: 'ETIMEDOUT',
        response: null
      };
      
      const client = new Hevy({ apiKey: 'test-key' });
      const interceptor = (client as any).client.interceptors.response.use.mock.calls[0][1];
      
      try {
        interceptor(mockError);
      } catch (error) {
        expect(error).toBeInstanceOf(NetworkError);
        expect((error as NetworkError).message).toContain('timed out');
      }
    });
  });

  describe('Default API Errors', () => {
    it('should throw HevyAPIError for 500 status', () => {
      const mockError = {
        response: { status: 500, data: { message: 'Server error' }, headers: {} }
      };
      
      const client = new Hevy({ apiKey: 'test-key' });
      const interceptor = (client as any).client.interceptors.response.use.mock.calls[0][1];
      
      try {
        interceptor(mockError);
      } catch (error) {
        expect(error).toBeInstanceOf(HevyAPIError);
        expect((error as HevyAPIError).statusCode).toBe(500);
      }
    });
  });

  describe('API Key Header', () => {
    it('should add api-key header to requests', () => {
      const mockHeaders = {
        set: vi.fn()
      };
      const mockConfig = { headers: mockHeaders };
      
      const client = new Hevy({ apiKey: 'my-api-key' });
      const interceptor = (client as any).client.interceptors.request.use.mock.calls[0][0];
      
      interceptor(mockConfig);
      
      expect(mockHeaders.set).toHaveBeenCalledWith('api-key', 'my-api-key');
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
