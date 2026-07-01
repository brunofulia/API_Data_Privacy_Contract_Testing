import { test as base, expect } from '@playwright/test';
import { RestfulBookerClient } from '@src/clients/restful-booker.client';
import { MockApiClient } from '@src/clients/mockapi.client';

export type ApiFixtures = {
  restfulBookerClient: RestfulBookerClient;
  mockApiClient: MockApiClient;
  authWithBooker: string;
};

export const test = base.extend<ApiFixtures>({
  restfulBookerClient: async ({ request }, use) => {
    const client = new RestfulBookerClient(request);
    await use(client);
  },

  mockApiClient: async ({ request }, use) => {
    const client = new MockApiClient(request);
    await use(client);
  },

  authWithBooker: async ({ restfulBookerClient }, use) => {
    const username = process.env.API_USERNAME || 'admin';
    const password = process.env.API_PASSWORD || 'password123';
    
    const response = await restfulBookerClient.createToken(username, password);
    const body = await response.json();
    
    if (!body.token) {
      throw new Error(`Failed to authenticate with RestfulBooker. Response: ${JSON.stringify(body)}`);
    }

    await use(body.token);
  }
});

export { expect };
