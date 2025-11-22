import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import type { ReactElement } from 'react';
import { act } from 'react';
import ProductCard from '@/components/ProductCard';
import { CartProvider } from '@/context/CartContext';
import { Product } from '@/data/products';

vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const renderWithCart = (ui: ReactElement) => {
  return render(<CartProvider>{ui}</CartProvider>);
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
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('adds item to cart and shows feedback', () => {
    renderWithCart(<ProductCard product={mockProduct} />);

    const addButton = screen.getByRole('button', { name: /add test sneaker to cart/i });
    expect(addButton).toHaveTextContent(/\bcart\b/i);

    act(() => {
      fireEvent.click(addButton);
    });

    expect(addButton).toHaveTextContent(/added!/i);

    act(() => {
      vi.advanceTimersByTime(1700);
    });

    expect(addButton).toHaveTextContent(/\bcart\b/i);
  });
});

