import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseClient } from './base.client';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  creditCard: string;
  consentGDPR: boolean;
}

export class MockApiClient extends BaseClient {
  constructor(request: APIRequestContext) {
    super(request, process.env.MOCK_API_URL || "");
  }

  async getUsers(): Promise<APIResponse> {
    return this.get('/users');
  }
}
