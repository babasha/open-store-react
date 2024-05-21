import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addItemToCart: (item: CartItem) => void;
  updateItemInCart: (item: CartItem) => void;
  removeItemFromCart: (id: number) => void;
  clearCart: () => void;
  resetQuantityInProductCard: (id: number) => void;
  resetAllQuantities: () => void;
  resetFlag: boolean;
  setResetFlag: (value: boolean) => void;
  resetButtonFlag: boolean;
  resetButton: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [resetFlag, setResetFlag] = useState<boolean>(false);
  const [resetButtonFlag, setResetButtonFlag] = useState<boolean>(false);

  const addItemToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity, price: i.price + item.price } : i
        );
      }
      return [...prevItems, item];
    });
  };

  const updateItemInCart = (item: CartItem) => {
    setCartItems((prevItems) =>
      prevItems.map((i) => (i.id === item.id ? { ...i, quantity: item.quantity, price: item.price } : i))
    );
  };

  const removeItemFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== id));
    setResetFlag(true);
    setResetButtonFlag(true);
  };

  const clearCart = () => {
    setCartItems([]);
    setResetFlag(true);
    setResetButtonFlag(true);
  };

  const resetQuantityInProductCard = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((i) => (i.id === id ? { ...i, quantity: 1, price: i.price / i.quantity } : i))
    );
  };

  const resetAllQuantities = () => {
    setCartItems((prevItems) => prevItems.map((i) => ({ ...i, quantity: 1, price: i.price / i.quantity })));
  };

  const resetButton = () => {
    setResetButtonFlag(false);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addItemToCart, updateItemInCart, removeItemFromCart, clearCart, resetQuantityInProductCard, resetAllQuantities, resetFlag, setResetFlag, resetButtonFlag, resetButton }}
    >
      {children}
    </CartContext.Provider>
  );
};
