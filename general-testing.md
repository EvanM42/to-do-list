# General Testing Guide

## Objectives
Ensure the app is reliable, secure, and safe to deploy as feature complexity grows.

## Testing Pyramid
- Unit tests: business logic and utilities
- Integration tests: API + DB interactions
- End-to-end tests: user workflows across frontend/backend

## Frontend Testing
- Component tests for task list, task item, and composer
- State behavior tests (optimistic update, rollback)
- Accessibility checks for keyboard and screen readers
- Visual smoke checks for mobile and desktop layouts

## Backend Testing
- Route validation tests (bad input, missing auth)
- Authorization tests (cross-user access denied)
- DB integration tests for CRUD and filtering
- Error response consistency tests

## Supabase/RLS Testing
- Verify user A cannot read/write user B private data
- Verify shared-list role behavior (viewer vs editor)
- Test policy behavior for inserts, updates, deletes

## End-to-End Scenarios (minimum)
- Sign up / sign in / sign out
- Create task in Inbox
- Set due date and mark complete
- Edit task details
- Filter by Today/Scheduled/Completed
- Multi-user list sharing behavior

## Tooling Suggestions
- Unit/Integration: Vitest or Jest
- API Integration: Supertest
- E2E: Playwright
- Linting/Type checks: ESLint + TypeScript strict mode

## CI Pipeline Expectations
- Run lint + typecheck + unit tests on every PR
- Run integration tests on PR and main
- Run E2E on merge to staging and before production release

## Release Readiness Checklist
- All test suites green
- No critical/high vulnerabilities unresolved
- Migrations reviewed and tested
- Monitoring and alerts verified

## Bug Triage Rules
- Priority 0: data loss/security issue -> hotfix immediately
- Priority 1: core task flow broken -> fix before next deploy
- Priority 2+: non-blocking UX defects -> schedule in sprint

## Definition of Done (Testing)
- Automated test coverage for critical flows
- CI gates enforced for merge/deploy
- Manual smoke checklist documented and repeatable