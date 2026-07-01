import { test, expect } from '@fixtures/api.fixtures';
import { PrivacyValidator } from '@src/utils/privacy-validator';

test.describe('API Contract Validation - GDPR Compliance', () => {

  test('Data Contract Verification: Revoked consent users must have PII masked', async ({ mockApiClient }) => {
    // 1. Fetch simulated user records
    const response = await mockApiClient.getUsers();
    
    // 2. Assert that the response HTTP status is 200
    expect(response.status()).toBe(200);

    const users = await response.json();

    // 3. Pass the records array directly through PrivacyValidator
    const { valid, violations } = PrivacyValidator.validateGDPRMasking(users);

    // 4. Enterprise-grade assertion: Expect the 'valid' outcome property to be true. 
    // If false, fail the test displaying all collected data leak violations in the log.
    expect(valid, `Critical GDPR Data Leak Detected:\n${violations.join('\n')}`).toBe(true);
  });

});
