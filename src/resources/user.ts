import { BaseHevyClient } from '../client';
import type { UserInfoResponse } from '../types';

export class UserClient extends BaseHevyClient {
  async getInfo(): Promise<UserInfoResponse> {
    return this.request<UserInfoResponse>({
      method: 'GET',
      url: '/v1/user/info',
    });
  }
}
