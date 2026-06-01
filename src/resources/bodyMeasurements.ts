import { BaseHevyClient } from '../client';
import type {
  BodyMeasurement,
  PaginatedBodyMeasurements,
  PaginationParams,
  PutBodyMeasurement,
} from '../types';
import { encodePathSegment } from '../utils/path';

export class BodyMeasurementsClient extends BaseHevyClient {
  async getAll(params?: PaginationParams): Promise<PaginatedBodyMeasurements> {
    return this.request<PaginatedBodyMeasurements>({
      method: 'GET',
      url: '/v1/body_measurements',
      params: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
      },
    });
  }

  async create(bodyMeasurement: BodyMeasurement): Promise<void> {
    return this.request<void>({
      method: 'POST',
      url: '/v1/body_measurements',
      data: bodyMeasurement,
    });
  }

  async getByDate(date: string): Promise<BodyMeasurement> {
    return this.request<BodyMeasurement>({
      method: 'GET',
      url: `/v1/body_measurements/${encodePathSegment(date)}`,
    });
  }

  async update(date: string, bodyMeasurement: PutBodyMeasurement): Promise<void> {
    return this.request<void>({
      method: 'PUT',
      url: `/v1/body_measurements/${encodePathSegment(date)}`,
      data: bodyMeasurement,
    });
  }
}
