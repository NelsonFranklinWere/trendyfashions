import '@testing-library/jest-dom/vitest';


class MockIntersectionObserver {
  constructor(
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit,
  ) {}

  observe(): void {}

  unobserve(): void {}

  disconnect(): void {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  // @ts-expect-error test environment polyfill
  globalThis.IntersectionObserver = MockIntersectionObserver;
}


