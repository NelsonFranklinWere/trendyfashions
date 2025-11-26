import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import type { ReactElement } from 'react';
import { act } from 'react';
import ProductCard from '@/components/ProductCard';
import { CartProvider } from '@/context/CartContext';
import { Product } from '@/data/products';

vi.mock('next/image', () => ({
  default: ({ fill: _fill, blurDataURL: _blur, placeholder: _placeholder, ...props }: any) => {
    const { alt, ...rest } = props;
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img alt={alt} {...rest} />;
  },
}));

const renderWithCart = (ui: ReactElement) => {
  return render(<CartProvider>{ui}</CartProvider>);
};

const clearTestLocalStorage = () => {
  const storage = window.localStorage as (Storage & { clear?: () => void }) | undefined;
  if (!storage) {
    return;
  }
  if (typeof storage.clear === 'function') {
    storage.clear();
    return;
  }
  for (let i = storage.length - 1; i >= 0; i -= 1) {
    const key = storage.key(i);
    if (key) {
      storage.removeItem(key);
    }
  }
};

const mockProduct: Product = {
  id: 'test-product',
  name: 'Test Sneaker',
  description: 'A stylish Nairobi test sneaker',
  price: 2800,
  image: '/images/casual/test-sneaker.jpg',
  category: 'casual',
};

describe('ProductCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearTestLocalStorage();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('adds item to cart and shows feedback', () => {
    renderWithCart(<ProductCard product={mockProduct} />);

    const addButton = screen.getByRole('button', { name: /add test sneaker to cart/i });
    expect(addButton).toHaveAttribute('aria-pressed', 'false');

    act(() => {
      fireEvent.click(addButton);
    });

    expect(addButton).toHaveAttribute('aria-label', 'Added Test Sneaker to cart');
    expect(addButton).toHaveAttribute('aria-pressed', 'true');

    act(() => {
      vi.advanceTimersByTime(1700);
    });

    expect(addButton).toHaveAttribute('aria-pressed', 'false');
    expect(addButton).toHaveAttribute('aria-label', 'Add Test Sneaker to cart');
  });
});

