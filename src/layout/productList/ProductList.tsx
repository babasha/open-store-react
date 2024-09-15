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
  discounts?: Discount[]; // Скидки
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editProductId, setEditProductId] = useState<number | null>(null);

  // Состояния для добавления продукта
  const [addNameEn, setAddNameEn] = useState('');
  const [addNameRu, setAddNameRu] = useState('');
  const [addNameGeo, setAddNameGeo] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addImage, setAddImage] = useState<File | null>(null);
  const [addUnit, setAddUnit] = useState('kg');
  const [addStep, setAddStep] = useState('1');
  const [addDiscounts, setAddDiscounts] = useState<Discount[]>([]);

  // Состояния для редактирования продукта
  const [editNameEn, setEditNameEn] = useState('');
  const [editNameRu, setEditNameRu] = useState('');
  const [editNameGeo, setEditNameGeo] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editUnit, setEditUnit] = useState('kg');
  const [editStep, setEditStep] = useState('1');
  const [editDiscounts, setEditDiscounts] = useState<Discount[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Загрузка продуктов
  useEffect(() => {
    fetch('/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при загрузке продуктов');
        }
        return response.json();
      })
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
          discounts: product.discounts || [],
        }));
        setProducts(updatedProducts);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError('Не удалось загрузить продукты.');
      });
  }, []);

  // Добавляем скидку в форму добавления
  const handleAddDiscount = () => {
    setAddDiscounts([...addDiscounts, { quantity: 0, percentage: 0 }]);
  };

  // Изменение параметров скидки в форме добавления
  const handleAddDiscountChange = (index: number, field: keyof Discount, value: string) => {
    const updatedDiscounts = addDiscounts.map((discount, i) =>
      i === index ? { ...discount, [field]: Number(value) } : discount
    );
    setAddDiscounts(updatedDiscounts);
  };

  // Удаление скидки из формы добавления
  const handleRemoveAddDiscount = (index: number) => {
    const updatedDiscounts = addDiscounts.filter((_, i) => i !== index);
    setAddDiscounts(updatedDiscounts);
  };

  // Добавление продукта
  const handleAddProduct = () => {
    const formData = new FormData();
    formData.append('nameEn', addNameEn);
    formData.append('nameRu', addNameRu);
    formData.append('nameGeo', addNameGeo);
    formData.append('price', addPrice);
    formData.append('unit', addUnit);
    if (addUnit === 'g') {
      formData.append('step', addStep);
    }
    if (addImage) {
      formData.append('image', addImage);
    }
    formData.append('discounts', JSON.stringify(addDiscounts)); // Скидки

    const token = localStorage.getItem('token');

    fetch('/products', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при добавлении продукта');
        }
        return response.json();
      })
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
        // Очистка полей формы после добавления
        setAddNameEn('');
        setAddNameRu('');
        setAddNameGeo('');
        setAddPrice('');
        setAddImage(null);
        setAddUnit('kg');
        setAddStep('1');
        setAddDiscounts([]);
        setError(null);
      })
      .catch((error) => {
        console.error('Error adding product:', error);
        setError('Не удалось добавить продукт.');
      });
  };

  // Редактирование продукта: установка состояний редактируемого продукта
  const handleEditProduct = (product: Product) => {
    setEditProductId(product.id);
    setEditNameEn(product.name.en);
    setEditNameRu(product.name.ru);
    setEditNameGeo(product.name.geo);
    setEditPrice(product.price.toString());
    setEditUnit(product.unit);
    setEditStep(product.step ? product.step.toString() : '1');
    setEditDiscounts(product.discounts || []);
    setEditImage(null); // Очистка выбранного изображения
    setError(null);
  };

  // Добавление скидки в форму редактирования
  const handleEditAddDiscount = () => {
    setEditDiscounts([...editDiscounts, { quantity: 0, percentage: 0 }]);
  };

  // Изменение параметров скидки в форме редактирования
  const handleEditDiscountChange = (index: number, field: keyof Discount, value: string) => {
    const updatedDiscounts = editDiscounts.map((discount, i) =>
      i === index ? { ...discount, [field]: Number(value) } : discount
    );
    setEditDiscounts(updatedDiscounts);
  };

  // Удаление скидки из формы редактирования
  const handleRemoveEditDiscount = (index: number) => {
    const updatedDiscounts = editDiscounts.filter((_, i) => i !== index);
    setEditDiscounts(updatedDiscounts);
  };

  // Сохранение изменений продукта
  const handleSaveProduct = (id: number) => {
    const formData = new FormData();
    formData.append('nameEn', editNameEn);
    formData.append('nameRu', editNameRu);
    formData.append('nameGeo', editNameGeo);
    formData.append('price', editPrice);
    formData.append('unit', editUnit);
    if (editUnit === 'g') {
      formData.append('step', editStep);
    }
    if (editImage) {
      formData.append('image', editImage);
    }
    formData.append('discounts', JSON.stringify(editDiscounts)); // Скидки

    const token = localStorage.getItem('token');

    fetch(`/products/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при обновлении продукта');
        }
        return response.json();
      })
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
                discounts: updatedProduct.discounts || [],
              }
            : product
        );
        setProducts(updatedProducts);
        setEditProductId(null);
        // Очистка формы редактирования
        setEditNameEn('');
        setEditNameRu('');
        setEditNameGeo('');
        setEditPrice('');
        setEditImage(null);
        setEditUnit('kg');
        setEditStep('1');
        setEditDiscounts([]);
        setError(null);
      })
      .catch((error) => {
        console.error('Error updating product:', error);
        setError('Не удалось обновить продукт.');
      });
  };

  // Отмена редактирования
  const handleCancelEdit = () => {
    setEditProductId(null);
    // Очистка формы редактирования
    setEditNameEn('');
    setEditNameRu('');
    setEditNameGeo('');
    setEditPrice('');
    setEditImage(null);
    setEditUnit('kg');
    setEditStep('1');
    setEditDiscounts([]);
    setError(null);
  };

  // Удаление продукта
  const handleDeleteProduct = (id: number) => {
    const token = localStorage.getItem('token');

    fetch(`/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при удалении продукта');
        }
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        setError('Не удалось удалить продукт.');
      });
  };

  return (
    <Section>
      <SectionTitle>Список продуктов</SectionTitle>

      {/* Форма добавления продукта */}
      <Form>
        <h2>Добавить продукт</h2>
        <Input
          type="text"
          value={addNameEn}
          onChange={(e) => setAddNameEn(e.target.value)}
          placeholder="Название продукта (Английский)"
        />
        <Input
          type="text"
          value={addNameRu}
          onChange={(e) => setAddNameRu(e.target.value)}
          placeholder="Название продукта (Русский)"
        />
        <Input
          type="text"
          value={addNameGeo}
          onChange={(e) => setAddNameGeo(e.target.value)}
          placeholder="Название продукта (Грузинский)"
        />
        <Input
          type="number"
          value={addPrice}
          onChange={(e) => setAddPrice(e.target.value)}
          placeholder="Цена продукта"
        />
        <Input
          type="file"
          onChange={(e) => setAddImage(e.target.files ? e.target.files[0] : null)}
        />
        <label>
          Единица измерения:
          <select value={addUnit} onChange={(e) => setAddUnit(e.target.value)}>
            <option value="kg">Килограммы</option>
            <option value="pcs">Штуки</option>
            <option value="g">Граммы</option>
          </select>
        </label>

        {addUnit === 'g' && (
          <label>
            Шаг (граммы):
            <select value={addStep} onChange={(e) => setAddStep(e.target.value)}>
              <option value="10">10 грамм</option>
              <option value="100">100 грамм</option>
              <option value="500">500 грамм</option>
            </select>
          </label>
        )}

        {/* Секция для управления скидками в форме добавления */}
        <div>
          <h3>Скидки</h3>
          {addDiscounts.map((discount, index) => (
            <div key={index}>
              <Input
                type="number"
                value={discount.quantity}
                onChange={(e) => handleAddDiscountChange(index, 'quantity', e.target.value)}
                placeholder="Минимальное количество"
              />
              <Input
                type="number"
                value={discount.percentage || ''}
                onChange={(e) => handleAddDiscountChange(index, 'percentage', e.target.value)}
                placeholder="Процент скидки"
              />
              <Input
                type="number"
                value={discount.amount || ''}
                onChange={(e) => handleAddDiscountChange(index, 'amount', e.target.value)}
                placeholder="Сумма скидки"
              />
              <Button type="button" onClick={() => handleRemoveAddDiscount(index)}>
                Удалить скидку
              </Button>
            </div>
          ))}
          <Button type="button" onClick={handleAddDiscount}>
            Добавить скидку
          </Button>
        </div>

        <Button type="button" onClick={handleAddProduct}>
          Добавить продукт
        </Button>
      </Form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Список продуктов */}
      <List>
        {products.map((product) => (
          <ListItem key={product.id}>
            <ProductDetails>
              <ProductImage src={product.image_url ?? ''} alt={product.name.en ?? ''} />
              {editProductId === product.id ? (
                <Form>
                  <h2>Редактировать продукт</h2>
                  <Input
                    type="text"
                    value={editNameEn}
                    onChange={(e) => setEditNameEn(e.target.value)}
                    placeholder="Название продукта (Английский)"
                  />
                  <Input
                    type="text"
                    value={editNameRu}
                    onChange={(e) => setEditNameRu(e.target.value)}
                    placeholder="Название продукта (Русский)"
                  />
                  <Input
                    type="text"
                    value={editNameGeo}
                    onChange={(e) => setEditNameGeo(e.target.value)}
                    placeholder="Название продукта (Грузинский)"
                  />
                  <Input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="Цена продукта"
                  />
                  <Input
                    type="file"
                    onChange={(e) => setEditImage(e.target.files ? e.target.files[0] : null)}
                  />
                  <label>
                    Единица измерения:
                    <select value={editUnit} onChange={(e) => setEditUnit(e.target.value)}>
                      <option value="kg">Килограммы</option>
                      <option value="pcs">Штуки</option>
                      <option value="g">Граммы</option>
                    </select>
                  </label>

                  {editUnit === 'g' && (
                    <label>
                      Шаг (граммы):
                      <select value={editStep} onChange={(e) => setEditStep(e.target.value)}>
                        <option value="10">10 грамм</option>
                        <option value="100">100 грамм</option>
                        <option value="500">500 грамм</option>
                      </select>
                    </label>
                  )}

                  {/* Секция для управления скидками в форме редактирования */}
                  <div>
                    <h3>Скидки</h3>
                    {editDiscounts.map((discount, index) => (
                      <div key={index}>
                        <Input
                          type="number"
                          value={discount.quantity}
                          onChange={(e) => handleEditDiscountChange(index, 'quantity', e.target.value)}
                          placeholder="Минимальное количество"
                        />
                        <Input
                          type="number"
                          value={discount.percentage || ''}
                          onChange={(e) => handleEditDiscountChange(index, 'percentage', e.target.value)}
                          placeholder="Процент скидки"
                        />
                        <Input
                          type="number"
                          value={discount.amount || ''}
                          onChange={(e) => handleEditDiscountChange(index, 'amount', e.target.value)}
                          placeholder="Сумма скидки"
                        />
                        <Button type="button" onClick={() => handleRemoveEditDiscount(index)}>
                          Удалить скидку
                        </Button>
                      </div>
                    ))}
                    <Button type="button" onClick={handleEditAddDiscount}>
                      Добавить скидку
                    </Button>
                  </div>

                  <Button type="button" onClick={() => handleSaveProduct(product.id)}>
                    Сохранить
                  </Button>
                  <Button type="button" onClick={handleCancelEdit}>
                    Отмена
                  </Button>
                </Form>
              ) : (
                <>
                  <p>
                    <strong>{product.name.en}</strong> - ${product.price} {product.unit}
                  </p>
                  {product.discounts && product.discounts.length > 0 && (
                    <div>
                      <h4>Скидки:</h4>
                      <ul>
                        {product.discounts.map((discount, idx) => (
                          <li key={idx}>
                            При покупке от {discount.quantity} шт. -{' '}
                            {discount.percentage
                              ? `${discount.percentage}% скидка`
                              : discount.amount
                              ? `${discount.amount}₽ скидка`
                              : 'Без скидки'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button type="button" onClick={() => handleDeleteProduct(product.id)}>
                    Удалить
                  </Button>
                  <Button type="button" onClick={() => handleEditProduct(product)}>
                    Редактировать
                  </Button>
                </>
              )}
            </ProductDetails>
          </ListItem>
        ))}
      </List>
    </Section>
  );
};

export default ProductList;
