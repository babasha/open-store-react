import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface CartItem {
  id: number;
  title: string;
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

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const handleLanguageChange = () => {
      setCartItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          title: item.titles[i18n.language as 'en' | 'ru' | 'geo'],
        }))
      );
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const addItemToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevItems, item];
    });
  };

  const updateItemInCart = (item: CartItem) => {
    setCartItems((prevItems) =>
      prevItems.map((i) => (i.id === item.id ? { ...i, quantity: item.quantity } : i))
    );
  };

  const removeItemFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addItemToCart, updateItemInCart, removeItemFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
