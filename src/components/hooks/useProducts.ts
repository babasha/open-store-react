import { useState, useEffect, useCallback } from 'react';

interface Product {
  id: number;
  name: {
    en: string;
    ru: string;
    geo: string;
  };
  price: number;
  image_url: string | null;
  unit: string;
  step?: number;
}

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/products');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const updatedProducts = data.map((product: any) => ({
        ...product,
        name: {
          en: product.name_en,
          ru: product.name_ru,
          geo: product.name_geo,
        },
        unit: product.unit || 'kg',
        step: product.step || 1,
      }));
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setGlobalError('Ошибка загрузки продуктов.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    setProducts,
    loading,
    setLoading, // Добавляем setLoading в возвращаемый объект
    globalError,
    fetchProducts,
    setGlobalError,
  };
};

export default useProducts;
