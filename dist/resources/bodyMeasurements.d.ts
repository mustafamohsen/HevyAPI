import { BaseHevyClient } from '../client';
import type { BodyMeasurement, PaginatedBodyMeasurements, PaginationParams, PutBodyMeasurement } from '../types';
export declare class BodyMeasurementsClient extends BaseHevyClient {
    getAll(params?: PaginationParams): Promise<PaginatedBodyMeasurements>;
    create(bodyMeasurement: BodyMeasurement): Promise<void>;
    getByDate(date: string): Promise<BodyMeasurement>;
    update(date: string, bodyMeasurement: PutBodyMeasurement): Promise<void>;
}
//# sourceMappingURL=bodyMeasurements.d.ts.map