import { BaseHevyClient, type HevyClientConfig } from '../client';
import type { UserInfoResponse } from '../types';

export class UserClient extends BaseHevyClient {
  // biome-ignore lint/complexity/noUselessConstructor: Explicit constructor keeps Bun function coverage accurate for inherited clients.
  constructor(config: HevyClientConfig) {
    super(config);
  }

  async getInfo(): Promise<UserInfoResponse> {
    return this.request<UserInfoResponse>({
      method: 'GET',
      url: '/v1/user/info',
    });
  }
}
