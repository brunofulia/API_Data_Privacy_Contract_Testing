# API & Data Privacy Contract Testing Framework

An enterprise-grade QA Automation Architecture that I built for rigorous backend validation, designed specifically to enforce strict Data Privacy Compliance (GDPR) and Role-Based Access Control (RBAC) across corporate infrastructure.

## 🎯 Project Purpose & Strategic Business Value

In the modern enterprise landscape, functional API testing is no longer sufficient. With this architecture, I transform traditional functional testing into **automated compliance auditing**. This framework acts as a quality gate within CI/CD pipelines, proactively ensuring that:

* **GDPR PII Leak Protection:** I validate that downstream systems programmatically honor data subject rights by actively masking Personally Identifiable Information (PII) after consent revocation.
* **RBAC Broken Access Control Verification:** I perform security state verification to identify authorization bypass attempts and ensure that mutational endpoints remain protected by strict authentication policies.

Through this repository, I demonstrate how QA automation can evolve beyond functional validation into a critical layer of compliance and security assurance.

## 🛠️ Tech Stack & Architecture Decisions

I intentionally designed this framework to avoid the fragmentation often caused by combining UI-focused test runners with external DSLs such as Karate or Postman.

* **TypeScript & Playwright:** The entire framework runs on native TypeScript using Playwright's `APIRequestContext`.
* **Architectural Homogeneity:** By leveraging Playwright's API engine, I avoid the overhead of headless browsers while reusing the same highly parallelized test runner, reporting infrastructure, and assertion libraries used across broader engineering ecosystems.
* **No Fragmented Dependencies:** I enforce programmatic validation through native code. There are no heavy schema-validation libraries or UI layers introducing unnecessary complexity, allowing for fast and maintainable backend auditing.

## 🧱 Repository Layout & Patterns

The codebase follows the **API Object Model** pattern, allowing me to isolate network clients, request payloads, and security validations.

```text
api-data-privacy-contract-framework/
 ├── config/            # Environment parsing and global test profiles (.env)
 ├── src/
 │    ├── clients/      # Dedicated API controllers (MockApiClient, RestfulBookerClient)
 │    ├── fixtures/     # Playwright Dependency Injection configuration
 │    └── utils/        # Standalone security & compliance validators
 ├── tests/
 │    ├── contract/     # GDPR compliance and contract regression suites
 │    └── security/     # RBAC verification and controlled KO-state testing
```

* **Provider & Client Pattern:** I centralize HTTP abstractions through reusable base providers. Individual APIs such as MockAPI and Restful-Booker are managed through specialized clients that remain free of assertions, preserving separation of concerns.
* **Custom Fixture Dependency Injection:** I automatically instantiate clients and runtime credentials through Playwright fixtures, enabling native dependency injection during test execution (for example, automated `authWithBooker` token provisioning).

## 🛡️ Oracle Governance Profiles (Controlled KO States)

I designed the automation to simulate realistic platform threats and validate that CI/CD protection mechanisms behave as expected under failure conditions.

### 1. `PrivacyValidator` (GDPR Check)

To enforce compliance, the `PrivacyValidator` analyzes simulated datasets (sourced from MockAPI) using strict regular-expression validation.

* **Telemetry Simulation:** A specific backend record (for example, User 3 – Pierre Martin) is flagged with `consentGDPR: false`.
* **The Audit:** The validator rejects unmasked plain-text emails or exposed credit card numbers, failing the build and generating detailed violation logs in the Playwright trace reporter to prevent non-compliant releases.

### 2. `TRIGGER_SECURITY_KO=true` Toggle

This toggle forces the security suite into a **Simulated Regression / Fire Drill Mode**.

* **Inverted Oracle Assertion:** When enabled, the framework deliberately expects a mutating endpoint to accept an insecure unauthorized request (`HTTP 200`).
* **The Result:** Because the protected backend correctly returns `HTTP 403 Forbidden`, the assertion fails immediately. This demonstrates how the CI/CD pipeline would react if a real authorization vulnerability were ever introduced.

#### How to Toggle this Mode:

You can activate or deactivate this simulated regression using one of two methods:

1. **Via Environment File (Recommended for Local Dev):**
   Open your active environment configuration file (e.g., [.env.staging](file:///c:/3_Portfolio_Github/API_Data_Privacy_Contract_Testing/.env.staging)) and modify the `TRIGGER_SECURITY_KO` value:
   - **Activate (Fire Drill Mode):** `TRIGGER_SECURITY_KO=true`
   - **Deactivate (Safe Mode):** `TRIGGER_SECURITY_KO=false`

2. **Via Command Line Environment Variable (Recommended for CI/CD Pipelines):**
   Override the file configuration directly from your terminal when running the tests:
   * **Linux/macOS:**
     ```bash
     TRIGGER_SECURITY_KO=true npm run test:security
     ```
   * **PowerShell (Windows):**
     ```powershell
     $env:TRIGGER_SECURITY_KO="true"; npm run test:security
     ```
   * **Command Prompt (Windows):**
     ```cmd
     set TRIGGER_SECURITY_KO=true && npm run test:security
     ```


## 🚀 Local Setup & Quickstart

To initialize the framework locally, clone the repository and install the required dependencies.

### Installation

```bash
# Install core dependencies (TypeScript, Playwright, Dotenv)
npm ci

# Install Playwright drivers
npx playwright install --with-deps
```

### Environment Profiles

Duplicate the example configuration file to create your target environment profile.

```bash
cp .env.example .env.staging
```

Ensure that `.env.staging` contains valid endpoint mappings and environment-specific configuration values.

### Execution Commands

Run the complete API test suite using Playwright's native parallel execution capabilities:

```bash
# Run all contract and security tests
npx playwright test

# Run specific test scopes
npm run test:contract
npm run test:security
```

### Reviewing Evidence (Report Generation)

Playwright automatically captures execution artifacts and traces. To inspect the generated HTML report:

```bash
npx playwright show-report
```

> **Troubleshooting `EADDRINUSE`:** If the local report viewer port is already in use, release the default Playwright report port:
>
> ```powershell
> Stop-Process -Id (Get-NetTCPConnection -LocalPort 9323).OwningProcess -Force
> ```
