// ProductList.tsx

import React, { useState } from 'react';
import {
  Section,
  SectionTitle,
  List,
} from '../../styles/AdminPanelStyles';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '../../components/Spinner';
import ProductForm from './ProductForm';
import ProductListItem from './ProductListItem';
import useProducts from '../../components/hooks/useProducts';

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

const ProductList: React.FC = () => {
  const {
    products,
    setProducts,
    loading,
    setLoading,
    globalError,
    fetchProducts,
    setGlobalError
  } = useProducts();
  const [editProductId, setEditProductId] = useState<number | null>(null);

  const handleAddProduct = async (formData: any) => {
    setGlobalError(null);
    setLoading(true);
    try {
      const sendData = new FormData();

      // Добавляем остальные поля
      sendData.append('nameEn', formData.nameEn);
      sendData.append('nameRu', formData.nameRu);
      sendData.append('nameGeo', formData.nameGeo);
      sendData.append('price', formData.price);
      sendData.append('unit', formData.unit);
      sendData.append('step', formData.step);

      // Добавляем файл изображения с именем поля 'image'
      if (formData.image) {
        sendData.append('image', formData.image); // Имя поля должно быть 'image'
      }

      const token = localStorage.getItem('token');
      const response = await fetch('/products', {
        method: 'POST',
        body: sendData,
        headers: {
          Authorization: `Bearer ${token}`,
          // Не устанавливайте Content-Type, он будет установлен автоматически
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка при добавлении продукта:', errorText);
        throw new Error('Failed to add product');
      }

      const newProduct = await response.json();
      const updatedProduct = {
        ...newProduct,
        name: {
          en: newProduct.name_en,
          ru: newProduct.name_ru,
          geo: newProduct.name_geo,
        },
        unit: newProduct.unit || 'kg',
        step: newProduct.step || 1,
      };
      setProducts([...products, updatedProduct]);
    } catch (error) {
      console.error('Error adding product:', error);
      setGlobalError('Ошибка добавления продукта.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    setGlobalError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setGlobalError('Ошибка удаления продукта.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (id: number) => {
    setEditProductId(id);
  };

  const handleSaveProduct = async (formData: any) => {
    setGlobalError(null);
    setLoading(true);
    try {
      const sendData = new FormData();

      // Добавляем остальные поля
      sendData.append('nameEn', formData.nameEn);
      sendData.append('nameRu', formData.nameRu);
      sendData.append('nameGeo', formData.nameGeo);
      sendData.append('price', formData.price);
      sendData.append('unit', formData.unit);
      sendData.append('step', formData.step);

      // Добавляем файл изображения, если он выбран
      if (formData.image) {
        sendData.append('image', formData.image);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`/products/${editProductId}`, {
        method: 'PUT',
        body: sendData,
        headers: {
          Authorization: `Bearer ${token}`,
          // Не устанавливайте Content-Type, браузер установит его автоматически
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка при обновлении продукта:', errorText);
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();
      const updatedProducts = products.map((product) =>
        product.id === editProductId
          ? {
              ...updatedProduct,
              name: {
                en: updatedProduct.name_en,
                ru: updatedProduct.name_ru,
                geo: updatedProduct.name_geo,
              },
              unit: updatedProduct.unit || 'kg',
              step: updatedProduct.step || 1,
            }
          : product
      );
      setProducts(updatedProducts);
      setEditProductId(null);
    } catch (error) {
      console.error('Error updating product:', error);
      setGlobalError('Ошибка обновления продукта.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Section>
      <SectionTitle>Список продуктов</SectionTitle>

      {/* Форма для добавления продукта */}
      <ProductForm onSubmit={handleAddProduct} />

      {/* Отображение глобальной ошибки */}
      {globalError && <p>{globalError}</p>}

      {/* Список продуктов с анимациями */}
      <List>
        <AnimatePresence>
          {products.map((product) =>
            editProductId === product.id ? (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductForm
                  onSubmit={handleSaveProduct}
                  initialData={{
                    nameEn: product.name.en,
                    nameRu: product.name.ru,
                    nameGeo: product.name.geo,
                    price: product.price.toString(),
                    unit: product.unit,
                    step: product.step?.toString(),
                    // При редактировании можно оставить поле image пустым
                  }}
                  onCancel={() => setEditProductId(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductListItem
                  product={product}
                  onDelete={handleDeleteProduct}
                  onEdit={handleEditProduct}
                />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </List>
    </Section>
  );
};

export default ProductList;
