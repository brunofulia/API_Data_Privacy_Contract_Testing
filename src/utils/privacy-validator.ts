export interface MockUser {
  id: string;
  name: string;
  email: string;
  creditCard: string;
  consentGDPR: boolean;
}

export class PrivacyValidator {
  /**
   * Validates GDPR rules for users. If consentGDPR is false,
   * verify that PII fields (email, creditCard) are masked (e.g. containing '*').
   * 
   * @param users The list of user objects returned by the API
   * @returns Validation result with boolean flag and detailed violations
   */
  static validateGDPRMasking(users: MockUser[]): { valid: boolean; violations: string[] } {
    const violations: string[] = [];

    // Email regex: ensures the local part has asterisks, or the whole email is heavily masked.
    // E.g., matches 'j***@domain.com', '***@***.***' and rejects 'plain@email.com'
    const emailMaskRegex = /^([^@]*\*+[^@]*)@([\w.-]+|\*+\.\*+)$/;
    // Standard unmasked check to definitively reject plain-text emails
    const plainTextEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Credit card regex: matches patterns like '************1234' or '****-****-****-1234'
    const ccMaskRegex = /^(?:\*+[\s-]?)+\d{4}$/;

    for (const user of users) {
      if (user.consentGDPR === false) {
        const isEmailMasked = emailMaskRegex.test(user.email) || (!plainTextEmailRegex.test(user.email) && user.email.includes('*'));
        const isCreditCardMasked = ccMaskRegex.test(user.creditCard);

        if (!isEmailMasked) {
          violations.push(`Violation: User ${user.id} (${user.name}) has consentGDPR=false, but email '${user.email}' is completely exposed or improperly masked.`);
        }

        if (!isCreditCardMasked) {
          violations.push(`Violation: User ${user.id} (${user.name}) has consentGDPR=false, but creditCard '${user.creditCard}' is completely exposed or improperly masked.`);
        }
      }
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
