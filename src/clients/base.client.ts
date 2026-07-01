import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseClient {
  protected request: APIRequestContext;
  protected baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  protected async get(url: string, options?: { headers?: Record<string, string>, params?: Record<string, string | number | boolean> }): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${url}`, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options?.headers
      }
    });
  }

  protected async post(url: string, data: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${url}`, {
      ...options,
      data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });
  }

  protected async put(url: string, data: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    return this.request.put(`${this.baseUrl}${url}`, {
      ...options,
      data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });
  }

  protected async delete(url: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}${url}`, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options?.headers
      }
    });
  }
}
