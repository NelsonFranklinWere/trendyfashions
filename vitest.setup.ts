import '@testing-library/jest-dom/vitest';

const ensureTestLocalStorage = () => {
  if (typeof window === 'undefined') {
    return;
  }
  const storage = window.localStorage as Storage | undefined;
  if (
    storage &&
    typeof storage.getItem === 'function' &&
    typeof storage.setItem === 'function' &&
    typeof storage.removeItem === 'function' &&
    typeof storage.clear === 'function'
  ) {
    return;
  }

  let store = new Map<string, string>();

  const mockStorage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => {
      store = new Map();
    },
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  };

  // @ts-ignore override for tests
  window.localStorage = mockStorage;
};

ensureTestLocalStorage();


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


