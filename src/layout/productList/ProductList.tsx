import React, { useState, useEffect, useCallback } from 'react';
import {
  Section,
  SectionTitle,
  List,
  ListItem,
  ProductDetails,
  ProductImage,
  Form,
  Input,
  Button,
} from '../../styles/AdminPanelStyles';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '../../components/Spinner'; // Предположим, что есть компонент Spinner
import { validateProductForm } from '../../components/utils/validation'; // Предположим, что есть функция валидации

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

const ProductForm = ({
  onSubmit,
  initialData = {},
  onCancel,
}: {
  onSubmit: (data: any) => void;
  initialData?: any;
  onCancel?: () => void;
}) => {
  const [nameEn, setNameEn] = useState(initialData.nameEn || '');
  const [nameRu, setNameRu] = useState(initialData.nameRu || '');
  const [nameGeo, setNameGeo] = useState(initialData.nameGeo || '');
  const [price, setPrice] = useState(initialData.price || '');
  const [image, setImage] = useState<File | null>(null);
  const [unit, setUnit] = useState(initialData.unit || 'kg');
  const [step, setStep] = useState(initialData.step || '1');
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = () => {
    const formData = {
      nameEn,
      nameRu,
      nameGeo,
      price,
      unit,
      step,
      image,
    };

    const validationErrors = validateProductForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
    setNameEn('');
    setNameRu('');
    setNameGeo('');
    setPrice('');
    setImage(null);
    setUnit('kg');
    setStep('1');
    setErrors({});
  };

  return (
    <Form>
      <Input
        type="text"
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
        placeholder="Название продукта (английский)"
      />
      {errors.nameEn && <p>{errors.nameEn}</p>}
      <Input
        type="text"
        value={nameRu}
        onChange={(e) => setNameRu(e.target.value)}
        placeholder="Название продукта (русский)"
      />
      {errors.nameRu && <p>{errors.nameRu}</p>}
      <Input
        type="text"
        value={nameGeo}
        onChange={(e) => setNameGeo(e.target.value)}
        placeholder="Название продукта (грузинский)"
      />
      {errors.nameGeo && <p>{errors.nameGeo}</p>}
      <Input
        type="text"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Цена продукта"
      />
      {errors.price && <p>{errors.price}</p>}
      <Input
        type="file"
        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
      />
      {errors.image && <p>{errors.image}</p>}
      <label>
        Единица измерения:
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="kg">Килограммы</option>
          <option value="pcs">Штуки</option>
          <option value="g">Граммы</option>
        </select>
      </label>
      {unit === 'g' && (
        <label>
          Шаг (граммы):
          <select value={step} onChange={(e) => setStep(e.target.value)}>
            <option value="10">10 грамм</option>
            <option value="100">100 грамм</option>
            <option value="500">500 грамм</option>
          </select>
        </label>
      )}
      <Button onClick={handleSubmit}>Сохранить</Button>
      {onCancel && <Button onClick={onCancel}>Отмена</Button>}
    </Form>
  );
};

const ProductListItem = React.memo(({ product, onDelete, onEdit }: any) => (
  <ListItem>
    <ProductDetails>
      <ProductImage src={product.image_url ?? ''} alt={product.name.en ?? ''} />
      <p>
        {product.name.en} - ${product.price} {product.unit}
      </p>
      <Button onClick={() => onDelete(product.id)}>Удалить</Button>
      <Button onClick={() => onEdit(product.id)}>Редактировать</Button>
    </ProductDetails>
  </ListItem>
));

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/products');
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

  const handleAddProduct = async (formData: any) => {
    setLoading(true);
    try {
      const sendData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          sendData.append(key, formData[key]);
        }
      });

      const token = localStorage.getItem('token');
      const response = await fetch('/products', {
        method: 'POST',
        body: sendData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    setLoading(true);
    try {
      const sendData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          sendData.append(key, formData[key]);
        }
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`/products/${editProductId}`, {
        method: 'PUT',
        body: sendData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  if (globalError) {
    return <p>{globalError}</p>;
  }

  return (
    <Section>
      <SectionTitle>Список продуктов</SectionTitle>

      {/* Форма для добавления продукта */}
      <ProductForm onSubmit={handleAddProduct} />

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
