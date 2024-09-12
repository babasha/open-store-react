// src/page/paymentsPages/PurchasedItemsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PurchasedItem {
  id: number;
  title: string;
  quantity: number;
  price: number;
}

interface PurchasedItemsContextType {
  purchasedItems: PurchasedItem[];
  setPurchasedItems: (items: PurchasedItem[]) => void;
  clearPurchasedItems: () => void;
}

// Добавляем интерфейс для пропсов, ожидающих `children`
interface PurchasedItemsProviderProps {
  children: ReactNode;
}

const PurchasedItemsContext = createContext<PurchasedItemsContextType | undefined>(undefined);

export const PurchasedItemsProvider = ({ children }: PurchasedItemsProviderProps) => {
  const [purchasedItems, setPurchasedItemsState] = useState<PurchasedItem[]>([]);

  const setPurchasedItems = (items: PurchasedItem[]) => {
    setPurchasedItemsState(items);
  };

  const clearPurchasedItems = () => {
    setPurchasedItemsState([]);
  };

  return (
    <PurchasedItemsContext.Provider value={{ purchasedItems, setPurchasedItems, clearPurchasedItems }}>
      {children}
    </PurchasedItemsContext.Provider>
  );
};

export const usePurchasedItems = () => {
  const context = useContext(PurchasedItemsContext);
  if (!context) {
    throw new Error('usePurchasedItems must be used within a PurchasedItemsProvider');
  }
  return context;
};
