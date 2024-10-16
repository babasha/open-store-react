import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';

interface CartItem {
  id: number;
  title: string;
  unit: string;
  step?: number;
  titles: {
    en: string;
    ru: string;
    geo: string;
  };
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addItemToCart: (item: CartItem) => void;
  updateItemInCart: (item: CartItem) => void;
  removeItemFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

type Action =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_TITLES'; payload: string };

const cartReducer = (state: CartItem[], action: Action): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.find((i) => i.id === action.payload.id);
      if (existingItem) {
        return state.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: i.quantity + action.payload.quantity }
            : i
        );
      }
      return [...state, action.payload];
    }
    case 'UPDATE_ITEM':
      return state.map((i) =>
        i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
      );
    case 'REMOVE_ITEM':
      return state.filter((i) => i.id !== action.payload);
    case 'CLEAR_CART':
      return [];
    case 'UPDATE_TITLES':
      return state.map((item) => ({
        ...item,
        title: item.titles[action.payload as 'en' | 'ru' | 'geo'],
      }));
    default:
      return state;
  }
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    dispatch({ type: 'UPDATE_TITLES', payload: i18n.language });
    const handleLanguageChange = (lang: string) => {
      dispatch({ type: 'UPDATE_TITLES', payload: lang });
    };
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const addItemToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const updateItemInCart = (item: CartItem) => {
    dispatch({ type: 'UPDATE_ITEM', payload: item });
  };

  const removeItemFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value = useMemo(
    () => ({
      cartItems,
      addItemToCart,
      updateItemInCart,
      removeItemFromCart,
      clearCart,
    }),
    [cartItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};