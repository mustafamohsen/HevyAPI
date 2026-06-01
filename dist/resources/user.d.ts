import { BaseHevyClient, type HevyClientConfig } from '../client';
import type { UserInfoResponse } from '../types';
export declare class UserClient extends BaseHevyClient {
    constructor(config: HevyClientConfig);
    getInfo(): Promise<UserInfoResponse>;
}
//# sourceMappingURL=user.d.ts.map