// Global test setup — runs once before every test file.
//
// 1. @testing-library/jest-dom adds custom DOM matchers (toBeInTheDocument,
//    toHaveTextContent, etc.) used by the existing component tests.
// 2. The `jest` global shim lets legacy Jest-style tests (jest.mock / jest.fn)
//    run under vitest without a full rewrite. `vi.fn` is API-compatible with
//    `jest.fn`; `vi.mock` is similarly compatible (though note: vitest only
//    hoists `vi.mock` calls, not `jest.mock`, so hoisting-sensitive mocks may
//    still need migration to `vi.mock`).

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Compatibility shim for tests written in Jest style.
globalThis.jest = vi;
