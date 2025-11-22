import { describe, expect, it } from 'vitest';
import { cartReducer, CartAction, CartState } from '@/context/CartContext';

const baseState: CartState = { items: [] };

describe('cartReducer', () => {
  it('adds a new item to cart', () => {
    const action: CartAction = {
      type: 'ADD_ITEM',
      payload: {
        id: 'product-1',
        name: 'Test Product',
        price: 2800,
        image: '/images/test.jpg',
      },
    };

    const state = cartReducer(baseState, action);
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ id: 'product-1', quantity: 1 });
  });

  it('increments quantity when adding same item', () => {
    const initialState: CartState = {
      items: [
        { id: 'product-1', name: 'Test', price: 2800, image: '/images/test.jpg', quantity: 1 },
      ],
    };

    const action: CartAction = {
      type: 'ADD_ITEM',
      payload: {
        id: 'product-1',
        name: 'Test',
        price: 2800,
        image: '/images/test.jpg',
      },
    };

    const state = cartReducer(initialState, action);
    expect(state.items[0].quantity).toBe(2);
  });

  it('decrements quantity and removes item at zero', () => {
    const initialState: CartState = {
      items: [
        { id: 'product-1', name: 'Test', price: 2800, image: '/images/test.jpg', quantity: 1 },
      ],
    };

    const decrementAction: CartAction = {
      type: 'DECREMENT_ITEM',
      payload: { id: 'product-1' },
    };

    const stateAfterDecrement = cartReducer(initialState, decrementAction);
    expect(stateAfterDecrement.items).toHaveLength(0);
  });

  it('clears the cart', () => {
    const initialState: CartState = {
      items: [
        { id: 'product-1', name: 'Test', price: 2800, image: '/images/test.jpg', quantity: 3 },
      ],
    };

    const state = cartReducer(initialState, { type: 'CLEAR_CART' });
    expect(state.items).toHaveLength(0);
  });
});


