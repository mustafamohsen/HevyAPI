import { type AxiosInstance, type AxiosRequestConfig } from 'axios';
export interface HevyClientConfig {
    apiKey: string;
    baseURL?: string;
    timeout?: number;
}
export interface RequestOptions extends AxiosRequestConfig {
    requiresAuth?: boolean;
}
export declare abstract class BaseHevyClient {
    protected client: AxiosInstance;
    protected apiKey: string;
    constructor(config: HevyClientConfig);
    private setupRequestInterceptor;
    private setupResponseInterceptor;
    private handleError;
    private parseRetryAfter;
    private extractFieldErrors;
    protected request<T>(options: RequestOptions): Promise<T>;
}
//# sourceMappingURL=index.d.ts.map