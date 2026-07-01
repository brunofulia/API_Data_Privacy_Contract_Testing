import * as dotenv from 'dotenv';
import * as path from 'path';

// Determine the environment and load the corresponding .env file
const environment = process.env.NODE_ENV || 'staging';
dotenv.config({
  path: path.resolve(__dirname, `../.env.${environment}`),
});

export const ENV = {
  ENVIRONMENT: environment,
  BOOKER_API_URL: process.env.BOOKER_API_URL || 'https://restful-booker.herokuapp.com',
  MOCK_API_URL: process.env.MOCK_API_URL || '',
  API_USERNAME: process.env.API_USERNAME || 'admin',
  API_PASSWORD: process.env.API_PASSWORD || 'password123',
  TRIGGER_SECURITY_KO: process.env.TRIGGER_SECURITY_KO === 'true',
};
