// ProductListItem.tsx

import React from 'react';
import { ListItem, ProductDetails, ProductImage, Button } from '../../styles/AdminPanelStyles';

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

interface ProductListItemProps {
  product: Product;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const ProductListItem: React.FC<ProductListItemProps> = React.memo(
  ({ product, onDelete, onEdit }) => {
    // Функция для формирования URL изображения
    const getImageUrl = (imageUrl: string | null) => {
      if (imageUrl) {
        // Формируем URL для запроса изображения через маршрут /images/:filename
        return `/images/${imageUrl}?format=webp&width=100`;
      }
      // Возвращаем путь к плейсхолдеру, если изображение отсутствует
      return '/images/placeholder.webp'; // Убедитесь, что у вас есть плейсхолдер в директории uploads
    };

    return (
      <ListItem>
        <ProductDetails>
          <ProductImage src={getImageUrl(product.image_url)} alt={product.name.en} />
          <div>
            <p>
              <strong>Название (EN):</strong> {product.name.en}
            </p>
            <p>
              <strong>Название (RU):</strong> {product.name.ru}
            </p>
            <p>
              <strong>Название (GEO):</strong> {product.name.geo}
            </p>
            <p>
              <strong>Цена:</strong> ${product.price} {product.unit}
            </p>
            {product.unit === 'g' && product.step && (
              <p>
                <strong>Шаг:</strong> {product.step} г
              </p>
            )}
          </div>
          <div>
            <Button onClick={() => onEdit(product.id)}>Редактировать</Button>
            <Button onClick={() => onDelete(product.id)}>Удалить</Button>
          </div>
        </ProductDetails>
      </ListItem>
    );
  }
);

export default ProductListItem;
