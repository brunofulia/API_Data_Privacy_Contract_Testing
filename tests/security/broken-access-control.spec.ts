import { test, expect } from '@fixtures/api.fixtures';

test.describe('Security Verification: Broken Access Control (RBAC)', () => {

  test('PASS Scenario: Authorized user can alter a booking record', async ({ restfulBookerClient, authWithBooker }) => {
    // Setup: Create a booking record to manipulate
    const createRes = await restfulBookerClient.createBooking({
      firstname: "Security",
      lastname: "Audit",
      totalprice: 150,
      depositpaid: false,
      bookingdates: { checkin: "2026-05-01", checkout: "2026-05-10" },
      additionalneeds: "RBAC Verification"
    });
    
    expect(createRes.status()).toBe(200);
    const body = await createRes.json();
    const bookingId = body.bookingid;

    // Use authWithBooker token fixture to delete the record
    const deleteRes = await restfulBookerClient.deleteBooking(bookingId, authWithBooker);
    
    // Assert the operation returns a successful HTTP execution code (Restful-booker returns 201 Created for DELETE)
    expect([200, 201, 202, 204]).toContain(deleteRes.status());
  });

  test('CONTROLLED KO STATE: Exploitation Attempt', async ({ restfulBookerClient }) => {
    // Setup: Dummy booking ID for the exploitation attempt
    const targetBookingId = 999999;
    
    // The Controlled KO Trigger Toggle
    const isSecurityKoTriggered = process.env.TRIGGER_SECURITY_KO === 'true';

    // Exploitation Attempt: Intentionally call deleteBooking passing an empty token string
    const exploitRes = await restfulBookerClient.deleteBooking(targetBookingId, "");
    const status = exploitRes.status();

    // Dynamic Security Oracle Routing
    if (isSecurityKoTriggered) {
      // SIMULATED REGRESIÓN (Fire Drill Mode): Force the test to expect an insecure HTTP 200 OK.
      // Since the real API securely responds with 403, this assertion will instantly collapse and fail,
      // successfully demonstrating to reviewers how the CI/CD pipeline intercepts a security breach.
      expect(status, "Controlled KO Active: Simulating an open backend vulnerability").toBe(200);
    } else {
      // STANDARD PRODUCTION SAFETY: Validate that the real live API correctly rejects the attack.
      expect([401, 403], `Expected API to reject unauthorized deletion, but received status ${status}`).toContain(status);
    }
  });

});