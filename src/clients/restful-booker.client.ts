import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseClient } from './base.client';

export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds?: string;
}

export class RestfulBookerClient extends BaseClient {
  constructor(request: APIRequestContext) {
    super(request, process.env.BOOKER_API_URL || "");
  }

  async createToken(username: string = process.env.API_USERNAME || 'admin', password: string = process.env.API_PASSWORD || 'password123'): Promise<APIResponse> {
    return this.post('/auth', {
      username,
      password
    });
  }

  async createBooking(payload: BookingPayload): Promise<APIResponse> {
    return this.post('/booking', payload);
  }

  async deleteBooking(id: number, token: string): Promise<APIResponse> {
    return this.delete(`/booking/${id}`, {
      headers: {
        Cookie: `token=${token}`
      }
    });
  }
}
