import React, { useState, useEffect } from 'react';
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

interface Discount {
  quantity: number; // Минимальное количество для скидки
  percentage?: number; // Процент скидки
  amount?: number; // Фиксированная сумма скидки
}

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
  discounts?: Discount[]; // Добавлено свойство discounts
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [nameEn, setNameEn] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [nameGeo, setNameGeo] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [unit, setUnit] = useState('kg');
  const [step, setStep] = useState('1');
  const [discounts, setDiscounts] = useState<Discount[]>([]); // Скидки

  // Загружаем товары при загрузке компонента
  useEffect(() => {
    fetch('/products')
      .then((response) => response.json())
      .then((data) => {
        const updatedProducts = data.map((product: any) => ({
          ...product,
          name: {
            en: product.name_en,
            ru: product.name_ru,
            geo: product.name_geo,
          },
          unit: product.unit || 'kg',
          step: product.step || 1,
          discounts: product.discounts || [], // Подгружаем скидки
        }));
        setProducts(updatedProducts);
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleAddDiscount = () => {
    setDiscounts([...discounts, { quantity: 0, percentage: 0 }]);
  };

  const handleDiscountChange = (index: number, field: keyof Discount, value: string) => {
    const updatedDiscounts = discounts.map((discount, i) =>
      i === index ? { ...discount, [field]: Number(value) } : discount
    );
    setDiscounts(updatedDiscounts);
  };

  const handleRemoveDiscount = (index: number) => {
    const updatedDiscounts = discounts.filter((_, i) => i !== index);
    setDiscounts(updatedDiscounts);
  };

  const handleAddProduct = () => {
    const formData = new FormData();
    formData.append('nameEn', nameEn);
    formData.append('nameRu', nameRu);
    formData.append('nameGeo', nameGeo);
    formData.append('price', price);
    formData.append('unit', unit);
    if (unit === 'g') {
      formData.append('step', step);
    }
    if (image) {
      formData.append('image', image);
    }
    formData.append('discounts', JSON.stringify(discounts)); // Добавляем скидки

    const token = localStorage.getItem('token');

    fetch('/products', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((newProduct) => {
        const updatedProduct = {  
          ...newProduct,
          name: {
            en: newProduct.name_en,
            ru: newProduct.name_ru,
            geo: newProduct.name_geo,
          },
          unit: newProduct.unit || 'kg',
          step: newProduct.step || 1,
          discounts: newProduct.discounts || [],
        };
        setProducts([...products, updatedProduct]);
        setNameEn('');
        setNameRu('');
        setNameGeo('');
        setPrice('');
        setImage(null);
        setDiscounts([]); // Очищаем скидки после добавления
      })
      .catch((error) => console.error('Error adding product:', error));
  };


  const handleDeleteProduct = (id: number) => {
    const token = localStorage.getItem('token');

    fetch(`/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => console.error('Error deleting product:', error));
  };


  const handleEditProduct = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setEditProductId(id);
      setNameEn(product.name.en);
      setNameRu(product.name.ru);
      setNameGeo(product.name.geo);
      setPrice(product.price.toString());
      setUnit(product.unit || 'kg');
      setStep(product.step ? product.step.toString() : '1');
      setDiscounts(product.discounts || []); // Устанавливаем текущие скидки
    }
  };

  const handleSaveProduct = (id: number) => {
    const formData = new FormData();
    formData.append('nameEn', nameEn);
    formData.append('nameRu', nameRu);
    formData.append('nameGeo', nameGeo);
    formData.append('price', price);
    formData.append('unit', unit);
    if (unit === 'g') {
      formData.append('step', step);
    }
    if (image) {
      formData.append('image', image);
    }

    const token = localStorage.getItem('token');

    fetch(`/products/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((updatedProduct) => {
        const updatedProducts = products.map((product) =>
          product.id === id
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
        setNameEn('');
        setNameRu('');
        setNameGeo('');
        setPrice('');
        setImage(null);
      })
      .catch((error) => console.error('Error updating product:', error));
  };


  return (
    <Section>
      <SectionTitle>Products List</SectionTitle>

      <Form>
        <Input
          type="text"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="Product Name (English)"
        />
        <Input
          type="text"
          value={nameRu}
          onChange={(e) => setNameRu(e.target.value)}
          placeholder="Product Name (Russian)"
        />
        <Input
          type="text"
          value={nameGeo}
          onChange={(e) => setNameGeo(e.target.value)}
          placeholder="Product Name (Georgian)"
        />
        <Input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Product Price"
        />
        <Input
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
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

        {/* Секция скидок */}
        <div>
          <h3>Discounts</h3>
          {discounts.map((discount, index) => (
            <div key={index}>
              <Input
                type="number"
                value={discount.quantity}
                onChange={(e) => handleDiscountChange(index, 'quantity', e.target.value)}
                placeholder="Minimum Quantity"
              />
              <Input
                type="number"
                value={discount.percentage || ''}
                onChange={(e) => handleDiscountChange(index, 'percentage', e.target.value)}
                placeholder="Discount Percentage"
              />
              <Input
                type="number"
                value={discount.amount || ''}
                onChange={(e) => handleDiscountChange(index, 'amount', e.target.value)}
                placeholder="Discount Amount"
              />
              <Button onClick={() => handleRemoveDiscount(index)}>Remove Discount</Button>
            </div>
          ))}
          <Button onClick={handleAddDiscount}>Add Discount</Button>
        </div>

        <Button onClick={handleAddProduct}>Add Product</Button>
      </Form>

      {/* Список товаров */}
      <List>
        {products.map((product) => (
          <ListItem key={product.id}>
            <ProductDetails>
              <ProductImage src={product.image_url ?? ''} alt={product.name.en ?? ''} />
              {editProductId === product.id ? (
                <Form>
                  <Input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Product Name (English)"
                  />
                  <Input
                    type="text"
                    value={nameRu}
                    onChange={(e) => setNameRu(e.target.value)}
                    placeholder="Product Name (Russian)"
                  />
                  <Input
                    type="text"
                    value={nameGeo}
                    onChange={(e) => setNameGeo(e.target.value)}
                    placeholder="Product Name (Georgian)"
                  />
                  <Input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Product Price"
                  />
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
                  <Button onClick={() => handleSaveProduct(product.id)}>Save</Button>
                  <Button onClick={() => setEditProductId(null)}>Cancel</Button>
                </Form>
              ) : (
                <>
                  {product.name.en} - ${product.price} {product.unit}
                  <Button onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                  <Button onClick={() => handleEditProduct(product.id)}>Edit</Button>
                </>
              )}
              <p>{product.name.en} - {product.price} {product.unit}</p>
              <Button onClick={() => handleEditProduct(product.id)}>Edit</Button>
            </ProductDetails>
          </ListItem>
        ))}
      </List>
    </Section>
  );
};

export default ProductList;
