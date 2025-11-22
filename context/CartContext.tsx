'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const CART_STORAGE_KEY = 'trendy-fashion-zone-cart-v1';

const defaultState: CartState = {
  items: [],
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'INCREMENT_ITEM'; payload: { id: string } }
  | { type: 'DECREMENT_ITEM'; payload: { id: string } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
              : item,
          ),
        };
      }

      return {
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'INCREMENT_ITEM': {
      return {
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
            : item,
        ),
      };
    }
    case 'DECREMENT_ITEM': {
      return {
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    }
    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }
    case 'CLEAR_CART':
      return defaultState;
    default:
      return state;
  }
};

interface CartContextValue {
  items: CartItem[];
  itemsCount: number;
  subtotal: number;
  isHydrated: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') {
    return defaultState;
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return defaultState;
    }
    const parsed = JSON.parse(stored) as CartState;
    if (!parsed || !Array.isArray(parsed.items)) {
      return defaultState;
    }
    return {
      items: parsed.items.map((item) => ({
        ...item,
        quantity: typeof item.quantity === 'number' && item.quantity > 0 ? Math.min(item.quantity, 99) : 1,
      })),
    };
  } catch (error) {
    console.error('Failed to load cart from storage', error);
    return defaultState;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, defaultState, loadCartFromStorage);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to persist cart to storage', error);
    }
  }, [state]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const incrementItem = useCallback((id: string) => {
    dispatch({ type: 'INCREMENT_ITEM', payload: { id } });
  }, []);

  const decrementItem = useCallback((id: string) => {
    dispatch({ type: 'DECREMENT_ITEM', payload: { id } });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const itemsCount = useMemo(() => state.items.reduce((total, item) => total + item.quantity, 0), [state.items]);
  const subtotal = useMemo(() => state.items.reduce((total, item) => total + item.price * item.quantity, 0), [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      itemsCount,
      subtotal,
      isHydrated,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
    }),
    [state.items, itemsCount, subtotal, isHydrated, addItem, incrementItem, decrementItem, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = (): CartContextValue => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }

  return context;
};

export const useCartHydration = (): boolean => {
  const { isHydrated } = useCartContext();
  return isHydrated;
};

export type { CartState, CartAction };
export { cartReducer };

